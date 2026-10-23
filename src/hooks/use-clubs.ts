import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getClub,
  getClubs,
  getClubSessions,
  joinClubSession,
  leaveClubSession
} from '@/lib/api/club';
import { api } from '@/lib/api/api';

import type { WeekView } from '@/types/contracts/club';

export const clubKeys = {
  all: ['clubs'] as const,
  detail: (slug: string) => ['clubs', slug] as const,
  sessions: (slug: string, week?: string) =>
    ['clubs', slug, 'sessions', week ?? 'current'] as const,
  status: (slug: string, userId?: number) =>
    ['clubs', slug, 'status', userId] as const
};

export function useClubs() {
  return useQuery({
    queryKey: clubKeys.all,
    queryFn: getClubs,
    staleTime: 5 * 60 * 1000
  });
}

export function useClub(slug: string) {
  return useQuery({
    queryKey: clubKeys.detail(slug),
    queryFn: () => getClub(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000
  });
}

import { useAuth } from '@/store/auth';
import { getClubStatus, joinClub } from '@/lib/api/club';
import { cancelJoinRequest, leaveClub } from '@/lib/api/api';

export function useClubStatus(slug: string) {
  const userId = useAuth((s) => s.user?.id);

  return useQuery({
    queryKey: clubKeys.status(slug, userId),
    queryFn: () => getClubStatus(slug),
    enabled: Boolean(slug) && Boolean(userId)
  });
}

export function useJoinClub(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => joinClub(slug),
    onSuccess: () => {
      toast.success('Join request sent');
      return queryClient.invalidateQueries({ queryKey: clubKeys.detail(slug) });
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to send join request.')
  });
}

// ==========================================
// NEW: Update Club Hook (No `any`)
// ==========================================
export function useUpdateClub(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; description?: string }) => {
      return api<unknown>(`/clubs/${slug}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      toast.success('Club updated successfully!');
      queryClient.invalidateQueries({ queryKey: clubKeys.detail(slug) });
      queryClient.invalidateQueries({ queryKey: clubKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update club information.');
    }
  });
}

export function useClubSessions(slug: string, week?: string) {
  return useQuery({
    queryKey: clubKeys.sessions(slug, week),
    queryFn: () => getClubSessions(slug, week),
    enabled: Boolean(slug),
    refetchInterval: 4000,
    refetchOnWindowFocus: true
  });
}

export function useJoinClubSession(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: number) => joinClubSession(slug, sessionId),
    onMutate: async (sessionId: number) => {
      await queryClient.cancelQueries({
        queryKey: ['clubs', slug, 'sessions']
      });

      const previousData = queryClient.getQueriesData<WeekView>({
        queryKey: ['clubs', slug, 'sessions']
      });

      queryClient.setQueriesData<WeekView>(
        { queryKey: ['clubs', slug, 'sessions'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            sessions: old.sessions.map((s) =>
              s.id === sessionId
                ? {
                    ...s,
                    is_joined: true,
                    spots_left: Math.max(0, s.spots_left - 1),
                    attends_count: s.attends_count + 1
                  }
                : s
            )
          };
        }
      );

      return { previousData };
    },
    onSuccess: () => {
      toast.success('You have successfully joined the session!');
    },
    onError: (err: unknown, _sessionId, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      const errorMessage = err instanceof Error ? err.message : '';
      if (
        errorMessage.toLowerCase().includes('full') ||
        errorMessage.toLowerCase().includes('capacity') ||
        errorMessage.toLowerCase().includes('conflict')
      ) {
        toast.error("You couldn't join because the session is now full!");
      } else {
        toast.error(errorMessage || 'Failed to join session');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs', slug, 'sessions'] });
    }
  });
}

export function useLeaveClubSession(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: number) => leaveClubSession(slug, sessionId),
    onMutate: async (sessionId: number) => {
      await queryClient.cancelQueries({
        queryKey: ['clubs', slug, 'sessions']
      });

      const previousData = queryClient.getQueriesData<WeekView>({
        queryKey: ['clubs', slug, 'sessions']
      });

      queryClient.setQueriesData<WeekView>(
        { queryKey: ['clubs', slug, 'sessions'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            sessions: old.sessions.map((s) =>
              s.id === sessionId
                ? {
                    ...s,
                    is_joined: false,
                    spots_left: s.spots_left + 1,
                    attends_count: Math.max(0, s.attends_count - 1)
                  }
                : s
            )
          };
        }
      );

      return { previousData };
    },
    onSuccess: () => {
      toast.success('You have left the session.');
    },
    onError: (err: unknown, _sessionId, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to leave session';
      toast.error(errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs', slug, 'sessions'] });
    }
  });
}

export function useCancelJoinClub(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelJoinRequest(slug),
    onSuccess: () => {
      toast.success('Join request cancelled');
      return queryClient.invalidateQueries({ queryKey: clubKeys.detail(slug) });
    },
    onError: (err: Error) =>
      toast.error(err.message || 'Failed to cancel join request.')
  });
}

export function useLeaveClub(slug: string, memberId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!memberId) throw new Error('Member ID not found.');
      return leaveClub(slug, memberId);
    },
    onSuccess: () => {
      toast.success('You have left the club');
      return queryClient.invalidateQueries({ queryKey: clubKeys.detail(slug) });
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to leave club.')
  });
}

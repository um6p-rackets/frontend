import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // <--- 1. IMPORT TOAST HERE
import {
  getClub,
  getClubs,
  getClubSessions,
  joinClubSession,
  leaveClubSession,
} from "@/lib/api/club";
import { mockClubs } from "@/lib/mock-data";

import type { WeekView } from "@/types/contracts/club";

export const clubKeys = {
  all: ["clubs"] as const,
  detail: (slug: string) => ["clubs", slug] as const,
  sessions: (slug: string, week?: string) =>
    ["clubs", slug, "sessions", week ?? "current"] as const,
};

export function useClubs() {
  return useQuery({
    queryKey: clubKeys.all,
    queryFn: async () => {
      try {
        return await getClubs();
      } catch (err) {
        console.warn("Failed to fetch clubs from backend, falling back to mockClubs:", err);
        return mockClubs;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useClub(slug: string) {
  return useQuery({
    queryKey: clubKeys.detail(slug),
    queryFn: async () => {
      try {
        return await getClub(slug);
      } catch (err) {
        console.warn(`Failed to fetch club ${slug} from backend, falling back to mockClubs:`, err);
        return mockClubs.find((c) => c.slug === slug) ?? null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useClubSessions(slug: string, week?: string) {
  return useQuery({
    queryKey: clubKeys.sessions(slug, week),
    queryFn: () => getClubSessions(slug, week),
    enabled: Boolean(slug),
    refetchInterval: 4000,
    refetchOnWindowFocus: true,
  });
}

export function useJoinClubSession(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: number) => joinClubSession(slug, sessionId),
    onMutate: async (sessionId: number) => {
      await queryClient.cancelQueries({ queryKey: ["clubs", slug, "sessions"] });

      const previousData = queryClient.getQueriesData<WeekView>({
        queryKey: ["clubs", slug, "sessions"],
      });

      queryClient.setQueriesData<WeekView>(
        { queryKey: ["clubs", slug, "sessions"] },
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
                    attends_count: s.attends_count + 1,
                  }
                : s
            ),
          };
        }
      );

      return { previousData };
    },
    onSuccess: () => {
      toast.success("You have successfully joined the session!");
    },
    // Replaced 'any' with unknown / Error type guard
    onError: (err: unknown, _sessionId, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      const errorMessage = err instanceof Error ? err.message : "";
      if (
        errorMessage.toLowerCase().includes("full") || 
        errorMessage.toLowerCase().includes("capacity") || 
        errorMessage.toLowerCase().includes("conflict")
      ) {
        toast.error("You couldn't join because the session is now full!");
      } else {
        toast.error(errorMessage || "Failed to join session");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs", slug, "sessions"] });
    },
  });
}

export function useLeaveClubSession(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: number) => leaveClubSession(slug, sessionId),
    onMutate: async (sessionId: number) => {
      await queryClient.cancelQueries({ queryKey: ["clubs", slug, "sessions"] });

      const previousData = queryClient.getQueriesData<WeekView>({
        queryKey: ["clubs", slug, "sessions"],
      });

      queryClient.setQueriesData<WeekView>(
        { queryKey: ["clubs", slug, "sessions"] },
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
                    attends_count: Math.max(0, s.attends_count - 1),
                  }
                : s
            ),
          };
        }
      );

      return { previousData };
    },
    onSuccess: () => {
      toast.success("You have left the session.");
    },
    // Replaced 'any' with unknown / Error type guard
    onError: (err: unknown, _sessionId, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const errorMessage = err instanceof Error ? err.message : "Failed to leave session";
      toast.error(errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs", slug, "sessions"] });
    },
  });
}

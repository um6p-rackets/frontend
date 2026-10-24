// -> src/hooks/use-matches.ts
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { clubKeys } from '@/hooks/use-clubs';
import {
  acceptMatch,
  cancelMatch,
  getClubMatches,
  getPendingMatches,
  requestMatch
} from '@/lib/api/matches';
import type { MatchRequestBody } from '@/types/contracts/club';

export const matchKeys = {
  all: (slug: string) => [...clubKeys.detail(slug), 'matches'] as const,
  pending: (slug: string) => [...matchKeys.all(slug), 'pending'] as const,
  lists: (slug: string) => [...matchKeys.all(slug), 'list'] as const,
  list: (slug: string, filters: Record<string, unknown>) =>
    [...matchKeys.lists(slug), filters] as const
};

// TODO: delete this once accept-match-modal and match-history-section use
// matchKeys. Until then they still cache under their old keys.
function invalidateLegacyMatchKeys(queryClient: QueryClient, slug: string) {
  queryClient.invalidateQueries({ queryKey: ['club-matches', slug] });
  queryClient.invalidateQueries({ queryKey: ['club-pending-matches', slug] });
}

export function usePendingMatches(slug: string, enabled = true) {
  return useQuery({
    queryKey: matchKeys.pending(slug),
    queryFn: () => getPendingMatches(slug),
    enabled: enabled && Boolean(slug)
  });
}

export function useClubMatches(
  slug: string,
  mine: string,
  statusFilter: string,
  page: number,
  limit: number,
  enabled = true
) {
  return useQuery({
    queryKey: matchKeys.list(slug, { mine, statusFilter, page, limit }),
    queryFn: () => getClubMatches(slug, mine, statusFilter, page, limit),
    enabled: enabled && Boolean(slug)
  });
}

export function useCancelMatch(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: number) => cancelMatch(slug, matchId),
    onSuccess: () => {
      toast.success('Match cancelled successfully.');
      invalidateLegacyMatchKeys(queryClient, slug);
      return queryClient.invalidateQueries({ queryKey: matchKeys.all(slug) });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to cancel match.');
    }
  });
}

// variables = the match id
export function useAcceptMatch(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: number) => acceptMatch(slug, matchId),
    onSuccess: () => {
      toast.success('Match accepted successfully.');
      invalidateLegacyMatchKeys(queryClient, slug);
      return queryClient.invalidateQueries({ queryKey: matchKeys.all(slug) });
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to accept match.')
  });
}

export function useRequestMatch(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: MatchRequestBody) => requestMatch(slug, body),
    onSuccess: () => {
      toast.success('Match request sent successfully!', {
        description:
          'Teams and pending match created. Notified coaches/leaders for validation.'
      });
      invalidateLegacyMatchKeys(queryClient, slug);
      return queryClient.invalidateQueries({ queryKey: matchKeys.all(slug) });
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to send match request')
  });
}

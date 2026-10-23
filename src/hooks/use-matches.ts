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
  getPendingMatches,
  requestMatch
} from '@/lib/api/matches';
import type { MatchRequestBody } from '@/types/contracts/club';

export const matchKeys = {
  all: (slug: string) => [...clubKeys.detail(slug), 'matches'] as const,
  pending: (slug: string) => [...matchKeys.all(slug), 'pending'] as const
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
    onError: (err) => toast.error(err.message || 'Failed to accept match.')
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
    onError: (err) => toast.error(err.message || 'Failed to send match request')
  });
}
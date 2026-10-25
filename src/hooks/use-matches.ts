// -> src/hooks/use-matches.ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { clubKeys } from "@/hooks/use-clubs";
import {
  acceptMatch,
  cancelMatch,
  getClubMatches,
  getPendingMatches,
  requestMatch,
} from "@/lib/api/matches";
import type { MatchRequestBody } from "@/types/contracts/club";

export const matchKeys = {
  all: (slug: string) => [...clubKeys.detail(slug), "matches"] as const,
  pending: (slug: string) => [...matchKeys.all(slug), "pending"] as const,
  lists: (slug: string) => [...matchKeys.all(slug), "list"] as const,
  list: (slug: string, filters: Record<string, unknown>) =>
    [...matchKeys.lists(slug), filters] as const,
};

export function usePendingMatches(slug: string, enabled = true) {
  return useQuery({
    queryKey: matchKeys.pending(slug),
    queryFn: () => getPendingMatches(slug),
    enabled: enabled && Boolean(slug),
  });
}

export function useClubMatches(
  slug: string,
  mine: string | null,
  statusFilter: string,
  page: number,
  limit: number,
  enabled = true,
) {
  return useQuery({
    queryKey: matchKeys.list(slug, { mine, statusFilter, page, limit }),
    queryFn: () => getClubMatches(slug, mine, statusFilter, page, limit),
    enabled: enabled && Boolean(slug),
    placeholderData: keepPreviousData,
  });
}

export function useCancelMatch(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: number) => cancelMatch(slug, matchId),
    onSuccess: () => {
      toast.success("Match cancelled successfully.");
      return queryClient.invalidateQueries({ queryKey: matchKeys.all(slug) });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to cancel match.");
    },
  });
}

export function useAcceptMatch(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: number) => acceptMatch(slug, matchId),
    onSuccess: () => toast.success("Match accepted successfully."),
    onError: (err: Error) => toast.error(err.message || "Failed to accept match."),
    // Also after an error: on a 409 someone else accepted first, so the row must go
    onSettled: () => queryClient.invalidateQueries({ queryKey: matchKeys.all(slug) }),
  });
}

export function useRequestMatch(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: MatchRequestBody) => requestMatch(slug, body),
    onSuccess: () => {
      toast.success("Match request sent successfully!", {
        description: "Teams and pending match created. Notified coaches/leaders for validation.",
      });
      return queryClient.invalidateQueries({ queryKey: matchKeys.all(slug) });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to send match request"),
  });
}

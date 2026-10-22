'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { Loader2, Calendar, CheckCircle2, Inbox } from 'lucide-react';
import { toast } from 'sonner';

interface Player {
  member_id: number;
  login: string;
  first_name: string;
  last_name: string;
  avatar?: string | null;
  department?: string | null;
}

interface Team {
  player1: Player;
  player2?: Player | null;
}

interface MatchItem {
  id: number;
  status: number; // 0: pending
  mode: number; // 1: singles, 2: doubles
  scheduled_at: string;
  team1: Team;
  team2: Team;
}

export default function MatchAcceptSection({ clubSlug }: { clubSlug: string }) {
  const queryClient = useQueryClient();

  // Fetch all pending match requests for the club using TanStack Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['club-pending-matches', clubSlug],
    queryFn: async () => {
      const res = await api<{ data: MatchItem[] }>(
        `/clubs/${clubSlug}/matches?status=pending&limit=50`
      );
      return res;
    },
  });

  // Accept match mutation using TanStack Query
  const acceptMutation = useMutation({
    mutationFn: async (matchId: number) => {
      await api(`/clubs/${clubSlug}/matches/${matchId}/accept`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      toast.success('Match accepted successfully.');
      queryClient.invalidateQueries({ queryKey: ['club-pending-matches', clubSlug] });
      queryClient.invalidateQueries({ queryKey: ['club-matches', clubSlug] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to accept match.');
    },
  });

  const pendingRequests = data?.data || [];

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto py-6 px-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black italic tracking-tight text-foreground">
          Match <span className="text-brand-orange">Accept</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Review pending challenge requests from other players and accept them to confirm your matches.
        </p>
      </div>

      {/* Pending List */}
      <div className="space-y-3 min-h-[300px]">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
          </div>
        ) : error ? (
          <p className="text-center text-sm text-red-500 py-10">Failed to load match requests.</p>
        ) : pendingRequests.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-3xl flex flex-col items-center justify-center gap-2">
            <Inbox className="w-8 h-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground font-medium">No pending match requests to accept.</p>
          </div>
        ) : (
          pendingRequests.map((reqMatch) => {
            const op1 = reqMatch.team2.player1;
            const opNames = reqMatch.mode === 2 && reqMatch.team2.player2 
              ? `${op1?.first_name} ${op1?.last_name} & ${reqMatch.team2.player2.first_name} ${reqMatch.team2.player2.last_name}`
              : op1 ? `${op1.first_name} ${op1.last_name}` : 'Opponent';

            return (
              <div
                key={reqMatch.id}
                className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:border-brand-orange/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 font-bold text-xs border border-amber-500/20">
                    {reqMatch.mode === 2 ? 'Doubles Request' : 'Singles Request'}
                  </div>
                  <div className="font-bold text-sm text-foreground pt-1">
                    vs {opNames}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(reqMatch.scheduled_at).toLocaleDateString()}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={acceptMutation.isPending}
                  onClick={() => acceptMutation.mutate(reqMatch.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50 self-end sm:self-center"
                >
                  {acceptMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  Accept
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
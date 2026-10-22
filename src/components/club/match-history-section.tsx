'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { Loader2, Calendar, XCircle, ChevronLeft, ChevronRight, Whistle, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Player {
  member_id: number;
  id?: number;
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
  status: number; // 0: pending, 1: upcoming, 2: completed, 3: cancelled
  mode: number; // 1: singles, 2: doubles
  location?: string | null;
  scheduled_at: string;
  cancelled_at?: string | null;
  team1: Team;
  team2: Team;
  ref_id?: number | null;
  referee_id?: number | null;
  referee?: Player | null;
  winner_id?: number | null;
  team1_score?: number | null;
  team2_score?: number | null;
  team1_points?: number | null;
  team2_points?: number | null;
}

export default function MatchHistorySection({
  clubSlug,
  currentMemberId,
}: {
  clubSlug: string;
  currentMemberId: number;
}) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'mine' | 'referee' | 'club'>('mine');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  // Fetch matches with pagination and filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['club-matches', clubSlug, activeTab, statusFilter, page],
    queryFn: async () => {
      // Both 'mine' and 'referee' tabs query mine=true for now
      const mineParam = activeTab === 'club' ? 'false' : 'true';
      const statusParam = statusFilter !== 'all' ? `&status=${statusFilter}` : '';
      const res = await api<{ data: MatchItem[]; total: number; page: number; limit: number }>(
        `/clubs/${clubSlug}/matches?mine=${mineParam}${statusParam}&page=${page}&limit=${limit}`
      );
      return res;
    },
  });

  // Cancel match mutation
  const cancelMutation = useMutation({
    mutationFn: async (matchId: number) => {
      await api(`/clubs/${clubSlug}/matches/${matchId}/cancel`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      toast.success('Match cancelled successfully.');
      queryClient.invalidateQueries({ queryKey: ['club-matches', clubSlug] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to cancel match.');
    },
  });

  const rawMatches = data?.data || [];

  // Helper function to check if you are playing in the match
  const checkIfPlayer = (match: MatchItem) => {
    const isTeam1Member = 
      match.team1.player1?.member_id === currentMemberId || 
      Boolean(match.team1.player2 && match.team1.player2.member_id === currentMemberId);

    const isTeam2Member = 
      match.team2.player1?.member_id === currentMemberId || 
      Boolean(match.team2.player2 && match.team2.player2.member_id === currentMemberId);

    return isTeam1Member || isTeam2Member;
  };

  // Helper function to check if you are the referee of the match
  const checkIfReferee = (match: MatchItem) => {
    const refId = match.ref_id ?? match.referee_id ?? match.referee?.member_id ?? match.referee?.id;
    return Boolean(refId && Number(refId) === Number(currentMemberId));
  };

  // Temporarily show all raw matches for both 'mine' and 'referee' tabs as requested
  const filteredMatches = rawMatches;

  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  const matches = [...filteredMatches].sort(
    (a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
  );

  const getTeamNames = (team: Team) => {
    return [
      team.player1 ? `${team.player1.first_name} ${team.player1.last_name}` : '',
      team.player2 ? `${team.player2.first_name} ${team.player2.last_name}` : ''
    ].filter(Boolean).join(' & ');
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto py-6 px-4">
      <div>
        <h1 className="text-3xl font-black italic tracking-tight text-foreground">
          Match <span className="text-brand-orange">History</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Track official match fixtures, review past scores, and manage your active challenges.
        </p>
      </div>

      {/* Sub-tabs Filter Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex gap-2 bg-muted/40 p-1 rounded-xl flex-wrap">
          <button
            onClick={() => { setActiveTab('mine'); setPage(1); }}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === 'mine' ? "bg-brand-orange text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            My Matches
          </button>
          <button
            onClick={() => { setActiveTab('referee'); setPage(1); }}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === 'referee' ? "bg-brand-orange text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Referee Matches
          </button>
          <button
            onClick={() => { setActiveTab('club'); setPage(1); }}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === 'club' ? "bg-brand-orange text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Club Matches
          </button>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-9 px-3 rounded-xl border border-border/70 bg-background text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-3 min-h-[300px]">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
          </div>
        ) : error ? (
          <p className="text-center text-sm text-red-500 py-10">Failed to load match history.</p>
        ) : matches.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-3xl">
            <p className="text-sm text-muted-foreground font-medium">No matches found.</p>
          </div>
        ) : (
          matches.map((match) => {
            const isTeam1Member = 
              match.team1.player1?.member_id === currentMemberId || 
              Boolean(match.team1.player2 && match.team1.player2.member_id === currentMemberId);

            const isTeam2Member = 
              match.team2.player1?.member_id === currentMemberId || 
              Boolean(match.team2.player2 && match.team2.player2.member_id === currentMemberId);

            const isPlayerInMatch = isTeam1Member || isTeam2Member;
            const isReferee = checkIfReferee(match);
            const isMyMatch = isPlayerInMatch || isReferee;

            let titleText = '';
            let avatarUrl: string | null | undefined = null;
            let displayDept = 'Sport Department';

            if (isPlayerInMatch && activeTab !== 'referee') {
              const userIsTeam1 = isTeam1Member;
              const myTeam = userIsTeam1 ? match.team1 : match.team2;
              const enemyTeam = userIsTeam1 ? match.team2 : match.team1;

              const teammate = myTeam.player1?.member_id === currentMemberId ? myTeam.player2 : myTeam.player1;
              const op1 = enemyTeam.player1;
              const op2 = enemyTeam.player2;

              if (match.mode === 2) {
                const teammateName = teammate ? `${teammate.first_name} ${teammate.last_name}` : 'Teammate';
                const op1Name = op1 ? `${op1.first_name} ${op1.last_name}` : 'Opponent';
                const op2Name = op2 ? `${op2.first_name} ${op2.last_name}` : 'Opponent';
                titleText = `You & ${teammateName} vs ${op1Name} & ${op2Name}`;
              } else {
                const opName = op1 ? `${op1.first_name} ${op1.last_name}` : 'Opponent';
                titleText = `You vs ${opName}`;
              }

              avatarUrl = op1?.avatar;
              displayDept = op1?.department || 'Sport Department';
            } else {
              const team1Names = getTeamNames(match.team1);
              const team2Names = getTeamNames(match.team2);

              titleText = `${team1Names} vs ${team2Names}`;
              avatarUrl = match.team1.player1?.avatar;
            }

            const isPending = match.status === 0;
            const isUpcoming = match.status === 1;
            const isCompleted = match.status === 2;

            let userWon = false;
            if (isCompleted && match.winner_id && isPlayerInMatch) {
              const winningTeamIsTeam1 = 
                match.winner_id === match.team1.player1.member_id || 
                Boolean(match.team1.player2 && match.winner_id === match.team1.player2.member_id);
              userWon = Boolean(isTeam1Member ? winningTeamIsTeam1 : !winningTeamIsTeam1);
            }

            return (
              <div
                key={match.id}
                className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:border-brand-orange/50 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  {/* Status Indicator */}
                  {isCompleted ? (
                    isPlayerInMatch && activeTab !== 'referee' ? (
                      <div className={cn(
                        "px-3 py-1.5 rounded-full font-bold text-xs shrink-0 border shadow-2xs",
                        userWon 
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                          : "bg-red-500/10 text-red-600 border-red-500/20"
                      )}>
                        {userWon ? 'Win' : 'Lose'}
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs shrink-0 border border-emerald-500/20">
                        Finished
                      </div>
                    )
                  ) : isPending ? (
                    <div className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 font-bold text-xs shrink-0 border border-amber-500/20">
                      Pending
                    </div>
                  ) : isUpcoming ? (
                    <div className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 font-bold text-xs shrink-0 border border-blue-500/20">
                      Upcoming
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground font-bold text-xs shrink-0 border border-border/40">
                      Cancelled
                    </div>
                  )}

                  {/* Explicit Badge */}
                  {isPlayerInMatch && activeTab !== 'referee' ? (
                    <div className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-700 font-bold text-[11px] border border-teal-500/20 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> My Match
                    </div>
                  ) : isReferee ? (
                    <div className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-700 font-bold text-[11px] border border-purple-500/20 flex items-center gap-1">
                      <Whistle className="w-3 h-3" /> Referee
                    </div>
                  ) : null}

                  <div className="flex items-center gap-3">
                    {avatarUrl ? (
                      <div className="w-10 h-10 rounded-full relative overflow-hidden shrink-0">
                        <Image src={avatarUrl} alt="Match participants" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent shrink-0 text-sm">
                        {titleText.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-sm text-foreground">
                        {titleText} {match.mode === 2 && <span className="text-xs text-muted-foreground font-normal">(Doubles)</span>}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                        <span>{displayDept}</span>
                        {isCompleted && match.team1_score !== null && match.team2_score !== null && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-foreground">
                              {match.team1_score} - {match.team2_score}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(match.scheduled_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {isMyMatch && (isPending || isUpcoming) && (
                    <button
                      type="button"
                      disabled={cancelMutation.isPending}
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelMutation.mutate(match.id);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-red-500 hover:text-white hover:bg-red-500 border border-red-200 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                    >
                      {cancelMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )} 
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {!isLoading && totalItems > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs text-muted-foreground">
          <span>
            Displaying {(page - 1) * limit + 1}–{Math.min(page * limit, totalItems)} of {totalItems} matches
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border/70 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors text-foreground cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    page === p ? "bg-brand-orange text-white shadow-xs" : "hover:bg-muted text-foreground"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border/70 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors text-foreground cursor-pointer"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

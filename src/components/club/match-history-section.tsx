"use client";

import { useState } from "react";
import { Loader2, Calendar, Clock, MapPin, XCircle, Whistle, UserCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Pagination from "@/components/leaderboard/pagination";
import { useClubStatus } from "@/hooks/use-clubs";
import { useClubMatches, useCancelMatch } from "@/hooks/use-matches";
import {
  formatMatchDate,
  formatMatchTime,
  getMySide,
  playerName,
  teamNames,
} from "@/lib/match-utils";
import { MatchMineFilter, MatchStatus, MemberRole, type MatchDetail } from "@/types/contracts/club";

type Tab = "mine" | "referee" | "club";

const PAGE_SIZE = 10;

const TABS: { value: Tab; label: string; staffOnly?: boolean }[] = [
  { value: "mine", label: "My Matches" },
  { value: "referee", label: "Referee Matches", staffOnly: true },
  { value: "club", label: "Club Matches" },
];

const STATUS_FILTERS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_BADGES = {
  [MatchStatus.PENDING]: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  [MatchStatus.CONFIRMED]: {
    label: "Upcoming",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  [MatchStatus.FINISHED]: {
    label: "Finished",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  [MatchStatus.CANCELLED]: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground border-border/40",
  },
};

const PILL = "px-3 py-1.5 rounded-full font-bold text-xs shrink-0 border";

function MatchCard({
  match,
  memberId,
  tab,
  isStaff,
  isCancelling,
  cancelDisabled,
  onCancel,
}: {
  match: MatchDetail;
  memberId: number;
  tab: Tab;
  isStaff: boolean;
  isCancelling: boolean;
  cancelDisabled: boolean;
  onCancel: () => void;
}) {
  const mySide = getMySide(match, memberId);
  const isReferee = match.ref_id === memberId;
  // In the referee tab we look at the match as a referee, not as a player
  const showAsPlayer = mySide !== null && tab !== "referee";

  const isPending = match.status === MatchStatus.PENDING;
  const isFinished = match.status === MatchStatus.FINISHED;
  const isCancelled = match.status === MatchStatus.CANCELLED;

  // Title and avatar: "You vs Omar" for my matches, "Sara vs Omar" for the others
  let title = `${teamNames(match.team1)} vs ${teamNames(match.team2)}`;
  let avatarUrl = match.team1.player1.avatar;

  if (showAsPlayer) {
    const mine = match[mySide];
    const enemy = mySide === "team1" ? match.team2 : match.team1;
    const teammate = mine.player1.member_id === memberId ? mine.player2 : mine.player1;

    title =
      match.mode === 2
        ? `You & ${playerName(teammate) || "Teammate"} vs ${teamNames(enemy)}`
        : `You vs ${teamNames(enemy)}`;
    avatarUrl = enemy.player1.avatar;
  }

  // winner_id is the id of the winning team
  const userWon =
    mySide !== null && match.winner_id === (mySide === "team1" ? match.team1_id : match.team2_id);

  // Staff can cancel any open match. Others only see it on their pending matches
  // (the backend still checks the real rules and answers with a message).
  const canCancel =
    (isStaff && !isFinished && !isCancelled) || (isPending && (tab !== "club" || mySide !== null));

  const statusBadge =
    isFinished && showAsPlayer
      ? {
          label: userWon ? "Win" : "Lose",
          className: userWon
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            : "bg-red-500/10 text-red-600 border-red-500/20",
        }
      : STATUS_BADGES[match.status];

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:border-brand-orange/50 transition-colors">
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        <div className={cn(PILL, statusBadge.className)}>{statusBadge.label}</div>

        {showAsPlayer ? (
          <div className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-700 font-bold text-[11px] border border-teal-500/20 flex items-center gap-1">
            <UserCheck className="w-3 h-3" /> My Match
          </div>
        ) : (
          isReferee && (
            <div className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-700 font-bold text-[11px] border border-purple-500/20 flex items-center gap-1">
              <Whistle className="w-3 h-3" /> Referee
            </div>
          )
        )}

        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={avatarUrl || undefined} alt={title} referrerPolicy="no-referrer" />
            <AvatarFallback className="bg-accent/20 text-accent font-bold text-sm">
              {title.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="font-bold text-sm text-foreground">
              {title}{" "}
              {match.mode === 2 && (
                <span className="text-xs text-muted-foreground font-normal">(Doubles)</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="flex items-center gap-1 text-foreground font-medium">
                <MapPin className="w-3 h-3 text-brand-orange" />{" "}
                {match.location || "Sport Department"}
              </span>
              {isFinished && (
                <>
                  <span>•</span>
                  <span className="font-semibold text-foreground">
                    {match.team1_score} - {match.team2_score}
                  </span>
                </>
              )}
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {formatMatchDate(match.scheduled_at)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formatMatchTime(match.scheduled_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {canCancel && (
        <button
          type="button"
          disabled={cancelDisabled}
          onClick={onCancel}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-red-500 hover:text-white hover:bg-red-500 border border-red-200 text-xs font-semibold transition-all shadow-2xs cursor-pointer self-end sm:self-center disabled:opacity-50"
        >
          {isCancelling ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <XCircle className="w-3.5 h-3.5" />
          )}
          Cancel
        </button>
      )}
    </div>
  );
}

export default function MatchHistorySection({
  clubSlug,
  currentMemberId,
}: {
  clubSlug: string;
  currentMemberId: number;
}) {
  const { data: status } = useClubStatus(clubSlug);
  const isStaff = (status?.role ?? MemberRole.MEMBER) >= MemberRole.LEADER;

  const [tab, setTab] = useState<Tab>("mine");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // where I play or referee. Only the club tab asks for everyone's.
  const { data, isLoading, error } = useClubMatches(
    clubSlug,
    tab === "mine"
      ? String(MatchMineFilter.PLAYER)
      : tab === "referee"
        ? String(MatchMineFilter.REFEREE)
        : tab == "club" ? null : String(MatchMineFilter.ANY),
    statusFilter,
    page,
    PAGE_SIZE,
  );
  const cancelMatch = useCancelMatch(clubSlug);

  const matches = [...(data?.data ?? [])].sort(
    (a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime(),
  );
  const totalItems = data?.total ?? 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;

  const changeTab = (next: Tab) => {
    setTab(next);
    setPage(1);
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

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex gap-2 bg-muted/40 p-1 rounded-xl flex-wrap">
          {TABS.filter((t) => !t.staffOnly || isStaff).map((t) => (
            <button
              key={t.value}
              onClick={() => changeTab(t.value)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                tab === t.value
                  ? "bg-brand-orange text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 px-3 rounded-xl border border-border/70 bg-background text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3 min-h-75">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
          </div>
        ) : error ? (
          <p className="text-center text-sm text-red-500 py-10">{error.message}</p>
        ) : matches.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-3xl">
            <p className="text-sm text-muted-foreground font-medium">No matches found.</p>
          </div>
        ) : (
          matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              memberId={currentMemberId}
              tab={tab}
              isStaff={isStaff}
              // `variables` is the match id being cancelled: only that row shows the spinner
              isCancelling={cancelMatch.isPending && cancelMatch.variables === match.id}
              cancelDisabled={cancelMatch.isPending}
              onCancel={() => cancelMatch.mutate(match.id)}
            />
          ))
        )}
      </div>

      {!isLoading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/60 text-xs text-muted-foreground">
          <span>
            Displaying {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalItems)} of{" "}
            {totalItems} matches
          </span>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}

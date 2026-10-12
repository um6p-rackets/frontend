'use client';

import { useState } from 'react';
import { UserHistoryMatch } from '@/types/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown } from 'lucide-react';

interface HistoryTabProps {
  history: UserHistoryMatch[];
}

const BATCH_SIZE = 5;

export default function HistoryTab({ history }: HistoryTabProps) {
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);

  if (history.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border/80 p-8 text-center text-muted-foreground italic">
        No match history recorded yet.
      </div>
    );
  }

  const visibleMatches = history.slice(0, visibleCount);
  const hasMore = visibleCount < history.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  };

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {visibleMatches.map((match) => {
        const opponentNames =
          match.opponents.length > 0
            ? match.opponents.map((o) => `${o.first_name} ${o.last_name}`).join(' & ')
            : 'Unknown Opponent';
        const primaryOpponent = match.opponents[0];
        const dateFormatted = new Date(match.date).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        });

        return (
          <div
            key={match.match_id}
            className="bg-[#F8F7F4] dark:bg-card border border-border/70 hover:border-border rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-2xs"
          >
            {/* Left: Result Badge + Opponent */}
            <div className="flex items-center gap-3.5 min-w-0">
              <span
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-black italic text-xs sm:text-sm shrink-0 ${
                  match.result === 'W'
                    ? 'bg-emerald-500 text-white shadow-2xs'
                    : 'bg-destructive text-white shadow-2xs'
                }`}
              >
                {match.result}
              </span>

              <Avatar className="w-9 h-9 sm:w-10 sm:h-10 border border-background shrink-0">
                <AvatarImage
                  src={primaryOpponent?.avatar || undefined}
                  alt={opponentNames}
                />
                <AvatarFallback className="bg-brand-cream text-brand-ink font-bold text-xs">
                  {primaryOpponent?.first_name?.charAt(0) || 'O'}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <h4 className="font-bold italic text-sm sm:text-base text-brand-ink dark:text-white truncate">
                  vs {opponentNames}
                  {match.partner ? ` (with ${match.partner.first_name} ${match.partner.last_name})` : ''}
                </h4>
                <p className="text-xs font-semibold italic text-muted-foreground truncate">
                  {match.club_name} • {match.my_score} - {match.opponent_score}
                  {primaryOpponent?.department ? ` • Dept ${primaryOpponent.department}` : ''}
                </p>
              </div>
            </div>

            {/* Right: Date & Points Change */}
            <div className="flex flex-col items-end shrink-0 pl-2">
              <span
                className={`font-black italic text-sm sm:text-base ${
                  match.points_change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
                }`}
              >
                {match.points_change >= 0 ? `+${match.points_change}` : match.points_change} PTS
              </span>
              <span className="text-[11px] font-bold italic text-muted-foreground mt-0.5">
                {dateFormatted}
              </span>
            </div>
          </div>
        );
      })}

      {/* Show More Button (reveals 5 more per click) */}
      {hasMore && (
        <div className="pt-2 flex justify-center w-full">
          <button
            type="button"
            onClick={handleShowMore}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-card border border-border/80 hover:border-brand-orange hover:text-brand-orange text-brand-ink dark:text-gray-200 text-xs sm:text-sm font-bold italic transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
          >
            <span>Show More</span>
            <ChevronDown className="w-4 h-4 shrink-0" />
          </button>
        </div>
      )}

      {/* All Loaded Message */}
      {!hasMore && history.length > BATCH_SIZE && (
        <p className="text-center text-xs text-muted-foreground font-semibold italic py-2">
          Showing all {history.length} matches
        </p>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { UserHistoryMatch, Paginated } from '@/types/contracts/club';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LeaderboardPagination from '../members/pagination';

interface HistoryTabProps {
  history: Paginated<UserHistoryMatch>;
}

const ITEMS_PER_PAGE = 5;

export default function HistoryTab({ history }: HistoryTabProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Since backend fetches all matches in `data`, we paginate it locally
  const allMatches = history.data || [];
  
  if (allMatches.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border/80 p-8 text-center text-muted-foreground italic font-semibold">
        No match history recorded yet.
      </div>
    );
  }

  // Calculate Pagination
  const totalPages = Math.ceil(allMatches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleMatches = allMatches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {visibleMatches.map((match) => {
        const opponentNames =
          match.opponents.length > 0
            ? match.opponents.map((o) => `${o.login}`).join(' & ')
            : 'Unknown Opponent';
        const primaryOpponent = match.opponents[0];
        const dateFormatted = new Date(match.date).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        });
        
        const isWin = match.result === 'W';

        return (
          <div
            key={match.match_id}
            className="bg-card hover:bg-muted/30 border border-border/60 hover:border-border rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-sm"
          >
            {/* Left: Result Badge + Avatar + Text */}
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
              {/* W/L Badge */}
              <span
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-black italic text-sm shrink-0 shadow-2xs ${
                  isWin
                    ? 'bg-emerald-500 text-white'
                    : 'bg-destructive text-white'
                }`}
              >
                {match.result}
              </span>

              {/* Avatar */}
              {/* <Avatar className="w-10 h-10 border-2 border-background shrink-0 shadow-2xs">
                <AvatarImage
                  src={primaryOpponent?.avatar || undefined}
                  alt={opponentNames}
                />
                <AvatarFallback className="bg-muted text-foreground font-bold text-xs uppercase">
                  {primaryOpponent?.first_name?.charAt(0) || 'O'}
                </AvatarFallback>
              </Avatar> */}

              {/* Text Info */}
              <div className="min-w-0 flex flex-col justify-center">
                
              </div>
                
              <div className="min-w-0 flex flex-col justify-center">
                <h4 className="font-black italic text-sm sm:text-base text-brand-ink dark:text-white line-clamp-2 leading-tight">
                  
                  {match.partner && (
                    <span className="text-muted-foreground/80 font-bold ml-1.5 text-xs sm:text-sm">
                      (with {match.partner.login})
                    </span>
                  )}
                  {" "}vs {opponentNames}
                </h4>
                
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold italic text-muted-foreground mt-1">
                  <span className="text-brand-ink dark:text-gray-300 font-bold">{match.club_name}</span>
                  <span className="opacity-40">•</span>
                  {/* Fixed score string formatting */}
                  <span className="bg-secondary/60 dark:bg-secondary px-1.5 py-0.5 rounded text-[11px] uppercase tracking-wider text-foreground">
                    Score: {match.my_score} - {match.opponent_score}
                  </span>
                  {primaryOpponent?.department && (
                    <>
                      <span className="opacity-40">•</span>
                      <span>Dept {primaryOpponent.department}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Date & Points Badge */}
            <div className="flex flex-col items-end shrink-0 pl-2">
              <div
                className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg font-black italic text-sm border shadow-2xs ${
                  match.points_change >= 0 
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                    : 'bg-red-50 dark:bg-destructive/10 text-destructive border-red-200 dark:border-destructive/20'
                }`}
              >
                {match.points_change >= 0 ? `+${match.points_change}` : match.points_change} PTS
              </div>
              <span className="text-[10px] font-bold italic text-muted-foreground mt-1.5 uppercase tracking-wider">
                {dateFormatted}
              </span>
            </div>
          </div>
        );
      })}

      {/* Reusable Pagination Component */}
      {totalPages > 1 && (
        <div className="mt-2 flex justify-center w-full bg-card border border-border/60 rounded-xl p-2 shadow-2xs">
          <LeaderboardPagination
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page) => {
              setCurrentPage(page);
            }} 
          />
        </div>
      )}
    </div>
  );
}
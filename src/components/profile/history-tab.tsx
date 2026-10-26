"use client";

import { useState } from "react";
import { useUserMatches } from "@/hooks/use-matches";
import LeaderboardPagination from "../members/pagination";

interface HistoryTabProps {
  userId: number;
}

const ITEMS_PER_PAGE = 5;

export default function HistoryTab({ userId }: HistoryTabProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Hook handles all data fetching automatically
  const {
    data: history,
    isLoading,
    isFetching,
  } = useUserMatches(userId, currentPage, ITEMS_PER_PAGE);

  // Show a sleek skeleton loader during the initial data fetch
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 w-full h-full min-h-100">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-22 w-full bg-muted/40 animate-pulse rounded-xl border border-border/40"
          />
        ))}
      </div>
    );
  }

  const matches = history?.data ?? [];
  const total = history?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  if (total === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border/80 p-8 text-center text-muted-foreground italic font-semibold flex items-center justify-center min-h-100">
        No match history recorded yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full h-full min-h-100">
      {/* Match Cards List (dims slightly when switching pages) */}
      <div
        className={`flex-1 overflow-y-auto pr-1 sm:pr-2 flex flex-col gap-2 transition-opacity duration-200 ${isFetching && !isLoading ? "opacity-60" : "opacity-100"}`}
      >
        {matches.map((match) => {
          const dateFormatted = new Date(match.date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });

          const isWin = match.result === "W";
          const resultText = isWin ? "VICTORY" : "DEFEAT";
          const resultTextColor = isWin
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-600 dark:text-red-400";

          const bgColor = isWin
            ? "bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
            : "bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20";

          const borderColor = isWin
            ? "border-emerald-500 dark:border-emerald-400"
            : "border-red-500 dark:border-red-400";

          const pointsFormatted =
            match.points_change >= 0 ? `+${match.points_change}` : match.points_change;

          const matchMode = match.mode == 1 ? "1 V 1" : match.mode == 2 ? "2 V 2" : "UNKNOWN";

          return (
            <div
              key={match.match_id}
              className="group relative flex items-center p-3 sm:p-4 rounded-xl border border-border/40 transition-all duration-200 overflow-hidden shadow-2xs bg-card"
            >
              <div
                className={`absolute right-0 top-0 bottom-0 w-1/2 ${isWin ? "from-emerald-500/5" : "from-red-500/5"} to-transparent pointer-events-none`}
              />

              <div className="flex items-center justify-between w-full relative z-10">
                {/* Left Column: Club & Date */}
                <div className="flex flex-col flex-1 min-w-0 pr-4">
                  <h4 className="font-black italic text-base sm:text-lg text-brand-ink dark:text-white truncate uppercase leading-tight">
                    {match.club_name}
                  </h4>
                  <span className="text-xs font-semibold italic text-muted-foreground/80 truncate mt-0.5">
                    {dateFormatted}
                  </span>
                </div>

                {/* Center Column: Mode + Victory/Defeat & Score */}
                <div className="flex items-center justify-center gap-10 sm:gap-24 shrink-0">
                  <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-border/60 bg-muted/30 text-[10px] sm:text-xs font-bold text-muted-foreground tracking-widest shrink-0">
                    {matchMode}
                  </span>

                  <div className="flex flex-col items-center justify-center w-24 shrink-0">
                    <span
                      className={`font-black italic tracking-widest text-[13px] sm:text-[15px] uppercase ${resultTextColor}`}
                    >
                      {resultText}
                    </span>
                    <span className="font-black text-sm sm:text-base text-foreground mt-0.5 tabular-nums">
                      {match.my_score}{" "}
                      <span className="text-muted-foreground font-normal mx-0.5">-</span>{" "}
                      {match.opponent_score}
                    </span>
                  </div>
                </div>

                {/* Right Column: Points Box */}
                <div className="flex items-center justify-end flex-1 min-w-0 pl-4">
                  <span
                    className={`border border-border/40 rounded-md px-3 py-1 sm:px-4 sm:py-1.5 ${borderColor} ${bgColor} text-xs sm:text-sm font-black italic tracking-wide ${resultTextColor} shrink-0`}
                  >
                    {pointsFormatted}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="mt-auto shrink-0 pt-2">
          <div className="flex justify-center w-full bg-card border border-border/60 rounded-xl p-2 shadow-2xs">
            <LeaderboardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

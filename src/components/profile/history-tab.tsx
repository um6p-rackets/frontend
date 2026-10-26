"use client";

import { useState } from "react";
import { UserHistoryMatch, Paginated } from "@/types/contracts/club";
import Pagination from "../members/pagination";

interface HistoryTabProps {
  history: Paginated<UserHistoryMatch>;
}

const ITEMS_PER_PAGE = 5;

export default function HistoryTab({ history }: HistoryTabProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const allMatches = history.data || [];

  if (allMatches.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border/80 p-8 text-center text-muted-foreground text-sm font-medium">
        No match history recorded yet.
      </div>
    );
  }

  const totalPages = Math.ceil(allMatches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleMatches = allMatches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {visibleMatches.map((match) => {
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
          ? "bg-emerald-50/50 dark:bg-emerald-500/10"
          : "bg-red-50/50 dark:bg-red-500/10";

        const borderColor = isWin
          ? "border-emerald-500/30 dark:border-emerald-400/30"
          : "border-red-500/30 dark:border-red-400/30";

        const pointsFormatted =
          match.points_change >= 0 ? `+${match.points_change}` : match.points_change;

        const matchMode = match.mode == 1 ? "1 V 1" : match.mode == 2 ? "2 V 2" : "UNKNOWN";

        return (
          <div
            key={match.match_id}
            className="flex items-center px-4 py-3.5 rounded-xl border border-border/80 transition-all duration-200 shadow-2xs bg-card hover:border-orange-500/60 dark:hover:border-orange-400/60"
          >
            <div className="flex items-center justify-between w-full">
              {/* Left Column: Club & Time */}
              <div className="flex flex-col flex-1 min-w-0 pr-4">
                <h4 className="font-bold italic text-sm sm:text-base text-brand-ink dark:text-white truncate uppercase leading-tight">
                  {match.club_name}
                </h4>
                <span className="text-[11px] font-medium text-muted-foreground/80 truncate mt-0.5">
                  {dateFormatted}
                </span>
              </div>

              {/* Center Column: Mode + Victory/Defeat & Score */}
              <div className="flex items-center justify-center gap-8 sm:gap-20 shrink-0">
                {/* Mode Pill */}
                <span className="px-2.5 py-0.5 rounded-full border border-border/60 bg-muted/30 text-[10px] font-bold text-muted-foreground tracking-wider shrink-0">
                  {matchMode}
                </span>

                {/* Victory/Defeat & Score */}
                <div className="flex flex-col items-center justify-center w-20 shrink-0">
                  <span
                    className={`font-bold italic tracking-wider text-[11px] sm:text-xs uppercase ${resultTextColor}`}
                  >
                    {resultText}
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-foreground mt-0.5 tabular-nums">
                    {match.my_score}{" "}
                    <span className="text-muted-foreground font-normal mx-0.5">-</span>{" "}
                    {match.opponent_score}
                  </span>
                </div>
              </div>

              {/* Right Column: Points Box */}
              <div className="flex items-center justify-end flex-1 min-w-0 pl-4">
                <span
                  className={`border rounded-md px-2.5 py-1 ${borderColor} ${bgColor} text-xs font-bold italic tracking-wide ${resultTextColor} shrink-0`}
                >
                  {pointsFormatted}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center w-full bg-card border border-border/60 rounded-xl p-2 shadow-2xs">
          <Pagination
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
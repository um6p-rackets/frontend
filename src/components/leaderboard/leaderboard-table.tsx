'use client';

import { useState } from 'react';
import LeaderboardRow from './leaderboard-row';
import type { ClubPageData } from '@/types/mock-data-types';
import Pagination from './pagination';

export default function LeaderboardTable({
  top_members
}: {
  top_members: ClubPageData['top_members'];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedMembers = [...top_members].sort((a, b) => b.points - a.points);
  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMembers = sortedMembers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="w-full max-w-6xl bg-card shadow-sm rounded-xl sm:rounded-2xl p-3 sm:p-8 border border-border">
      <div className="mb-4 px-2">
        <p className="text-[10px] sm:text-xs text-muted-foreground italic mt-1">
          Active campus contenders ranked by performance.
        </p>
      </div>

      {/* Leaderboard List (Mobile Cards & Desktop Table) */}
      <div className="w-full md:overflow-x-auto md:pb-4 scrollbar-thin">
        <div className="w-full md:min-w-170">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-[60px_2.2fr_1fr_1fr_1fr_80px] gap-4 w-full px-4 sm:px-6 py-3 mb-2 text-[9px] sm:text-xs font-black text-muted-foreground italic tracking-widest border-b border-border">
            <div>RANK</div>
            <div>ATHLETE</div>
            <div>DEPARTMENT</div>
            <div>RECORD</div>
            <div>WIN RATE</div>
            <div className="text-right">POINTS</div>
          </div>

          {/* Members List */}
          <div className="flex flex-col gap-3 md:gap-2">
            {currentMembers.map((member, index) => (
              <LeaderboardRow
                key={`${member.name}-${startIndex + index}`}
                member={member}
                rank={startIndex + index + 1}
              />
            ))}
          </div>
        </div>
      </div>

      {totalPages > 0 && (
        <div className="mt-4 sm:mt-8 flex flex-col md:flex-row justify-between items-center gap-4 px-2 sm:px-4 text-[10px] sm:text-xs font-bold text-muted-foreground italic">
          <p className="text-center md:text-left">
            Displaying {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, sortedMembers.length)} of{' '}
            {sortedMembers.length} active contenders
          </p>

          <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

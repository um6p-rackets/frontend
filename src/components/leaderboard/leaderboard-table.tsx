'use client';

import { useState } from 'react';
import LeaderboardRow from './leaderboard-row';
import type { ClubPageData } from '@/types/club';

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
  const currentMembers = sortedMembers.slice(startIndex, startIndex + itemsPerPage);

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

      <div className="w-full overflow-x-auto pb-4 scrollbar-thin">
        <div className="min-w-170">
          
          <div className="grid grid-cols-[60px_2fr_1fr_1fr_1fr_80px] gap-4 w-full px-4 sm:px-6 py-3 mb-2 text-[9px] sm:text-xs font-black text-muted-foreground italic tracking-widest border-b border-border">
            <div>RANK</div>
            <div>ATHLETE</div>
            <div>DEPARTMENT</div>
            <div>RECORD</div>
            <div>WIN RATE</div>
            <div className="text-right">POINTS</div>
          </div>

          <div className="flex flex-col gap-2">
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
            Displaying {startIndex + 1}–{Math.min(startIndex + itemsPerPage, sortedMembers.length)} of {sortedMembers.length} active contenders
          </p>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button 
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1 sm:py-1.5 bg-background border border-border text-brand-ink rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed italic font-black text-[10px] sm:text-xs"
            >
              Prev
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2.5 py-1 sm:py-1.5 rounded-md italic font-black text-[10px] sm:text-xs transition-colors ${
                  currentPage === page 
                    ? 'bg-brand-orange text-white border border-brand-orange' 
                    : 'bg-background border border-border text-brand-ink hover:bg-muted'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 sm:py-1.5 bg-background border border-border text-brand-ink rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed italic font-black text-[10px] sm:text-xs"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
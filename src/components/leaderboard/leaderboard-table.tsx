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
    <div className="w-full max-w-6xl bg-card shadow-sm rounded-2xl p-8 border border-border">
      
      <div className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_80px] gap-4 w-full px-6 py-4 mb-2 text-xs font-bold text-muted-foreground italic tracking-widest border-b border-border">
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

      {totalPages > 0 && (
        <div className="mt-8 flex justify-between items-center px-4 text-xs font-bold text-muted-foreground italic">
          <p>
            Displaying {startIndex + 1}–{Math.min(startIndex + itemsPerPage, sortedMembers.length)} of {sortedMembers.length} active collegiate contenders
          </p>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-1.5 bg-background border border-border text-brand-ink rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed italic font-black text-sm"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-md italic font-black text-sm transition-colors ${
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
              className="px-4 py-1.5 bg-background border border-border text-brand-ink rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed italic font-black text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
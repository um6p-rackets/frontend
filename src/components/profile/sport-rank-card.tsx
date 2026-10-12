'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserClubRank } from '@/types/contracts/club';
import { MoveUpRight } from 'lucide-react';

interface SportRankCardProps {
  clubRanks: UserClubRank[];
  userName: string;
  department?: string | null;
}

// Global catalog of sports icons and default names
const sportsCatalog: Record<
  string,
  { name: string; icon: React.ReactNode }
> = {
  padel: {
    name: 'Padel Club',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="10" cy="9" rx="6" ry="6.5" fill="none" />
        <line x1="14.5" y1="13.5" x2="21" y2="20" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="8" cy="8" r="0.8" fill="currentColor" />
        <circle cx="10" cy="8" r="0.8" fill="currentColor" />
        <circle cx="12" cy="8" r="0.8" fill="currentColor" />
        <circle cx="9" cy="10.5" r="0.8" fill="currentColor" />
        <circle cx="11" cy="10.5" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  tennis: {
    name: 'Tennis Club',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" stroke="currentColor" strokeWidth="1.7">
        <ellipse cx="10" cy="9" rx="6.5" ry="6.5" />
        <line x1="10" y1="2.5" x2="10" y2="15.5" strokeWidth="0.8" strokeDasharray="1 1" />
        <line x1="3.5" y1="9" x2="16.5" y2="9" strokeWidth="0.8" strokeDasharray="1 1" />
        <line x1="14.5" y1="13.5" x2="21" y2="20" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="19" cy="5" r="2.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  badminton: {
    name: 'Badminton Club',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" stroke="currentColor" strokeWidth="1.6">
        <ellipse cx="10" cy="8" rx="5" ry="6.5" />
        <line x1="10" y1="1.5" x2="10" y2="14.5" strokeWidth="0.8" strokeDasharray="1 1" />
        <line x1="13.5" y1="13" x2="21" y2="20.5" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  'table-tennis': {
    name: 'Table Tennis Club',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="10" cy="9" r="6" />
        <line x1="14" y1="13.5" x2="20.5" y2="20" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="19.5" cy="5" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  squash: {
    name: 'Squash Club',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" stroke="currentColor" strokeWidth="1.7">
        <path d="M6 13C4 10 4 6 7 4C10 2 13 4 14 7C15 9 14 12 11 13.5" />
        <line x1="11" y1="13.5" x2="19.5" y2="21" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="19" cy="5" r="2.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
};

function normalizeSportKey(sport: string): string {
  const s = sport.toLowerCase().replace(/club/g, '').trim().replace(/\s+/g, '-');
  if (s.includes('padel')) return 'padel';
  if (s.includes('tennis') && !s.includes('table')) return 'tennis';
  if (s.includes('badminton')) return 'badminton';
  if (s.includes('table') || s.includes('ping')) return 'table-tennis';
  if (s.includes('squash')) return 'squash';
  return s;
}

export default function SportRankCard({ clubRanks, userName, department }: SportRankCardProps) {
  // Dynamically map ONLY the clubs that this user actually has
  const availableSports = (clubRanks || []).map((rank) => {
    const key = normalizeSportKey(rank.club_name);
    const catalogItem = sportsCatalog[key] || {
      name: rank.club_name,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none" stroke="currentColor" strokeWidth="1.7">
          <circle cx="10" cy="9" r="6" />
          <line x1="14" y1="13.5" x2="20.5" y2="20" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    };

    return {
      id: key,
      sport: rank.club_name,
      name: catalogItem.name,
      icon: catalogItem.icon,
      rankInfo: rank,
    };
  });

  const [selectedSport, setSelectedSport] = useState<string>(
    availableSports[0]?.id || ''
  );

  // If user has no club ranks, render a placeholder card
  if (availableSports.length === 0) {
    return (
      <div className="w-full flex flex-col rounded-2xl overflow-hidden shadow-xs border border-border/80 bg-card p-6 text-center">
        <h3 className="text-xl font-black italic text-brand-ink dark:text-white">
          Rank
        </h3>
        <p className="text-xs text-muted-foreground italic mt-2">
          No club rankings recorded for this athlete yet.
        </p>
        <Link
          href="/#clubs"
          className="mt-4 inline-flex items-center justify-center gap-1 text-xs font-bold italic text-brand-orange hover:underline"
        >
          <span>Explore Clubs</span>
          <MoveUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Active sport
  const currentSport =
    availableSports.find((s) => s.id === selectedSport) || availableSports[0];
  const currentRankInfo = currentSport.rankInfo;

  return (
    <div className="w-full flex flex-col rounded-2xl overflow-hidden shadow-xs border border-border/80">
      {/* Orange Sport Selector Header Bar - only renders buttons for user's sports */}
      <div className="bg-brand-orange text-white py-3.5 px-3 flex items-center justify-around divide-x divide-white/30">
        {availableSports.map((sport) => {
          const isSelected = currentSport.id === sport.id;
          return (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              title={sport.name}
              className={`flex-1 flex items-center justify-center py-1 transition-all cursor-pointer ${
                isSelected
                  ? 'text-white scale-110 drop-shadow-md'
                  : 'text-white/70 hover:text-white hover:scale-105'
              }`}
            >
              {sport.icon}
            </button>
          );
        })}
      </div>

      {/* Card Body */}
      <div className="bg-card p-5 sm:p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-black italic text-brand-ink dark:text-white">
            Rank
          </h2>
          <p className="text-sm font-semibold italic text-muted-foreground mt-0.5">
            {currentSport.name}
          </p>
        </div>

        {/* User Rank Box */}
        <div className="bg-[#FAF7EE] dark:bg-muted/40 rounded-xl p-3.5 sm:p-4 flex items-center justify-between border border-[#ECE6D8] dark:border-border/40">
          <div className="flex items-center gap-3 min-w-0">
            {/* Rank badge circle */}
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white font-black italic flex items-center justify-center text-sm shrink-0 shadow-2xs">
              {currentRankInfo.rank}
            </div>

            <div className="min-w-0">
              <div className="font-bold italic text-sm sm:text-base text-brand-ink dark:text-white truncate">
                {userName}
              </div>
              <div className="text-xs font-semibold italic text-muted-foreground">
                Department {department || 'Campus'}
              </div>
            </div>
          </div>

          {/* Points */}
          <div className="flex flex-col items-end shrink-0 pl-2">
            <span className="font-black italic text-brand-orange text-base sm:text-lg leading-tight">
              {currentRankInfo.points.toLocaleString()}
            </span>
            <span className="text-[10px] font-black italic text-muted-foreground tracking-wider">
              PTS
            </span>
          </div>
        </div>

        {/* View Leaderboard Link */}
        <Link
          href="/leaderboard"
          className="flex items-center justify-center gap-1.5 pt-2 text-xs sm:text-sm font-bold italic text-brand-ink dark:text-gray-200 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
        >
          <span>View Leaderboard</span>
          <MoveUpRight className="w-3.5 h-3.5 shrink-0" />
        </Link>
      </div>
    </div>
  );
}

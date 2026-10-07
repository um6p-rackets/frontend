import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ClubPageData } from '@/types/club';

import Rank1Badge from '@/components/badge/rank1';
import Rank2Badge from '@/components/badge/rank2';
import Rank3Badge from '@/components/badge/rank3';
import UndefeatedBadge from '@/components/badge/undefeated';
import HotStreakBadge from '@/components/badge/hot-streak';

function calculateWinRate(record?: string) {
  if (!record) return '-';
  const match = record.match(/(\d+)W\s*-\s*(\d+)L/);
  if (match) {
    const wins = parseInt(match[1], 10);
    const losses = parseInt(match[2], 10);
    const total = wins + losses;
    if (total === 0) return '0%';
    return `${Number(((wins / total) * 100).toFixed(1))}%`;
  }
  return '-';
}

export default function LeaderboardRow({ 
  member, 
  rank 
}: { 
  member: ClubPageData['top_members'][0]; 
  rank: number 
}) {
  let rankBg = 'bg-brand-ink text-background';
  let rowBg = 'bg-card hover:bg-muted';
  
  if (rank === 1) { 
    rankBg = 'bg-brand-orange text-white'; 
    rowBg = 'bg-brand-cream/50';
  } else if (rank === 2) { 
    rankBg = 'bg-brand-teal text-white'; 
    rowBg = 'bg-muted/80'; 
  } else if (rank === 3) { 
    rankBg = 'bg-accent text-white'; 
    rowBg = 'bg-card'; 
  }

  const hasBadges = rank <= 3 || (member.badges && member.badges.length > 0);
  const winRate = calculateWinRate(member.record);

  return (
    <div className={`relative flex flex-col justify-center px-4 sm:px-6 py-2.5 sm:py-4 rounded-xl transition-colors ${rowBg}`}>
      
      {hasBadges && (
        <div className="absolute top-1 left-4 sm:left-6 flex flex-wrap items-center gap-1 scale-[0.8] sm:scale-100 origin-top-left">
          {rank === 1 && <Rank1Badge />}
          {rank === 2 && <Rank2Badge />}
          {rank === 3 && <Rank3Badge />}
          {member.badges?.includes('undefeated') && <UndefeatedBadge />}
          {member.badges?.includes('hot-streak') && <HotStreakBadge />}
        </div>
      )}

        <div className={`grid grid-cols-[60px_2fr_1fr_1fr_1fr_80px] items-center gap-4 w-full ${hasBadges ? 'mt-4 sm:mt-4' : ''}`}>
        
        {/* Rank */}
        <div className="font-bold text-sm sm:text-lg">
          <div className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md ${rankBg}`}>
            {rank}
          </div>
        </div>

        {/* Athlete */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-background shadow-sm shrink-0">
            <AvatarImage src={member.avatar_url} alt={member.name} />
            <AvatarFallback className="bg-brand-cream text-brand-orange font-bold text-xs sm:text-base">{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-bold text-brand-ink italic text-xs sm:text-base truncate">{member.name}</span>
        </div>

        {/* Department */}
        <div className="font-bold text-muted-foreground italic text-[11px] sm:text-sm truncate">{member.department}</div>
        
        {/* Record & Win Rate */}
        <div className="font-bold text-muted-foreground italic text-[11px] sm:text-sm truncate">{member.record || '-'}</div>
        <div className="font-bold text-muted-foreground italic text-[11px] sm:text-sm truncate">{winRate}</div>
        
        {/* Points */}
        <div className="font-bold text-brand-orange italic text-right text-sm sm:text-lg">{member.points}</div>
      </div>
    </div>
  );
}
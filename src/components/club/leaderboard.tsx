import { ClubPageData } from '@/types/club';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MoveUpRight, Trophy } from 'lucide-react';
import Link from 'next/link';

export function LeaderboardMemberCard({
  rank,
  member
}: {
  rank: number;
  member: ClubPageData['top_members'][0];
}) {
  return (
    <Link
      href="#"
      className="p-3 sm:p-4 gap-2 sm:gap-4 grid grid-cols-[1fr_auto] justify-between items-center m-1 hover:shadow-sm cursor-pointer transition-shadow duration-300 rounded-lg"
    >
      <div className="flex flex-row justify-start items-center gap-3 sm:gap-4 min-w-0">
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 shrink-0">
          <AvatarImage src={member.avatar_url} alt={member.name} />
          <AvatarFallback className="bg-accent text-accent-foreground text-xs sm:text-sm">
            {rank}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="font-bold text-sm sm:text-lg truncate">{member.name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{member.department}</p>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground text-right flex flex-col justify-center items-end shrink-0">
        <p className="flex flex-col justify-center items-center w-fit">
          <span className="font-bold text-accent text-sm sm:text-base">{member.points}</span> 
          <span className="text-[10px] sm:text-xs">PTS</span>
        </p>
      </div>
    </Link>
  );
}

export default function Leaderboard({
  top_members
}: {
  top_members: ClubPageData['top_members'];
}) {
  const sortedMembers = [...top_members].sort((a, b) => b.points - a.points);
  
  return (
    <Card className="w-full h-full bg-gray-50 border-none shadow-none ring-0 rounded-md flex flex-col">
      <div className="text-xl sm:text-2xl px-4 py-3 font-bold flex items-center justify-start gap-3 sm:gap-4 border-b border-gray-200">
        <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-accent shrink-0" /> 
        <span>Leaderboard</span>
      </div>
      
      <div className="flex flex-col gap-1 sm:gap-2 p-1 sm:p-2 overflow-auto flex-1">
        {sortedMembers.slice(0, 5).map((member, index) => (
          <LeaderboardMemberCard key={index} member={member} rank={index + 1} />
        ))}
      </div>
      
      <Link
        href="/leaderboard"
        className="flex flex-row justify-center items-center gap-2 p-3 sm:p-4 font-semibold hover:underline cursor-pointer text-sm sm:text-base border-t border-gray-100"
      >
        <MoveUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-accent shrink-0" />
        <p>View Full Campus Ladder</p>
      </Link>
    </Card>
  );
}
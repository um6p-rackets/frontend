import { ClubPageData } from '@/types/club';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ListOrdered, MoveUpRight, Podium, Trophy } from 'lucide-react';
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
      className="p-4 gap-4 grid grid-cols-2   justify-between items-center  m-0 hover:shadow-sm cursor-pointer transition-shadow duration-300 m-1"
    >
      <div className="flex flex-row justify-start items-center gap-4">
        <Avatar>
          <AvatarImage src={member.avatar_url} alt={member.name} />
          <AvatarFallback className="bg-accent text-accent-foreground">
            {rank}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-lg truncate">{member.name}</h3>
          <p className="text-sm text-muted-foreground">{member.department}</p>
        </div>
      </div>
      <div className="text-xs text-muted-foreground  text-right flex flex-col justify-center items-end">
        <p className="flex flex-col justify-center items-center w-fit">
          <span className="font-bold text-accent">{member.points}</span> <br />{' '}
          <span className="text-xs">PTS</span>
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
  return (
    <Card className="w-full h-full  bg-gray-50 border-none shadow-none ring-0 rounded-md grid-rows-[auto_minmax(0,1fr)] ">
      <div className="text-2xl px-4 py-2 font-bold  flex items-center justify-start  gap-4  border-b border-gray-200">
        <Trophy className="w-8 h-8 text-accent" /> <span>Leaderboard</span>
      </div>
      <div className="grid grid-cols-1 gap-4  overflow-auto  min-h-0 ">
        {top_members.map((member, index) => (
          <LeaderboardMemberCard key={index} member={member} rank={index + 1} />
        ))}
      </div>
      <Link
        href="#"
        className="flex flex-row justify-center items-center gap-2 p-4  font-semibold hover:underline cursor-pointer"
      >
        <MoveUpRight className="w-6 h-6 text-accent" />
        <p>View Full Campus Ladder</p>
      </Link>
    </Card>
  );
}

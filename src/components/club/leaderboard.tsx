import { ClubPageData } from '@/types/club';
import { Card } from '../ui/card';

export function LeaderboardMemberCard({
  member
}: {
  member: ClubPageData['top_members'][0];
}) {
  return (
    <div className="p-4 gap-2 flex flex-col justify-between items-start m-0 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="font-bold text-lg">{member.name}</h3>
      <p className="text-sm text-muted-foreground">{member.department}</p>
      <p className="text-xs text-muted-foreground w-full  text-right">
        {member.points} points
      </p>
    </div>
  );
}

export default function Leaderboard({
  top_members
}: {
  top_members: ClubPageData['top_members'];
}) {
  return (
    <Card className="w-full h-full  bg-gray-50 border-none shadow-none ring-0 rounded-md grid-rows-[auto_minmax(0,1fr)]">
      <h2 className="text-2xl px-4 py-2 font-bold text-accent">Leaderboard</h2>
      <div className="grid grid-cols-1 gap-4  overflow-auto  min-h-0 ">
        {top_members.map((member, index) => (
          <LeaderboardMemberCard key={index} member={member} />
        ))}
      </div>
    </Card>
  );
}

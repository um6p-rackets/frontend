import { ClubPageData } from '@/types/club';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { CircleSmall } from 'lucide-react';
import { Separator } from '../ui/separator';

function SessionCard({
  session
}: {
  session: ClubPageData['weekly_sessions'][0];
}) {
  return (
    <Card className="grid grid-cols-3 justify-between items-center p-4 gap-4">
      <div className="font-semibold text-accent text-lg p-4 bg-accent-foreground rounded-md w-fit">
        <span className="md:hidden">{session.day.slice(0, 3)}</span>
        <span className="hidden md:inline">{session.day}</span>
      </div>
      <div className="flex flex-col justify-between items-left w-full h-full">
        <div className="font-bold text-lg">{session.type} </div>
        <div>
          {session.start_time} - {session.end_time}
        </div>
      </div>
      <div className="flex flex-col justify-between items-center w-full h-full gap-2 *:w-full">
        <div className="font-regular text-center flex flex-row justify-center items-center gap-2">
          <CircleSmall className="w-4 h-4 text-accent" fill="currentColor" />
          <span className="flex gap-2">
            {session.spots_available}{' '}
            <Separator orientation="vertical" className="rotate-25" />{' '}
            {session.total_spots} spots
          </span>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          Join
        </Button>
      </div>
    </Card>
  );
}

export default function SessionsList({
  weekly_sessions
}: {
  weekly_sessions: ClubPageData['weekly_sessions'];
}) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {weekly_sessions.map((session, index) => (
        <SessionCard key={index} session={session} />
      ))}
    </div>
  );
}

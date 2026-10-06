import { ClubPageData } from '@/types/club';
import { Card } from '../ui/card';

function Announcement({
  announcement
}: {
  announcement: ClubPageData['announcements'][0];
}) {
  return (
    <Card className="p-4 gap-2 flex flex-col justify-between items-start m-0 w-full">
      <h3 className="font-bold text-lg">{announcement.title}</h3>
      <p className="text-sm text-muted-foreground">{announcement.content}</p>
      <p className="text-xs text-muted-foreground w-full  text-right">
        {announcement.date}
      </p>
    </Card>
  );
}

export default function AnnouncementList({
  announcements
}: {
  announcements: ClubPageData['announcements'];
}) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {announcements.map((announcement, index) => (
        <Announcement key={index} announcement={announcement} />
      ))}
    </div>
  );
}

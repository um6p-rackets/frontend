import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import AnnouncementList from './announcement-list';
import DocumentList from './document-list';
import SessionsList from './sessions-list';
import type { ClubPageData } from '@/types/club';

export default function ClubTaps({
  weekly_sessions,
  announcements,
  documents
}: {
  weekly_sessions: ClubPageData['weekly_sessions'];
  announcements: ClubPageData['announcements'];
  documents: ClubPageData['documents'];
}) {
  return (
    <Tabs defaultValue="sessions" className="w-full max-w-150">
      <TabsList className="m-0 p-4 flex flex-row w-full rounded-md shadow-none bg-gray-50 py-8 gap-2 lg:gap-6   justify-between *:rounded-md *:shadow:none *:bg-none  *:px-3 *:py-5 *:data-active:bg-accent *:data-active:text-accent-foreground *:focus:bg-accent *:focus:text-primary-foreground *:text-md *:font-semibold ">
        <TabsTrigger value="Sessions">Sessions</TabsTrigger>
        <TabsTrigger value="Announcements">Announcements</TabsTrigger>
        <TabsTrigger value="Tournament" className="hidden">
          Tournament
        </TabsTrigger>
        <TabsTrigger value="Documents">Documents</TabsTrigger>
      </TabsList>
      <Card className="w-full h-full  min-h-50 p-4  overflow-auto bg-gray-50 border-none shadow-none ring-0 rounded-md  ">
        <TabsContent value="Sessions">
          <SessionsList weekly_sessions={weekly_sessions} />
        </TabsContent>
        <TabsContent value="Announcements">
          <AnnouncementList announcements={announcements} />
        </TabsContent>
        <TabsContent value="Tournament">
          {/* TODO: Implement tournament content */}
          tournament content should be here
          {/* so you should create two components:
          one for tournament register link and one for tournament bracket link
          also its shown just on case of there is a tournament */}
        </TabsContent>
        <TabsContent value="Documents">
          <DocumentList documents={documents} />
        </TabsContent>
      </Card>
    </Tabs>
  );
}

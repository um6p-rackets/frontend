import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import SessionsList from './sessions-list';
import type { ClubPageData } from '@/types/club';

export default function ClubTaps({ weekly_sessions, announcements, documents, top_members }: { weekly_sessions: ClubPageData['weekly_sessions']; announcements: ClubPageData['announcements']; documents: ClubPageData['documents']; top_members: ClubPageData['top_members'] }) {
  return (
    <Tabs defaultValue="sessions" className="w-full">
      <TabsList className="flex flex-row w-full rounded-md shadow-none bg-gray-50 py-8 gap-2 lg:gap-6   justify-between *:rounded-md *:shadow:none *:bg-none  *:px-3 *:py-5 *:data-active:bg-accent *:data-active:text-accent-foreground *:focus:bg-accent *:focus:text-primary-foreground *:text-md *:font-semibold ">
        <TabsTrigger value="Sessions">Sessions</TabsTrigger>
        <TabsTrigger value="Announcements">Announcements</TabsTrigger>
        <TabsTrigger value="Tournament" className="hidden">
          Tournament
        </TabsTrigger>
        <TabsTrigger value="Documents">Documents</TabsTrigger>
        <TabsTrigger value="About">About</TabsTrigger>
      </TabsList>
      <Card className="w-full h-full p-4 min-h-50  max-h-125 overflow-auto bg-none border-none shadow-none ring-0 rounded-md">
        <TabsContent value="Sessions">
          <SessionsList weekly_sessions={weekly_sessions} />
        </TabsContent>
        <TabsContent value="Announcements">aaaa</TabsContent>
        <TabsContent value="Tournament">yttttt</TabsContent>
        <TabsContent value="Documents">ddd</TabsContent>
        <TabsContent value="About">aaa</TabsContent>
      </Card>
    </Tabs>
  );
}

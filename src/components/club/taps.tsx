import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import SessionsList from './sessions-list';

export default function ClubTaps() {
  return (
    <Tabs defaultValue="sessions" className="">
      <TabsList className="overflow-auth flex flex-row w-full rounded-md shadow-none bg-gray-50 py-8 gap-2 md:gap-6   justify-between *:rounded-md *:shadow:none *:bg-none  *:px-4 *:py-5 *:data-active:bg-accent *:data-active:text-accent-foreground *:focus:bg-accent *:focus:text-primary-foreground *:text-md *:font-semibold ">
        <TabsTrigger value="Sessions">Sessions</TabsTrigger>
        <TabsTrigger value="Announcements">Announcements</TabsTrigger>
        <TabsTrigger value="Tournament" className="hidden">
          Tournament
        </TabsTrigger>
        <TabsTrigger value="Documents">Documents</TabsTrigger>
        <TabsTrigger value="About">About</TabsTrigger>
      </TabsList>
      <Card className="w-full h-full p-4 min-h-50  max-h-125 overflow-auto">
        <TabsContent value="Sessions">
          <SessionsList />
        </TabsContent>
        <TabsContent value="Announcements">aaaa</TabsContent>
        <TabsContent value="Tournament">yttttt</TabsContent>
        <TabsContent value="Documents">ddd</TabsContent>
        <TabsContent value="About">aaa</TabsContent>
      </Card>
    </Tabs>
  );
}

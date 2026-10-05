import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export default function ClubTaps() {
  return (
    <Tabs defaultValue="sessions" className="">
      <TabsList className="flex flex-row w-full rounded-md shadow-none bg-gray-50 p-8  m-2 gap-2 *:rounded-md *:shadow:none *:bg-none  *:px-4 *:py-5 *:data-active:bg-accent *:data-active:text-accent-foreground *:focus:bg-accent *:focus:text-primary-foreground *:text-md *:font-semibold ">
        <TabsTrigger value="Sessions">Sessions</TabsTrigger>
        <TabsTrigger value="Announcements">Announcements</TabsTrigger>
        <TabsTrigger value="Tournament" className="hidden">
          Tournament
        </TabsTrigger>
        <TabsTrigger value="Documents">Documents</TabsTrigger>
        <TabsTrigger value="About">About</TabsTrigger>
      </TabsList>
      <TabsContent value="Sessions"></TabsContent>
      <TabsContent value="Announcements"></TabsContent>
      <TabsContent value="Tournament"></TabsContent>
      <TabsContent value="Documents"></TabsContent>
      <TabsContent value="About"></TabsContent>
    </Tabs>
  );
}

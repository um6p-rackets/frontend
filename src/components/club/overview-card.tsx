import { Users, Whistle } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Card } from '../ui/card';

export default function OverviewCard({
  desc,
  members,
  coach
}: {
  desc: string;
  members: number;
  coach: string;
}) {
  return (
    <Card className=" p-4 rounded-none border-none  shadow-none ring-0 bg-gray-50 dark:bg-gray-800 mx-5 mt-10 xl:mt-12 lg:mx-10">
      <Image
        src="/decorations/shuttlecock.png"
        alt="Badminton Club"
        width={100}
        height={100}
        className="absolute -top-10 -right-5 hidden md:block"
      />
      <h2 className="text-xl font-semibold mb-2">Official Campus Club</h2>
      <p className="mb-2">{desc}</p>
      <div className="flex flex-col sm:flex-row items-left gap-6">
        <div className="mb-2 flex gap-3 items-center">
          <Users className="text-accent" />
          <div>
            <span className="font-semibold truncate">{members}</span>
            <br /> Members
          </div>
        </div>
        <div className="mb-2 flex gap-3 items-center">
          <Whistle className="text-accent" />
          <div>
            <span className="font-semibold truncate">{coach}</span>
            <br /> Coach
          </div>
        </div>
        <Button className="bg-accent p-2 py-5">Request to Join</Button>
      </div>
    </Card>
  );
}

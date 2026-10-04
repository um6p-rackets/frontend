import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoveUpRight } from 'lucide-react';
import Image from 'next/image';

// this card got sport name example("Badminton, table tennis, padel") and a link and a image png link

type ClubCardProps = {
  name: string;
  imageUrl: string;
};

export default function ClubCard({ name, imageUrl }: ClubCardProps) {
  return (
    <Card className="w-[350px] flex flex-row h-[200px] rounded-none shadow-md border border-border bg-card text-card-foreground p-0">
      <div className="flex flex-col justify-between w-full p-4">
        <ClubCardTitle name={name} />
        <div className="flex gap-1 text-sm text-muted-foreground w-full pl-5   items-center cursor-pointer hover:text-accent transition-colors duration-200">
          <span>click to join</span>
          <MoveUpRight />
        </div>
      </div>
      <CardContent className="relative w-full p-0">
        <span className="absolute  top-0 w-[80px] h-full bg-accent border-0 rounded-none" />

        <div className="absolute right-2  center  w-[200px] h-[200px] ">
          <Image
            src={imageUrl}
            alt={name}
            width={180}
            height={180}
            className="rounded-md w-full h-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function ClubCardTitle({ name }: { name: string }) {
  return (
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-accent">
        {name}
      </CardTitle>
      <CardTitle className="text-xl text-muted-foreground">Club</CardTitle>
    </CardHeader>
  );
}

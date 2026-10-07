import ClubCard from "@/components/home/club-card";

const clubs = [
  {
    name: "Padel",
    imageUrl: "/clubs/padel.png",
    link: "/clubs/padel",
  },
  {
    name: "Squash",
    imageUrl: "/clubs/squash.png",
    link: "/clubs/squash",
  },
  {
    name: "Badminton",
    imageUrl: "/clubs/badminton.png",
    link: "/clubs/badminton",
  },
  {
    name: "Table Tennis",
    imageUrl: "/clubs/table-tennis.png",
    link: "/clubs/table-tennis",
  },
  {
    name: "Tennis",
    imageUrl: "/clubs/tennis.png",
    link: "/clubs/tennis",
  }
];

export default function ClubList() {
  return (
    <div className="relative max-w-6xl mx-auto w-full py-16 px-6 sm:px-12 md:px-16">
      
      <div className="absolute bottom-[28%] right-0 w-[42%] h-1.5 bg-brand-teal -z-10 hidden xl:block animate-pulse-slow" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 xl:gap-x-40 gap-y-14 md:gap-y-20 place-items-center">
        {clubs.map((club) => (
          <ClubCard key={club.name} name={club.name} imageUrl={club.imageUrl} link={club.link} />
        ))}
        
        <div className="max-w-[320px] text-xs sm:text-sm text-muted-foreground italic lg:justify-self-start self-center py-4 pl-4 border-l-2 border-brand-teal/20">
          Ready to play? Simply click on a club card to instantly join your team and get on the court.
        </div>
      </div>
    </div>
  );
}
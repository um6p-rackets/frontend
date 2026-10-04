import ClubCard from "@/components/home/club-card";

// mock data for clubs
const clubs = [
  {
    name: "Padel",
    imageUrl: "/clubs/padel.png",
    link: "/clubs/padel",
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
];

export default function ClubList() {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {clubs.map((club) => (
        
        <ClubCard key={club.name} name={club.name} imageUrl={club.imageUrl} link={club.link} />
      ))}
    </div>
  );
}
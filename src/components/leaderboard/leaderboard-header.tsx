import { BarChart2 } from 'lucide-react';

export default function LeaderboardHeader() {
  return (
    <div className="w-full max-w-6xl mb-12 flex flex-col items-start">
      <div className="flex items-center gap-2 text-brand-ink mb-4">
        <BarChart2 className="w-8 h-8" strokeWidth={3} />
        <h1 className="text-2xl  font-black italic sm:text-4xl text-brand-orange uppercase tracking-tight">
          LEADERBOARD
        </h1>
      </div>
      <div className="w-72 h-1.5 bg-brand-ink rounded-full"></div>
    </div>
  );
}
import { BarChart2 } from 'lucide-react';

export default function LeaderboardHeader() {
  return (
    <div className="w-full max-w-6xl mb-12 flex flex-col items-start">
      <div className="flex items-center gap-3 text-brand-orange mb-4">
        <BarChart2 className="w-10 h-10" strokeWidth={3} />
        <h1 className="text-5xl font-black italic tracking-tight">LEADERBOARD</h1>
      </div>
      <div className="w-72 h-1.5 bg-brand-ink rounded-full"></div>
    </div>
  );
}
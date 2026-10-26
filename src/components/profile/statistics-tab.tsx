import { UserProfileData } from '@/types/contracts/club';

interface StatisticsTabProps {
  data: UserProfileData;
}

export default function StatisticsTab({ data }: StatisticsTabProps) {
  const { club_ranks, history } = data;

  const sportBreakdown = club_ranks.map((cr, idx) => {
    const clubMatches = history.data.filter((m) => m.club_id === cr.club_id);
    const wins = clubMatches.filter((m) => m.result === 'W').length;
    const losses = clubMatches.filter((m) => m.result === 'L').length;
    const total = wins + losses;
    const winRate = total > 0 ? (wins / total) * 100 : 0;

    return {
      sport: cr.club_name,
      matches: total,
      wins: wins,
      losses: losses,
      winRate: winRate,
      rating: cr.points,
      isMain: idx === 0, // Designates the top/primary sport tag
    };
  });

  return (
    <div className="bg-card rounded-2xl border border-border/80 p-5 sm:p-6 shadow-xs flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-4">
        {sportBreakdown.map((item) => (
          <div key={item.sport} className="flex flex-col gap-2 pb-4 border-b border-border/50 last:border-0 last:pb-0">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold italic text-brand-ink dark:text-white text-base">
                  {item.sport}
                </span>
                {item.isMain && (
                  <span className="px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/40 text-brand-orange text-[10px] font-black italic border border-orange-200/60 dark:border-orange-900/40">
                    Main
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold italic text-muted-foreground">
                  {item.wins}W - {item.losses}L
                </span>
                <span className={`font-black italic text-xs sm:text-sm ${item.winRate === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-brand-orange'}`}>
                  {item.winRate.toFixed(1)}%
                </span>
              </div>
            </div>
            
            {/* Custom Colored Progress Bar */}
            <div className="w-full bg-secondary/80 dark:bg-[#121417] rounded-full h-2.5 overflow-hidden border border-border/40">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  item.winRate === 100 ? 'bg-emerald-500' : 'bg-brand-orange'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, item.winRate))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

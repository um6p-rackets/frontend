import { UserProfileData } from '@/types/contracts/club';

interface StatisticsTabProps {
  data: UserProfileData;
}

export default function StatisticsTab({ data }: StatisticsTabProps) {
  const { stats, club_ranks, history } = data;

  const sportBreakdown = club_ranks.map((cr) => {
    const clubMatches = history.filter((m) => m.club_id === cr.club_id);
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
    };
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-[#F8F7F4] dark:bg-card border border-border/70 rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-semibold italic text-muted-foreground">Total Matches</span>
          <p className="text-2xl font-black italic text-brand-ink dark:text-white mt-1">
            {stats.total_matches}
          </p>
          <span className="text-[11px] font-bold italic text-muted-foreground">Across campus clubs</span>
        </div>

        <div className="bg-[#F8F7F4] dark:bg-card border border-border/70 rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-semibold italic text-muted-foreground">Overall Win Rate</span>
          <p className="text-2xl font-black italic text-brand-orange mt-1">
            {(stats.win_rate * 100).toFixed(1)}%
          </p>
          <span className="text-[11px] font-bold italic text-muted-foreground">
            {stats.wins}W - {stats.losses}L record
          </span>
        </div>

        <div className="bg-[#F8F7F4] dark:bg-card border border-border/70 rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-semibold italic text-muted-foreground">Current Streak</span>
          <p className="text-2xl font-black italic text-amber-600 mt-1">
            {stats.current_win_streak}W Streak
          </p>
          <span className="text-[11px] font-bold italic text-muted-foreground">Active winning run</span>
        </div>
      </div>

      {/* Sport Breakdown Table/Cards */}
      <div className="bg-card rounded-2xl border border-border/70 p-5 sm:p-6 shadow-xs flex flex-col gap-4">
        <h3 className="text-lg font-bold italic text-brand-ink dark:text-white">
          Performance by Sport
        </h3>

        <div className="flex flex-col gap-4">
          {sportBreakdown.map((item) => (
            <div key={item.sport} className="flex flex-col gap-1.5 pb-3 border-b border-border/40 last:border-0 last:pb-0">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold italic text-brand-ink dark:text-white">{item.sport}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold italic text-muted-foreground">
                    {item.wins}W - {item.losses}L
                  </span>
                  <span className="font-bold italic text-brand-orange text-xs sm:text-sm">
                    {item.winRate.toFixed(1)}%
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand-orange h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, item.winRate))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

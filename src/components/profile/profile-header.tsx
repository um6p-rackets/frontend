import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfileData } from '@/types/contracts/club';
import { Flame, Heart, GraduationCap } from 'lucide-react';
import Rank1Badge from '@/components/badge/rank1';
import Rank2Badge from '@/components/badge/rank2';
import Rank3Badge from '@/components/badge/rank3';
import UndefeatedBadge from '@/components/badge/undefeated';
import HotStreakBadge from '@/components/badge/hot-streak';
import { mockClubData } from '@/lib/mock-data';

export default function ProfileHeader({ data }: { data: UserProfileData }) {
  const { user, stats, joined_clubs, club_ranks } = data;
  const fullName = `${user.first_name} ${user.last_name}`;

  // Find user's best rank across clubs or campus leaderboard
  const lbMember = mockClubData.top_members.find((m) => m.user_id === user.id);
  const bestRankNumber = stats.best_rank?.rank ?? (lbMember ? mockClubData.top_members.indexOf(lbMember) + 1 : null);

  const hasRank1 = bestRankNumber === 1;
  const hasRank2 = bestRankNumber === 2;
  const hasRank3 = bestRankNumber === 3;
  const isUndefeated = (stats.wins > 0 && stats.losses === 0) || lbMember?.badges?.includes('undefeated');
  const isHotStreak = stats.current_win_streak >= 3 || lbMember?.badges?.includes('hot-streak');

  // Top ranked sport for this user (highest points, then best rank)
  const topClubRank =
    club_ranks && club_ranks.length > 0
      ? [...club_ranks].sort((a, b) => (b.points !== a.points ? b.points - a.points : a.rank - b.rank))[0]
      : stats.best_rank;
  const topClubId = topClubRank?.club_id;

  // Sort joined clubs so the sport with the heart (top-ranked sport) is always first
  const sortedClubs = [...joined_clubs].sort((a, b) => {
    if (a.club.id === topClubId) return -1;
    if (b.club.id === topClubId) return 1;
    return 0;
  });

  return (
    <div className="w-full bg-card rounded-2xl md:rounded-3xl border border-border/80 p-5 sm:p-7 md:p-8 shadow-xs">
      {/* Top Section: Avatar, Info, Badges */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left: Avatar & User Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-4 border-background shadow-md shrink-0">
            <AvatarImage src={user.avatar || undefined} alt={fullName} className="object-cover" />
            <AvatarFallback className="bg-brand-cream text-brand-orange font-black text-2xl">
              {user.first_name.charAt(0)}
              {user.last_name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tight text-brand-ink dark:text-white">
              {fullName}
            </h1>

            <div className="flex items-center gap-1.5 text-muted-foreground text-sm sm:text-base font-medium italic mt-1">
              <GraduationCap className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>Department {user.department || 'Campus Athlete'}</span>
            </div>

            {/* Joined Clubs / Sports Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5">
              {sortedClubs.map((jc) => {
                const isTopSport = jc.club.id === topClubId;
                return (
                  <span
                    key={jc.club.id}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/30 text-brand-orange border border-orange-200/60 dark:border-orange-900/40 text-xs font-bold italic"
                  >
                    {isTopSport && (
                      <Heart className="w-3 h-3 fill-brand-orange text-brand-orange" />
                    )}
                    {jc.club.name}
                  </span>
                );
              })}

              {stats.current_win_streak > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40 text-xs font-bold italic">
                  <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {stats.current_win_streak}W Streak
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Badges from @/components/badge */}
        <div className="flex flex-wrap lg:flex-col lg:items-end gap-2 shrink-0 self-start">
          {hasRank1 && <Rank1Badge />}
          {hasRank2 && <Rank2Badge />}
          {hasRank3 && <Rank3Badge />}
          {isUndefeated && <UndefeatedBadge />}
          {isHotStreak && <HotStreakBadge />}
        </div>
      </div>

      {/* Bottom Section: Performance Stats Banner */}
      <div className="bg-[#FAF7EE] dark:bg-muted/40 rounded-xl p-4 sm:p-5 md:p-6 mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 border border-[#ECE6D8] dark:border-border/40">
        {/* Ladder Points */}
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-semibold italic text-muted-foreground">
            Ladder Rating
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl md:text-3xl font-black italic text-brand-orange">
              {stats.ladder_points.toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm font-bold italic text-muted-foreground">
              PTS
            </span>
          </div>
        </div>

        {/* Win Rate */}
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-semibold italic text-muted-foreground">
            Win Rate (W-L)
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl md:text-3xl font-black italic text-brand-orange">
              {(stats.win_rate * 100).toFixed(1)}%
            </span>
            <span className="text-xs sm:text-sm font-semibold italic text-muted-foreground">
              ({stats.wins}W - {stats.losses}L)
            </span>
          </div>
        </div>

        {/* Total Matches */}
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-semibold italic text-muted-foreground">
            Intramural Matches
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl md:text-3xl font-black italic text-brand-orange">
              {stats.total_matches}
            </span>
            <span className="text-xs sm:text-sm font-semibold italic text-muted-foreground">
              Recorded
            </span>
          </div>
        </div>

        {/* Best Sport Rank */}
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-semibold italic text-muted-foreground">
            Peak Sport Rank
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            {stats.best_rank ? (
              <>
                <span className="text-2xl sm:text-3xl md:text-3xl font-black italic text-brand-orange">
                  #{stats.best_rank.rank}
                </span>
                <span className="text-xs sm:text-sm font-bold italic text-brand-ink dark:text-gray-200">
                  {stats.best_rank.club_name}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold italic text-muted-foreground">-</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfileData } from '@/types/contracts/club';
import { Flame, Heart, GraduationCap, Settings } from 'lucide-react';
import Rank1Badge from '@/components/badge/rank1';
import Rank2Badge from '@/components/badge/rank2';
import Rank3Badge from '@/components/badge/rank3';
import UndefeatedBadge from '@/components/badge/undefeated';
import HotStreakBadge from '@/components/badge/hot-streak';
import { mockClubData } from '@/lib/mock-data';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SettingsProfile1 } from '@/components/setting/setting';

export default function ProfileHeader({ data }: { data: UserProfileData }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(data.user);
  const { stats, joined_clubs, club_ranks } = data;
  const fullName = `${currentUser.first_name} ${currentUser.last_name}`;

  // Find user's best rank across clubs or campus leaderboard
  const lbMember = mockClubData.top_members.find((m) => m.user_id === currentUser.id);
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
    <div className="w-full bg-card rounded-2xl md:rounded-3xl border border-border/80 p-5 sm:p-7 md:p-8 shadow-xs relative">
      {/* Top Section: Avatar, Info, Badges */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left: Avatar & User Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 pr-10 sm:pr-12 lg:pr-0">
          <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-4 border-background shadow-md shrink-0">
            <AvatarImage src={currentUser.avatar || undefined} alt={fullName} className="object-cover" />
            <AvatarFallback className="bg-brand-cream text-brand-orange font-black text-2xl">
              {currentUser.first_name.charAt(0)}
              {currentUser.last_name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tight text-brand-ink dark:text-white">
              {fullName}
            </h1>

            <div className="flex items-center gap-1.5 text-muted-foreground text-sm sm:text-base font-medium italic mt-1">
              <GraduationCap className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>Department {currentUser.department || 'Campus Athlete'}</span>
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

        {/* Right: Badges & Settings */}
        <div className="flex flex-wrap lg:flex-col lg:items-end gap-3 shrink-0 self-start">
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger
              className="absolute top-5 right-5 sm:top-7 sm:right-7 lg:static inline-flex items-center gap-1.5 p-2 lg:px-3.5 lg:py-1.5 rounded-xl text-xs font-black italic tracking-wide text-muted-foreground hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-border/80 transition-all cursor-pointer group shadow-2xs"
              title="Profile Settings"
              aria-label="Profile Settings"
            >
              <Settings className="w-4.5 h-4.5 lg:w-4 lg:h-4 transition-transform duration-300 group-hover:rotate-45 text-brand-orange" />
              <span className="hidden lg:inline">Settings</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-auto p-0 border-0 bg-transparent ring-0 shadow-none" showCloseButton={false}>
              <SettingsProfile1
                defaultValues={{
                  first_name: currentUser.first_name,
                  last_name: currentUser.last_name,
                  name: fullName,
                  email: currentUser.email,
                  username: currentUser.login,
                  avatar: currentUser.avatar ?? undefined,
                  department: currentUser.department ?? '',
                }}
                onSave={(updated) => {
                  setCurrentUser((prev) => ({
                    ...prev,
                    first_name: updated.first_name ?? prev.first_name,
                    last_name: updated.last_name ?? prev.last_name,
                    email: updated.email ?? prev.email,
                    login: updated.username ?? prev.login,
                    avatar: updated.avatar !== undefined ? updated.avatar : null,
                    department: updated.department ?? prev.department,
                  }));
                  setIsSettingsOpen(false);
                }}
                onCancel={() => setIsSettingsOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {(hasRank1 || hasRank2 || hasRank3 || isUndefeated || isHotStreak) && (
            <div className="flex flex-wrap lg:flex-col lg:items-end gap-2">
              {hasRank1 && <Rank1Badge />}
              {hasRank2 && <Rank2Badge />}
              {hasRank3 && <Rank3Badge />}
              {isUndefeated && <UndefeatedBadge />}
              {isHotStreak && <HotStreakBadge />}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Performance Stats Banner */}
      <div className="bg-secondary/50 dark:bg-[#121417] rounded-xl p-4 sm:p-5 md:p-6 mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 border border-border/60 dark:border-border/40">
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

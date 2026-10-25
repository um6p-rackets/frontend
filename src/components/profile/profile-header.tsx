'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GraduationCap, Settings } from 'lucide-react';
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
import { UserProfile } from '@/types';

export default function ProfileHeader({ data }: { data: UserProfile }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(data.user);
  const { global_stats, joined_clubs, club_ranks } = data.memberProfile;
  const fullName = `${currentUser.first_name} ${currentUser.last_name}`;

  // Find user's best rank across clubs or campus leaderboard
  const lbMember = mockClubData.top_members.find((m) => m.user_id === currentUser.id);
  const bestRankNumber = global_stats.best_rank?.rank ?? (lbMember ? mockClubData.top_members.indexOf(lbMember) + 1 : null);

  const hasRank1 = bestRankNumber === 1;
  const hasRank2 = bestRankNumber === 2;
  const hasRank3 = bestRankNumber === 3;
  const isUndefeated = (global_stats.wins > 0 && global_stats.losses === 0) || lbMember?.badges?.includes('undefeated');
  const isHotStreak = global_stats.current_win_streak >= 3 || lbMember?.badges?.includes('hot-streak');

  // Top ranked sport for this user (highest points, then best rank)
  const topClubRank =
    club_ranks && club_ranks.length > 0
      ? [...club_ranks].sort((a, b) => (b.points !== a.points ? b.points - a.points : a.rank - b.rank))[0]
      : global_stats.best_rank;
  const topClubId = topClubRank?.club_id;

  // Sort joined clubs so the sport with the top-ranked sport is always first
  const sortedClubs = [...joined_clubs].sort((a, b) => {
    if (a.club.id === topClubId) return -1;
    if (b.club.id === topClubId) return 1;
    return 0;
  });

  return (
    <div className="w-full bg-card rounded-2xl md:rounded-3xl border border-border/80 p-5 sm:p-7 md:p-8 shadow-xs relative">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Avatar with Status Dot & User Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          <div className="relative shrink-0">
            <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-md">
              <AvatarImage
                src={currentUser.avatar || undefined}
                alt={fullName}
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <AvatarFallback className="bg-brand-cream text-brand-orange font-black text-2xl">
                {currentUser.first_name.charAt(0)}
                {currentUser.last_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {/* Green Online Status Indicator */}
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-background rounded-full shadow-2xs" />
          </div>

          <div className="flex flex-col">
            {/* Name & Horizontal Custom Badges Row */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black italic tracking-tight text-brand-ink dark:text-white">
                {fullName}
              </h1>

              {/* Your custom imported badge components rendered horizontally */}
              {(hasRank1 || hasRank2 || hasRank3 || isUndefeated || isHotStreak) && (
                <div className="flex flex-wrap items-center gap-2">
                  {hasRank1 && <Rank1Badge />}
                  {hasRank2 && <Rank2Badge />}
                  {hasRank3 && <Rank3Badge />}
                  {isUndefeated && <UndefeatedBadge />}
                  {isHotStreak && <HotStreakBadge />}
                </div>
              )}
            </div>

            {/* Department */}
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium italic mt-1">
              <GraduationCap className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>Department {currentUser.department || 'Campus Athlete'}</span>
            </div>

            {/* Joined Clubs / Sports Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5">
              {sortedClubs.map((jc) => {
                return (
                  <span
                    key={jc.club.id}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold italic transition-all bg-[#F4F2EE] dark:bg-muted/40 text-muted-foreground border border-border/40"
                  >
                    {jc.club.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Settings Button */}
        <div className="absolute top-5 right-5 sm:top-7 sm:right-7 lg:static self-start shrink-0">
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black italic tracking-wide text-brand-ink dark:text-white hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-border/80 transition-all cursor-pointer group shadow-2xs bg-card"
              title="Profile Settings"
              aria-label="Profile Settings"
            >
              <Settings className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45 text-muted-foreground group-hover:text-brand-orange" />
              <span>Settings</span>
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
        </div>
      </div>
    </div>
  );
}

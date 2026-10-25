"use client";

import { useState } from "react";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileTabs, { ProfileTabType } from "@/components/profile/profile-tabs";
import StatisticsTab from "@/components/profile/statistics-tab";
import HistoryTab from "@/components/profile/history-tab";
import SportRankCard from "@/components/profile/sport-rank-card";
import { Footer } from "@/components/footer";
import { UserProfile } from "@/types";

interface ProfileViewProps {
  data: UserProfile;
}

export default function ProfileView({ data }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<ProfileTabType>("statistics");
  const fullName = `${data.user.first_name} ${data.user.last_name}`;
  const user = data.user;
  const memberProfile = data.memberProfile;
  const { global_stats } = memberProfile;

  return (
    // Outer container set to min-h-screen and flex-col so footer stays at the bottom
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 max-w-7xl mx-auto w-full flex flex-col gap-6 sm:gap-7">
        {/* Top Profile Header Card */}
        <ProfileHeader data={data} />

        {/* Top Stats Banner (3 Cards: Win Rate, Matches, Current Run) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground italic">
              Win Rate
            </span>
            <div className="mt-3">
              <div className="text-3xl font-black italic text-brand-ink dark:text-white">
                {global_stats.win_rate}%
              </div>
              <p className="text-xs font-semibold italic text-muted-foreground mt-0.5">
                {global_stats.wins} Wins – {global_stats.losses} Losses
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground italic">
              Matches
            </span>
            <div className="mt-3">
              <div className="text-3xl font-black italic text-brand-ink dark:text-white flex items-baseline gap-2">
                <span>{global_stats.total_matches}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase not-italic">
                  Total
                </span>
              </div>
              <p className="text-xs font-semibold italic text-muted-foreground mt-0.5">
                Across all {memberProfile.club_ranks.length} sports
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground italic">
              Current Run
            </span>
            <div className="mt-3">
              <div className="text-3xl font-black italic text-brand-orange flex items-baseline gap-2">
                <span>{global_stats.current_win_streak}W</span>
                <span className="text-xs font-bold text-brand-orange/80 uppercase not-italic">
                  Unbroken
                </span>
              </div>
              <p className="text-xs font-semibold italic text-muted-foreground mt-0.5">
                Active winning streak
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Campus Standing (Left) & Toggleable Section (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start w-full">
          {/* Changed from lg:col-span-4 to lg:col-span-3 */}
          <aside className="lg:col-span-5 w-full flex flex-col gap-3">
            <SportRankCard
              clubRanks={memberProfile.club_ranks}
              userName={fullName}
              department={user.department}
            />
          </aside>

          {/* Changed from lg:col-span-8 to lg:col-span-9 */}
          <section className="lg:col-span-7 w-full flex flex-col gap-3">
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Active Tab View Body */}
            {/* TODO: Use Pagnation for history tab to avoid loading all matches at once */}
            <div className="w-full">
              {/* {activeTab === 'statistics' && (
                <StatisticsTab data={memberProfile} />
              )} */}
              {activeTab === "history" && <HistoryTab history={memberProfile.history} />}
            </div>
          </section>
        </div>
      </main>

      {/* Global Footer component appended at the bottom */}
      <Footer />
    </div>
  );
}

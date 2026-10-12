'use client';

import { useState } from 'react';
import ProfileHeader from '@/components/profile/profile-header';
import ProfileTabs, { ProfileTabType } from '@/components/profile/profile-tabs';
import StatisticsTab from '@/components/profile/statistics-tab';
import HistoryTab from '@/components/profile/history-tab';
import SportRankCard from '@/components/profile/sport-rank-card';
import { UserProfileData } from '@/types/types';

interface ProfileViewProps {
  data: UserProfileData;
}

export default function ProfileView({ data }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<ProfileTabType>('statistics');
  const fullName = `${data.user.first_name} ${data.user.last_name}`;

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 max-w-7xl mx-auto w-full flex flex-col gap-7 sm:gap-8">
      {/* Top Profile Header Card */}
      <ProfileHeader data={data} />

      {/* Main Content Grid: Tabs & Content on Left, Sport Rank Widget on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start w-full">
        {/* Left Column (Tabs + Content): on mobile order-2, on desktop order-1 */}
        <section className="order-2 lg:order-1 lg:col-span-8 flex flex-col gap-5 sm:gap-6 w-full">
          {/* Tabs Selector (Statistics & History) */}
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Active Tab Views */}
          <div className="w-full">
            {activeTab === 'statistics' && (
              <StatisticsTab data={data} />
            )}
            {activeTab === 'history' && (
              <HistoryTab history={data.history} />
            )}
          </div>
        </section>

        {/* Right Column (Sport Club Rank Widget): on mobile order-1 (top), on desktop order-2 (right) */}
        <aside className="order-1 lg:order-2 lg:col-span-4 w-full">
          <SportRankCard
            clubRanks={data.club_ranks}
            userName={fullName}
            department={data.user.department}
          />
        </aside>
      </div>
    </main>
  );
}

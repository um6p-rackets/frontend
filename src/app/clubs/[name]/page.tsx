'use client';

import ClubTitle from '@/components/club/club-title';
import { useParams } from 'next/navigation';

import OverviewCard from '@/components/club/overview-card';
import ClubTaps from '@/components/club/taps';
import Leaderboard from '@/components/club/leaderboard';

import { mockClubData } from '@/lib/mock-data';

export default function ClubPage() {
  const params = useParams<{ name: string }>();

  return (
    <div>
      <ClubTitle name={params.name} />
      <section className="relative">
        {/* description/number of members/ coach name/ join button for new members */}
        <OverviewCard
          desc={mockClubData.description}
          coach={mockClubData.coach_name}
          members={mockClubData.members}
        />
      </section>
      <div className="w-full flex items-center justify-center mt-12 ">
        <div className="w-full h-full flex items-center justify-center ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8  justify-center">
            <section className="">
              {/* this section for taps (training sessions, announcements, tournament,
          Documents, About) */}
              <ClubTaps
                weekly_sessions={mockClubData.weekly_sessions}
                announcements={mockClubData.announcements}
                documents={mockClubData.documents}
              />
            </section>
            <section className="">
              <Leaderboard top_members={mockClubData.top_members} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

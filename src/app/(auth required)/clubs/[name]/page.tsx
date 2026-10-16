'use client';

import { useParams } from 'next/navigation';
import ClubTitle from '@/components/club/club-title';
import OverviewCard from '@/components/club/overview-card';
import ClubTaps from '@/components/club/taps';
import Leaderboard from '@/components/club/leaderboard';
import { useClub } from '@/hooks/use-clubs';
import { getClubBySlug, mockClubData } from '@/lib/mock-data';

export default function ClubPage() {
  const params = useParams<{ name: string }>();
  const clubSlug = params?.name ?? 'tennis';

  const { data: apiClub } = useClub(clubSlug);
  const clubData = getClubBySlug(clubSlug);

  const clubName = clubData?.name || apiClub?.name || clubSlug;
  const description = clubData?.description || apiClub?.description || mockClubData.description;
  const coach = clubData?.coach_name || mockClubData.coach_name;
  const members = clubData?.members_count ?? (apiClub as { members_count?: number } | undefined)?.members_count ?? mockClubData.members;
  const avatar = clubData?.avatar || `/clubs/${clubSlug}.png`;

  return (
    <div className="w-[92%] lg:w-[70%] mx-auto">
      <ClubTitle name={clubName} slug={clubSlug} avatar={avatar} />
      <section className="relative mt-4">
        {/* description/number of members/ coach name/ join button for new members */}
        <OverviewCard
          clubName={clubName}
          clubSlug={clubSlug}
          desc={description}
          coach={coach}
          members={members}
        />
      </section>
      <div className="w-full flex items-center justify-center mt-10 sm:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch justify-center w-full">
          <section className="lg:h-full flex flex-col min-w-0">
            {/* this section for taps (training sessions, announcements, tournament,
        Documents, About) */}
            <ClubTaps
              clubSlug={clubSlug}
              announcements={mockClubData.announcements}
              documents={mockClubData.documents}
            />
          </section>
          <section className="self-start w-full min-w-0">
            <Leaderboard top_members={mockClubData.top_members} />
          </section>
        </div>
      </div>
    </div>
  );
}

'use client';

import ClubTitle from '@/components/club/club-title';
import { useParams } from 'next/navigation';

import type { ClubPageData } from '@/types/club';
import OverviewCard from '@/components/club/overview-card';
import ClubTaps from '@/components/club/taps';

// Mock data for demonstration purposes
const mockClubData: ClubPageData = {
  name: 'Badminton',
  description:
    "Badminton is a fast-paced, highly engaging racket sport played indoors either in singles (one against one) or doubles (two against two). Unlike other racket sports, badminton is played with a shuttlecock, which is a feathered projectile that flies differently from balls used in other sports. The objective is to hit the shuttlecock over the net and into the opponent's half of the court, aiming to make it land on the ground before they can return it.",
  members: 42,
  coach_name: 'Mr. Michael',
  weekly_sessions: [
    {
      type: 'Practice',
      day: 'Monday',
      start_time: '17:00',
      end_time: '19:00',
      location: 'Sport Department',
      spots_available: 10,
      total_spots: 20
    },
    {
      type: 'Match',
      day: 'Wednesday',
      start_time: '18:00',
      end_time: '20:00',
      location: 'Sport Department',
      spots_available: 5,
      total_spots: 10
    },
    {
      type: 'Training Session',
      day: 'Wednesday',
      start_time: '18:00',
      end_time: '20:00',
      location: 'Sport Department',
      spots_available: 5,
      total_spots: 10
    }
  ],
  announcements: [
    {
      title: 'Upcoming Tournament',
      content:
        'We are excited to announce that our club will be participating in the upcoming inter-school badminton tournament. All members are encouraged to attend the practice sessions and prepare for the matches.',
      date: '2024-05-01'
    },
    {
      title: 'New Coach',
      content:
        'We are pleased to welcome Mr. Michael as our new badminton coach. He brings a wealth of experience and is looking forward to helping our members improve their skills.',
      date: '2024-04-15'
    },
    {
      title: 'Meeting Reminder',
      content:
        'Please remember that we have a club meeting scheduled for this Friday at 4:00 PM in the main hall. All members are encouraged to attend.',
      date: '2024-05-01'
    },
    {
      title: 'Event Update',
      content:
        'We are excited to announce that the upcoming event has been rescheduled. Please check the updated schedule for more details.',
      date: '2024-05-01'
    }
  ],
  documents: [
    {
      title: 'Club Rules and Regulations',
      url: '/documents/badminton_club_rules.pdf',
      description:
        'A comprehensive guide to the rules and regulations of our badminton club.',
      date: '2024-03-10'
    },
    {
      title: 'Training Schedule',
      url: '/documents/badminton_training_schedule.pdf',
      description: 'Detailed training schedule for the upcoming season.',
      date: '2024-03-15'
    }
  ],
  top_members: [
    {
      name: 'Alice Johnson',
      points: 150,
      department: 'Science'
    },
    {
      name: 'Bob Smith',
      points: 120,
      department: 'Arts'
    },
    {
      name: 'Charlie Brown',
      points: 100,
      department: 'Commerce'
    },
    {
      name: 'Diana Prince',
      points: 90,
      department: 'Science'
    },
    {
      name: 'Ethan Hunt',
      points: 80,
      department: 'Arts'
    }
  ]
};

export default function ClubPage() {
  const params = useParams<{ name: string }>();

  return (
    <div>
      <ClubTitle name={params.name} />
      <section className="relative">
        {/* discript/number of memebers/ coach name/ join button for new members */}
        <OverviewCard
          desc={mockClubData.description}
          coach={mockClubData.coach_name}
          members={mockClubData.members}
        />
      </section>
      <div className="w-full flex items-center justify-center mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8  justify-center w-full md:w-2xl lg:w-fit">
          <section>
            {/* this section for taps (training sessions, announcements, tournament,
          Documents, About) */}
            <ClubTaps
              weekly_sessions={mockClubData.weekly_sessions}
              announcements={mockClubData.announcements}
              documents={mockClubData.documents}
              top_members={mockClubData.top_members}
            />
          </section>
          <section className="lg:w-xl">leaderboad top 5 members</section>
        </div>
      </div>
    </div>
  );
}

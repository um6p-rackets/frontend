import { ClubPageData } from '@/types/club';

export const mockClubData: ClubPageData = {
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
      name: 'Ilorez (Zobair Najdaoui)',
      points: 1500,
      department: '1337',
      avatar_url: 'https://unavatar.io/github/ilorez',
      record: '18W - 0L',
      badges: ['undefeated']
    },
    {
      name: 'Hamza Wahmane',
      points: 2000,
      department: 'Arts',
      avatar_url: 'https://unavatar.io/github/hamzawhmn',
      record: '15W - 3L',
      badges: [] 
    },
    {
      name: 'I am Atomic',
      points: 100,
      department: '1337',
      avatar_url: 'https://unavatar.io/github/atomic',
      record: '13W - 4L',
      badges: []
    },
    {
      name: 'Ablabib',
      points: 90,
      department: 'Science',
      avatar_url: 'https://unavatar.io/github/ablabib',
      record: '10W - 5L',
      badges: []
    },
    {
      name: 'Nsila lmd9s',
      points: 80,
      department: 'Arts',
      avatar_url: 'https://unavatar.io/github/nsila',
      record: '8W - 7L',
      badges: []
    },
    {
      name: 'Hamza Wahmane',
      points: 120,
      department: 'Arts',
      avatar_url: 'https://unavatar.io/github/hamzawhmn',
      record: '2W - 1L',
      badges: [] 
    },
    {
      name: 'I am Atomic',
      points: 110,
      department: '1337',
      avatar_url: 'https://unavatar.io/github/atomic',
      record: '5W - 2L',
      badges: []
    },
    {
      name: 'Ablabib',
      points: 95,
      department: 'Science',
      avatar_url: 'https://unavatar.io/github/ablabib',
      record: '4W - 4L',
      badges: []
    },
    {
      name: 'Nsila lmd9s',
      points: 85,
      department: 'Arts',
      avatar_url: 'https://unavatar.io/github/nsila',
      record: '3W - 3L',
      badges: []
    },
    {
      name: 'Hamza Wahmane',
      points: 15,
      department: 'Arts',
      avatar_url: 'https://unavatar.io/github/hamzawhmn',
      record: '1W - 5L',
      badges: [] 
    },
    {
      name: 'I am Atomic',
      points: 60,
      department: '1337',
      avatar_url: 'https://unavatar.io/github/atomic',
      record: '6W - 6L',
      badges: []
    },
    {
      name: 'Ablabib',
      points: 25,
      department: 'Science',
      avatar_url: 'https://unavatar.io/github/ablabib',
      record: '2W - 8L',
      badges: []
    },
    {
      name: 'Nsila lmd9s',
      points: 5,
      department: 'Arts',
      avatar_url: 'https://unavatar.io/github/nsila',
      record: '0W - 10L',
      badges: []
    }
  ]
};
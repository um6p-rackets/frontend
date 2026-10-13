import { ClubPageData } from '@/types/mock-data-types';
import { User } from '@/types/contracts/auth';
import {
  Club,
  Member,
  MemberRole,
  Team,
  Match,
  MatchMode,
  MatchStatus,
  Session,
  WeekDay,
  SessionAttend,
  Announcement,
  Achievement,
  Player,
  JoinedClub,
  UserHistoryMatch,
  UserClubRank,
  UserProfileData,
} from '@/types/contracts/club';
import {
  Notification,
  NotificationReceiver,
} from '@/types/contracts/notification';

// ==========================================
// 1. AUTH Service: `users`
// ==========================================
export const mockUsers: User[] = [
  {
    id: 1,
    login: 'hwahmane',
    first_name: 'Hamza',
    last_name: 'Wahmane',
    gender: true,
    department: '1337',
    phone_number: '+212600000000',
    email: 'hamza@example.com',
    avatar: 'https://unavatar.io/github/hamzawhmn',
    joined_at: '2026-10-03T10:00:00Z',
  },
  {
    id: 2,
    login: 'znajdaoui',
    first_name: 'Zobair',
    last_name: 'Najdaoui',
    gender: true,
    department: 'Computer Science',
    phone_number: '+212611111111',
    email: 'zobair@example.com',
    avatar: 'https://unavatar.io/github/ilorez',
    joined_at: '2026-10-03T10:00:00Z',
  },
  {
    id: 3,
    login: 'ablabib',
    first_name: 'Ablabib',
    last_name: 'Idrissi',
    gender: true,
    department: 'Science',
    phone_number: '+212622222222',
    email: 'ablabib@example.com',
    avatar: 'https://unavatar.io/github/ablabib',
    joined_at: '2026-09-15T08:30:00Z',
  },
  {
    id: 4,
    login: 'nsila',
    first_name: 'Nsila',
    last_name: 'Lmd9s',
    gender: true,
    department: 'Arts',
    phone_number: '+212633333333',
    email: 'nsila@example.com',
    avatar: 'https://unavatar.io/github/nsila',
    joined_at: '2026-09-20T14:15:00Z',
  },
  {
    id: 5,
    login: 'atomic',
    first_name: 'Atomic',
    last_name: 'Hero',
    gender: true,
    department: '1337',
    phone_number: '+212644444444',
    email: 'atomic@example.com',
    avatar: 'https://unavatar.io/github/atomic',
    joined_at: '2026-09-10T12:00:00Z',
  },
  {
    id: 6,
    login: 'hwahmane_arts',
    first_name: 'Hamza',
    last_name: 'Wahmane',
    gender: true,
    department: 'Arts',
    phone_number: '+212655555555',
    email: 'hamza.arts@example.com',
    avatar: 'https://unavatar.io/github/hamza-w',
    joined_at: '2026-09-25T11:00:00Z',
  },
  {
    id: 7,
    login: 'hwahmane_jr',
    first_name: 'Hamza',
    last_name: 'Wahmane',
    gender: true,
    department: 'Arts',
    phone_number: '+212666666666',
    email: 'hamza.jr@example.com',
    avatar: 'https://unavatar.io/github/hwahmane',
    joined_at: '2026-09-28T09:00:00Z',
  },
  {
    id: 8,
    login: 'coach_karim',
    first_name: 'Karim',
    last_name: 'Bennani',
    gender: true,
    department: 'Sports Faculty',
    phone_number: '+212677777777',
    email: 'coach.karim@example.com',
    avatar: 'https://unavatar.io/github/coach-karim',
    joined_at: '2026-08-01T08:00:00Z',
  },
];

export const mockUser: User = mockUsers[0];
export const mockRegisterExampleUser: User = mockUsers[1];

export function getUserById(userId: number): User | undefined {
  return mockUsers.find((u) => u.id === userId);
}

// ==========================================
// 2. CLUB Service: `clubs`
// ==========================================
export const mockClubs: Club[] = [
  {
    id: 1,
    name: 'Badminton',
    slug:'badminton',
    description:
      'Badminton is a fast-paced, highly engaging racket sport played indoors either in singles or doubles.',
    avatar: '/clubs/badminton.png',
    created_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 2,
    name: 'Tennis',
    slug:'tennis',
    description:
      'Tennis is a high-intensity racket sport played on courts of clay, grass, or acrylic surfaces.',
    avatar: '/clubs/tennis.png',
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 3,
    name: 'Padel',
    slug:'padel',
    description:
      'Padel is an exhilarating doubles racket sport played in an enclosed court surrounded by glass walls and mesh.',
    avatar: '/clubs/padel.png',
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 4,
    name: 'Table Tennis',
    slug: 'table-tennis',
    description:
      'Fast-reflex sport played across a hard tabletop divided by a central net.',
    avatar: '/clubs/table-tennis.png',
    created_at: '2026-02-10T00:00:00Z',
  },
  {
    id: 5,
    name: 'Squash',
    slug: 'squash',
    description:
      'High-cardio indoor racket sport played in a four-walled court with a small hollow rubber ball.',
    avatar: '/clubs/squash.png',
    created_at: '2026-02-20T00:00:00Z',
  },
];

// ==========================================
// 3. CLUB Service: `members`
// ==========================================
export const mockMembers: Member[] = [
  // User 1 (Hamza Wahmane - 1337)
  { id: 1, club_id: 1, user_id: 1, role: MemberRole.MEMBER, joined_at: '2026-09-01T08:00:00Z', left_at: null },
  { id: 2, club_id: 2, user_id: 1, role: MemberRole.MEMBER, joined_at: '2026-09-05T08:00:00Z', left_at: null },
  { id: 3, club_id: 3, user_id: 1, role: MemberRole.MEMBER, joined_at: '2026-09-10T08:00:00Z', left_at: null },

  // User 2 (Zobair Najdaoui)
  { id: 4, club_id: 1, user_id: 2, role: MemberRole.LEADER, joined_at: '2026-09-01T08:00:00Z', left_at: null },
  { id: 5, club_id: 2, user_id: 2, role: MemberRole.MEMBER, joined_at: '2026-09-05T08:00:00Z', left_at: null },

  // User 3 (Ablabib)
  { id: 6, club_id: 1, user_id: 3, role: MemberRole.MEMBER, joined_at: '2026-09-15T08:00:00Z', left_at: null },
  { id: 7, club_id: 3, user_id: 3, role: MemberRole.MEMBER, joined_at: '2026-09-15T08:00:00Z', left_at: null },

  // User 4 (Nsila)
  { id: 8, club_id: 1, user_id: 4, role: MemberRole.MEMBER, joined_at: '2026-09-20T08:00:00Z', left_at: null },
  { id: 9, club_id: 4, user_id: 4, role: MemberRole.MEMBER, joined_at: '2026-09-20T08:00:00Z', left_at: null },

  // User 5 (Atomic)
  { id: 10, club_id: 1, user_id: 5, role: MemberRole.MEMBER, joined_at: '2026-09-10T08:00:00Z', left_at: null },
  { id: 11, club_id: 2, user_id: 5, role: MemberRole.MEMBER, joined_at: '2026-09-10T08:00:00Z', left_at: null },
  { id: 12, club_id: 5, user_id: 5, role: MemberRole.MEMBER, joined_at: '2026-09-10T08:00:00Z', left_at: null },

  // User 6 (Hamza Arts)
  { id: 13, club_id: 1, user_id: 6, role: MemberRole.MEMBER, joined_at: '2026-09-25T08:00:00Z', left_at: null },
  { id: 14, club_id: 3, user_id: 6, role: MemberRole.MEMBER, joined_at: '2026-09-25T08:00:00Z', left_at: null },

  // User 7 (Hamza Jr)
  { id: 15, club_id: 1, user_id: 7, role: MemberRole.MEMBER, joined_at: '2026-09-28T08:00:00Z', left_at: null },
  { id: 16, club_id: 2, user_id: 7, role: MemberRole.MEMBER, joined_at: '2026-09-28T08:00:00Z', left_at: null },

  // User 8 (Coach Karim)
  { id: 17, club_id: 1, user_id: 8, role: MemberRole.COACH, joined_at: '2026-08-01T08:00:00Z', left_at: null },
  { id: 18, club_id: 2, user_id: 8, role: MemberRole.COACH, joined_at: '2026-08-01T08:00:00Z', left_at: null },
];

export function getPlayerForMember(memberId: number): Player {
  const member = mockMembers.find((m) => m.id === memberId);
  const user = member ? getUserById(member.user_id) : undefined;
  return {
    id: user?.id || 0,
    login: user?.login || 'unknown',
    first_name: user?.first_name || 'Unknown',
    last_name: user?.last_name || 'Player',
    avatar: user?.avatar || null,
    department: user?.department || null,
    member_id: memberId,
  };
}

// ==========================================
// 4. CLUB Service: `teams`
// ==========================================
export const mockTeams: Team[] = [
  { id: 1, club_id: 1, player1_id: 1, player2_id: null, created_at: '2026-09-01T08:00:00Z' }, // Hamza (Badminton)
  { id: 2, club_id: 2, player1_id: 2, player2_id: null, created_at: '2026-09-05T08:00:00Z' }, // Hamza (Tennis)
  { id: 3, club_id: 3, player1_id: 3, player2_id: null, created_at: '2026-09-10T08:00:00Z' }, // Hamza (Padel)
  { id: 4, club_id: 1, player1_id: 4, player2_id: null, created_at: '2026-09-01T08:00:00Z' }, // Zobair (Badminton)
  { id: 5, club_id: 2, player1_id: 5, player2_id: null, created_at: '2026-09-05T08:00:00Z' }, // Zobair (Tennis)
  { id: 6, club_id: 1, player1_id: 6, player2_id: null, created_at: '2026-09-15T08:00:00Z' }, // Ablabib (Badminton)
  { id: 7, club_id: 3, player1_id: 7, player2_id: null, created_at: '2026-09-15T08:00:00Z' }, // Ablabib (Padel)
  { id: 8, club_id: 1, player1_id: 8, player2_id: null, created_at: '2026-09-20T08:00:00Z' }, // Nsila (Badminton)
  { id: 9, club_id: 4, player1_id: 9, player2_id: null, created_at: '2026-09-20T08:00:00Z' }, // Nsila (Table Tennis)
  { id: 10, club_id: 1, player1_id: 10, player2_id: null, created_at: '2026-09-10T08:00:00Z' }, // Atomic (Badminton)
  { id: 11, club_id: 2, player1_id: 11, player2_id: null, created_at: '2026-09-10T08:00:00Z' }, // Atomic (Tennis)
  { id: 12, club_id: 5, player1_id: 12, player2_id: null, created_at: '2026-09-10T08:00:00Z' }, // Atomic (Squash)
  { id: 13, club_id: 1, player1_id: 13, player2_id: null, created_at: '2026-09-25T08:00:00Z' }, // Hamza Arts (Badminton)
  { id: 14, club_id: 3, player1_id: 14, player2_id: null, created_at: '2026-09-25T08:00:00Z' }, // Hamza Arts (Padel)
  { id: 15, club_id: 1, player1_id: 15, player2_id: null, created_at: '2026-09-28T08:00:00Z' }, // Hamza Jr (Badminton)
  { id: 16, club_id: 2, player1_id: 16, player2_id: null, created_at: '2026-09-28T08:00:00Z' }, // Hamza Jr (Tennis)
];

// ==========================================
// 5. CLUB Service: `matches`
// ==========================================
export const mockMatches: Match[] = [
  // User 1 Matches
  {
    id: 1,
    club_id: 2, // Tennis
    team1_id: 2, // Hamza
    team2_id: 5, // Zobair
    winner_id: 2,
    ref_id: 18,
    team1_score: 6,
    team2_score: 4,
    team1_points: 25,
    team2_points: -15,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-10-04T16:00:00Z',
  },
  {
    id: 2,
    club_id: 3, // Padel
    team1_id: 3, // Hamza
    team2_id: 7, // Ablabib
    winner_id: 3,
    ref_id: null,
    team1_score: 6,
    team2_score: 2,
    team1_points: 20,
    team2_points: -10,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-10-01T15:00:00Z',
  },
  {
    id: 3,
    club_id: 1, // Badminton
    team1_id: 1, // Hamza
    team2_id: 8, // Nsila
    winner_id: 1,
    ref_id: 17,
    team1_score: 21,
    team2_score: 18,
    team1_points: 18,
    team2_points: -8,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-09-28T18:00:00Z',
  },
  {
    id: 4,
    club_id: 5, // Squash
    team1_id: 1, // Hamza
    team2_id: 12, // Atomic
    winner_id: 12,
    ref_id: null,
    team1_score: 9,
    team2_score: 11,
    team1_points: -10,
    team2_points: 20,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-09-22T17:00:00Z',
  },
  {
    id: 5,
    club_id: 3, // Padel
    team1_id: 3, // Hamza
    team2_id: 5, // Zobair
    winner_id: 3,
    ref_id: null,
    team1_score: 7,
    team2_score: 6,
    team1_points: 22,
    team2_points: -12,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-09-19T14:30:00Z',
  },
  {
    id: 6,
    club_id: 2, // Tennis
    team1_id: 2, // Hamza
    team2_id: 7, // Ablabib
    winner_id: 2,
    ref_id: 18,
    team1_score: 6,
    team2_score: 3,
    team1_points: 20,
    team2_points: -10,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-09-15T16:00:00Z',
  },
  {
    id: 7,
    club_id: 4, // Table Tennis
    team1_id: 1, // Hamza
    team2_id: 9, // Nsila
    winner_id: 1,
    ref_id: null,
    team1_score: 11,
    team2_score: 9,
    team1_points: 15,
    team2_points: -8,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-09-12T13:00:00Z',
  },
  {
    id: 8,
    club_id: 2, // Tennis
    team1_id: 2, // Hamza
    team2_id: 11, // Atomic
    winner_id: 2,
    ref_id: 18,
    team1_score: 6,
    team2_score: 4,
    team1_points: 24,
    team2_points: -12,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-09-08T15:30:00Z',
  },
  {
    id: 9,
    club_id: 1, // Badminton
    team1_id: 1, // Hamza
    team2_id: 4, // Zobair
    winner_id: 4,
    ref_id: 17,
    team1_score: 19,
    team2_score: 21,
    team1_points: -12,
    team2_points: 25,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-09-02T19:00:00Z',
  },
  {
    id: 10,
    club_id: 5, // Squash
    team1_id: 1, // Hamza
    team2_id: 6, // Ablabib
    winner_id: 1,
    ref_id: null,
    team1_score: 11,
    team2_score: 8,
    team1_points: 18,
    team2_points: -10,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-08-28T18:00:00Z',
  },
  {
    id: 11,
    club_id: 3, // Padel
    team1_id: 3, // Hamza
    team2_id: 8, // Nsila
    winner_id: 3,
    ref_id: null,
    team1_score: 6,
    team2_score: 1,
    team1_points: 20,
    team2_points: -10,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-08-25T16:00:00Z',
  },
  {
    id: 12,
    club_id: 1, // Badminton
    team1_id: 1, // Hamza
    team2_id: 10, // Atomic
    winner_id: 1,
    ref_id: 17,
    team1_score: 21,
    team2_score: 15,
    team1_points: 16,
    team2_points: -8,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-08-20T17:30:00Z',
  },
  {
    id: 13,
    club_id: 2, // Tennis
    team1_id: 2, // Hamza
    team2_id: 5, // Zobair
    winner_id: 2,
    ref_id: 18,
    team1_score: 6,
    team2_score: 2,
    team1_points: 25,
    team2_points: -15,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-08-16T15:00:00Z',
  },
  {
    id: 14,
    club_id: 3, // Padel
    team1_id: 3, // Hamza
    team2_id: 7, // Ablabib
    winner_id: 3,
    ref_id: null,
    team1_score: 6,
    team2_score: 4,
    team1_points: 20,
    team2_points: -10,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-08-10T16:00:00Z',
  },
  {
    id: 15,
    club_id: 5, // Squash
    team1_id: 1, // Hamza
    team2_id: 8, // Nsila
    winner_id: 1,
    ref_id: null,
    team1_score: 11,
    team2_score: 7,
    team1_points: 19,
    team2_points: -9,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-08-05T18:00:00Z',
  },

  // User 6 Matches (Hamza Arts)
  {
    id: 16,
    club_id: 1,
    team1_id: 13,
    team2_id: 10,
    winner_id: 13,
    ref_id: 17,
    team1_score: 21,
    team2_score: 17,
    team1_points: 15,
    team2_points: -8,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-10-02T16:00:00Z',
  },
  {
    id: 17,
    club_id: 3,
    team1_id: 14,
    team2_id: 7,
    winner_id: 14,
    ref_id: null,
    team1_score: 6,
    team2_score: 3,
    team1_points: 12,
    team2_points: -6,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-09-29T15:00:00Z',
  },
  {
    id: 18,
    club_id: 2,
    team1_id: 13,
    team2_id: 2,
    winner_id: 2,
    ref_id: 18,
    team1_score: 3,
    team2_score: 6,
    team1_points: -8,
    team2_points: 20,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-09-21T17:00:00Z',
  },

  // User 7 Matches (Hamza Jr)
  {
    id: 19,
    club_id: 1,
    team1_id: 15,
    team2_id: 8,
    winner_id: 15,
    ref_id: 17,
    team1_score: 21,
    team2_score: 19,
    team1_points: 10,
    team2_points: -5,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-10-01T14:00:00Z',
  },
  {
    id: 20,
    club_id: 2,
    team1_id: 16,
    team2_id: 5,
    winner_id: 5,
    ref_id: 18,
    team1_score: 1,
    team2_score: 6,
    team1_points: -6,
    team2_points: 15,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-09-25T16:00:00Z',
  },
  {
    id: 21,
    club_id: 3,
    team1_id: 15,
    team2_id: 7,
    winner_id: 7,
    ref_id: null,
    team1_score: 2,
    team2_score: 6,
    team1_points: -5,
    team2_points: 12,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-09-18T15:00:00Z',
  },
  {
    id: 22,
    club_id: 1,
    team1_id: 15,
    team2_id: 10,
    winner_id: 10,
    ref_id: 17,
    team1_score: 15,
    team2_score: 21,
    team1_points: -4,
    team2_points: 10,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-09-10T17:00:00Z',
  },
  {
    id: 23,
    club_id: 2,
    team1_id: 16,
    team2_id: 2,
    winner_id: 2,
    ref_id: 18,
    team1_score: 0,
    team2_score: 6,
    team1_points: -10,
    team2_points: 25,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-09-05T16:30:00Z',
  },
  {
    id: 24,
    club_id: 4,
    team1_id: 15,
    team2_id: 9,
    winner_id: 9,
    ref_id: null,
    team1_score: 5,
    team2_score: 11,
    team1_points: -5,
    team2_points: 12,
    mode: MatchMode.SINGLES,
    status: MatchStatus.FINISHED,
    scheduled_at: '2026-08-29T13:00:00Z',
  },
];

// ==========================================
// 6. CLUB Service: `week_sessions`
// ==========================================
export const mockWeekSessions: Session[] = [
  {
    id: 1,
    club_id: 2,
    template_id: 1,
    start_at: '17:30:00',
    end_at: '19:00:00',
    title: 'Tennis Training',
    location: 'Court 1',
    capacity: 20,
    cancelled_at: '2026-02-15T00:00:00Z',
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 2,
    club_id: 1,
    template_id: 1,
    start_at: '17:00:00',
    end_at: '19:00:00',
    title: 'Badminton Practice',
    location: 'Sport Department',
    capacity: 20,
    cancelled_at: '2026-02-15T00:00:00Z',
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 3,
    club_id: 1,
    template_id: 1,
    start_at: '18:00:00',
    end_at: '20:00:00',
    title: 'Badminton Match Session',
    location: 'Sport Department',
    capacity: 20,
    cancelled_at: '2026-02-15T00:00:00Z',
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-01-10T00:00:00Z',
  },
];

// ==========================================
// 7. CLUB Service: `session_attends`
// ==========================================
export const mockSessionAttends: SessionAttend[] = [];

// ==========================================
// 8. CLUB Service: `announcements`
// ==========================================
export const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    club_id: 1,
    announcer_id: 4,
    description:
      'We are excited to announce that our club will be participating in the upcoming inter-school badminton tournament. All members are encouraged to attend the practice sessions and prepare for the matches.',
    created_at: '2026-05-01T10:00:00Z',
  },
  {
    id: 2,
    club_id: 1,
    announcer_id: 17,
    description:
      'We are pleased to welcome Mr. Michael as our new badminton coach. He brings a wealth of experience and is looking forward to helping our members improve their skills.',
    created_at: '2026-04-15T09:00:00Z',
  },
];

// ==========================================
// 9. CLUB Service: `achievements`
// ==========================================
export const mockAchievements: Achievement[] = [];

// ==========================================
// 10. NOTIFICATION Service
// ==========================================
export const mockNotifications: Notification[] = [
  {
    id: 1,
    sender_type: 'club',
    sender_id: 1,
    notif_category: 1,
    sent_at: '2026-10-04T12:00:00Z',
  },
];

export const mockNotificationReceivers: NotificationReceiver[] = [
  {
    id: 1,
    notification_id: 1,
    receiver_user_id: 1,
    is_read: false,
    action: null,
  },
];

// ==========================================
// Club Page Data
// ==========================================
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
      total_spots: 20,
    },
    {
      type: 'Match',
      day: 'Wednesday',
      start_time: '18:00',
      end_time: '20:00',
      location: 'Sport Department',
      spots_available: 5,
      total_spots: 10,
    },
    {
      type: 'Training Session',
      day: 'Wednesday',
      start_time: '18:00',
      end_time: '20:00',
      location: 'Sport Department',
      spots_available: 5,
      total_spots: 10,
    },
  ],
  announcements: [
    {
      title: 'Upcoming Tournament',
      content:
        'We are excited to announce that our club will be participating in the upcoming inter-school badminton tournament. All members are encouraged to attend the practice sessions and prepare for the matches.',
      date: '2024-05-01',
    },
    {
      title: 'New Coach',
      content:
        'We are pleased to welcome Mr. Michael as our new badminton coach. He brings a wealth of experience and is looking forward to helping our members improve their skills.',
      date: '2024-04-15',
    },
    {
      title: 'Meeting Reminder',
      content:
        'Please remember that we have a club meeting scheduled for this Friday at 4:00 PM in the main hall. All members are encouraged to attend.',
      date: '2024-05-01',
    },
    {
      title: 'Event Update',
      content:
        'We are excited to announce that the upcoming event has been rescheduled. Please check the updated schedule for more details.',
      date: '2024-05-01',
    },
  ],
  documents: [
    {
      title: 'Club Rules and Regulations',
      url: '/documents/badminton_club_rules.pdf',
      description: 'A comprehensive guide to the rules and regulations of our badminton club.',
      date: '2024-03-10',
    },
    {
      title: 'Training Schedule',
      url: '/documents/badminton_training_schedule.pdf',
      description: 'Detailed training schedule for the upcoming season.',
      date: '2024-03-15',
    },
  ],
  top_members: [
    {
      user_id: 2,
      name: 'Ilorez (Zobair Najdaoui)',
      points: 1500,
      department: '1337',
      avatar_url: 'https://unavatar.io/github/ilorez',
      record: '18W - 0L',
      badges: ['undefeated'],
    },
    {
      user_id: 1,
      name: 'Hamza Wahmane',
      points: 2000,
      department: '1337',
      avatar_url: 'https://unavatar.io/github/hamzawhmn',
      record: '15W - 3L',
      badges: ['hot-streak'],
    },
    {
      user_id: 5,
      name: 'I am Atomic',
      points: 100,
      department: '1337',
      avatar_url: 'https://unavatar.io/github/atomic',
      record: '13W - 4L',
      badges: [],
    },
    {
      user_id: 3,
      name: 'Ablabib',
      points: 90,
      department: 'Science',
      avatar_url: 'https://unavatar.io/github/ablabib',
      record: '10W - 5L',
      badges: [],
    },
    {
      user_id: 4,
      name: 'Nsila lmd9s',
      points: 1000,
      department: 'Arts',
      avatar_url: 'https://unavatar.io/github/nsila',
      record: '8W - 7L',
      badges: ['hot-streak'],
    },
    {
      user_id: 6,
      name: 'Hamza Wahmane',
      points: 120,
      department: 'Arts',
      avatar_url: 'https://unavatar.io/github/hamza-w',
      record: '2W - 1L',
      badges: [],
    },
    {
      user_id: 5,
      name: 'I am Atomic',
      points: 110,
      department: '1337',
      avatar_url: 'https://unavatar.io/github/atomic',
      record: '5W - 2L',
      badges: [],
    },
    {
      user_id: 3,
      name: 'Ablabib',
      points: 95,
      department: 'Science',
      avatar_url: 'https://unavatar.io/github/ablabib',
      record: '4W - 4L',
      badges: ['undefeated', 'hot-streak'],
    },
    {
      user_id: 4,
      name: 'Nsila lmd9s',
      points: 85,
      department: 'Arts',
      avatar_url: 'https://unavatar.io/github/nsila',
      record: '3W - 3L',
      badges: [],
    },
    {
      user_id: 7,
      name: 'Hamza Wahmane',
      points: 15,
      department: 'Arts',
      avatar_url: 'https://unavatar.io/github/hwahmane',
      record: '1W - 5L',
      badges: [],
    },
    {
      user_id: 5,
      name: 'I am Atomic',
      points: 60,
      department: '1337',
      avatar_url: 'https://unavatar.io/github/atomic',
      record: '6W - 6L',
      badges: [],
    },
    {
      user_id: 3,
      name: 'Ablabib',
      points: 25,
      department: 'Science',
      avatar_url: 'https://unavatar.io/github/ablabib',
      record: '2W - 8L',
      badges: [],
    },
    {
      user_id: 4,
      name: 'Nsila lmd9s',
      points: 5,
      department: 'Arts',
      avatar_url: 'https://unavatar.io/github/nsila',
      record: '0W - 10L',
      badges: [],
    },
  ],
};

// ==========================================
// Relational Queries (Backend View Models)
// ==========================================

export function getUserMatchHistory(userId: number): UserHistoryMatch[] {
  // 1. Memberships for this user
  const userMemberIds = mockMembers
    .filter((m) => m.user_id === userId)
    .map((m) => m.id);

  // 2. Teams where this user is player1 or player2
  const userTeams = mockTeams.filter(
    (t) => userMemberIds.includes(t.player1_id) || (t.player2_id && userMemberIds.includes(t.player2_id))
  );
  const userTeamIds = userTeams.map((t) => t.id);

  // 3. Matches
  const userMatches = mockMatches.filter(
    (m) => userTeamIds.includes(m.team1_id) || userTeamIds.includes(m.team2_id)
  );

  return userMatches.map((m) => {
    const isTeam1 = userTeamIds.includes(m.team1_id);
    const myTeam = isTeam1
      ? userTeams.find((t) => t.id === m.team1_id)!
      : userTeams.find((t) => t.id === m.team2_id)!;
    const opponentTeamId = isTeam1 ? m.team2_id : m.team1_id;
    const opponentTeam = mockTeams.find((t) => t.id === opponentTeamId);

    // Opponents array (Player[])
    const opponents: Player[] = [];
    if (opponentTeam) {
      opponents.push(getPlayerForMember(opponentTeam.player1_id));
      if (opponentTeam.player2_id) {
        opponents.push(getPlayerForMember(opponentTeam.player2_id));
      }
    }

    // Partner if doubles
    const partner =
      myTeam.player2_id && userMemberIds.includes(myTeam.player1_id)
        ? getPlayerForMember(myTeam.player2_id)
        : myTeam.player2_id && userMemberIds.includes(myTeam.player2_id)
        ? getPlayerForMember(myTeam.player1_id)
        : null;

    // Club name
    const club = mockClubs.find((c) => c.id === m.club_id);
    const clubName = club ? club.name : 'Racket Sport';
    const clubSlug = club ? club.slug : 'racket-sport';

    // Result
    const isWinner = m.winner_id
      ? userTeamIds.includes(m.winner_id)
      : isTeam1
      ? m.team1_score > m.team2_score
      : m.team2_score > m.team1_score;
    const result: 'W' | 'L' = isWinner ? 'W' : 'L';

    const myScore = isTeam1 ? m.team1_score : m.team2_score;
    const opponentScore = isTeam1 ? m.team2_score : m.team1_score;
    const pointsChange = isTeam1 ? m.team1_points : m.team2_points;

    return {
      match_id: m.id,
      club_id: m.club_id,
      club_name: clubName,
      club_slug: clubSlug,
      mode: m.mode,
      partner,
      opponents,
      result,
      my_score: myScore,
      opponent_score: opponentScore,
      points_change: pointsChange,
      date: m.scheduled_at,
    };
  });
}

export function getUserClubRanks(userId: number): UserClubRank[] {
  const userMemberships = mockMembers.filter((m) => m.user_id === userId);

  return userMemberships.map((mem) => {
    const club = mockClubs.find((c) => c.id === mem.club_id);
    const clubName = club ? club.name : 'Sport Club';
    const clubSlug = club ? club.slug : 'sport-club';

    // Calculate user's points in this club
    const memberMatches = getUserMatchHistory(userId).filter((h) => h.club_id === mem.club_id);
    const matchesSum = memberMatches.reduce((acc, match) => acc + match.points_change, 0);

    const lbMember = mockClubData.top_members.find((top) => top.user_id === userId);
    const points = lbMember && mem.club_id === 1 ? lbMember.points : Math.max(10, 1000 + matchesSum);

    const rank =
      userId === 1 ? 1 :
      userId === 2 ? 2 :
      userId === 4 ? 3 :
      userId === 5 ? 4 :
      userId === 3 ? 5 :
      userId === 6 ? 6 :
      userId === 7 ? 10 : 8;

    return {
      club_id: mem.club_id,
      club_name: clubName,
      club_slug: clubSlug,
      rank,
      points,
    };
  });
}

export function getUserIdForMember(member: { user_id?: number; name?: string; points?: number }): number {
  if (member.user_id) return member.user_id;
  const lower = (member.name || '').toLowerCase();
  if (lower.includes('hamza') || lower.includes('wahmane')) {
    if (member.points === 2000) return 1;
    if (member.points === 120) return 6;
    if (member.points === 15) return 7;
    return 1;
  }
  if (lower.includes('zobair') || lower.includes('ilorez') || lower.includes('najdaoui')) return 2;
  if (lower.includes('ablabib')) return 3;
  if (lower.includes('nsila')) return 4;
  if (lower.includes('atomic')) return 5;
  return 1;
}

export function getUserProfile(userIdInput: number | string): UserProfileData {
  const targetId = Number(userIdInput) || 1;
  const user = mockUsers.find((u) => u.id === targetId) || mockUsers[0];

  const history = getUserMatchHistory(user.id);
  const achievements = mockAchievements.filter((a) => a.user_id === user.id);
  const club_ranks = getUserClubRanks(user.id);

  // Joined clubs
  const userMemberships = mockMembers.filter((m) => m.user_id === user.id && m.left_at === null);
  const joined_clubs: JoinedClub[] = userMemberships.map((mem) => {
    const club = mockClubs.find((c) => c.id === mem.club_id)!;
    return {
      club,
      member_id: mem.id,
      role: mem.role,
      joined_at: mem.joined_at,
    };
  });

  // Calculate statistics
  const wins = history.filter((m) => m.result === 'W').length;
  const losses = history.filter((m) => m.result === 'L').length;
  const totalMatches = wins + losses;
  const winRate = totalMatches > 0 ? wins / totalMatches : (user.id === 1 ? 15 / 18 : 2 / 3);

  const memberOnLeaderboard = mockClubData.top_members.find((m) => m.user_id === user.id);
  const ladderPoints = memberOnLeaderboard ? memberOnLeaderboard.points : (user.id === 1 ? 2000 : 120);

  const bestRank = club_ranks.length > 0
    ? [...club_ranks].sort((a, b) => a.rank - b.rank)[0]
    : null;

  const currentStreak = user.id === 1 ? 5 : user.id === 2 ? 18 : wins > 0 ? wins : 0;

  return {
    user,
    stats: {
      total_matches: totalMatches > 0 ? totalMatches : (user.id === 1 ? 18 : 3),
      wins: wins > 0 ? wins : (user.id === 1 ? 15 : 2),
      losses: losses > 0 ? losses : (user.id === 1 ? 3 : 1),
      win_rate: winRate,
      ladder_points: ladderPoints,
      current_win_streak: currentStreak,
      best_rank: bestRank,
    },
    joined_clubs,
    achievements,
    history,
    club_ranks,
  };
}

export const mockUserProfileData: UserProfileData = getUserProfile(1);
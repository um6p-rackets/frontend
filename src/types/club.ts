type ClubSession = {
  type: string;
  day: string;
  start_time: string;
  end_time: string;
  location: string;
  spots_available: number;
  total_spots: number;
}

type ClubAnnouncement = {
  title: string;
  content: string;
  date: string;
}

type ClubDocument = {
  title: string;
  url: string;
  description: string;
  date: string;
}

type LeaderboardMember = {
  name: string;
  points: number;
  department: string;
  avatar_url: string;
  record?: string;
  badges?: string[];
}

export type ClubPageData = {
  name: string; 
  description: string;
  members: number;
  coach_name: string;
  weekly_sessions: ClubSession[];
  announcements: ClubAnnouncement[];
  documents: ClubDocument[];
  top_members: LeaderboardMember[]; // Top 5 members based on points
};
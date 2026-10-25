import { api } from '@/lib/api/api';
import type { AnnouncementWithAuthor } from '@/types/contracts/club';

export interface ClubMember {
  id?: number;
  member_id: number;
  login: string;
  first_name: string;
  last_name: string;
}

const CLUBS = '/clubs';

export const getAnnouncements = (slug: string, limit = 20, page = 1) =>
  api<{ data: AnnouncementWithAuthor[] }>(
    `${CLUBS}/${slug}/announcements?limit=${limit}&page=${page}`
  );

export const getClubMembersForAnnouncements = (slug: string) =>
  api<{ data: ClubMember[] } | ClubMember[]>(`${CLUBS}/${slug}/members`).catch(() => ({ data: [] }));

export const createAnnouncement = (slug: string, description: string) =>
  api<AnnouncementWithAuthor>(`${CLUBS}/${slug}/announcements`, {
    method: 'POST',
    body: JSON.stringify({ description }),
  });

export const deleteAnnouncement = (slug: string, announcementId: number) =>
  api<void>(`${CLUBS}/${slug}/announcements/${announcementId}`, {
    method: 'DELETE',
  });
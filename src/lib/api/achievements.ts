// -> src/lib/api/achievements.ts
import { api, post } from '@/lib/api/api';
import type {
  Achievement,
  Paginated,
  UserSummary
} from '@/types/contracts/club';
import type { AchievementCode } from '@/types/contracts/achievement-code';

const CLUBS = '/clubs';

// GET /:slug/achievements returns the owner with each row.
// If your contract file already exports this type, import it instead.
export type AchievementWithUser = Achievement & { user: UserSummary };

// Level: member. Newest first.
export const getClubAchievements = (slug: string, page = 1, limit = 10) =>
  api<Paginated<AchievementWithUser>>(
    `${CLUBS}/${slug}/achievements?page=${page}&limit=${limit}`
  );

// Level: leader. user_id = auth-service id of an ACTIVE member.
// 409 = the user already has this code, 400 = unknown code.
// awarded_by is set by the server, never sent.
export const awardAchievement = (
  slug: string,
  body: { user_id: number; code: AchievementCode }
) => post<Achievement>(`${CLUBS}/${slug}/achievements`, body);

// Level: leader. 204.
export const deleteAchievement = (slug: string, achievementId: number) =>
  api<void>(`${CLUBS}/${slug}/achievements/${achievementId}`, {
    method: 'DELETE'
  });
import { api } from "@/lib/api/api";
import type { Club, WeekView } from "@/types/contracts/club";

const CLUBS = "/clubs";

export const getClubs = () => api<Club[]>(CLUBS);
export const getClub = (slug: string) => api<Club>(`${CLUBS}/${slug}`);
export const getClubSessions = (slug: string, week?: string) => {
  const query = week ? `?week=${encodeURIComponent(week)}` : "";
  return api<WeekView>(`${CLUBS}/${slug}/sessions${query}`);
};

export const joinClubSession = (slug: string, sessionId: number) =>
  api<{ success: boolean; message: string }>(
    `${CLUBS}/${slug}/sessions/${sessionId}/join`,
    {
      method: "POST",
    }
  );

export const leaveClubSession = (slug: string, sessionId: number) =>
  api<{ success: boolean; message: string }>(
    `${CLUBS}/${slug}/sessions/${sessionId}/join`,
    {
      method: "DELETE",
    }
  );
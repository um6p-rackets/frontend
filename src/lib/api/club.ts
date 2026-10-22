import { api, ApiError } from "@/lib/api/api";
import type { Club, ClubMemberStatus, ClubWithMembersCountAndCoachFullName, WeekView } from "@/types/contracts/club";

const CLUBS = "/clubs";

export const getClubs = () => api<Club[]>(CLUBS);
export const getClub = (slug: string) => api<ClubWithMembersCountAndCoachFullName>(`${CLUBS}/${slug}`);

function getMondayOfDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const day = date.getUTCDay();
  const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(Date.UTC(y, m - 1, diff));
  return monday.toISOString().slice(0, 10);
}

function addDaysToDate(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
}

export const getClubSessions = async (slug: string, week?: string): Promise<WeekView> => {
  const weekParam =
    week && !isNaN(Date.parse(week))
      ? week
      : new Date().toISOString().slice(0, 10);
  const query = `?week=${encodeURIComponent(weekParam)}`;

  try {
    return await api<WeekView>(`${CLUBS}/${slug}/sessions${query}`);
  } catch (err: unknown) {
    const isFutureError =
      (err instanceof Error && err.message.toLowerCase().includes("future")) ||
      (err instanceof ApiError && err.status === 400 && new Date(weekParam) > new Date());

    if (isFutureError) {
      const mondayStr = getMondayOfDate(weekParam);
      return {
        week_start: mondayStr,
        is_current_week: false,
        is_future_week: true,
        prev_week_start: addDaysToDate(mondayStr, -7),
        next_week_start: addDaysToDate(mondayStr, 7),
        sessions: [],
      };
    }

    throw err;
  }
};

// --- Official Contract Type ---
export const getClubStatus = (slug: string) =>
  api<ClubMemberStatus>(`${CLUBS}/${slug}/status`);

export const joinClubSession = (slug: string, sessionId: number) =>
  api<{ success: boolean }>(`${CLUBS}/${slug}/sessions/${sessionId}/attend`, {
    method: "POST",
  });

export const leaveClubSession = (slug: string, sessionId: number) =>
  api<{ success: boolean }>(`${CLUBS}/${slug}/sessions/${sessionId}/attend`, {
    method: "DELETE",
  });

export const joinClub = (slug: string) =>
  api<{ status: "pending" }>(`${CLUBS}/${slug}/join`, { method: "POST" });

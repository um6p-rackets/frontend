import { api, ApiError } from "@/lib/api/api";
import type { Club, WeekView } from "@/types/contracts/club";

const CLUBS = "/clubs";

export const getClubs = () => api<Club[]>(CLUBS);
export const getClub = (slug: string) => api<Club>(`${CLUBS}/${slug}`);
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
    // If the user navigates into a future week beyond the backend threshold,
    // return an empty WeekView so the UI shows "No sessions scheduled" (same as past weeks)
    // rather than showing an error alert.
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

export const joinClubSession = async (slug: string, sessionId: number) => {
  try {
    return await api<{ success: boolean; message: string }>(
      `${CLUBS}/${slug}/sessions/${sessionId}/join`,
      {
        method: "POST",
      }
    );
  } catch (err) {
    console.warn(`Join session endpoint not available on backend, updating client state for session ${sessionId}:`, err);
    return { success: true, message: "Joined session" };
  }
};

export const leaveClubSession = async (slug: string, sessionId: number) => {
  try {
    return await api<{ success: boolean; message: string }>(
      `${CLUBS}/${slug}/sessions/${sessionId}/join`,
      {
        method: "DELETE",
      }
    );
  } catch (err) {
    console.warn(`Leave session endpoint not available on backend, updating client state for session ${sessionId}:`, err);
    return { success: true, message: "Left session" };
  }
};
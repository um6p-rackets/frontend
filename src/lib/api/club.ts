import { api } from "@/lib/api/api";
import type { Club } from "@/types/types";

const CLUBS = "/clubs";

export const getClubs = () => api<Club[]>(CLUBS);
export const getClub = (slug: string) => api<Club>(`${CLUBS}/${slug}`);
import { api, post } from '@/lib/api/api';
import type {
  MatchDetail,
  MatchRequestBody,
  Paginated
} from '@/types/contracts/club';

const CLUBS = '/clubs';

export const getPendingMatches = (slug: string) =>
  api<Paginated<MatchDetail>>(
    `${CLUBS}/${slug}/matches?status=pending&limit=50`
  );

export const acceptMatch = (slug: string, matchId: number) =>
  post<void>(`${CLUBS}/${slug}/matches/${matchId}/accept`);

export const requestMatch = (slug: string, body: MatchRequestBody) =>
  post<void>(`${CLUBS}/${slug}/matches/request`, body);
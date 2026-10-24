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

export const getClubMatches = (
  slug: string,
  mine: string,
  statusFilter: string,
  page: number,
  limit: number
) => {
  const statusParam = statusFilter !== 'all' ? `&status=${statusFilter}` : '';
  return api<Paginated<MatchDetail>>(
    `${CLUBS}/${slug}/matches?mine=${mine}&page=${page}&limit=${limit}${statusParam}`
  );
};

export const cancelMatch = (slug: string, matchId: number) =>
  post<void>(`${CLUBS}/${slug}/matches/${matchId}/cancel`);

// -> src/hooks/use-achievements.ts
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { clubKeys } from '@/hooks/use-clubs';
import { ApiError } from '@/lib/api/api';
import {
  awardAchievement,
  deleteAchievement,
  getClubAchievements,
} from '@/lib/api/achievements';
import type { AchievementCode } from '@/types/contracts/achievement-code';

export const achievementKeys = {
  // all club pages: invalidate this one after award / delete
  club: (slug: string) => [...clubKeys.detail(slug), 'achievements'] as const,
  clubPage: (slug: string, page: number, limit: number) =>
    [...achievementKeys.club(slug), { page, limit }] as const,
  // cross-club list shown on a profile
  user: (userId: number) => ['users', userId, 'achievements'] as const
};

export function useClubAchievements(slug: string, page: number, limit = 10) {
  return useQuery({
    queryKey: achievementKeys.clubPage(slug, page, limit),
    queryFn: () => getClubAchievements(slug, page, limit),
    enabled: Boolean(slug),
    placeholderData: keepPreviousData // no flicker when changing page
  });
}

export function useAwardAchievement(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { user_id: number; code: AchievementCode }) =>
      awardAchievement(slug, body),
    onSuccess: (_, { user_id }) => {
      toast.success('Achievement awarded.');
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: achievementKeys.club(slug) }),
        queryClient.invalidateQueries({ queryKey: achievementKeys.user(user_id) })
      ]);
    },
    onError: (err) =>
      toast.error(
        err instanceof ApiError && err.status === 409
          ? 'This member already has this achievement.'
          : err.message || 'Failed to award achievement.'
      )
  });
}

// userId is only used to refresh that user's profile list
export function useDeleteAchievement(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ achievementId }: { achievementId: number; userId: number }) =>
      deleteAchievement(slug, achievementId),
    onSuccess: (_, { userId }) => {
      toast.success('Achievement removed.');
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: achievementKeys.club(slug) }),
        queryClient.invalidateQueries({ queryKey: achievementKeys.user(userId) })
      ]);
    },
    onError: (err) => toast.error(err.message || 'Failed to remove achievement.')
  });
}
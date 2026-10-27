import { UsersApi } from "@/lib/api/users";
import { useQuery } from "@tanstack/react-query";

export const profileKeys = {
  all: ["profiles"] as const,
  me: () => [...profileKeys.all, "me"] as const,
  detail: (id: number) => [...profileKeys.all, id] as const,
};

export function useMyProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: () => UsersApi.getMyProfile(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useUserProfile(userId: number) {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: () => UsersApi.getUserProfile(userId),
    enabled: Boolean(userId),
    staleTime: 10 * 60 * 1000,
  });
}

export function useUserJoinedClubs(userId: number) {
  return useQuery({
    queryKey: [...profileKeys.detail(userId), "joinedClubs"],
    queryFn: () => UsersApi.getJoinedClubs(userId),
    enabled: Boolean(userId),
    staleTime: 10 * 60 * 1000,
  });
}


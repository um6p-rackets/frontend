import { useQuery } from "@tanstack/react-query";
import { AuthApi } from "@/lib/api/auth";

export const authKeys = { me: ["auth", "me"] as const };

// The current user: a User when logged in, null when not, undefined while loading
export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: AuthApi.getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
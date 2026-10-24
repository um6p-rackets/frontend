"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthApi } from "@/lib/api/auth";
import { authKeys } from "@/hooks/use-me";
import { useAuth } from "@/store/auth";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearAuth = useAuth((state) => state.logout);

  return async () => {
    try {
      await AuthApi.logout(); // clears the HttpOnly cookies
    } catch {
      // if server fails we just sigout locally, we can do nothing for that
    } finally {
      queryClient.clear(); // wipes private data from the cache
      queryClient.setQueryData(authKeys.me, null); // "not logged in", no refetch needed
      clearAuth(); // TODO: remove when the Zustand auth store is deleted
      router.push("/");
    }
  };
}

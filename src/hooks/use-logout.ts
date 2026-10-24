"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthApi } from "@/lib/api/auth";
import { authKeys } from "@/hooks/use-me";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return async () => {
    try {
      await AuthApi.logout(); // clears the HttpOnly cookies
    } catch {
      // best thing we can do is make him logout in front side
    } finally {
      // 1. Tell everyone listening to useMe: not logged in
      queryClient.setQueryData(authKeys.me, null);
      // 2. Wipe all other private data, but keep the auth key
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== authKeys.me[0],
      });
      router.push("/");
    }
  };
}

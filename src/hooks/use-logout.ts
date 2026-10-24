"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthApi } from "@/lib/api/auth";
import { authKeys } from "@/hooks/use-me";

import { broadcastAuthChange } from "@/hooks/use-auth-sync";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return async () => {
    try {
      await AuthApi.logout(); 
    } catch { } // force front-end logout regardless
    finally {
      queryClient.setQueryData(authKeys.me, null);
      queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== authKeys.me[0] });
      
      broadcastAuthChange();
      
      router.push("/");
    }
  };
}
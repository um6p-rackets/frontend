"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { AuthApi } from "@/lib/api/auth";
import { authKeys } from "@/hooks/use-me";

// Handles the return from Google login (?oauth=success).
// Who is logged in now comes only from useMe, so this file no longer stores the user.
export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const isOauthSuccess = searchParams.get("oauth") === "success";

  useEffect(() => {
    if (!isOauthSuccess) return;

    // The backend just set the cookies, so a cached "not logged in" answer is outdated
    queryClient
      .fetchQuery({ queryKey: authKeys.me, queryFn: AuthApi.getMe, staleTime: 0 })
      .catch(() => undefined) // if it fails, useMe will show the real state
      .finally(() => {
        // Remove ?oauth=success from the address bar
        const url = new URL(window.location.href);
        url.searchParams.delete("oauth");
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      });
  }, [isOauthSuccess, queryClient]);

  // Keep the spinner until the answer is in and the URL is clean
  if (isOauthSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  return <>{children}</>;
}

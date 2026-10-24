"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/hooks/use-me";

const CHANNEL = "auth-sync";

// Call this immediately after successful login, register, or logout
export function broadcastAuthChange() {
  if (typeof BroadcastChannel === "undefined") return;
  const ch = new BroadcastChannel(CHANNEL);
  ch.postMessage("auth-changed");
  ch.close();
}

export function useAuthSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const ch = new BroadcastChannel(CHANNEL);

    ch.onmessage = () => {
      // Another tab logged in or out.
      // Drop private caches and re-evaluate useMe.
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== authKeys.me[0] });
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    };

    // Safety net: Re-verify when user switches back to an old background tab
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        queryClient.invalidateQueries({ queryKey: authKeys.me });
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      ch.close();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [queryClient]);
}

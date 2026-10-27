"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { notificationKeys } from "@/hooks/use-notification-inbox";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3010";

export function useNotificationSocket(userId: string | number | undefined) {
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!userId) {
      return;
    }
    // const userId = queryClient.getQueryData(["me"]) as { id: string | number } | undefined;

    const socket: Socket = io(`${WS_URL}/notifications`, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      setConnected(true);
      console.log("Notification socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    // query looks like "notifications", "inbox", userId
    socket.on("notification:new", () => {
      void queryClient.invalidateQueries({
        queryKey: notificationKeys.inbox(userId),
      });
    });

    socket.on("connect_error", (error) => {
      console.error("Notification socket connection failed:", error.message);
    });

    return () => {
      socket.disconnect();
      setConnected(false);
    };
  }, [userId, queryClient]);

  return { connected };
}

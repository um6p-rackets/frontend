"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import type {
  InboxResponse,
  InboxItem,
  NotificationRealtimePayload,
} from "@/types/contracts/notification";
import { getInbox } from "@/lib/api/notification";
import { useMe } from "@/hooks/use-me";

interface NotificationContextType {
  notifications: NotificationRealtimePayload[];
  connected: boolean;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3010";

function mapInboxItem(item: InboxItem): NotificationRealtimePayload {
  return {
    notification_id: item.notification_id,
    event_id: item.notification.event_id,
    sender_type: item.notification.sender_type,
    sender_id: item.notification.sender_id,
    sender_name: item.notification.sender_name,
    sender_avatar_url: item.notification.sender_avatar_url,
    category: item.notification.category,
    type: item.notification.type,
    club_id: item.notification.club_id,
    club_name: item.notification.club_name,
    sent_at: item.notification.sent_at,
    is_read: item.is_read,
  };
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  // const user = useAuth((state) => state.user);
  const { data: user } = useMe();
  const userId = user?.id;

  const [notifications, setNotifications] = useState<NotificationRealtimePayload[]>([]);
  const [connected, setConnected] = useState(false);

  // Fetch the persisted inbox for the authenticated user.
  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    let cancelled = false;

    async function loadInbox() {
      try {
        const response: InboxResponse = await getInbox(1, 10);

        if (cancelled) return;

        const inbox = response.items.map(mapInboxItem);

        setNotifications((previous) => {
          const merged = new Map<string, NotificationRealtimePayload>();

          inbox.forEach((item) => {
            merged.set(item.notification_id, item);
          });

          // Preserve notifications received while the request
          // was in progress.
          previous.forEach((item) => {
            if (!merged.has(item.notification_id)) {
              merged.set(item.notification_id, item);
            }
          });

          return Array.from(merged.values()).sort(
            (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime(),
          );
        });
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load notification inbox:", error);
        }
      }
    }

    loadInbox();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Connect to Socket.IO and listen for new notifications.
  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setConnected(false);
      return;
    }

    const socket: Socket = io(`${WS_URL}/notifications`, {
      withCredentials: true,
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("notification:new", (notification: NotificationRealtimePayload) => {
      setNotifications((previous) => [
        notification,
        ...previous.filter((item) => item.notification_id !== notification.notification_id),
      ]);
    });

    socket.on("connect_error", (error) => {
      console.error("Notification socket connection failed:", error.message);
    });

    return () => {
      socket.disconnect();
      setConnected(false);
    };
  }, [userId]);

  return (
    <NotificationContext.Provider value={{ notifications, connected }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }

  return context;
}

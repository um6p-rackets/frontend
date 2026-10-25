"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

const NotificationContext = createContext<NotificationContextType | null>(
  null,
);

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3010";

const notificationKeys = {
  inbox: (userId: string | number) =>
    ["notifications", "inbox", userId] as const,
};

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

export function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data: user } = useMe();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const [connected, setConnected] = useState(false);

  const inboxQuery = useQuery({
    queryKey: notificationKeys.inbox(userId ?? ""), // the key to the cached data for a specific user
    queryFn: async (): Promise<InboxResponse> => getInbox(1, 10), // how to get the data
    enabled: !!userId,
  });

  const notifications: NotificationRealtimePayload[] =
    inboxQuery.data?.items.map(mapInboxItem) ?? [];

  // inboxQuery we could also
  // inboxQuery.isLoading, inboxQuery.isError, inboxQuery.error, inboxQuery.refetch
  useEffect(() => {
    if (!userId) {
      return;
    }

    const socket: Socket = io(`${WS_URL}/notifications`, {
      withCredentials: true,
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on(
      "notification:new",
      (notification: NotificationRealtimePayload) => {
        queryClient.setQueryData<InboxResponse>( // this for real time updating the query cache
          notificationKeys.inbox(userId),
          (previous) => {
            if (!previous) {
              // The inbox query has not loaded yet.
              // Trigger a refetch rather than losing the event.
              void queryClient.invalidateQueries({
                queryKey: notificationKeys.inbox(userId),
              });
              return previous;
            }

            const newItem: InboxItem = {
              id: notification.notification_id,
              notification_id: notification.notification_id,
              receiver_user_id: String(userId),
              is_read: false,
              read_at: null,
              notification: {
                id: notification.notification_id,
                event_id: notification.event_id,
                sender_type: notification.sender_type,
                sender_id: notification.sender_id,
                sender_name: notification.sender_name,
                sender_avatar_url: notification.sender_avatar_url,
                category: notification.category,
                type: notification.type,
                club_id: notification.club_id,
                club_name: notification.club_name,
                sent_at: notification.sent_at,
              },
            };

            const items = [
              newItem,
              ...previous.items.filter(
                (item) =>
                  item.notification_id !== notification.notification_id,
              ),
            ].slice(0, 10);

            return {
              ...previous,
              items,
            };
          },
        );
      },
    );

    socket.on("connect_error", (error) => {
      console.error(
        "Notification socket connection failed:",
        error.message,
      );
    });

    return () => {
      setConnected(false);
      socket.disconnect();
    };
  }, [userId, queryClient]);

  return (
    <NotificationContext.Provider value={{ notifications, connected }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider",
    );
  }

  return context;
}
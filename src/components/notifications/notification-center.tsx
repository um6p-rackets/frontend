
"use client";

import {
  Bell,
  CheckCheck,
  Circle,
  Clock3,
  Inbox,
  Wifi,
  WifiOff,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import type {
  NotificationRealtimePayload,
} from "@/types/contracts/notification";

interface NotificationCenterProps {
  notifications: NotificationRealtimePayload[];
  connected: boolean;
  onMarkAllAsRead?: () => void;
  markingAllAsRead?: boolean;
}

const ORANGE = "#D7492A";
const LIGHT_ORANGE = "#ED6E47";

function getInitials(name?: string | null) {
  if (!name) return "SY";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getNotificationText(
  notification: NotificationRealtimePayload,
) {
  const sender =
    notification.sender_name || "Someone";

  const club = notification.club_name || "your club";

  switch (notification.type) {
    case "JOIN_REQUESTED":
      return {
        title: "New join request",
        description: `${sender} wants to join ${club}.`,
      };

    case "JOIN_ACCEPTED":
      return {
        title: "Request accepted",
        description: `${sender} accepted your request to join ${club}.`,
      };

    case "JOIN_REJECTED":
      return {
        title: "Request declined",
        description: `${sender} declined your request to join ${club}.`,
      };

    case "CLUB_ANNOUNCEMENT":
      return {
        title: "Club announcement",
        description: `${sender} posted an announcement for ${club}.`,
      };

    default:
      return {
        title: String(notification.type).replaceAll("_", " "),
        description: `You have a new update${notification.club_name ? ` from ${notification.club_name}` : ""}.`,
      };
  }
}

function formatNotificationDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  const now = new Date();
  const sameDay = parsed.toDateString() === now.toDateString();

  if (sameDay) {
    return parsed.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return parsed.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year:
      parsed.getFullYear() === now.getFullYear()
        ? undefined
        : "numeric",
  });
}

export function NotificationCenter({
  notifications,
  connected,
  onMarkAllAsRead,
  markingAllAsRead = false,
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(
    (notification) => !notification.is_read,
  ).length;

  return (
    <Sheet>
      <SheetTrigger
        title="Notifications"
        aria-label={`Notifications, ${unreadCount} unread`}
        className="relative inline-flex size-10 items-center justify-center rounded-xl border border-transparent text-[#3B3B3B] transition-colors hover:border-[#D7492A]/20 hover:bg-[#D7492A]/10 hover:text-[#D7492A] dark:text-white"
      >
        <Bell className="size-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#D7492A] px-1 text-[10px] font-bold text-white dark:border-[#202020]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l border-[#3B3B3B]/15 bg-white p-0 text-[#3B3B3B] dark:border-white/10 dark:bg-[#202020] dark:text-white sm:max-w-[440px]"
      >
        <SheetHeader className="border-b border-[#3B3B3B]/10 bg-[#3B3B3B] px-5 py-6 text-white">
          <div className="flex items-center justify-between gap-3 pr-7">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#D7492A]">
                <Bell className="size-5" />
              </div>

              <div className="text-left">
                <SheetTitle className="text-xl font-bold text-white">
                  Notifications
                </SheetTitle>
                <SheetDescription className="mt-1 text-sm text-white/65">
                  Your club activity, all in one place.
                </SheetDescription>
              </div>
            </div>

            <Badge className="shrink-0 border-0 bg-white/10 text-white hover:bg-white/10">
              {unreadCount} unread
            </Badge>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-white/70">
              {connected ? (
                <Wifi className="size-3.5 text-[#ED6E47]" />
              ) : (
                <WifiOff className="size-3.5" />
              )}

              {connected ? "Live updates enabled" : "Reconnecting..."}
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={
                unreadCount === 0 ||
                markingAllAsRead ||
                !onMarkAllAsRead
              }
              onClick={onMarkAllAsRead}
            >
              <CheckCheck className="size-3.5" />
              {markingAllAsRead ? "Marking..." : "Mark all as read"}
            </Button>
            {/* <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={unreadCount === 0 || markingAllAsRead}
              onClick={onMarkAllAsRead}
              className="h-8 gap-1.5 px-2 text-xs text-white hover:bg-white/10 hover:text-[#ED6E47] disabled:text-white/35"
            >
              <CheckCheck className="size-3.5" />
              {markingAllAsRead ? "Marking..." : "Mark all as read"}
            </Button> */}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-8 text-center">
              <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#D7492A]/10">
                <Inbox className="size-7 text-[#D7492A]" />
              </div>

              <h3 className="text-lg font-semibold">
                You&apos;re all caught up
              </h3>

              <p className="mt-2 max-w-[260px] text-sm leading-6 text-[#3B3B3B]/60 dark:text-white/55">
                When something happens in your clubs, you&apos;ll find it here.
              </p>
            </div>
          ) : (
            <div className="p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3B3B3B]/50 dark:text-white/45">
                  Recent activity
                </p>

                <span className="text-xs text-[#3B3B3B]/45 dark:text-white/40">
                  {notifications.length} notifications
                </span>
              </div>

              <div className="space-y-2">
                {notifications.map((notification) => {
                  const content = getNotificationText(notification);
                  const unread = !notification.is_read;

                  return (
                    <article
                      key={notification.notification_id}
                      className={`group relative overflow-hidden rounded-xl border p-3.5 transition-colors ${
                        unread
                          ? "border-[#D7492A]/20 bg-[#D7492A]/[0.055] dark:bg-[#D7492A]/10"
                          : "border-[#3B3B3B]/10 bg-white hover:bg-[#3B3B3B]/[0.025] dark:border-white/10 dark:bg-white/[0.025] dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      {unread && (
                        <div className="absolute inset-y-0 left-0 w-[3px] bg-[#D7492A]" />
                      )}

                      <div className="flex gap-3 pl-1">
                        <Avatar className="mt-0.5 size-11 shrink-0 border border-[#3B3B3B]/10">
                          <AvatarImage
                            src={
                              notification.sender_avatar_url || undefined
                            }
                            alt={notification.sender_name || "Sender"}
                            referrerPolicy="no-referrer"
                          />

                          <AvatarFallback
                            className="font-semibold text-white"
                            style={{
                              backgroundColor: unread
                                ? ORANGE
                                : LIGHT_ORANGE,
                            }}
                          >
                            {getInitials(notification.sender_name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold leading-5">
                              {content.title}
                            </h4>

                            {unread && (
                              <Circle
                                className="mt-1 size-2 shrink-0 fill-[#D7492A] text-[#D7492A]"
                                aria-label="Unread"
                              />
                            )}
                          </div>

                          <p className="mt-1.5 text-[13px] leading-5 text-[#3B3B3B]/70 dark:text-white/65">
                            {content.description}
                          </p>

                          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#3B3B3B]/45 dark:text-white/40">
                            <Clock3 className="size-3" />
                            <time dateTime={notification.sent_at}>
                              {formatNotificationDate(
                                notification.sent_at,
                              )}
                            </time>

                            {notification.club_name && (
                              <>
                                <span>·</span>
                                <span className="truncate">
                                  {notification.club_name}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[#3B3B3B]/10 px-5 py-3 dark:border-white/10">
          <p className="text-center text-[11px] text-[#3B3B3B]/45 dark:text-white/40">
            Showing your latest notifications
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

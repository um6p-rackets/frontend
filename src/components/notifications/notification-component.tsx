"use client";

import { useState } from "react";
import { Bell, Circle, Inbox } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import type { NotificationRealtimePayload } from "@/types/contracts/notification";

interface NotificationComponentProps {
  notifications: NotificationRealtimePayload[];
  connected: boolean;
  onMarkAllAsRead?: () => void;
  markingAllAsRead?: boolean;
  triggerMode?: "icon" | "menu"; 
}

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

function getNotificationText(notification: NotificationRealtimePayload) {
  const sender = notification.sender_name || "Someone";
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
    year: parsed.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
}

export function NotificationComponent({
  notifications,
  connected,
  onMarkAllAsRead,
  markingAllAsRead = false,
  triggerMode = "icon", 
}: NotificationComponentProps) {
  const [selectedNotification, setSelectedNotification] = useState<NotificationRealtimePayload | null>(null);

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read,
  ).length;

  return (
    <>
      <Sheet>
        {triggerMode === "menu" ? (
          <SheetTrigger className="px-3 sm:px-4 py-2.5 flex items-center justify-between text-sm sm:text-base font-semibold rounded-lg hover:bg-muted text-foreground transition-colors w-full text-left border-t border-border mt-1 pt-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <Bell className="w-5 h-5 shrink-0" /> 
              <span className="truncate">Notifications</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2">
                {unreadCount > 99 ? "99+" : unreadCount} new
              </span>
            )}
          </SheetTrigger>
        ) : (
          <SheetTrigger
            title="Notifications"
            aria-label={`Notifications, ${unreadCount} unread`}
            className="relative inline-flex size-9 sm:size-10 items-center justify-center rounded-xl border border-transparent text-muted-foreground transition-colors hover:border-brand-orange/20 hover:bg-brand-orange/10 hover:text-brand-orange shrink-0"
          >
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-brand-orange px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </SheetTrigger>
        )}

        <SheetContent
          side="right"
          className="fixed inset-y-0 right-0 z-50 flex w-[85vw] max-w-[340px] sm:w-[440px] sm:max-w-[440px] flex-col gap-0 border-l border-border/70 bg-background p-0 shadow-2xl"
        >
          <SheetHeader className="border-b border-border/60 bg-background pl-4 pr-12 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center justify-between gap-2 w-full min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex size-9 sm:size-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange shrink-0">
                  <Bell className="size-4 sm:size-5" />
                </div>

                <div className="min-w-0">
                  <SheetTitle className="text-lg sm:text-2xl font-black italic tracking-tight text-foreground truncate">
                    Notifications
                  </SheetTitle>
                </div>
              </div>

              {unreadCount > 0 && (
                <Badge className="shrink-0 border-0 bg-brand-orange text-white hover:bg-brand-orange/90 font-bold px-2 py-0.5 rounded-full text-[10px] sm:text-xs">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              {notifications.length === 0 ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center px-6 sm:px-8 text-center">
                  <div className="mb-5 flex size-14 sm:size-16 items-center justify-center rounded-2xl bg-brand-orange/10">
                    <Inbox className="size-6 sm:size-7 text-brand-orange" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    You&apos;re all caught up
                  </h3>

                  <p className="mt-2 max-w-[260px] text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    When something happens in your clubs, you&apos;ll find it here.
                  </p>
                </div>
              ) : (
                <div className="p-3 sm:p-4 pb-6 w-full">
                  <div className="mb-3 sm:mb-4 flex items-center justify-between px-1">
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Recent activity
                    </p>

                    <span className="text-[10px] sm:text-xs font-medium text-muted-foreground/70">
                      {notifications.length} notifications
                    </span>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3 w-full">
                    {notifications.map((notification) => {
                      const content = getNotificationText(notification);
                      const unread = !notification.is_read;

                      return (
                        <button
                          key={notification.notification_id}
                          onClick={() => setSelectedNotification(notification)}
                          className={cn(
                            "group w-full text-left relative overflow-hidden rounded-xl sm:rounded-2xl border p-3 sm:p-4 transition-colors cursor-pointer",
                            unread
                              ? "border-brand-orange/40 bg-brand-orange/[0.04] shadow-xs"
                              : "border-border/70 bg-card hover:border-brand-orange/40 shadow-2xs"
                          )}
                        >
                          <div className="flex gap-2.5 sm:gap-3 pl-1 w-full min-w-0">
                            <Avatar className="mt-0.5 size-9 sm:size-11 shrink-0 ring-2 ring-background shadow-xs">
                              <AvatarImage
                                src={notification.sender_avatar_url || undefined}
                                alt={notification.sender_name || "Sender"}
                                referrerPolicy="no-referrer"
                              />

                              <AvatarFallback className="bg-muted text-brand-orange font-black text-xs sm:text-sm">
                                {getInitials(notification.sender_name)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 flex-1 pr-2 sm:pr-4 flex flex-col justify-center gap-1 sm:gap-1.5 overflow-hidden">
                              <div className="flex items-start justify-between gap-2 min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold text-foreground truncate w-full">
                                  {content.title}
                                </h4>
                              </div>

                              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-muted-foreground/70 min-w-0">
                                <time dateTime={notification.sent_at} className="truncate">
                                  {formatNotificationDate(notification.sent_at)}
                                </time>
                              </div>
                            </div>

                            {unread && (
                              <Circle
                                className="absolute top-3 sm:top-4 right-3 sm:right-4 size-2 sm:size-2.5 shrink-0 fill-brand-orange text-brand-orange"
                                aria-label="Unread"
                              />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog 
        open={!!selectedNotification} 
        onOpenChange={(open) => {
          if (!open) setSelectedNotification(null);
        }}
      >
        <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-[90vw] max-w-[360px] sm:max-w-md max-h-[85vh] overflow-y-auto rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl">
          {selectedNotification && (() => {
            const content = getNotificationText(selectedNotification);
            return (
              <>
                <DialogHeader className="text-left space-y-2 sm:space-y-3">
                  <DialogTitle className="text-xl sm:text-2xl font-black italic tracking-tight text-foreground break-words">
                    {content.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground break-words">
                    {content.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-4 sm:pt-5 border-t border-border/60">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 sm:size-12 shrink-0 border border-border/50 shadow-xs">
                      <AvatarImage
                        src={selectedNotification.sender_avatar_url || undefined}
                        alt={selectedNotification.sender_name || "Sender"}
                        referrerPolicy="no-referrer"
                      />
                      <AvatarFallback className="bg-brand-orange/10 text-brand-orange font-black text-xs sm:text-sm">
                        {getInitials(selectedNotification.sender_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                      <span className="text-sm font-bold text-foreground truncate">
                        {selectedNotification.sender_name || "Someone"}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs font-medium text-muted-foreground/70">
                        <time dateTime={selectedNotification.sent_at} className="whitespace-nowrap">
                          {formatNotificationDate(selectedNotification.sent_at)}
                        </time>
                        {selectedNotification.club_name && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="truncate max-w-full sm:max-w-[200px]">
                              {selectedNotification.club_name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </>
  );
}

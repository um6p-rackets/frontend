'use client';

import { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  useClubSessions,
  useJoinClubSession,
  useLeaveClubSession,
} from '@/hooks/use-clubs';
import type { SessionView } from '@/types/contracts/club';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import {
  CircleSmall,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  MapPin,
  Check,
  X,
  RotateCcw,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Separator } from '../ui/separator';

function formatWeekDisplay(weekStartStr?: string) {
  if (!weekStartStr) return '';
  const [year, month, day] = weekStartStr.split('-').map(Number);
  const startDate = new Date(year, month - 1, day);
  const endDate = new Date(year, month - 1, day + 6);

  const startFormatted = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const endFormatted = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `${startFormatted} – ${endFormatted}`;
}

function formatTime(isoString: string) {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function getSessionDay(isoString: string) {
  const d = new Date(isoString);
  const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
  const dayShort = d.toLocaleDateString('en-US', { weekday: 'short' });
  const dateFormatted = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return { dayName, dayShort, dateFormatted };
}

function ActionButton({
  session,
  onJoin,
  onCancel,
  isJoining,
  isCancelling,
}: {
  session: SessionView;
  onJoin: (sessionId: number) => void;
  onCancel: (sessionId: number) => void;
  isJoining: boolean;
  isCancelling: boolean;
}) {
  // Past sessions
  if (session.state === 'past') {
    if (session.is_joined) {
      return (
        <Button
          disabled
          variant="outline"
          className="border-accent/40 text-accent opacity-75 flex items-center justify-center gap-1 font-semibold text-xs sm:text-sm"
        >
          <Check className="w-3.5 h-3.5" />
          Joined
        </Button>
      );
    }
    return (
      <Button disabled variant="outline" className="opacity-60 text-muted-foreground text-xs sm:text-sm">
        Past
      </Button>
    );
  }

  // Cancelled session
  if (session.state === 'cancelled') {
    return (
      <Button disabled variant="outline" className="opacity-60 text-destructive border-destructive/30 text-xs sm:text-sm">
        Cancelled
      </Button>
    );
  }

  // Active / upcoming session and already joined -> directly show Cancel
  if (session.is_joined) {
    return (
      <Button
        disabled={isCancelling}
        variant="outline"
        onClick={() => onCancel(session.id)}
        className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive flex items-center justify-center gap-1 font-semibold text-xs sm:text-sm cursor-pointer transition-colors"
        title="Cancel session attendance"
      >
        {isCancelling ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Cancelling...</span>
          </>
        ) : (
          <>
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </>
        )}
      </Button>
    );
  }

  // Active / upcoming session and not joined
  switch (session.state) {
    case 'full':
      return (
        <Button disabled variant="outline" className="opacity-60 text-xs sm:text-sm">
          Full
        </Button>
      );
    case 'ongoing':
      return (
        <Button disabled className="bg-amber-500 text-white hover:bg-amber-600 text-xs sm:text-sm">
          Ongoing
        </Button>
      );
    case 'open':
    default:
      return (
        <Button
          disabled={isJoining}
          onClick={() => onJoin(session.id)}
          className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs sm:text-sm cursor-pointer"
        >
          {isJoining ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Joining...</span>
            </>
          ) : (
            'Join'
          )}
        </Button>
      );
  }
}

function SessionCard({
  session,
  onJoin,
  onCancel,
  isJoining,
  isCancelling,
}: {
  session: SessionView;
  onJoin: (sessionId: number) => void;
  onCancel: (sessionId: number) => void;
  isJoining: boolean;
  isCancelling: boolean;
}) {
  const { dayName, dayShort, dateFormatted } = getSessionDay(session.start_at);
  const startTime = formatTime(session.start_at);
  const endTime = formatTime(session.end_at);

  return (
    <>
      {/* Mobile Card Layout (< sm) */}
      <Card className="flex flex-col sm:hidden border border-border/70 shadow-2xs hover:border-border transition-all bg-card p-4 !pb-4 gap-3 rounded-xl">
        <CardHeader className="p-0 gap-1.5 flex flex-row items-center justify-between border-none">
          <Badge
            variant="outline"
            className="font-semibold text-accent border-accent/30 bg-accent-foreground/60 text-xs px-2.5 py-1"
          >
            {dayShort}, {dateFormatted}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full font-medium">
            <CircleSmall className="w-3.5 h-3.5 text-accent shrink-0" fill="currentColor" />
            <span>
              <strong className="text-foreground font-semibold">{session.spots_left}</strong>
              <span className="opacity-75">/{session.capacity} spots</span>
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0 space-y-1">
          <CardTitle className="text-base font-bold text-foreground leading-snug">
            {session.title || 'Session'}
          </CardTitle>
          <CardDescription className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1 font-medium text-foreground/85">
              <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span>{startTime} - {endTime}</span>
            </span>
            {session.location && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{session.location}</span>
              </span>
            )}
          </CardDescription>
        </CardContent>

        <CardFooter className="p-0 pt-1 border-t-0 bg-transparent *:w-full">
          <ActionButton
            session={session}
            onJoin={onJoin}
            onCancel={onCancel}
            isJoining={isJoining}
            isCancelling={isCancelling}
          />
        </CardFooter>
      </Card>

      {/* Desktop / Tablet Horizontal Layout (sm and up) */}
      <Card className="hidden sm:grid sm:grid-cols-[auto_1fr_auto] items-center p-4 !pb-4 gap-4 bg-card border border-border/70 shadow-2xs hover:border-border transition-all rounded-xl">
        {/* Day / Date Box */}
        <div className="font-semibold text-accent text-base lg:text-lg p-3 lg:p-4 bg-accent-foreground rounded-md flex flex-col justify-center items-center text-center min-w-[76px]">
          <span className="md:hidden">{dayShort}</span>
          <span className="hidden md:inline">{dayName}</span>
          <span className="text-xs font-normal opacity-75 mt-0.5">{dateFormatted}</span>
        </div>

        {/* Title, Time, Location */}
        <CardContent className="p-0 flex flex-col justify-between items-start min-w-0 py-0.5">
          <div>
            <CardTitle className="font-bold text-base lg:text-lg leading-tight truncate">
              {session.title || 'Session'}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {startTime} - {endTime}
            </CardDescription>
          </div>
          {session.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/90 mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{session.location}</span>
            </div>
          )}
        </CardContent>

        {/* Spots & Action Button */}
        <CardFooter className="p-0 border-t-0 bg-transparent flex flex-col justify-between items-center min-w-[120px] gap-2 *:w-full py-0.5">
          <div className="font-normal text-center flex flex-row justify-center items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <CircleSmall className="w-4 h-4 text-accent shrink-0" fill="currentColor" />
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-medium text-foreground">{session.spots_left}</span>
              <Separator orientation="vertical" className="rotate-25 h-3" />
              <span>{session.capacity} spots</span>
            </span>
          </div>
          <ActionButton
            session={session}
            onJoin={onJoin}
            onCancel={onCancel}
            isJoining={isJoining}
            isCancelling={isCancelling}
          />
        </CardFooter>
      </Card>
    </>
  );
}

export function SessionsSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <Skeleton className="h-12 rounded-lg" />
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-32 sm:h-28 rounded-xl" />
      ))}
    </div>
  );
}

export default function SessionsList({ clubSlug }: { clubSlug: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const weekQuery = searchParams.get('week') || undefined;
  const { data, isPending, isError, error, refetch } = useClubSessions(clubSlug, weekQuery);
  const joinMutation = useJoinClubSession(clubSlug);
  const leaveMutation = useLeaveClubSession(clubSlug);

  const currentWeekKey = data?.week_start || weekQuery || 'current';
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  const showAll = expandedWeek === currentWeekKey;

  const INITIAL_VISIBLE_COUNT = 3;
  const sessions = data?.sessions || [];
  const visibleSessions = showAll ? sessions : sessions.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = sessions.length > INITIAL_VISIBLE_COUNT;

  const handleWeekChange = (newWeek?: string) => {
    setExpandedWeek(null);
    const params = new URLSearchParams(searchParams.toString());
    if (newWeek) {
      params.set('week', newWeek);
    } else {
      params.delete('week');
    }
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

const handleJoin = (sessionId: number) => {
    const numericId = Number(sessionId);
    
    if (!numericId || isNaN(numericId) || numericId <= 0) {
      console.error("🚨 BUG: Invalid session ID:", sessionId);
      alert("Cannot join: Session ID is missing. Check your console!");
      return;
    }

    joinMutation.mutate(numericId);
  };

  const handleCancel = (sessionId: number) => {
    const numericId = Number(sessionId);

    if (!numericId || isNaN(numericId) || numericId <= 0) {
      console.error("🚨 BUG: Invalid session ID:", sessionId);
      return;
    }

    leaveMutation.mutate(numericId);
  };

  if (isPending) {
    return <SessionsSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center gap-3 border border-destructive/20 rounded-xl bg-destructive/5">
        <AlertCircle className="w-8 h-8 text-destructive" />
        <div className="text-sm font-semibold text-destructive">Failed to load sessions</div>
        <p className="text-xs text-muted-foreground max-w-sm">
          {error?.message || 'Something went wrong while fetching sessions.'}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="cursor-pointer">
          Retry
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        {/* Week Navigation Header & Date Filter */}
        <div className="flex flex-col gap-3 mb-4 pb-3 border-b border-border/40">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => data.prev_week_start && handleWeekChange(data.prev_week_start)}
                disabled={!data.prev_week_start}
                title="Previous week"
                aria-label="Previous week"
                className="cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {formatWeekDisplay(data.week_start)}
                </span>
                <div className="flex items-center gap-2">
                  {data.is_current_week ? (
                    <Badge className="bg-accent/15 text-accent text-[11px] font-medium border-transparent">
                      Current Week
                    </Badge>
                  ) : (data.is_future_week ?? (Boolean(data.week_start) && data.week_start > new Date().toISOString().slice(0, 10))) ? (
                    <Badge variant="outline" className="border-accent/40 text-accent text-[11px] font-medium">
                      Future Week
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      Past Week
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => data.next_week_start && handleWeekChange(data.next_week_start)}
                disabled={!data.next_week_start}
                title="Next week"
                aria-label="Next week"
                className="cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {(!data.is_current_week || weekQuery) && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleWeekChange(undefined)}
                className="text-xs text-accent hover:text-accent font-medium flex items-center gap-1 cursor-pointer"
                title="Reset to current week"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Current Week</span>
              </Button>
            )}
          </div>
        </div>

        {/* Sessions Cards */}
        {sessions.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-2 border border-dashed rounded-lg bg-card/50">
            <Calendar className="w-8 h-8 text-muted-foreground/60" />
            <p className="font-medium text-sm text-foreground">No sessions scheduled</p>
            <p className="text-xs text-muted-foreground">
              There are no sessions scheduled for this week.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {visibleSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onJoin={handleJoin}
                onCancel={handleCancel}
                isJoining={joinMutation.isPending && joinMutation.variables === session.id}
                isCancelling={leaveMutation.isPending && leaveMutation.variables === session.id}
              />
            ))}
          </div>
        )}
      </div>

      {hasMore && (
        <div className="pt-3 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedWeek(showAll ? null : currentWeekKey)}
            className="w-full border-border/70 bg-card hover:bg-card hover:text-accent hover:border-accent/40 text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 py-2 cursor-pointer shadow-2xs transition-colors"
          >
            {showAll ? (
              <>
                <span>Show less</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Show more ({sessions.length - INITIAL_VISIBLE_COUNT} more)</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

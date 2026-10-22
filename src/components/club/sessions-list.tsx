'use client';

import { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useClubSessions, useJoinClubSession, useLeaveClubSession } from '@/hooks/use-clubs';
import type { SessionView } from '@/types/contracts/club';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

import SessionCard from './session-card';
import CreateSessionDialog from './create-session-dialog';

function formatWeekDisplay(weekStartStr?: string) {
  if (!weekStartStr) return '';
  const [year, month, day] = weekStartStr.split('-').map(Number);
  const startDate = new Date(year, month - 1, day);
  const endDate = new Date(year, month - 1, day + 6);

  const startFormatted = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endFormatted = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return `${startFormatted} – ${endFormatted}`;
}

export function SessionsSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <Skeleton className="h-12 rounded-lg" />
      {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 sm:h-28 rounded-xl" />)}
    </div>
  );
}

export default function SessionsList({ 
  clubSlug,
  isAdmin = false 
}: { 
  clubSlug: string;
  isAdmin?: boolean; 
}) {
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

  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const diffToMonday = today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1);
  const currentMonday = new Date(today);
  currentMonday.setDate(diffToMonday);
  currentMonday.setHours(0, 0, 0, 0);

  const maxFutureDate = new Date(currentMonday);
  maxFutureDate.setDate(maxFutureDate.getDate() + 7);
  const maxWeekStr = maxFutureDate.toISOString().slice(0, 10);

  const minPastDate = new Date(currentMonday);
  minPastDate.setFullYear(minPastDate.getFullYear() - 1);
  const minWeekStr = minPastDate.toISOString().slice(0, 10);

  const currentWeekStart = data?.week_start || '';
  const isPastLimitReached = currentWeekStart <= minWeekStr;
  const isFutureLimitReached = currentWeekStart >= maxWeekStr;

  const INITIAL_VISIBLE_COUNT = 3;
  const sessions = data?.sessions || [];
  const visibleSessions = showAll ? sessions : sessions.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = sessions.length > INITIAL_VISIBLE_COUNT;

  const handleWeekChange = (newWeek?: string) => {
    setExpandedWeek(null);
    const params = new URLSearchParams(searchParams.toString());
    if (newWeek) params.set('week', newWeek);
    else params.delete('week');
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  const handleJoin = (session: SessionView) => {
    if (session.spots_left <= 0) {
      toast.error("Session is full", { description: "There are no spots left for this session." });
      return;
    }
    const numericId = Number(session.id);
    if (!numericId || isNaN(numericId) || numericId <= 0) return;
    joinMutation.mutate(numericId);
  };

  const handleCancel = (sessionId: number) => {
    const numericId = Number(sessionId);
    if (!numericId || isNaN(numericId) || numericId <= 0) return;
    leaveMutation.mutate(numericId);
  };

  if (isPending) return <SessionsSkeleton />;

  if (isError) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center gap-3 border border-destructive/20 rounded-xl bg-destructive/5">
        <AlertCircle className="w-8 h-8 text-destructive" />
        <div className="text-sm font-semibold text-destructive">Failed to load sessions</div>
        <p className="text-xs text-muted-foreground max-w-sm">{error?.message || 'Something went wrong.'}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex-1 flex flex-col">
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <CreateSessionDialog clubSlug={clubSlug} onSuccess={() => refetch()} />
        </div>
      )}

      <div>
        <div className="flex flex-col gap-3 mb-4 pb-3 border-b border-border/40">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon-sm" 
                onClick={() => data.prev_week_start && handleWeekChange(data.prev_week_start)} 
                disabled={!data.prev_week_start || data.prev_week_start < minWeekStr || isPastLimitReached}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{formatWeekDisplay(data.week_start)}</span>
                <div className="flex items-center gap-2">
                  {data.is_current_week ? (
                    <Badge className="bg-accent/15 text-accent text-[11px] font-medium border-transparent">Current Week</Badge>
                  ) : (data.is_future_week ?? (Boolean(data.week_start) && data.week_start > new Date().toISOString().slice(0, 10))) ? (
                    <Badge variant="outline" className="border-accent/40 text-accent text-[11px] font-medium">Future Week</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[11px] font-medium">Past Week</Badge>
                  )}
                </div>
              </div>
              <Button 
                variant="outline" 
                size="icon-sm" 
                onClick={() => data.next_week_start && handleWeekChange(data.next_week_start)} 
                disabled={!data.next_week_start || isFutureLimitReached}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            {(!data.is_current_week || weekQuery) && (
              <Button variant="ghost" size="xs" onClick={() => handleWeekChange(undefined)} className="text-xs text-accent hover:text-accent font-medium flex items-center gap-1 cursor-pointer">
                <RotateCcw className="w-3 h-3" /><span>Current Week</span>
              </Button>
            )}
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-2 border border-dashed rounded-lg bg-card/50">
            <CalendarIcon className="w-8 h-8 text-muted-foreground/60" />
            <p className="font-medium text-sm text-foreground">No sessions scheduled</p>
            <p className="text-xs text-muted-foreground">There are no sessions scheduled for this week.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {visibleSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                clubSlug={clubSlug}
                isAdmin={isAdmin}
                onJoin={handleJoin}
                onCancel={handleCancel}
                onDeleteSuccess={() => refetch()}
                isJoining={joinMutation.isPending && joinMutation.variables === session.id}
                isCancelling={leaveMutation.isPending && leaveMutation.variables === session.id}
              />
            ))}
          </div>
        )}
      </div>

      {hasMore && (
        <div className="pt-6 pb-1 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedWeek(showAll ? null : currentWeekKey)}
            className="text-xs text-brand-orange hover:text-brand-orange/80 hover:bg-transparent p-0 h-auto font-semibold cursor-pointer inline-flex items-center gap-1"
          >
            {showAll ? (
              <><span>Show less</span><ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <><span>Show more ({sessions.length - INITIAL_VISIBLE_COUNT} more)</span><ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

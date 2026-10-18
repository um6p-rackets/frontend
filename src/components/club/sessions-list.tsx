'use client';

import { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { format } from "date-fns";
import { useQueryClient } from '@tanstack/react-query';
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
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Check,
  X,
  RotateCcw,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Pencil,
  ChevronDownIcon,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import { api } from '@/lib/api/api';
import { cn } from '@/lib/utils';

// Shadcn form, modal & calendar imports
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

function formatWeekDisplay(weekStartStr?: string) {
  if (!weekStartStr) return '';
  const [year, month, day] = weekStartStr.split('-').map(Number);
  const startDate = new Date(year, month - 1, day);
  const endDate = new Date(year, month - 1, day + 6);

  const startFormatted = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endFormatted = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return `${startFormatted} – ${endFormatted}`;
}

function formatTime(isoString: string) {
  const d = new Date(isoString);
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getSessionDay(isoString: string) {
  const d = new Date(isoString);
  const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
  const dayShort = d.toLocaleDateString('en-US', { weekday: 'short' });
  const dateFormatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
  onJoin: (session: SessionView) => void;
  onCancel: (sessionId: number) => void;
  isJoining: boolean;
  isCancelling: boolean;
}) {
  const baseClass = "w-full rounded-xl font-semibold text-sm h-9 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm";

  if (session.state === 'past') {
    if (session.is_joined) {
      return (
        <Button disabled variant="outline" className={`${baseClass} border-accent/40 text-accent opacity-75 shadow-none`}>
          <Check className="w-4 h-4" /> Joined
        </Button>
      );
    }
    return <Button disabled variant="outline" className={`${baseClass} opacity-60 text-muted-foreground shadow-none`}>Past</Button>;
  }

  if (session.state === 'cancelled') {
    return <Button disabled variant="outline" className={`${baseClass} opacity-60 text-destructive border-destructive/30 shadow-none`}>Cancelled</Button>;
  }

  if (session.is_joined) {
    return (
      <Button
        disabled={isCancelling}
        variant="outline"
        onClick={() => onCancel(session.id)}
        className={`${baseClass} border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive group shadow-none`}
      >
        {isCancelling ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Cancelling...</span></>
        ) : (
          <>
            <X className="w-4 h-4 group-hover:block" />
            <span >Cancel</span>
          </>
        )}
      </Button>
    );
  }

  switch (session.state) {
    case 'full':
      return <Button disabled variant="outline" className={`${baseClass} opacity-60 shadow-none`}>Full</Button>;
    case 'ongoing':
      return <Button disabled className={`${baseClass} bg-amber-500 text-white hover:bg-amber-600`}>Ongoing</Button>;
    case 'open':
    default:
      return (
        <Button
          disabled={isJoining}
          onClick={() => onJoin(session)}
          className={`${baseClass} bg-brand-orange text-white hover:bg-brand-orange/90`}
        >
          {isJoining ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Joining...</span></> : 'Join'}
        </Button>
      );
  }
}

function SessionCard({
  session,
  clubSlug,
  isAdmin,
  onJoin,
  onCancel,
  onDeleteSuccess,
  isJoining,
  isCancelling,
}: {
  session: SessionView;
  clubSlug: string;
  isAdmin: boolean;
  onJoin: (session: SessionView) => void;
  onCancel: (sessionId: number) => void;
  onDeleteSuccess: () => void;
  isJoining: boolean;
  isCancelling: boolean;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { dayShort, dateFormatted } = getSessionDay(session.start_at);
  const startTime = formatTime(session.start_at);
  const endTime = formatTime(session.end_at);

  // Edit States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editTitle, setEditTitle] = useState(session.title || '');
  const [editLocation, setEditLocation] = useState(session.location || '');
  const [editCapacity, setEditCapacity] = useState(session.capacity.toString());
  const [editStartTime, setEditStartTime] = useState(formatTime(session.start_at));
  const [editEndTime, setEditEndTime] = useState(formatTime(session.end_at));
  const [applyToFuture, setApplyToFuture] = useState(false);

  const handleEditOpenChange = (open: boolean) => {
    if (open) {
      setEditTitle(session.title || '');
      setEditLocation(session.location || '');
      setEditCapacity(session.capacity.toString());
      setEditStartTime(formatTime(session.start_at));
      setEditEndTime(formatTime(session.end_at));
      setApplyToFuture(false);
    }
    setIsEditOpen(open);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editStartTime >= editEndTime) return;
    setIsEditSubmitting(true);
    try {
      await api(`/clubs/${clubSlug}/sessions/${session.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: editTitle || session.title,
          location: editLocation || session.location,
          capacity: parseInt(editCapacity),
          start_time: editStartTime,
          end_time: editEndTime,
          apply_to_future: applyToFuture,
        }),
      });
      toast.success("Capacity updated successfully");
      setIsEditOpen(false);
      onDeleteSuccess();
    } catch (error: unknown) {
      console.error('Failed to update session:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update session";
      
      if (
        errorMessage.toLowerCase().includes("already exists") || 
        errorMessage.toLowerCase().includes("unique") ||
        errorMessage.toLowerCase().includes("conflict")
      ) {
        toast.error("A session with this title or location already exists in the series.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api(`/clubs/${clubSlug}/sessions/${session.id}`, { method: 'DELETE' });
      toast.success("Session deleted");
      onDeleteSuccess();
    } catch (error) {
      console.error('Failed to delete session', error);
      toast.error("Failed to delete session");
    } finally {
      setIsDeleting(false);
    }
  };

  const editButton = isAdmin && (
    <Dialog open={isEditOpen} onOpenChange={handleEditOpenChange}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md transition-colors hover:bg-muted text-foreground/70 h-8 w-8 shrink-0 cursor-pointer focus-visible:outline-none">
        <Pencil className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
          <DialogDescription>Update the details for this session slot.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEdit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="e.g., Beginners Training" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
          </div>

          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input 
                  type="time" 
                  value={editStartTime} 
                  onChange={(e) => setEditStartTime(e.target.value)} 
                  className={editStartTime && editEndTime && editStartTime >= editEndTime ? "border-destructive focus-visible:ring-destructive" : ""}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input 
                  type="time" 
                  value={editEndTime} 
                  onChange={(e) => setEditEndTime(e.target.value)} 
                  className={editStartTime && editEndTime && editStartTime >= editEndTime ? "border-destructive focus-visible:ring-destructive" : ""}
                  required 
                />
              </div>
            </div>
            {editStartTime && editEndTime && editStartTime >= editEndTime && (
              <p className="text-[13px] font-medium text-destructive mt-1">
                End time must be after the start time.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input placeholder="Court 1" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Capacity (Spots)</Label>
              <Input type="number" min="1" value={editCapacity} onChange={(e) => setEditCapacity(e.target.value)} required />
            </div>
          </div>

          {session.template_id !== null && session.template_id !== undefined && (
            <div className="flex items-center space-x-2 pt-2 pb-2">
              <input
                type="checkbox"
                id={`applyFuture-${session.id}`}
                checked={applyToFuture}
                onChange={(e) => setApplyToFuture(e.target.checked)}
                className="w-4 h-4 text-brand-orange border-gray-300 rounded focus:ring-brand-orange cursor-pointer accent-brand-orange"
              />
              <Label htmlFor={`applyFuture-${session.id}`} className="font-normal text-sm cursor-pointer">
                Apply changes to all future recurring sessions
              </Label>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isEditSubmitting} className="bg-brand-orange hover:bg-brand-orange/90 text-white">
              {isEditSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  const deleteButton = isAdmin && (
    <AlertDialog>
      <AlertDialogTrigger className="inline-flex items-center justify-center rounded-md transition-colors hover:bg-destructive/10 text-destructive h-8 w-8 shrink-0 cursor-pointer focus-visible:outline-none">
        <Trash2 className="w-4 h-4" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Session?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently remove this session and cancel all member registrations.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <Card className="flex flex-col border border-border/70 shadow-sm hover:shadow-md transition-shadow bg-card p-4 sm:p-5 gap-3 sm:gap-4 rounded-xl relative overflow-hidden">
      <div className="flex justify-between items-start sm:items-center w-full">
        <Badge variant="outline" className="font-semibold text-accent border-accent/30 bg-accent-foreground/60 text-xs sm:text-sm px-3 py-1 shrink-0 rounded-full">
          {dayShort}, {dateFormatted}
        </Badge>
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full font-medium mr-1">
            <CircleSmall className="w-4 h-4 text-accent shrink-0" fill="currentColor" />
            <span>
              <strong className="text-foreground font-bold">{session.spots_left}</strong>
              <span className="opacity-75">/{session.capacity}</span>
            </span>
          </div>
          {editButton}
          {deleteButton}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-4 w-full sm:mt-1">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <h3 className="font-bold text-xl sm:text-2xl text-foreground leading-snug truncate">
            {session.title || 'Session'}
          </h3>
          <div className="flex items-center gap-3 sm:gap-4 text-sm text-muted-foreground font-medium flex-wrap">
            <span className="flex items-center gap-1.5 shrink-0">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{startTime} - {endTime}</span>
            </span>
            {session.location && (
              <span className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate">{session.location}</span>
              </span>
            )}
          </div>
        </div>
        <div className="w-full sm:w-[110px] shrink-0">
          <ActionButton session={session} onJoin={onJoin} onCancel={onCancel} isJoining={isJoining} isCancelling={isCancelling} />
        </div>
      </div>
    </Card>
  );
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

  // Form States for Creation
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('20');
  
  const [sessionDate, setSessionDate] = useState<Date>();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [repeatWeekly, setRepeatWeekly] = useState(true);

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

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionDate || !startTime || !endTime) {
      toast.error("Please fill in the date and times");
      return;
    }

    if (startTime >= endTime) {
      return; 
    }

    setIsSubmitting(true);
    
    try {
      const jsDay = sessionDate.getDay();
      const backendWeekday = jsDay === 0 ? 6 : jsDay - 1;

      const mondayDate = new Date(sessionDate);
      mondayDate.setDate(mondayDate.getDate() - backendWeekday);

      await api(`/clubs/${clubSlug}/sessions`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          location,
          capacity: parseInt(capacity),
          weekday: backendWeekday,
          start_time: startTime,
          end_time: endTime,
          week_start: format(mondayDate, 'yyyy-MM-dd'),
          repeat_weekly: repeatWeekly 
        }),
      });
      
      toast.success("Session created successfully");
      setIsAddOpen(false);
      
      setTitle(''); 
      setLocation(''); 
      setSessionDate(undefined); 
      setStartTime(''); 
      setEndTime(''); 
      setCapacity('20');
      setRepeatWeekly(true);
      
      refetch();
    } catch (error: unknown) {
      console.error('Failed to create session:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create session");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // التحقق المباشر من امتلاء الجلسة من جهة العميل قبل الانضمام
  const handleJoin = (session: SessionView) => {
    if (session.spots_left <= 0) {
      toast.error("Session is full", {
        description: "There are no spots left for this session.",
      });
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
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-brand-orange hover:bg-brand-orange/90 text-white shadow-sm h-8 px-3 gap-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
              <Plus className="w-4 h-4" /> New Session
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Session</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSession} className="space-y-4 pt-4">
                
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="e.g., Beginners Training" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger className={cn(
                      "inline-flex items-center justify-between whitespace-nowrap rounded-md text-sm font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 w-full text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      !sessionDate && "text-muted-foreground"
                    )}>
                      {sessionDate ? format(sessionDate, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="w-4 h-4 opacity-50" />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={sessionDate}
                        onSelect={setSessionDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input 
                        type="time" 
                        value={startTime} 
                        onChange={(e) => setStartTime(e.target.value)} 
                        className={startTime && endTime && startTime >= endTime ? "border-destructive focus-visible:ring-destructive" : ""}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input 
                        type="time" 
                        value={endTime} 
                        onChange={(e) => setEndTime(e.target.value)} 
                        className={startTime && endTime && startTime >= endTime ? "border-destructive focus-visible:ring-destructive" : ""}
                        required 
                      />
                    </div>
                  </div>
                  {startTime && endTime && startTime >= endTime && (
                    <p className="text-[13px] font-medium text-destructive mt-1">
                      End time must be after the start time.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input placeholder="Court 1" value={location} onChange={(e) => setLocation(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Capacity (Spots)</Label>
                    <Input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2 pb-2">
                  <input
                    type="checkbox"
                    id="repeatWeekly"
                    checked={repeatWeekly}
                    onChange={(e) => setRepeatWeekly(e.target.checked)}
                    className="w-4 h-4 text-brand-orange border-gray-300 rounded focus:ring-brand-orange cursor-pointer accent-brand-orange"
                  />
                  <Label htmlFor="repeatWeekly" className="font-normal text-sm cursor-pointer">
                    Schedule as a recurring weekly session
                  </Label>
                </div>

                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Create Session"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
        <div className="pt-3 mt-auto">
          <Button variant="outline" size="sm" onClick={() => setExpandedWeek(showAll ? null : currentWeekKey)} className="w-full border-border/70 bg-card hover:bg-card hover:text-accent hover:border-accent/40 text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 py-2 cursor-pointer shadow-2xs transition-colors">
            {showAll ? <><span className="ml-2">Show less</span><ChevronUp className="w-3.5 h-3.5" /></> : <><span className="ml-2">Show more ({sessions.length - INITIAL_VISIBLE_COUNT} more)</span><ChevronDown className="w-3.5 h-3.5" /></>}
          </Button>
        </div>
      )}
    </div>
  );
}

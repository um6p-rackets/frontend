'use client';

import { useState } from 'react';
import { format } from "date-fns";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Plus, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api/api';
import { cn } from '@/lib/utils';

interface CreateSessionDialogProps {
  clubSlug: string;
  onSuccess: () => void;
}

export default function CreateSessionDialog({ clubSlug, onSuccess }: CreateSessionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('20');
  const [sessionDate, setSessionDate] = useState<Date>();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [repeatWeekly, setRepeatWeekly] = useState(true);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionDate || !startTime || !endTime) {
      toast.error("Please fill in the date and times");
      return;
    }
    if (startTime >= endTime) return;

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
      setIsOpen(false);
      setTitle('');
      setLocation('');
      setSessionDate(undefined);
      setStartTime('');
      setEndTime('');
      setCapacity('20');
      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create session";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-brand-orange hover:bg-brand-orange/90 text-white shadow-sm h-8 px-3 gap-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer">
        <Plus className="w-4 h-4" /> New Session
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="e.g., Beginners Training" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2 flex flex-col">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger className={cn(
                "inline-flex items-center justify-between whitespace-nowrap rounded-md text-sm font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 w-full text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer",
                !sessionDate && "text-muted-foreground"
              )}>
                {sessionDate ? format(sessionDate, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="w-4 h-4 opacity-50" />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={sessionDate} onSelect={setSessionDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input placeholder="Court 1" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="repeatWeekly"
              checked={repeatWeekly}
              onChange={(e) => setRepeatWeekly(e.target.checked)}
              className="w-4 h-4 text-brand-orange rounded cursor-pointer accent-brand-orange"
            />
            <Label htmlFor="repeatWeekly" className="font-normal text-sm cursor-pointer">
              Schedule as a recurring weekly session
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-brand-orange text-white">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Create Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

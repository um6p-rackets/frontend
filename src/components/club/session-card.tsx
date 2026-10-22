'use client';

import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { CircleSmall, Clock, MapPin, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api/api';
import type { SessionView } from '@/types/contracts/club';
import SessionActionButton from './session-action-button';

function formatTime(isoString: string) {
    const d = new Date(isoString);
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
    }

    function getSessionDay(isoString: string) {
    const d = new Date(isoString);
    const dayShort = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateFormatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dayShort, dateFormatted };
    }

    interface SessionCardProps {
    session: SessionView;
    clubSlug: string;
    isAdmin: boolean;
    onJoin: (session: SessionView) => void;
    onCancel: (sessionId: number) => void;
    onDeleteSuccess: () => void;
    isJoining: boolean;
    isCancelling: boolean;
    }

    export default function SessionCard({
    session,
    clubSlug,
    isAdmin,
    onJoin,
    onCancel,
    onDeleteSuccess,
    isJoining,
    isCancelling,
    }: SessionCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { dayShort, dateFormatted } = getSessionDay(session.start_at);
    const startTime = formatTime(session.start_at);
    const endTime = formatTime(session.end_at);

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
        const errorMessage = error instanceof Error ? error.message : "Failed to update session";
        toast.error(errorMessage);
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
        toast.error("Failed to delete session");
        } finally {
        setIsDeleting(false);
        }
    };

    return (
        <Card className="flex flex-col border border-border/75 shadow-sm hover:shadow-md transition-shadow bg-card p-4 sm:p-5 gap-3 sm:gap-4 rounded-xl relative overflow-hidden">
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

            {isAdmin && (
                <>
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
                        <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input type="time" value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>End Time</Label>
                            <Input type="time" value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} required />
                        </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Capacity</Label>
                            <Input type="number" min="1" value={editCapacity} onChange={(e) => setEditCapacity(e.target.value)} required />
                        </div>
                        </div>
                        {session.template_id !== null && session.template_id !== undefined && (
                        <div className="flex items-center space-x-2 pt-2">
                            <input
                            type="checkbox"
                            id={`applyFuture-${session.id}`}
                            checked={applyToFuture}
                            onChange={(e) => setApplyToFuture(e.target.checked)}
                            className="w-4 h-4 text-brand-orange rounded cursor-pointer accent-brand-orange"
                            />
                            <Label htmlFor={`applyFuture-${session.id}`} className="font-normal text-sm cursor-pointer">
                            Apply changes to all future recurring sessions
                            </Label>
                        </div>
                        )}
                        <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isEditSubmitting} className="bg-brand-orange text-white">
                            {isEditSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Changes"}
                        </Button>
                        </DialogFooter>
                    </form>
                    </DialogContent>
                </Dialog>

                <AlertDialog>
                    <AlertDialogTrigger className="inline-flex items-center justify-center rounded-md transition-colors hover:bg-destructive/10 text-destructive h-8 w-8 shrink-0 cursor-pointer focus-visible:outline-none">
                    <Trash2 className="w-4 h-4" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Session?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </>
            )}
            </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-4 w-full sm:mt-1">
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <h3 className="font-bold text-xl sm:text-2xl text-foreground leading-snug truncate">
                {session.title || 'Session'}
            </h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium flex-wrap">
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
            <SessionActionButton session={session} onJoin={onJoin} onCancel={onCancel} isJoining={isJoining} isCancelling={isCancelling} />
            </div>
        </div>
        </Card>
    );
}
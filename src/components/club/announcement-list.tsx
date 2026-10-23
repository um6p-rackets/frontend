'use client';

import { useState, useEffect } from 'react';
import { Card, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp, Loader2, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api/api';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

export interface AnnouncementWithAuthor {
  id: number;
  club_id: number;
  announcer_id: number;
  description: string;
  created_at: string;
  announcer: {
    id?: number;
    member_id?: number;
    login: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface ClubMember {
  id?: number;
  member_id: number;
  login: string;
  first_name: string;
  last_name: string;
}

function Announcement({
  clubSlug,
  announcement,
  isAdmin,
  membersMap,
  onDelete
}: {
  clubSlug: string;
  announcement: AnnouncementWithAuthor;
  isAdmin: boolean;
  membersMap: Map<number, ClubMember>;
  onDelete: (id: number) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = (() => {
    if (!announcement.created_at) return '';
    const isoString = announcement.created_at.includes(' ') && !announcement.created_at.includes('T')
      ? announcement.created_at.replace(' ', 'T')
      : announcement.created_at;
    const date = new Date(isoString);
    return !isNaN(date.getTime())
      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : announcement.created_at;
  })();

  // Dynamically resolve author from the database members map using announcer_id
  const memberAuthor = membersMap.get(announcement.announcer_id);
  const announcer = (announcement.announcer?.first_name ? announcement.announcer : null) || memberAuthor;

  const displayName = [announcer?.first_name, announcer?.last_name]
    .filter(Boolean).join(' ') || announcer?.login || 'Club Admin';

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api(`/clubs/${clubSlug}/announcements/${announcement.id}`, { method: 'DELETE' });
      onDelete(announcement.id);
      toast.success("Announcement deleted", {
        description: "The announcement has been permanently removed.",
      });
    } catch (error) {
      toast.error("Failed to delete", {
        description: "An error occurred while deleting the announcement.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const isLongText = announcement.description.length > 160 || announcement.description.includes('\n');

  return (
    <Card className="p-4 gap-2 flex flex-col justify-between items-start m-0 w-full bg-card border border-border/70 rounded-xl shadow-2xs group relative">
      {isAdmin && (
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 transition-opacity text-destructive hover:bg-destructive/10 z-10"
              />
            }
          >
            <Trash2 className="w-4 h-4" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the announcement.
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
      )}

      <div className="w-full pr-8">
        <CardDescription className={cn(
          "text-sm sm:text-base text-foreground font-medium leading-relaxed whitespace-pre-wrap break-all",
          !isExpanded && "line-clamp-3"
        )}>
          {announcement.description}
        </CardDescription>

        {isLongText && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1.5 text-xs text-brand-orange hover:text-brand-orange/80 hover:bg-transparent p-0 h-auto font-semibold cursor-pointer"
          >
            {isExpanded ? "Show less" : "Show more"}
          </Button>
        )}
      </div>

      <div className="flex justify-between w-full text-xs text-muted-foreground/80 pt-1 mt-3 border-t border-border/40">
        <span className="italic font-medium">By {displayName}</span>
        <span className="font-semibold">{formattedDate}</span>
      </div>
    </Card>
  );
}

export default function AnnouncementList({
  clubSlug,
  isAdmin = false
}: {
  clubSlug: string;
  isAdmin?: boolean;
}) {
  const [announcements, setAnnouncements] = useState<AnnouncementWithAuthor[]>([]);
  const [membersMap, setMembersMap] = useState<Map<number, ClubMember>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const INITIAL_VISIBLE_COUNT = 4;

  useEffect(() => {
    async function fetchData() {
      if (!clubSlug) return setIsLoading(false);
      try {
        // Fetch announcements and club members concurrently from the database
        const [annRes, membersRes] = await Promise.all([
          api<{ data: AnnouncementWithAuthor[] }>(`/clubs/${clubSlug}/announcements?limit=20&page=1`),
          api<{ data: ClubMember[] } | ClubMember[]>(`/clubs/${clubSlug}/members`).catch(() => ({ data: [] }))
        ]);

        const fetchedAnnouncements = annRes.data || [];
        
        // Build a dynamic lookup map from member/user IDs
        const map = new Map<number, ClubMember>();
        const memberList = Array.isArray(membersRes) ? membersRes : (membersRes?.data || []);
        memberList.forEach((m: ClubMember) => {
          const key = m.member_id || m.id;
          if (key) map.set(key, m);
        });
        setMembersMap(map);

        // Sort by newest first based on created_at timestamp
        const sorted = fetchedAnnouncements.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setAnnouncements(sorted);
      } catch (error) {
        // Handle error silently
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [clubSlug]);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api<AnnouncementWithAuthor>(`/clubs/${clubSlug}/announcements`, {
        method: 'POST',
        body: JSON.stringify({ description: newDesc }),
      });

      setAnnouncements(prev => [res, ...prev].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setNewDesc('');
      setIsAddOpen(false);
      toast.success("Announcement posted", {
        description: "Your new announcement is now live.",
      });
    } catch (error) {
      toast.error("Failed to post", {
        description: "An error occurred while creating the announcement.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeAnnouncementFromState = (id: number) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-orange" /></div>;

  const visibleAnnouncements = showAll ? announcements : announcements.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = announcements.length > INITIAL_VISIBLE_COUNT;

  return (
    <div className="flex-1 flex flex-col">
      {isAdmin && (
        <div className="flex justify-end mb-8">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger render={<Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white" />}>
              <Plus className="w-4 h-4 mr-2" /> New Announcement
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateAnnouncement} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Message Content</Label>
                  <Textarea
                    placeholder="Type the announcement here..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="min-h-25"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Post"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {announcements.length === 0 ? (
        <div className="text-sm text-muted-foreground italic p-6 text-center bg-card rounded-xl border border-border/70">
          No announcements have been posted yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {visibleAnnouncements.map((announcement) => (
            <Announcement
              key={announcement.id}
              clubSlug={clubSlug}
              announcement={announcement}
              isAdmin={isAdmin}
              membersMap={membersMap}
              onDelete={removeAnnouncementFromState}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="pt-6 pb-1 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-brand-orange hover:text-brand-orange/80 hover:bg-transparent p-0 h-auto font-semibold cursor-pointer inline-flex items-center gap-1"
          >
            {showAll ? (
              <><span>Show less</span><ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <><span>Show more ({announcements.length - INITIAL_VISIBLE_COUNT} more)</span><ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
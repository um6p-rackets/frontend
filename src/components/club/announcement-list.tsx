'use client';

import { useState, useEffect } from 'react';
import { Card, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { api } from '@/lib/api/api';

export interface AnnouncementWithAuthor {
  id: number;
  club_id: number;
  announcer_id: number;
  description: string;
  created_at: string;
  announcer: {
    id: number;
    login: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    department: string | null;
    member_id: number;
  } | null;
}

function Announcement({
  announcement
}: {
  announcement: AnnouncementWithAuthor;
}) {
  const dateStr = new Date(announcement.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const firstName = announcement.announcer?.first_name?.trim();
  const lastName = announcement.announcer?.last_name?.trim();
  const login = announcement.announcer?.login?.trim();
  
  const displayName = [firstName, lastName].filter(Boolean).join(' ') || login || 'Club Admin';

  return (
    <Card className="p-4 gap-2 flex flex-col justify-between items-start m-0 w-full bg-card border border-border/70 rounded-xl shadow-2xs">
      <CardDescription className="text-sm sm:text-base text-foreground font-medium leading-relaxed whitespace-pre-wrap">
        {announcement.description}
      </CardDescription>
      
      <div className="flex justify-between w-full text-xs text-muted-foreground/80 pt-1 mt-3 border-t border-border/40">
        <span className="italic font-medium">
          By {displayName}
        </span>
        <span className="font-semibold">{dateStr}</span>
      </div>
    </Card>
  );
}

export default function AnnouncementList({
  clubSlug 
}: {
  clubSlug: string; 
}) {
  const [announcements, setAnnouncements] = useState<AnnouncementWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  
  const INITIAL_VISIBLE_COUNT = 3;

  useEffect(() => {
    async function fetchAnnouncements() {
      if (!clubSlug) {
        setIsLoading(false);
        return;
      }
      
      try {
        const res = await api<{ data: AnnouncementWithAuthor[] }>(`/clubs/${clubSlug}/announcements?limit=20&page=1`);
        setAnnouncements(res.data || []);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAnnouncements();
  }, [clubSlug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic p-6 text-center bg-card rounded-xl border border-border/70">
        No announcements have been posted yet.
      </div>
    );
  }

  const visibleAnnouncements = showAll ? announcements : announcements.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = announcements.length > INITIAL_VISIBLE_COUNT;

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className="grid grid-cols-1 gap-4">
        {visibleAnnouncements.map((announcement) => (
          <Announcement key={announcement.id} announcement={announcement} />
        ))}
      </div>

      {hasMore && (
        <div className="pt-3 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="w-full border-border/70 bg-card hover:bg-card hover:text-brand-orange hover:border-brand-orange/40 text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 py-2 cursor-pointer shadow-2xs transition-colors"
          >
            {showAll ? (
              <>
                <span>Show less</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Show more ({announcements.length - INITIAL_VISIBLE_COUNT} more)</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

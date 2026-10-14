'use client';

import { useState } from 'react';
import { ClubPageData } from '@/types/mock-data-types';
import { Card, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

function Announcement({
  announcement
}: {
  announcement: ClubPageData['announcements'][0];
}) {
  return (
    <Card className="p-4 gap-2 flex flex-col justify-between items-start m-0 w-full bg-card border border-border/70 rounded-xl shadow-2xs">
      <CardTitle className="font-bold text-base sm:text-lg text-foreground">{announcement.title}</CardTitle>
      <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {announcement.content}
      </CardDescription>
      <div className="text-xs text-muted-foreground/80 w-full text-right pt-1">
        {announcement.date}
      </div>
    </Card>
  );
}

export default function AnnouncementList({
  announcements
}: {
  announcements: ClubPageData['announcements'];
}) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_VISIBLE_COUNT = 3;
  const items = announcements || [];
  const visibleAnnouncements = showAll ? items : items.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = items.length > INITIAL_VISIBLE_COUNT;

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className="grid grid-cols-1 gap-4">
        {visibleAnnouncements.map((announcement, index) => (
          <Announcement key={index} announcement={announcement} />
        ))}
      </div>

      {hasMore && (
        <div className="pt-3 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="w-full border-border/70 bg-card hover:bg-card hover:text-accent hover:border-accent/40 text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 py-2 cursor-pointer shadow-2xs transition-colors"
          >
            {showAll ? (
              <>
                <span>Show less</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Show more ({items.length - INITIAL_VISIBLE_COUNT} more)</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

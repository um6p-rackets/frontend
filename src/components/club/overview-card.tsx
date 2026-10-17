'use client';

import { useState } from 'react';
import { Users, Whistle, UserPlus, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { cn } from 'cn';

export default function OverviewCard({
  clubName,
  desc,
  members,
  coach,
}: {
  clubName?: string;
  clubSlug?: string;
  desc: string;
  members: number;
  coach: string;
  imageUrl?: string;
}) {
  const [isRequested, setIsRequested] = useState(false);

  return (
    <Card className="p-4 sm:p-7 rounded-xl sm:rounded-2xl border border-border/70 shadow-2xs bg-card sm:bg-gray-50 dark:bg-gray-800/80">

      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
        {clubName ? `${clubName} Club Overview` : 'Official Campus Club'}
      </h2>

      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mb-5 sm:mb-6">
        {desc}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0 shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base text-foreground leading-tight">
                {members}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Active Members</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0 shadow-2xs">
              <Whistle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base text-foreground leading-tight whitespace-nowrap">
                {coach}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Head Coach</div>
            </div>
          </div>
        </div>

        {/* <Button
          variant="accent"
          onClick={() => setIsRequested((prev) => !prev)}
          className={cn(
            'w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 font-bold text-sm sm:text-base rounded-md',
            'shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/40 active:scale-[0.98]',
            'transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 shrink-0',
            isRequested && 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
          )}
        >
          {isRequested ? (
            <>
              <Check className="w-5 h-5 shrink-0" />
              <span>Request Sent</span>
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 shrink-0" />
              <span>Request to Join</span>
            </>
          )}
        </Button> */}
      </div>
    </Card>
  );
}

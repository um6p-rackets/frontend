import { Users, Whistle } from 'lucide-react';
import { Card } from '../ui/card';

export default function OverviewCard({
  clubName,
  desc,
  members,
  coach,
}: {
  clubName?: string;
  desc: string;
  members: number;
  coach: string;
}) {
  return (
    <Card className="p-4 sm:p-7 rounded-xl sm:rounded-2xl border border-border/70 shadow-2xs bg-card sm:bg-gray-50 dark:bg-gray-800/80 w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
        {clubName ? `${clubName} Club Overview` : 'Official Campus Club'}
      </h2>

      {/* Removed max-w-2xl so description takes the full width of the card */}
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed w-full mb-5 sm:mb-6 break-words">
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
      </div>
    </Card>
  );
}

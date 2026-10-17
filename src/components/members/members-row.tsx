import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface ClubMember {
  id: number;
  role: number;
  joined_at: string;
  user: {
    id: number;
    login: string;
    first_name: string;
    last_name: string;
    department?: string | null;
    avatar?: string | null;
  };
}

export default function MembersRow({ member }: { member: ClubMember }) {
  const rowBg = 'bg-brand-cream/20 hover:bg-muted';
  const cardBg = 'bg-brand-cream/20 border-border hover:border-brand-orange/60';

  const joinDate = new Date(member.joined_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const displayName = `${member.user.first_name} ${member.user.last_name}`;
  
  let roleBadge = <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-[10px] font-black italic">MEMBER</span>;
  if (member.role === 2) {
    roleBadge = <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-[10px] font-black italic">COACH</span>;
  } else if (member.role === 1) {
    roleBadge = <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-[10px] font-black italic">LEADER</span>;
  }

  return (
    <>
      {/* Mobile Card View (< md) */}
      <Link
        href={`/profile/${member.user.id}`}
        className={`md:hidden relative flex flex-col p-4 rounded-xl border transition-all cursor-pointer shadow-2xs hover:shadow-md ${cardBg}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="w-12 h-12 border-2 border-background shadow-xs shrink-0">
              <AvatarImage src={member.user.avatar || undefined} alt={displayName} />
              <AvatarFallback className="bg-brand-cream text-brand-orange font-bold text-sm">
                {member.user.first_name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div 
                className="font-bold text-brand-ink italic text-sm truncate leading-tight group-hover:text-brand-orange"
                title={displayName}
              >
                {displayName}
              </div>
              <div 
                className="font-semibold text-muted-foreground italic text-xs truncate mt-0.5"
                title={`@${member.user.login}`}
              >
                @{member.user.login}
              </div>
              <div 
                className="font-semibold text-muted-foreground italic text-[10px] truncate mt-0.5"
                title={member.user.department || 'No Dept'}
              >
                {member.user.department || 'No Dept'}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 pl-2">
            {roleBadge}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 mt-3 pt-2.5 border-t border-border/40">
          <div className="flex justify-between items-center bg-background/70 rounded-lg px-3 py-2 border border-border/50">
            <span className="text-[9px] font-black text-muted-foreground italic tracking-wider">
              JOINED DATE
            </span>
            <span className="font-bold text-brand-ink italic text-xs">
              {joinDate}
            </span>
          </div>
        </div>
      </Link>

      {/* Desktop Row View (>= md) */}
      <Link
        href={`/profile/${member.user.id}`}
        className={`hidden md:flex relative flex-col justify-center px-4 sm:px-6 py-2.5 sm:py-4 rounded-xl transition-all cursor-pointer hover:shadow-xs ${rowBg}`}
      >
        <div className="grid grid-cols-[90px_2fr_1fr_1.5fr_1fr] items-center gap-4 w-full">
          
          {/* Role */}
          <div className="font-bold text-sm shrink-0">
            {roleBadge}
          </div>

          {/* Member Info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-background shadow-sm shrink-0">
              <AvatarImage src={member.user.avatar || undefined} alt={displayName} />
              <AvatarFallback className="bg-brand-cream text-brand-orange font-bold text-xs sm:text-base">
                {member.user.first_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span 
              className="font-bold text-brand-ink italic text-xs sm:text-base truncate pr-2 sm:pr-3 hover:text-brand-orange transition-colors"
              title={displayName}
            >
              {displayName}
            </span>
          </div>

          {/* Login (Added min-w-0 and title) */}
          <div 
            className="font-bold text-muted-foreground italic text-[11px] sm:text-sm truncate min-w-0"
            title={`@${member.user.login}`}
          >
            @{member.user.login}
          </div>

          {/* Department (Added min-w-0 and title) */}
          <div 
            className="font-bold text-muted-foreground italic text-[11px] sm:text-sm truncate min-w-0"
            title={member.user.department || 'No Dept'}
          >
            {member.user.department || '-'}
          </div>

          {/* Joined Date */}
          <div className="font-bold text-muted-foreground italic text-[11px] sm:text-sm truncate min-w-0">
            {joinDate}
          </div>

        </div>
      </Link>
    </>
  );
}
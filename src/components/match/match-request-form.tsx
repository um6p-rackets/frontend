'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowUpRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/lib/api/api';
import { MatchMode, MatchRequestBody } from '@/types/contracts/club';

import MatchDisciplineCard from './match-discipline-card';
import MatchPlayerCard from './match-player-card';
import MatchDateTimeSection from './match-datetime-section';
import MemberSearchModal from './member-search-modal';

export default function MatchRequestForm({
  clubSlug,
  currentMemberId,
  currentUserName,
  currentUserDepartment,
  currentUserAvatar,
}: {
  clubSlug: string;
  currentMemberId: number;
  currentUserName: string;
  currentUserDepartment?: string | null;
  currentUserAvatar?: string | null;
}) {
  const router = useRouter();
  const [matchMode, setMatchMode] = useState<MatchMode>(MatchMode.SINGLES);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state tracking actual member IDs, names, departments, and avatars
  const [partnerId, setPartnerId] = useState<number | undefined>(undefined);
  const [partnerName, setPartnerName] = useState<string>('');
  const [partnerDept, setPartnerDept] = useState<string>('');
  const [partnerAvatar, setPartnerAvatar] = useState<string | null>(null);
  
  const [opponentIds, setOpponentIds] = useState<number[]>([]);
  const [opponentNames, setOpponentNames] = useState<string[]>([]);
  const [opponentDepts, setOpponentDepts] = useState<string[]>([]);
  const [opponentAvatars, setOpponentAvatars] = useState<(string | null)[]>([]);

  const [location, setLocation] = useState<string>('Court 1 - Central Glass Court (UM6P Sports Pavilion)');
  
  // Date & Time states
  const [matchDate, setMatchDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('18:30');

  const [activeModalTarget, setActiveModalTarget] = useState<'partner' | 'opponent_1' | 'opponent_2' | null>(null);

  const handleSelectMemberResult = (memberId: number, memberName: string, department: string, avatarUrl: string | null) => {
    // Explicitly fallback department to "Sport Department" if empty, null, or whitespace
    const validDept = department && department.trim() !== '' ? department : 'Sport Department';

    if (activeModalTarget === 'partner') {
      setPartnerId(memberId);
      setPartnerName(memberName);
      setPartnerDept(validDept);
      setPartnerAvatar(avatarUrl);
    } else if (activeModalTarget === 'opponent_1') {
      setOpponentIds(prev => [memberId, prev[1]].filter(Boolean) as number[]);
      setOpponentNames(prev => [memberName, prev[1]].filter(Boolean) as string[]);
      setOpponentDepts(prev => [validDept, prev[1]].filter(Boolean) as string[]);
      setOpponentAvatars(prev => [avatarUrl, prev[1]].filter(Boolean) as (string | null)[]);
    } else if (activeModalTarget === 'opponent_2') {
      setOpponentIds(prev => [prev[0], memberId].filter(Boolean) as number[]);
      setOpponentNames(prev => [prev[0], memberName].filter(Boolean) as string[]);
      setOpponentDepts(prev => [prev[0], validDept].filter(Boolean) as string[]);
      setOpponentAvatars(prev => [prev[0], avatarUrl].filter(Boolean) as (string | null)[]);
    }
    setActiveModalTarget(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (matchMode === MatchMode.DOUBLES && !partnerId) {
      toast.error("Please select a partner for doubles match.");
      return;
    }

    const requiredOpponentsCount = matchMode === MatchMode.SINGLES ? 1 : 2;
    if (opponentIds.length < requiredOpponentsCount) {
      toast.error(`Please select ${requiredOpponentsCount} opponent(s).`);
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time.");
      return;
    }

    setIsSubmitting(true);

    try {
      const [hours, minutes] = startTime.split(':').map(Number);
      const scheduledDateTime = new Date(matchDate);
      scheduledDateTime.setHours(hours, minutes, 0, 0);

      if (scheduledDateTime < new Date()) {
        toast.error("Match scheduled time must be in the future.");
        setIsSubmitting(false);
        return;
      }

      const payload: MatchRequestBody = {
        mode: matchMode,
        partner_id: matchMode === MatchMode.DOUBLES ? partnerId : undefined,
        opponent_ids: opponentIds.slice(0, requiredOpponentsCount),
        location,
        scheduled_at: scheduledDateTime.toISOString(),
      };

      await api(`/clubs/${clubSlug}/matches/request`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      toast.success("Match request sent successfully!", {
        description: "Teams and pending match created. Notified coaches/leaders for validation.",
      });

      router.push(`/clubs/${clubSlug}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to send match request";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const excludedIds = [currentMemberId, partnerId, ...opponentIds].filter(Boolean) as number[];

  // Formatted department display check for current user card
  const formattedUserDept = currentUserDepartment && currentUserDepartment.trim() !== '' 
    ? currentUserDepartment 
    : 'Sport Department';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black italic tracking-tight text-foreground">
          Schedule <span className="text-brand-orange">A</span> Match
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Challenge fellow campus athletes, set your match format, and climb the UM6P Elo ladder on official campus courts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Step 1: Select Discipline */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white font-bold flex items-center justify-center text-sm">1</div>
            <div>
              <h2 className="font-bold text-lg text-foreground">Select Match Discipline</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Choose your match structure to calibrate official Elo point redistribution.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <MatchDisciplineCard
              mode={MatchMode.SINGLES}
              currentMode={matchMode}
              title="Single Match"
              description="Fast 1-on-1 ranking duel against one campus opponent on singles ladder."
              onSelect={() => {
                setMatchMode(MatchMode.SINGLES);
                setPartnerId(undefined);
                setPartnerName('');
                setPartnerDept('');
                setPartnerAvatar(null);
                setOpponentIds(opponentIds.slice(0, 1));
                setOpponentNames(opponentNames.slice(0, 1));
                setOpponentDepts(opponentDepts.slice(0, 1));
                setOpponentAvatars(opponentAvatars.slice(0, 1));
              }}
            />
            <MatchDisciplineCard
              mode={MatchMode.DOUBLES}
              currentMode={matchMode}
              title="Double Match"
              description="Collaborative 2-on-2 campus duel calibrated for pairs ladder rating."
              onSelect={() => setMatchMode(MatchMode.DOUBLES)}
            />
          </div>
        </div>

        {/* Step 2: Select Players & Teams */}
        <div className="space-y-4 pt-4 border-t border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white font-bold flex items-center justify-center text-sm">2</div>
            <div>
              <h2 className="font-bold text-lg text-foreground">Select Players & Teams</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Lock your position and recruit your opponent(s) from campus rankings.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 relative">
            
            {/* Team 1 • Your Side */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-muted-foreground italic">Team 1 • Your Side</span>
              
              <MatchPlayerCard
                name={currentUserName}
                subtitle={formattedUserDept}
                badgeText="1200 PTS"
                avatarUrl={currentUserAvatar}
              />

              {matchMode === MatchMode.DOUBLES && (
                <MatchPlayerCard
                  type="empty"
                  name={partnerId ? partnerName : 'Choose Teammate'}
                  subtitle={partnerId ? partnerDept : '+ Add Teammate'}
                  avatarUrl={partnerAvatar}
                  onClick={() => setActiveModalTarget('partner')}
                />
              )}
            </div>

            {/* VS Badge */}
            <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-foreground text-background font-black text-xs items-center justify-center z-20 shadow-md transition-all duration-300 ${
              matchMode === MatchMode.SINGLES ? "top-17" : "top-[59%]"
            }`}>
              VS
            </div>

            {/* Team 2 • Opponents */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-muted-foreground italic">Team 2 • Opponents</span>

              <MatchPlayerCard
                type="empty"
                name={opponentIds[0] ? opponentNames[0] : 'Choose Opponent'}
                subtitle={opponentIds[0] ? opponentDepts[0] : 'click and search'}
                avatarUrl={opponentAvatars[0]}
                onClick={() => setActiveModalTarget('opponent_1')}
              />

              {matchMode === MatchMode.DOUBLES && (
                <MatchPlayerCard
                  type="empty"
                  name={opponentIds[1] ? opponentNames[1] : 'Choose Opponent 2'}
                  subtitle={opponentIds[1] ? opponentDepts[1] : 'click and search'}
                  avatarUrl={opponentAvatars[1]}
                  onClick={() => setActiveModalTarget('opponent_2')}
                />
              )}
            </div>

          </div>
        </div>

        {/* Step 3: Select Date & Time */}
        <div className="space-y-4 pt-4 border-t border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white font-bold flex items-center justify-center text-sm">3</div>
            <div>
              <h2 className="font-bold text-lg text-foreground">Select Date & Time</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Pick match session timing and official UM6P campus court venue.</p>
            </div>
          </div>

          <MatchDateTimeSection
            matchDate={matchDate}
            setMatchDate={setMatchDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            location={location}
            setLocation={setLocation}
          />
        </div>

        {/* Footer Notice & Submit Button */}
        <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Official Elo match rating will automatically update upon match validation.</span>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto h-12 px-8 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold italic tracking-wide shadow-md"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending Request...</>
            ) : (
              <>Send Request <ArrowUpRight className="w-4 h-4 ml-1" /></>
            )}
          </Button>
        </div>

      </form>

      <MemberSearchModal
        clubSlug={clubSlug}
        isOpen={activeModalTarget !== null}
        onClose={() => setActiveModalTarget(null)}
        onSelectMember={handleSelectMemberResult}
        excludeMemberIds={excludedIds}
        title={activeModalTarget === 'partner' ? 'Select Your Teammate' : 'Select Opponent'}
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, CheckCircle, Plus, History, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import ClubTitle from '@/components/club/club-title';
import OverviewCard from '@/components/club/overview-card';
import ClubTaps from '@/components/club/taps';
import Leaderboard from '@/components/club/leaderboard';
import AcceptMatchModal from '@/components/club/accept-match-modal';
import AcceptJoinModal from '@/components/club/accept-join-modal';
import ManageLeadersModal from '@/components/club/manage-leaders-modal';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useClub } from '@/hooks/use-clubs';
import { mockClubData } from '@/lib/mock-data';
import { useAuth } from '@/store/auth';

import { getClubStatus, joinClub } from '@/lib/api/club';

export default function ClubPage() {
  const params = useParams<{ name: string }>();
  const clubSlug = params?.name ?? 'tennis';
  const queryClient = useQueryClient();

  const user = useAuth((state) => state.user);
  
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isAcceptJoinModalOpen, setIsAcceptJoinModalOpen] = useState(false);
  const [isSetLeaderModalOpen, setIsSetLeaderModalOpen] = useState(false);

  const { data: apiClub, isLoading: isClubLoading } = useClub(clubSlug);

  const { data: status, isLoading: isChecking } = useQuery({
    queryKey: ['club-status', clubSlug, user?.id],
    queryFn: async () => {
      const res = await getClubStatus(clubSlug);
      return res as { is_member: boolean; role?: number; member_id?: number; has_pending_request?: boolean };
    },
    enabled: !!user,
  });

  const currentMemberId = status?.member_id ?? 0;

  const joinMutation = useMutation({
    mutationFn: () => joinClub(clubSlug),
    onSuccess: () => {
      toast.success('Join request sent successfully.');
      queryClient.invalidateQueries({ queryKey: ['club-status', clubSlug, user?.id] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to send join request.');
    },
  });

  const clubName = apiClub?.name || clubSlug;
  const description = apiClub?.description || 'Welcome to the official campus club.';
  const members = (apiClub as { members_count?: number })?.members_count || 0;

  const rawCoach = (apiClub as { coach?: { first_name?: string; last_name?: string; login?: string } | null })?.coach;
  const coach: string = rawCoach
    ? ([rawCoach.first_name, rawCoach.last_name].filter(Boolean).join(' ') || rawCoach.login || "Pending")
    : "Pending";

  const isLoggedIn = !!user;
  const isMemberOrStaff = isLoggedIn && status?.is_member && (status.role === 0 || status.role === 1 || status.role === 2);
  const isStaffOnly = isLoggedIn && status?.is_member && (status.role === 1 || status.role === 2);
  const isCoachOnly = isLoggedIn && status?.is_member && status.role === 2;

  const actionButtons = isMemberOrStaff ? (
    <>
      <Link
        href={`/clubs/${clubSlug}/match`}
        className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs tracking-wide shadow-xs transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Request Match
      </Link>

      <Link
        href={`/clubs/${clubSlug}/match/history`}
        className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-border/70 hover:border-brand-orange bg-card text-foreground font-semibold text-xs transition-colors shadow-xs"
      >
        <History className="w-3.5 h-3.5 text-muted-foreground" /> Match History
      </Link>

      {isStaffOnly && (
        <>
          <button
            onClick={() => setIsAcceptModalOpen(true)}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-border/70 hover:border-brand-orange bg-card text-foreground font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Accept Match
          </button>

          <button
            onClick={() => setIsAcceptJoinModalOpen(true)}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-border/70 hover:border-brand-orange bg-card text-foreground font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-brand-orange" /> Accept Join Request
          </button>
        </>
      )}

      {isCoachOnly && (
        <button
          onClick={() => setIsSetLeaderModalOpen(true)}
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-border/70 hover:border-brand-orange bg-card text-foreground font-semibold text-xs transition-colors shadow-xs cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Set Leader
        </button>
      )}
    </>
  ) : null;

  return (
    <div className="w-[92%] lg:w-[70%] mx-auto pb-20">
      {isClubLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="size-10 animate-spin text-brand-orange" />
        </div>
      ) : (
        <>
          <ClubTitle name={clubName} slug={clubSlug} />

          <section className="relative mt-4"> 
            <OverviewCard
              clubName={clubName}
              desc={description}
              coach={coach}
              members={members}
              actions={actionButtons}
            />
          </section>

          {isChecking ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="size-10 animate-spin text-brand-orange" />
            </div>
          ) : status?.is_member ? (
            <div className="w-full flex flex-col items-center justify-center mt-10 sm:mt-12">
              <div className="w-full flex justify-start mb-4 gap-2">
                {status.role === 2 && <Badge className="bg-blue-500 text-white">Coach Access</Badge>}
                {status.role === 1 && <Badge className="bg-purple-500 text-white">Leader Access</Badge>}
                {status.role === 0 && <Badge className="bg-green-500 text-white">Active Member</Badge>}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch justify-center w-full animate-in fade-in duration-500">
                <section className="lg:h-full flex flex-col min-w-0">
                  <ClubTaps clubSlug={clubSlug} userRole={status.role} />
                </section>
                <section className="self-start w-full min-w-0">
                  <Leaderboard top_members={mockClubData.top_members} />
                </section>
              </div>
            </div>
          ) : (
            <div className="mt-10 sm:mt-12 flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/60 rounded-3xl bg-muted/10 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-orange-50 text-brand-orange rounded-full flex items-center justify-center mb-6 shadow-sm border border-orange-200/60">
                <Lock className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black italic text-brand-ink mb-3">Members Only</h2>
              <p className="text-muted-foreground font-medium max-w-md mb-8 text-sm sm:text-base">
                You must be an active member to view sessions, leaderboards, and book matches for {clubName}.
              </p>

              {joinMutation.isPending ? (
                <div className="inline-flex items-center gap-2 px-6 py-4 bg-green-50 text-green-700 border border-green-200 rounded-xl font-bold text-base shadow-sm">
                  <Loader2 className="size-5 animate-spin" /> Requesting to Join...
                </div>
              ) : status?.has_pending_request ? (
                <div className="inline-flex items-center gap-2 px-6 py-4 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-bold text-base shadow-sm">
                  Requested
                </div>
              ) : (
                <Button 
                  onClick={() => joinMutation.mutate()} 
                  disabled={joinMutation.isPending}
                  className="h-12 px-10 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-black italic text-base tracking-wide shadow-md shadow-brand-orange/20 cursor-pointer"
                >
                  Join Club Now
                </Button>
              )}
            </div>
          )}
        </>
      )}

      {/* MODAL COMPONENTS */}
      <AcceptMatchModal
        clubSlug={clubSlug}
        currentMemberId={currentMemberId}
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
      />

      <AcceptJoinModal
        clubSlug={clubSlug}
        isOpen={isAcceptJoinModalOpen}
        onClose={() => setIsAcceptJoinModalOpen(false)}
      />

      <ManageLeadersModal
        clubSlug={clubSlug}
        currentMemberId={currentMemberId}
        isOpen={isSetLeaderModalOpen}
        onClose={() => setIsSetLeaderModalOpen(false)}
      />
    </div>
  );
}

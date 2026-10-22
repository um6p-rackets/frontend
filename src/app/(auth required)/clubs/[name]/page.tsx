'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, Plus, History, CheckCircle2, UserCheck, ShieldCheck, MoreVertical, LogOut, UserMinus, UserX } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useClub } from '@/hooks/use-clubs';
import { mockClubData } from '@/lib/mock-data';
import { useAuth } from '@/store/auth';

import { getClubStatus, joinClub } from '@/lib/api/club';
import { api } from '@/lib/api/api';

export default function ClubPage() {
  const params = useParams<{ name: string }>();
  const clubSlug = params?.name ?? 'tennis';
  const queryClient = useQueryClient();

  const user = useAuth((state) => state.user);
  
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isAcceptJoinModalOpen, setIsAcceptJoinModalOpen] = useState(false);
  const [isSetLeaderModalOpen, setIsSetLeaderModalOpen] = useState(false);
  const [isRemoveLeaderModalOpen, setIsRemoveLeaderModalOpen] = useState(false);
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);

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

  const cancelJoinMutation = useMutation({
    mutationFn: async () => {
      await api(`/clubs/${clubSlug}/join`, { method: 'DELETE' });
    },
    onSuccess: () => {
      toast.success('Join request cancelled.');
      queryClient.invalidateQueries({ queryKey: ['club-status', clubSlug, user?.id] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to cancel join request.');
    },
  });

  const leaveClubMutation = useMutation({
    mutationFn: async () => {
      if (!currentMemberId) throw new Error('Member ID not found.');
      await api(`/clubs/${clubSlug}/members/${currentMemberId}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      toast.success('You have left the club.');
      queryClient.invalidateQueries({ queryKey: ['club-status', clubSlug, user?.id] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to leave club.');
    },
  });

  // Extract club details including coach full name from the database response
  const clubData = apiClub as { 
    name?: string; 
    description?: string; 
    members_count?: number; 
    coach_full_name?: string | null; 
  } | undefined;

  const clubName = clubData?.name || clubSlug;
  const description = clubData?.description || 'Welcome to the official campus club.';
  const members = clubData?.members_count || 0;
  const coach = clubData?.coach_full_name || 'Pending';

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

      {/* DROPDOWN MENU FOR MANAGEMENT & ACTIONS */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-border/70 hover:border-brand-orange bg-card text-foreground transition-colors shadow-xs cursor-pointer focus-visible:outline-none"
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          }
        />
        <DropdownMenuContent className="w-52" align="end">
          <DropdownMenuGroup>
            {isStaffOnly && (
              <>
                <DropdownMenuItem onClick={() => setIsAcceptModalOpen(true)} className="cursor-pointer font-medium text-xs gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Accept Match
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAcceptJoinModalOpen(true)} className="cursor-pointer font-medium text-xs gap-2">
                  <UserCheck className="w-4 h-4 text-brand-orange" /> Accept Join Request
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsRemoveMemberModalOpen(true)} className="cursor-pointer font-medium text-xs gap-2">
                  <UserX className="w-4 h-4 text-red-500" /> Remove Member
                </DropdownMenuItem>
              </>
            )}

            {isCoachOnly && (
              <>
                <DropdownMenuItem onClick={() => setIsSetLeaderModalOpen(true)} className="cursor-pointer font-medium text-xs gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" /> Set Leader
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsRemoveLeaderModalOpen(true)} className="cursor-pointer font-medium text-xs gap-2">
                  <UserMinus className="w-4 h-4 text-amber-500" /> Remove Leader
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem 
              onClick={() => leaveClubMutation.mutate()} 
              disabled={leaveClubMutation.isPending}
              className="cursor-pointer font-semibold text-xs text-destructive hover:text-white hover:bg-destructive focus:text-white focus:bg-destructive gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Leave Club
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
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

              {joinMutation.isPending || cancelJoinMutation.isPending ? (
                <div className="inline-flex items-center gap-2 px-6 py-4 bg-orange-50 text-brand-orange border border-orange-200 rounded-xl font-bold text-base shadow-sm">
                  <Loader2 className="size-5 animate-spin" /> Processing...
                </div>
              ) : status?.has_pending_request ? (
                <Button 
                  onClick={() => cancelJoinMutation.mutate()} 
                  disabled={cancelJoinMutation.isPending}
                  className="h-12 px-8 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 font-bold text-base transition-all shadow-sm cursor-pointer"
                >
                  Cancel Request
                </Button>
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

      {/* MODAL / SHEET COMPONENTS */}
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

      {/* Set Leader Sheet */}
      <ManageLeadersModal
        clubSlug={clubSlug}
        currentMemberId={currentMemberId}
        isOpen={isSetLeaderModalOpen}
        onClose={() => setIsSetLeaderModalOpen(false)}
        mode="set"
      />

      {/* Remove Leader Sheet */}
      <ManageLeadersModal
        clubSlug={clubSlug}
        currentMemberId={currentMemberId}
        isOpen={isRemoveLeaderModalOpen}
        onClose={() => setIsRemoveLeaderModalOpen(false)}
        mode="remove"
      />

      {/* Remove Member Sheet */}
      <ManageLeadersModal
        clubSlug={clubSlug}
        currentMemberId={currentMemberId}
        isOpen={isRemoveMemberModalOpen}
        onClose={() => setIsRemoveMemberModalOpen(false)}
        mode="remove-member"
      />
    </div>
  );
}
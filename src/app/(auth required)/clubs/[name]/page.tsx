"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Loader2,
  Plus,
  History,
} from "lucide-react";

import ClubTitle from '@/components/club/club-title';
import OverviewCard from '@/components/club/overview-card';
import ClubTaps from '@/components/club/taps';
import Leaderboard from '@/components/club/leaderboard';
import AcceptMatchModal from '@/components/club/accept-match-modal';
import AcceptJoinModal from '@/components/club/accept-join-modal';
import ManageLeadersModal from '@/components/club/manage-leaders-modal';
import EditClubModal from '@/components/club/edit-club-modal';
import ClubDropdownMenu from '@/components/club/club-dropdown-menu';

import { Button } from "@/components/ui/button";

import {
  useClub,
  useClubStatus,
  useJoinClub,
  useCancelJoinClub,
  useLeaveClub,
} from "@/hooks/use-clubs";
import { ApiError } from "@/lib/api/api";
import { mockClubData } from "@/lib/mock-data";

export default function ClubPage() {
  const { name: clubSlug } = useParams<{ name: string }>();

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isAcceptJoinModalOpen, setIsAcceptJoinModalOpen] = useState(false);
  const [isSetLeaderModalOpen, setIsSetLeaderModalOpen] = useState(false);
  const [isRemoveLeaderModalOpen, setIsRemoveLeaderModalOpen] = useState(false);
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);

  const { data: club, isLoading: isClubLoading, isError, error, refetch } = useClub(clubSlug);

  const {
    data: status,
    isLoading: isChecking,
    isError: isStatusError,
    refetch: refetchStatus,
  } = useClubStatus(clubSlug);

  const currentMemberId = status?.member_id ?? 0;

  const join = useJoinClub(clubSlug);
  const cancelJoin = useCancelJoinClub(clubSlug);
  const leave = useLeaveClub(clubSlug);

  if (isError) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <div className="w-[92%] lg:w-[70%] mx-auto py-24 text-center">
        <h2 className="text-2xl font-black mb-2">
          {notFound ? "Club not found" : "Could not load this club"}
        </h2>
        {!notFound && (
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  const clubName = club?.name ?? clubSlug;
  const membersCount = club?.members_count ?? 0;
  const description = club?.description ?? `Welcome to ${clubName} campus club.`;
  const coachFullName = club?.coach_full_name ?? "N/A";

  const isMember = !!status?.is_member;
  const isStaffOnly = isMember && (status?.role === 1 || status?.role === 2);
  const isCoachOnly = isMember && status?.role === 2;

  // Bottom action buttons (Request Match, Match History, Dropdown)
  const actionButtons = isMember ? (
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

      <ClubDropdownMenu
        isStaffOnly={isStaffOnly}
        isCoachOnly={isCoachOnly}
        isLeavePending={leave.isPending}
        onOpenAcceptModal={() => setIsAcceptModalOpen(true)}
        onOpenAcceptJoinModal={() => setIsAcceptJoinModalOpen(true)}
        onOpenRemoveMemberModal={() => setIsRemoveMemberModalOpen(true)}
        onOpenSetLeaderModal={() => setIsSetLeaderModalOpen(true)}
        onOpenRemoveLeaderModal={() => setIsRemoveLeaderModalOpen(true)}
        onLeaveClub={() => leave.mutate()}
      />
    </>
  ) : null;

  const topActionSlot = isCoachOnly ? (
    <EditClubModal
      clubSlug={clubSlug}
      currentName={clubName}
      currentDescription={description}
    />
  ) : null;

  return (
    <div className="w-[92%] xl:w-[80%] mx-auto pb-20">
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
              coach={coachFullName}
              members={membersCount}
              actions={actionButtons}
              topAction={topActionSlot}
            />
          </section>

          {isChecking ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="size-10 animate-spin text-brand-orange" />
            </div>
          ) : isStatusError ? (
            <div className="mt-10 text-center">
              <p className="text-muted-foreground mb-4">Could not check your membership.</p>
              <Button variant="outline" onClick={() => refetchStatus()}>
                Retry
              </Button>
            </div>
          ) : status?.is_member ? (
            <div className="w-full flex flex-col items-center justify-center mt-10 sm:mt-12">
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
              <div className="w-20 h-20 bg-orange-50 dark:bg-orange-950/40 text-brand-orange rounded-full flex items-center justify-center mb-6 shadow-sm border border-orange-200/60 dark:border-orange-900/40">
                <Lock className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black italic text-brand-ink dark:text-white mb-3">
                Members Only
              </h2>
              <p className="text-muted-foreground font-medium max-w-md mb-8 text-sm sm:text-base">
                You must be an active member to view sessions, leaderboards, and book matches for{" "}
                {clubName}.
              </p>

              {join.isPending || cancelJoin.isPending ? (
                <div className="inline-flex items-center gap-2 px-6 py-4 bg-orange-50 text-brand-orange border border-orange-200 rounded-xl font-bold text-base shadow-sm">
                  <Loader2 className="size-5 animate-spin" /> Processing...
                </div>
              ) : status?.has_pending_request ? (
                <Button
                  onClick={() => cancelJoin.mutate()}
                  className="h-12 px-8 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 font-bold text-base transition-all shadow-sm cursor-pointer"
                >
                  Cancel Request
                </Button>
              ) : (
                <Button
                  onClick={() => join.mutate()}
                  className="h-12 px-10 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-black italic text-base tracking-wide shadow-md shadow-brand-orange/20 cursor-pointer"
                >
                  Join Club Now
                </Button>
              )}
            </div>
          )}
        </>
      )}

      {/* Modals */}
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
        mode="set"
      />

      <ManageLeadersModal
        clubSlug={clubSlug}
        currentMemberId={currentMemberId}
        isOpen={isRemoveLeaderModalOpen}
        onClose={() => setIsRemoveLeaderModalOpen(false)}
        mode="remove"
      />

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

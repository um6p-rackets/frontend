'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Lock, Loader2, CheckCircle } from 'lucide-react';

import ClubTitle from '@/components/club/club-title';
import OverviewCard from '@/components/club/overview-card';
import ClubTaps from '@/components/club/taps';
import Leaderboard from '@/components/club/leaderboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useClub } from '@/hooks/use-clubs';
import { mockClubData } from '@/lib/mock-data'; 
import { useAuth } from '@/store/auth';

import { getClubStatus, joinClub } from '@/lib/api/club'; 

export default function ClubPage() {
  const params = useParams<{ name: string }>();
  const clubSlug = params?.name ?? 'tennis';

  const user = useAuth((state) => state.user);
  
  const { data: apiClub, isLoading: isClubLoading } = useClub(clubSlug);

  console.log("API Club Data Response:", apiClub);

  const [status, setStatus] = useState<{ is_member: boolean; role?: number } | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [joinStatus, setJoinStatus] = useState<"idle" | "pending" | "success">("idle");

  const clubName = apiClub?.name || clubSlug;
  const description = apiClub?.description || 'Welcome to the official campus club.';
  const members = (apiClub as { members_count?: number })?.members_count || 0; 
  
  const rawCoach = (apiClub as { coach?: { first_name?: string; last_name?: string; login?: string } | null })?.coach;
  const coach: string = rawCoach 
    ? ([rawCoach.first_name, rawCoach.last_name].filter(Boolean).join(' ') || rawCoach.login || "Pending")
    : "Pending";

  useEffect(() => {
    async function checkMembership() {
      if (!user) {
        setIsChecking(false);
        return;
      }
      try {
        const statusData = await getClubStatus(clubSlug);
        setStatus(statusData as { is_member: boolean; role?: number });
      } catch (error) {
        console.error("Failed to fetch club status", error);
      } finally {
        setIsChecking(false);
      }
    }
    checkMembership();
  }, [clubSlug, user]);

  const handleJoinClub = async () => {
    setIsJoining(true);
    try {
      await joinClub(clubSlug);
      setJoinStatus("pending");
    } catch (error) {
      console.error("Failed to join club", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="w-[92%] lg:w-[70%] mx-auto">
      
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
            />
          </section>

          {isChecking ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="size-10 animate-spin text-brand-orange" />
            </div>
          ) : status?.is_member ? (
            
            <div className="w-full flex flex-col items-center justify-center mt-10 sm:mt-12">
              <div className="w-full flex justify-start mb-4 gap-2">
                {status.role === 2 && <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Coach Access</Badge>}
                {status.role === 1 && <Badge className="bg-purple-500 hover:bg-purple-600 text-white">Leader Access</Badge>}
                {status.role === 0 && <Badge className="bg-green-500 hover:bg-green-600 text-white">Active Member</Badge>}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch justify-center w-full animate-in fade-in duration-500">
                <section className="lg:h-full flex flex-col min-w-0">
                  <ClubTaps
                    clubSlug={clubSlug}
                    userRole={status.role}
                  />
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
                You must be an active member to view sessions, leaderboards, and book matches for {clubName}.
              </p>

              {joinStatus === "pending" ? (
                <div className="inline-flex items-center gap-2 px-6 py-4 bg-green-50 text-green-700 border border-green-200 rounded-xl font-bold text-base shadow-sm">
                  <CheckCircle className="size-6" /> Join Request Sent
                </div>
              ) : (
                <Button 
                  onClick={handleJoinClub} 
                  disabled={isJoining}
                  className="h-12 px-10 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-black italic text-base tracking-wide shadow-md shadow-brand-orange/20"
                >
                  {isJoining ? (
                    <><Loader2 className="size-5 animate-spin mr-2" /> Requesting...</>
                  ) : (
                    "Join Club Now"
                  )}
                </Button>
              )}
            </div>

          )}
        </>
      )}
    </div>
  );
}

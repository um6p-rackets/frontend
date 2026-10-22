'use client';

import { Loader2, Inbox, Calendar, X, CheckCircle2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { toast } from 'sonner';

interface Player {
    member_id: number;
    login: string;
    first_name: string;
    last_name: string;
    avatar?: string | null;
    department?: string | null;
    }

    interface Team {
    player1: Player;
    player2?: Player | null;
    }

    interface MatchItem {
    id: number;
    status: number;
    mode: number;
    scheduled_at: string;
    team1: Team;
    team2: Team;
    }

    interface AcceptMatchModalProps {
    clubSlug: string;
    currentMemberId: number;
    isOpen: boolean;
    onClose: () => void;
    }

    export default function AcceptMatchModal({
    clubSlug,
    currentMemberId,
    isOpen,
    onClose,
    }: AcceptMatchModalProps) {
    const queryClient = useQueryClient();

    const { data: pendingData, isLoading: isLoadingPending } = useQuery({
        queryKey: ['club-pending-matches', clubSlug],
        queryFn: async () => {
        const res = await api<{ data: MatchItem[] }>(`/clubs/${clubSlug}/matches?status=pending&limit=50`);
        return res;
        },
        enabled: isOpen,
    });

    const acceptMatchMutation = useMutation({
        mutationFn: async (matchId: number) => {
        await api(`/clubs/${clubSlug}/matches/${matchId}/accept`, { method: 'POST' });
        },
        onSuccess: () => {
        toast.success('Match accepted successfully.');
        queryClient.invalidateQueries({ queryKey: ['club-pending-matches', clubSlug] });
        queryClient.invalidateQueries({ queryKey: ['club-matches', clubSlug] });
        },
        onError: (err: Error) => {
        toast.error(err.message || 'Failed to accept match.');
        },
    });

    const rawPendingRequests = pendingData?.data || [];
    const pendingRequests = rawPendingRequests.filter((reqMatch) => {
        const isTeam1Member = 
        reqMatch.team1.player1?.member_id === currentMemberId || 
        Boolean(reqMatch.team1.player2 && reqMatch.team1.player2.member_id === currentMemberId);

        const isTeam2Member = 
        reqMatch.team2.player1?.member_id === currentMemberId || 
        Boolean(reqMatch.team2.player2 && reqMatch.team2.player2.member_id === currentMemberId);

        return !(isTeam1Member || isTeam2Member);
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
        <div className="bg-card w-full max-w-xl rounded-3xl border border-border shadow-lg overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
            <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-brand-orange" />
                <h3 className="text-lg font-bold text-foreground">Pending Match Requests</h3>
            </div>
            <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
                <X className="w-4 h-4" />
            </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 flex-1">
            {isLoadingPending ? (
                <div className="flex justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
                </div>
            ) : pendingRequests.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm font-medium">
                No pending match requests found.
                </div>
            ) : (
                pendingRequests.map((reqMatch) => {
                const team1Names = [
                    reqMatch.team1.player1 ? `${reqMatch.team1.player1.first_name} ${reqMatch.team1.player1.last_name}` : '',
                    reqMatch.team1.player2 ? `${reqMatch.team1.player2.first_name} ${reqMatch.team1.player2.last_name}` : ''
                ].filter(Boolean).join(' & ');

                const team2Names = [
                    reqMatch.team2.player1 ? `${reqMatch.team2.player1.first_name} ${reqMatch.team2.player1.last_name}` : '',
                    reqMatch.team2.player2 ? `${reqMatch.team2.player2.first_name} ${reqMatch.team2.player2.last_name}` : ''
                ].filter(Boolean).join(' & ');

                return (
                    <div
                    key={reqMatch.id}
                    className="p-4 rounded-2xl border border-border/70 bg-background flex items-center justify-between gap-4 shadow-2xs"
                    >
                    <div className="space-y-1">
                        <div className="text-xs font-bold text-brand-orange">
                        {reqMatch.mode === 2 ? 'Doubles Request' : 'Singles Request'}
                        </div>
                        <div className="text-sm font-bold text-foreground">
                        {team1Names} vs {team2Names}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(reqMatch.scheduled_at).toLocaleDateString()}
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={acceptMatchMutation.isPending}
                        onClick={() => acceptMatchMutation.mutate(reqMatch.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                    >
                        {acceptMatchMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        Accept
                    </button>
                    </div>
                );
                })
            )}
            </div>

            <div className="px-6 py-4 border-t border-border/60 bg-muted/20 flex justify-end">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border/70 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
            >
                Close
            </button>
            </div>
        </div>
        </div>
    );
}

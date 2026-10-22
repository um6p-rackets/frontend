'use client';

import { useRouter } from 'next/navigation';
import { Loader2, UserPlus, Calendar, X, CheckCircle2, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { toast } from 'sonner';

interface UserSummary {
    id: number;
    login: string;
    first_name: string;
    last_name: string;
    avatar?: string | null;
    department?: string | null;
    }

    interface JoinRequestItem {
    id: number;
    club_id: number;
    user_id: number;
    status: number;
    requested_at: string;
    user: UserSummary;
    }

    interface AcceptJoinModalProps {
    clubSlug: string;
    isOpen: boolean;
    onClose: () => void;
    }

    export default function AcceptJoinModal({ clubSlug, isOpen, onClose }: AcceptJoinModalProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: pendingJoinData, isLoading: isLoadingJoinPending } = useQuery({
        queryKey: ['club-pending-join-requests', clubSlug],
        queryFn: async () => {
        const res = await api<{ data: JoinRequestItem[]; total: number }>(`/clubs/${clubSlug}/join-requests`);
        return res;
        },
        enabled: isOpen,
    });

    const acceptJoinMutation = useMutation({
        mutationFn: async (reqItem: JoinRequestItem) => {
        await api(`/clubs/${clubSlug}/members`, {
            method: 'POST',
            body: JSON.stringify({ user_id: reqItem.user_id || reqItem.id }),
        });
        },
        onSuccess: () => {
        toast.success('Join request accepted successfully.');
        queryClient.invalidateQueries({ queryKey: ['club-pending-join-requests', clubSlug] });
        queryClient.invalidateQueries({ queryKey: ['club-status', clubSlug] });
        },
        onError: (err: Error) => {
        toast.error(err.message || 'Failed to accept join request.');
        },
    });

    const rejectJoinMutation = useMutation({
        mutationFn: async (requestId: number) => {
        await api(`/clubs/${clubSlug}/join-requests/${requestId}/reject`, { method: 'POST' });
        },
        onSuccess: () => {
        toast.success('Join request declined.');
        queryClient.invalidateQueries({ queryKey: ['club-pending-join-requests', clubSlug] });
        },
        onError: (err: Error) => {
        toast.error(err.message || 'Failed to decline join request.');
        },
    });

    const pendingJoinRequests = pendingJoinData?.data || [];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
        <div className="bg-card w-full max-w-xl rounded-3xl border border-border shadow-lg overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
            <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-brand-orange" />
                <h3 className="text-lg font-bold text-foreground">Pending Join Requests</h3>
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
            {isLoadingJoinPending ? (
                <div className="flex justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
                </div>
            ) : pendingJoinRequests.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm font-medium">
                No pending join requests found.
                </div>
            ) : (
                pendingJoinRequests.map((req) => {
                const memberName = [req.user?.first_name, req.user?.last_name].filter(Boolean).join(' ') || req.user?.login || 'User';
                const dept = req.user?.department || 'Sport Department';

                return (
                    <div
                    key={req.id}
                    className="p-4 rounded-2xl border border-border/70 bg-background flex items-center justify-between gap-4 shadow-2xs"
                    >
                    <div 
                        onClick={() => router.push(`/users/${req.user?.login || req.user_id}`)}
                        className="space-y-1 cursor-pointer group flex-1"
                    >
                        <div className="text-xs font-bold text-brand-orange">
                        {dept}
                        </div>
                        <div className="text-sm font-bold text-foreground group-hover:text-brand-orange transition-colors">
                        {memberName}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Requested on {new Date(req.requested_at).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                        type="button"
                        disabled={acceptJoinMutation.isPending || rejectJoinMutation.isPending}
                        onClick={() => acceptJoinMutation.mutate(req)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                        >
                        {acceptJoinMutation.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        Accept
                        </button>

                        <button
                        type="button"
                        disabled={acceptJoinMutation.isPending || rejectJoinMutation.isPending}
                        onClick={() => rejectJoinMutation.mutate(req.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                        >
                        {rejectJoinMutation.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <XCircle className="w-3.5 h-3.5" />
                        )}
                        Decline
                        </button>
                    </div>
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Search, X, ShieldCheck, ShieldAlert, Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface UserSummary {
    id: number;
    login: string;
    first_name: string;
    last_name: string;
    avatar?: string | null;
    department?: string | null;
    }

    interface ClubMemberItem {
    id: number; // member_id
    user_id: number;
    role: number; // 0: member, 1: leader, 2: coach
    user: UserSummary;
    }

    interface ManageLeadersModalProps {
    clubSlug: string;
    currentMemberId: number;
    isOpen: boolean;
    onClose: () => void;
    }

    export default function ManageLeadersModal({
    clubSlug,
    currentMemberId,
    isOpen,
    onClose,
    }: ManageLeadersModalProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [memberSearchQuery, setMemberSearchQuery] = useState('');

    // Fetch club members with role=0
    const { data: clubMembersData, isLoading: isLoadingMembers } = useQuery({
        queryKey: ['club-members-list', clubSlug],
        queryFn: async () => {
        const res = await api<{ data: ClubMemberItem[]; total: number }>(
            `/clubs/${clubSlug}/members?role=0`
        );
        return res;
        },
        enabled: isOpen,
    });

    const allClubMembers = clubMembersData?.data || [];

    // Mutation for changing member role
    const updateRoleMutation = useMutation({
        mutationFn: async ({ memberId, newRole }: { memberId: number; newRole: number }) => {
        await api(`/clubs/${clubSlug}/members/${memberId}/role`, {
            method: 'PATCH',
            body: JSON.stringify({ role: newRole }),
        });
        },
        onSuccess: (_, variables) => {
        toast.success(variables.newRole === 1 ? 'Member promoted to leader.' : 'Leader demoted to member.');
        queryClient.invalidateQueries({ queryKey: ['club-members-list', clubSlug] });
        },
        onError: (err: Error) => {
        toast.error(err.message || 'Failed to update member role.');
        },
    });

    const filteredClubMembers = allClubMembers.filter((m) => {
        const fullName = `${m.user?.first_name || ''} ${m.user?.last_name || ''} ${m.user?.login || ''}`.toLowerCase();
        return fullName.includes(memberSearchQuery.toLowerCase());
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
        <div className="bg-card w-full max-w-xl rounded-3xl border border-border shadow-lg overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-foreground">Manage Club Leaders</h3>
            </div>
            <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
                <X className="w-4 h-4" />
            </button>
            </div>

            {/* Search Input Bar */}
            <div className="px-6 pt-4 pb-2">
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                type="text"
                placeholder="Search club members..."
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-background text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                />
            </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 flex-1">
            {isLoadingMembers ? (
                <div className="flex justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
                </div>
            ) : filteredClubMembers.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm font-medium">
                No members found.
                </div>
            ) : (
                filteredClubMembers.map((member) => {
                const memberName = [member.user?.first_name, member.user?.last_name].filter(Boolean).join(' ') || member.user?.login || 'User';
                const dept = member.user?.department || 'Sport Department';
                const isLeader = member.role === 1;
                const isCoach = member.role === 2;

                return (
                    <div
                    key={member.id}
                    className="p-4 rounded-2xl border border-border/70 bg-background flex items-center justify-between gap-4 shadow-2xs"
                    >
                    <div 
                        onClick={() => router.push(`/users/${member.user?.login || member.user_id}`)}
                        className="space-y-1 cursor-pointer group flex-1"
                    >
                        <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-orange">{dept}</span>
                        {isCoach && <Badge className="bg-blue-500 text-white text-[10px] px-1.5 py-0">Coach</Badge>}
                        {isLeader && <Badge className="bg-purple-500 text-white text-[10px] px-1.5 py-0">Leader</Badge>}
                        </div>
                        <div className="text-sm font-bold text-foreground group-hover:text-brand-orange transition-colors">
                        {memberName}
                        </div>
                    </div>

                    {!isCoach && member.id !== currentMemberId && (
                        <div>
                        {isLeader ? (
                            <button
                            type="button"
                            disabled={updateRoleMutation.isPending}
                            onClick={() => updateRoleMutation.mutate({ memberId: member.id, newRole: 0 })}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white border border-amber-200 text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                            >
                            {updateRoleMutation.isPending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <ShieldAlert className="w-3.5 h-3.5" />
                            )}
                            Demote
                            </button>
                        ) : (
                            <button
                            type="button"
                            disabled={updateRoleMutation.isPending}
                            onClick={() => updateRoleMutation.mutate({ memberId: member.id, newRole: 1 })}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                            >
                            {updateRoleMutation.isPending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <ShieldCheck className="w-3.5 h-3.5" />
                            )}
                            Set Leader
                            </button>
                        )}
                        </div>
                    )}
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

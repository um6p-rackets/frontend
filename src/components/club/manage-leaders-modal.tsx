'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Search, ShieldCheck, ShieldAlert, UserX } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/api';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

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
    mode?: 'set' | 'remove' | 'remove-member';
    }

    export default function ManageLeadersModal({
    clubSlug,
    currentMemberId,
    isOpen,
    onClose,
    mode = 'set',
    }: ManageLeadersModalProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [memberSearchQuery, setMemberSearchQuery] = useState('');

    // Fetch all members for remove-member mode, or specific roles for set/remove leader
    const fetchQueryParam = mode === 'remove' ? '?role=1' : '?role=0';

    const { data: clubMembersData, isLoading: isLoadingMembers } = useQuery({
        queryKey: ['club-members-list-mode', clubSlug, mode],
        queryFn: async () => {
        const res = await api<{ data: ClubMemberItem[]; total: number }>(
            `/clubs/${clubSlug}/members${fetchQueryParam}`
        );
        return res;
        },
        enabled: isOpen,
    });

    const rawMembersList = clubMembersData?.data || [];

    // If in remove-member mode, filter out coaches (role 2) so they cannot be removed via this list
    const membersList = mode === 'remove-member' 
        ? rawMembersList.filter((m) => m.role !== 2) 
        : rawMembersList;

    // Mutation for role change (set/remove leader)
    const updateRoleMutation = useMutation({
        mutationFn: async ({ memberId, newRole }: { memberId: number; newRole: number }) => {
        await api(`/clubs/${clubSlug}/members/${memberId}/role`, {
            method: 'PATCH',
            body: JSON.stringify({ role: newRole }),
        });
        },
        onSuccess: (_, variables) => {
        toast.success(variables.newRole === 1 ? 'Member promoted to leader.' : 'Leader demoted to member.');
        queryClient.invalidateQueries({ queryKey: ['club-members-list-mode', clubSlug] });
        },
        onError: (err: Error) => {
        toast.error(err.message || 'Failed to update member role.');
        },
    });

    // Mutation for completely removing a member from the club (Kicking them)
    const removeMemberMutation = useMutation({
        mutationFn: async (memberId: number) => {
        await api(`/clubs/${clubSlug}/members/${memberId}`, {
            method: 'DELETE',
        });
        },
        onSuccess: () => {
        toast.success('Member kicked from the club successfully.');
        queryClient.invalidateQueries({ queryKey: ['club-members-list-mode', clubSlug] });
        queryClient.invalidateQueries({ queryKey: ['club-status', clubSlug] });
        },
        onError: (err: Error) => {
        toast.error(err.message || 'Failed to remove member.');
        },
    });

    const filteredMembers = membersList.filter((m) => {
        const fullName = `${m.user?.first_name || ''} ${m.user?.last_name || ''} ${m.user?.login || ''}`.toLowerCase();
        return fullName.includes(memberSearchQuery.toLowerCase());
    });

    const isRemoveLeaderMode = mode === 'remove';
    const isRemoveMemberMode = mode === 'remove-member';

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto flex flex-col">
            <SheetHeader className="pb-4 border-b border-border/60">
            <div className="flex items-center gap-2">
                {isRemoveMemberMode ? (
                <UserX className="w-5 h-5 text-red-500" />
                ) : isRemoveLeaderMode ? (
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                ) : (
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                )}
                <SheetTitle>
                {isRemoveMemberMode ? 'Remove Club Member' : isRemoveLeaderMode ? 'Remove Club Leaders' : 'Manage Club Leaders'}
                </SheetTitle>
            </div>
            <SheetDescription>
                {isRemoveMemberMode 
                ? 'View all club members and kick them out if needed.' 
                : isRemoveLeaderMode 
                ? 'View current club leaders and remove their leadership role.' 
                : 'Search and promote active members to club leaders.'}
            </SheetDescription>
            </SheetHeader>

            {/* Search Input Bar */}
            <div className="pt-4 pb-2">
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                type="text"
                placeholder={isRemoveMemberMode ? "Search members..." : "Search..."}
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-background text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                />
            </div>
            </div>

            <div className="py-4 space-y-3 flex-1 overflow-y-auto">
            {isLoadingMembers ? (
                <div className="flex justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
                </div>
            ) : filteredMembers.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm font-medium">
                No members found.
                </div>
            ) : (
                filteredMembers.map((member) => {
                const memberName = [member.user?.first_name, member.user?.last_name].filter(Boolean).join(' ') || member.user?.login || 'User';
                const dept = member.user?.department || 'Sport Department';
                const isLeader = member.role === 1;

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
                        {isLeader && <Badge className="bg-purple-500 text-white text-[10px] px-1.5 py-0">Leader</Badge>}
                        </div>
                        <div className="text-sm font-bold text-foreground group-hover:text-brand-orange transition-colors">
                        {memberName}
                        </div>
                    </div>

                    {member.id !== currentMemberId && (
                        <div>
                        {isRemoveMemberMode ? (
                            <button
                            type="button"
                            disabled={removeMemberMutation.isPending}
                            onClick={() => removeMemberMutation.mutate(member.id)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                            >
                            {removeMemberMutation.isPending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <UserX className="w-3.5 h-3.5" />
                            )}
                            Remove
                            </button>
                        ) : isRemoveLeaderMode ? (
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
                            Remove Leader
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
        </SheetContent>
        </Sheet>
    );
}

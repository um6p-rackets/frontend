'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Search, ShieldCheck, ShieldAlert, UserX } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { useClubMembers, useSetMemberRole, useRemoveMember } from '@/hooks/use-club-members';
import { MemberRole } from '@/types/contracts/club';

type Mode = 'set' | 'remove' | 'remove-member';

// Everything that differs between the three modes
const MODES = {
    set: {
        role: MemberRole.MEMBER, // list: plain members
        title: 'Manage Club Leaders',
        description: 'Search and promote active members to club leaders.',
        placeholder: 'Search...',
        HeaderIcon: ShieldCheck,
        headerIconClass: 'text-blue-500',
    },
    remove: {
        role: MemberRole.LEADER, // list: leaders
        title: 'Remove Club Leaders',
        description: 'View current club leaders and remove their leadership role.',
        placeholder: 'Search...',
        HeaderIcon: ShieldAlert,
        headerIconClass: 'text-amber-500',
    },
    'remove-member': {
        role: MemberRole.MEMBER, // same list as before (role=0), see notes
        title: 'Remove Club Member',
        description: 'View all club members and kick them out if needed.',
        placeholder: 'Search members...',
        HeaderIcon: UserX,
        headerIconClass: 'text-red-500',
    },
} as const;

interface ManageLeadersModalProps {
    clubSlug: string;
    currentMemberId: number;
    isOpen: boolean;
    onClose: () => void;
    mode?: Mode;
}

export default function ManageLeadersModal({
    clubSlug,
    currentMemberId,
    isOpen,
    onClose,
    mode = 'set',
}: ManageLeadersModalProps) {
    const router = useRouter();
    const [search, setSearch] = useState('');

    const config = MODES[mode];
    const { data, isLoading } = useClubMembers(clubSlug, config.role, isOpen);
    const setRole = useSetMemberRole(clubSlug);
    const removeMember = useRemoveMember(clubSlug);

    // Row action for the current mode
    const action = {
        set: {
            label: 'Set Leader',
            Icon: ShieldCheck,
            className: 'bg-purple-600 hover:bg-purple-700 text-white',
            run: (id: number) => setRole.mutate({ memberId: id, role: MemberRole.LEADER }),
        },
        remove: {
            label: 'Remove Leader',
            Icon: ShieldAlert,
            className:
                'bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white border border-amber-200',
            run: (id: number) => setRole.mutate({ memberId: id, role: MemberRole.MEMBER }),
        },
        'remove-member': {
            label: 'Remove',
            Icon: UserX,
            className:
                'bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white border border-red-200',
            run: (id: number) => removeMember.mutate(id),
        },
    }[mode];

    // id of the member being processed (spinner only on that row)
    const pendingId = removeMember.isPending
        ? removeMember.variables
        : setRole.isPending
          ? setRole.variables?.memberId
          : undefined;
    const busy = removeMember.isPending || setRole.isPending;

    const query = search.toLowerCase();
    const members = (data?.data ?? []).filter((m) =>
        `${m.user?.first_name ?? ''} ${m.user?.last_name ?? ''} ${m.user?.login ?? ''}`
            .toLowerCase()
            .includes(query)
    );

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto flex flex-col">
                <SheetHeader className="pb-4 border-b border-border/60">
                    <div className="flex items-center gap-2">
                        <config.HeaderIcon className={`w-5 h-5 ${config.headerIconClass}`} />
                        <SheetTitle>{config.title}</SheetTitle>
                    </div>
                    <SheetDescription>{config.description}</SheetDescription>
                </SheetHeader>

                <div className="pt-4 pb-2">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={config.placeholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-background text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                        />
                    </div>
                </div>

                <div className="py-4 space-y-3 flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
                        </div>
                    ) : members.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground text-sm font-medium">
                            No members found.
                        </div>
                    ) : (
                        members.map((member) => {
                            const name =
                                [member.user?.first_name, member.user?.last_name]
                                    .filter(Boolean)
                                    .join(' ') ||
                                member.user?.login ||
                                'User';
                            const dept = member.user?.department || 'Sport Department';
                            const isLeader = member.role === MemberRole.LEADER;

                            return (
                                <div
                                    key={member.id}
                                    className="p-4 rounded-2xl border border-border/70 bg-background flex items-center justify-between gap-4 shadow-2xs"
                                >
                                    <div
                                        onClick={() =>
                                            router.push(
                                                `/users/${member.user?.login || member.user_id}`
                                            )
                                        }
                                        className="space-y-1 cursor-pointer group flex-1"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-brand-orange">
                                                {dept}
                                            </span>
                                            {isLeader && (
                                                <Badge className="bg-purple-500 text-white text-[10px] px-1.5 py-0">
                                                    Leader
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-sm font-bold text-foreground group-hover:text-brand-orange transition-colors">
                                            {name}
                                        </div>
                                    </div>

                                    {member.id !== currentMemberId && (
                                        <button
                                            type="button"
                                            disabled={busy}
                                            onClick={() => action.run(member.id)}
                                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50 ${action.className}`}
                                        >
                                            {pendingId === member.id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <action.Icon className="w-3.5 h-3.5" />
                                            )}
                                            {action.label}
                                        </button>
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

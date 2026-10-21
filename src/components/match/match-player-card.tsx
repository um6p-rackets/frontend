'use client';

import { Plus, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function MatchPlayerCard({
    type = 'filled',
    name,
    subtitle,
    badgeText,
    avatarUrl,
    onClick,
    }: {
    type?: 'filled' | 'empty';
    name: string;
    subtitle: string;
    badgeText?: string;
    avatarUrl?: string | null;
    onClick?: () => void;
    }) {
    // Fallback if subtitle is null, undefined, or empty
    const displayDepartment = subtitle && subtitle.trim() !== '' && subtitle !== 'undefined' && subtitle !== 'null' 
        ? subtitle 
        : 'Sport Department';

    if (type === 'empty') {
        return (
        <div 
            onClick={onClick}
            className="p-4 rounded-xl border border-dashed border-border/85 hover:border-brand-orange bg-muted/25 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
        >
            <div className="flex items-center gap-3">
            {avatarUrl ? (
                <div className="w-10 h-10 rounded-full relative overflow-hidden shrink-0">
                <Image src={avatarUrl} alt={name} fill className="object-cover" />
                </div>
            ) : (
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent shrink-0 text-sm">
                {name !== 'Choose Teammate' && name !== 'Choose Opponent' && name !== 'Choose Opponent 2' 
                    ? name.charAt(0).toUpperCase() 
                    : <Plus className="w-5 h-5 text-brand-orange" />}
                </div>
            )}
            <div>
                <div className="font-bold text-sm text-foreground">{name}</div>
                <div className="text-xs text-muted-foreground">{displayDepartment}</div>
            </div>
            </div>
            <span className="text-xs font-semibold text-brand-orange flex items-center gap-1 shrink-0">
            Pick <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
        </div>
        );
    }

    return (
        <div 
        onClick={onClick}
        className={cn(
            "p-4 rounded-xl border border-border/70 bg-background flex items-center justify-between shadow-2xs",
            onClick && "cursor-pointer hover:border-brand-orange transition-colors"
        )}
        >
        <div className="flex items-center gap-3">
            {avatarUrl ? (
            <div className="w-10 h-10 rounded-full relative overflow-hidden shrink-0">
                <Image src={avatarUrl} alt={name} fill className="object-cover" />
            </div>
            ) : (
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent shrink-0 text-sm">
                {name.charAt(0).toUpperCase()}
            </div>
            )}
            <div>
            <div className="font-bold text-sm text-foreground">{name}</div>
            <div className="text-xs text-muted-foreground">{displayDepartment}</div>
            </div>
        </div>
        {badgeText && (
            <span className="px-2.5 py-1 rounded-md bg-orange-100 dark:bg-orange-950/50 text-brand-orange font-black text-xs shrink-0">
            {badgeText}
            </span>
        )}
        </div>
    );
}
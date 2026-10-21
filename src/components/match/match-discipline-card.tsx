'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MatchMode } from '@/types/contracts/club';

export default function MatchDisciplineCard({
    mode,
    currentMode,
    title,
    description,
    onSelect,
    }: {
    mode: MatchMode;
    currentMode: MatchMode;
    title: string;
    description: string;
    onSelect: () => void;
    }) {
    const isSelected = currentMode === mode;

    return (
        <div
        onClick={onSelect}
        className={cn(
            "cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden",
            isSelected
            ? "bg-brand-orange text-white border-brand-orange shadow-md"
            : "bg-background text-foreground border-border/80 hover:border-brand-orange/50"
        )}
        >
        <div>
            <h3 className="text-xl font-black italic tracking-wide">
            {title}
            </h3>
            <p className={cn("text-xs sm:text-sm mt-2 leading-relaxed", isSelected ? "text-white/90" : "text-muted-foreground")}>
            {description}
            </p>
        </div>
        <div className="mt-6 flex items-center gap-2 text-xs font-semibold">
            <span className={cn("w-4 h-4 rounded-full border flex items-center justify-center", isSelected ? "border-white bg-white/20" : "border-muted-foreground")}>
            {isSelected && <Check className="w-3 h-3 text-white" />}
            </span>
            {isSelected ? "Selected" : "Click To Select"}
        </div>
        </div>
    );
}
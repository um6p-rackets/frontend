"use client";

import { useState } from "react";
import { Award, Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ACHIEVEMENT_GROUPS, getAchievementMeta } from "@/components/achievement/achievement-meta";
import { useAwardAchievement } from "@/hooks/use-achievements";
import { useClubMembers } from "@/hooks/use-club-members";
import { cn } from "@/lib/utils";
import type { AchievementCode } from "@/types/contracts/achievement-code";

export default function AwardAchievementSheet({
  clubSlug,
  isOpen,
  onClose,
}: {
  clubSlug: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState<number | null>(null); // auth-service id
  const [code, setCode] = useState<AchievementCode | null>(null);

  const { data, isLoading } = useClubMembers(clubSlug, undefined, isOpen);
  const award = useAwardAchievement(clubSlug);

  const query = search.toLowerCase();
  const members = (data?.data ?? []).filter((m) =>
    `${m.user?.first_name ?? ""} ${m.user?.last_name ?? ""} ${m.user?.login ?? ""}`
      .toLowerCase()
      .includes(query),
  );

  const handleSubmit = () => {
    if (userId === null || code === null) return;
    award.mutate(
      { user_id: userId, code },
      {
        onSuccess: () => {
          setUserId(null);
          setCode(null);
          setSearch("");
          onClose();
        },
      },
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto flex flex-col">
        <SheetHeader className="pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-orange" />
            <SheetTitle>Award Achievement</SheetTitle>
          </div>
          <SheetDescription>Pick an active member, then the achievement to give.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {/* 1. Member */}
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              1. Member
            </h3>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-background text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {isLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-orange" />
                </div>
              ) : members.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">No members found.</p>
              ) : (
                members.map((m) => {
                  const name =
                    [m.user?.first_name, m.user?.last_name].filter(Boolean).join(" ") ||
                    m.user?.login ||
                    "Member";
                  const selected = userId === m.user_id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setUserId(m.user_id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-xl border text-sm font-semibold transition-colors cursor-pointer",
                        selected
                          ? "border-brand-orange bg-orange-50 dark:bg-orange-950/30 text-brand-orange"
                          : "border-border/60 bg-card text-foreground hover:border-brand-orange/50",
                      )}
                    >
                      {name}
                      <span className="text-xs font-normal text-muted-foreground">
                        {" "}
                        @{m.user?.login}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          {/* 2. Achievement */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              2. Achievement
            </h3>
            {ACHIEVEMENT_GROUPS.map((group) => (
              <div key={group.category} className="space-y-1.5">
                <div className="text-[11px] font-bold italic text-muted-foreground">
                  {group.label}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {group.codes.map((c) => {
                    const { title, Icon } = getAchievementMeta(c);
                    const selected = code === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCode(c)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer",
                          selected
                            ? "border-brand-orange bg-orange-50 dark:bg-orange-950/30 text-brand-orange"
                            : "border-border/60 bg-card text-foreground hover:border-brand-orange/50",
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="pt-4 border-t border-border/60">
          <Button
            onClick={handleSubmit}
            disabled={userId === null || code === null || award.isPending}
            className="w-full h-11 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold cursor-pointer"
          >
            {award.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Award Achievement"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

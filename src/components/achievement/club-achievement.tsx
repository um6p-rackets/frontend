"use client";

// -> src/components/achievement/club-achievements.tsx (replaces the previous version)
import { useState } from "react";
import { Loader2, Plus, Trash2, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AchievementChip } from "@/components/achievement/achievement-list";
import { getAchievementMeta } from "@/components/achievement/achievement-meta";
import GiveAchievementModal from "@/components/achievement/give-achievement-modal";
import { useClubAchievements, useDeleteAchievement } from "@/hooks/use-achievements";

const LIMIT = 10;

// canManage = leader or coach (role 1 or 2)
export default function ClubAchievements({
  clubSlug,
  currentMemberId,
  canManage,
}: {
  clubSlug: string;
  currentMemberId: number;
  canManage: boolean;
}) {
  const [page, setPage] = useState(1);
  const [isGiveOpen, setIsGiveOpen] = useState(false);

  const { data, isLoading, isError, refetch, isPlaceholderData } = useClubAchievements(
    clubSlug,
    page,
    LIMIT,
  );
  const remove = useDeleteAchievement(clubSlug);

  const items = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / LIMIT));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black italic text-foreground">Achievements</h2>
        {canManage && (
          <Button
            size="sm"
            onClick={() => setIsGiveOpen(true)}
            className="h-9 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Award
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
        </div>
      ) : isError ? (
        <div className="text-center py-10">
          <p className="text-sm text-red-500 mb-3">Failed to load achievements.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-3xl flex flex-col items-center gap-2">
          <Trophy className="w-8 h-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground font-medium">
            No achievements awarded yet.
          </p>
        </div>
      ) : (
        <div
          className={`space-y-2 transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}
        >
          {items.map((a) => {
            const { title } = getAchievementMeta(a.code);
            const name =
              [a.user?.first_name, a.user?.last_name].filter(Boolean).join(" ") ||
              a.user?.login ||
              "Member";
            const isRemoving = remove.isPending && remove.variables === a.id;

            return (
              <div
                key={a.id}
                className="p-3 sm:p-4 rounded-2xl border border-border/70 bg-card flex items-center gap-3 shadow-2xs"
              >
                <AchievementChip code={a.code} />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-foreground truncate">{title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {name} • {new Date(a.taken_at).toLocaleDateString()}
                  </div>
                </div>

                {canManage && (
                  <button
                    type="button"
                    disabled={remove.isPending}
                    onClick={() => {
                      if (!window.confirm("Remove this achievement?")) return;
                      remove.mutate(a.id, {
                        // last item of the last page: step back one page
                        onSuccess: () => {
                          if (items.length === 1 && page > 1) setPage((p) => p - 1);
                        },
                      });
                    }}
                    aria-label="Remove achievement"
                    className="p-2 rounded-xl text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isRemoving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {canManage && (
        <GiveAchievementModal
          clubSlug={clubSlug}
          currentMemberId={currentMemberId}
          isOpen={isGiveOpen}
          onClose={() => setIsGiveOpen(false)}
        />
      )}
    </div>
  );
}
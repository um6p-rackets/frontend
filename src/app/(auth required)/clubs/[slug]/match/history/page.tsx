"use client";

import { useParams } from "next/navigation";
import { MemberGate } from "@/components/club/member-gate";
import MatchHistorySection from "@/components/club/match-history-section";

export default function MatchHistoryPage() {
  const params = useParams<{ name: string }>();
  const clubSlug = params?.name ?? "";

  return (
    <MemberGate slug={clubSlug}>
      {(memberId) => <MatchHistorySection clubSlug={clubSlug} currentMemberId={memberId} />}
    </MemberGate>
  );
}
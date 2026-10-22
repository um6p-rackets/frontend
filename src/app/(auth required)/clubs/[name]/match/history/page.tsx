'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/store/auth';
import MatchHistorySection from '@/components/club/match-history-section';

export default function MatchHistoryPage() {
  const params = useParams<{ name: string }>();
  const clubSlug = params?.name ?? 'tennis';
  const user = useAuth((state) => state.user);

  const currentMemberId = user?.id ? Number(user.id) : 1;

  return (
    <MatchHistorySection
      clubSlug={clubSlug}
      currentMemberId={currentMemberId}
    />
  );
}
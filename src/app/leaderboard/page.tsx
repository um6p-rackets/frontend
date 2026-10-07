import LeaderboardHeader from '@/components/leaderboard/leaderboard-header';
import LeaderboardTable from '@/components/leaderboard/leaderboard-table';

import { mockClubData } from '@/lib/mock-data';

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen p-8 md:p-15 flex flex-col items-center">
      <LeaderboardHeader />
      <LeaderboardTable top_members={mockClubData.top_members} />
    </main>
  );
}
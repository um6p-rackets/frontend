'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';

import LeaderboardHeader from '@/components/leaderboard/leaderboard-header';
import LeaderboardTable from '@/components/leaderboard/leaderboard-table';
import { mockClubData } from '@/lib/mock-data';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function LeaderboardPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filteredMembers = useMemo(() => {
    // 1. Sort everyone and attach their TRUE rank before filtering
    const allMembersWithRank = [...mockClubData.top_members]
      .sort((a, b) => b.points - a.points)
      .map((m, index) => ({ ...m, originalRank: index + 1 }));

    // 2. Return the full list if no search
    if (!debouncedSearch.trim()) return allMembersWithRank;
    
    // 3. Filter the list (but they keep their originalRank property!)
    const lowerSearch = debouncedSearch.toLowerCase().trim();
    
    return allMembersWithRank.filter((m) => {
      const nameMatch = m.name.toLowerCase().includes(lowerSearch);
      const deptMatch = m.department?.toLowerCase().includes(lowerSearch);
      return nameMatch || deptMatch;
    });
  }, [debouncedSearch]);

  return (
    <main className="min-h-screen px-4 py-8 sm:p-8 md:p-15 flex flex-col items-center">
      <LeaderboardHeader />
      
      <div className="w-full max-w-6xl mb-6 flex justify-end items-center">
        <InputGroup className="w-full sm:max-w-sm bg-card shadow-sm border-border">
          <InputGroupInput 
            placeholder="Search by name or department..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-transparent"
          />
          <InputGroupAddon>
            <Search className="w-4 h-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end" className="text-xs font-semibold text-muted-foreground">
            {filteredMembers.length} results
          </InputGroupAddon>
        </InputGroup>
      </div>

      <LeaderboardTable top_members={filteredMembers} />
    </main>
  );
}

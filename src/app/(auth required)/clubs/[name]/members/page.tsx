'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Search } from 'lucide-react';

import MembersHeader from '@/components/members/members-header';
import MembersTable from '@/components/members/members-table';
import { ClubMember } from '@/components/members/members-row';
import { api, ApiError } from '@/lib/api/api';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function ClubMembersPage() {
  const params = useParams<{ name: string }>();
  const clubSlug = params?.name ?? '';

  const [rawMembers, setRawMembers] = useState<ClubMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use text values for the UI so the Select component correctly shows words, not numbers
  const [role, setRole] = useState<string>("member");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce the search input for smooth typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // 1. Fetch the full list of members for the selected role
  useEffect(() => {
    async function fetchMembers() {
      if (!clubSlug) return;
      setIsLoading(true);

      try {
        // Map the text back to the integer your backend expects
        const roleMap: Record<string, number> = { member: 0, leader: 1, coach: 2 };
        const roleNum = roleMap[role] ?? 0;

        // We DO NOT pass login to the backend here, so we get the full list for local filtering
        const url = `/clubs/${clubSlug}/members?limit=50&role=${roleNum}`;
        const res = await api<{ data: ClubMember[] }>(url);

        const sortedMembers = (res.data || []).sort((a, b) => b.role - a.role);
        setRawMembers(sortedMembers);

      } catch (error: unknown) {
        if (error instanceof ApiError && error.status === 404) {
          setRawMembers([]);
        } else {
          // console.error('Failed to fetch club members:', error);
          setRawMembers([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembers();
  }, [clubSlug, role]);

  // 2. Filter the members locally by username, first name, or last name
  const filteredMembers = useMemo(() => {
    if (!debouncedSearch.trim()) return rawMembers;

    const lowerSearch = debouncedSearch.toLowerCase().trim();

    return rawMembers.filter((m) => {
      const loginMatch = m.user.login.toLowerCase().includes(lowerSearch);
      const fullNameMatch = `${m.user.first_name} ${m.user.last_name}`.toLowerCase().includes(lowerSearch);
      return loginMatch || fullNameMatch;
    });
  }, [rawMembers, debouncedSearch]);

  return (
    <main className="min-h-screen px-4 py-8 sm:p-8 md:p-15 flex flex-col items-center">
      <MembersHeader clubName={clubSlug} />

      {/* Filters and Search Section */}
      <div className="w-full max-w-6xl mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">

        {/* Local Search Input Group */}
        <InputGroup className="w-full sm:max-w-sm bg-card shadow-sm border-border">
          <InputGroupInput
            placeholder="Search by name or username..."
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

        {/* Role Select Dropdown (Using text values) */}
        <Select value={role} onValueChange={(val) => val && setRole(val)}>
          <SelectTrigger className="w-full sm:w-[180px] bg-card shadow-sm border-border font-semibold">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="member" className="font-semibold cursor-pointer">Members</SelectItem>
            <SelectItem value="leader" className="font-semibold cursor-pointer">Leaders</SelectItem>
            <SelectItem value="coach" className="font-semibold cursor-pointer">Coaches</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />
        </div>
      ) : (
        <MembersTable members={filteredMembers} />
      )}
    </main>
  );
}
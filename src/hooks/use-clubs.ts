import { useQuery } from "@tanstack/react-query";
import { getClub, getClubs } from "@/lib/api/club";

export const clubKeys = {
  all: ["clubs"] as const,
  detail: (slug: string) => ["clubs", slug] as const,
};

export function useClubs() {
  return useQuery({
    queryKey: clubKeys.all,
    queryFn: getClubs,
    staleTime: 5 * 60 * 1000, // clubs rarely change: reuse for 5 minutes
  });
}

export function useClub(slug: string) {
  return useQuery({
    queryKey: clubKeys.detail(slug),
    queryFn: () => getClub(slug),
  });
}
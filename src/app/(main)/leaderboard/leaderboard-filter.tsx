"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Globe, UsersRound } from "lucide-react";

interface LeaderboardFilterProps {
  cohorts: { id: string; name: string }[];
  selectedCohortId: string | null;
}

export function LeaderboardFilter({ cohorts, selectedCohortId }: LeaderboardFilterProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "global") {
      router.push("/leaderboard");
    } else {
      router.push(`/leaderboard?cohortId=${value}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <UsersRound className="h-4 w-4 text-muted-foreground shrink-0" />
      <select
        value={selectedCohortId || "global"}
        onChange={handleChange}
        className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary/50"
      >
        <option value="global">Global</option>
        {cohorts.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

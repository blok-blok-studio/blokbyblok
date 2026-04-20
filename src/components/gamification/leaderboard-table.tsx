"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Flame } from "lucide-react";
import { LevelBadge } from "./level-badge";
import type { LeaderboardEntry } from "@/types/gamification";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
}

const rankStyles: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-slate-300",
  3: "text-amber-600",
};

export function LeaderboardTable({
  entries,
  currentUserId,
  className,
}: LeaderboardTableProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {entries.map((entry) => {
        const isCurrentUser = entry.userId === currentUserId;
        const isTopThree = entry.rank <= 3;

        return (
          <div
            key={entry.userId}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
              isCurrentUser
                ? "border border-primary/50 bg-primary/10"
                : "border border-transparent bg-card hover:bg-secondary/50",
              // Responsive stacking
              "flex-wrap sm:flex-nowrap"
            )}
          >
            {/* Rank */}
            <span
              className={cn(
                "w-8 shrink-0 text-center text-sm font-bold",
                isTopThree
                  ? rankStyles[entry.rank]
                  : "text-muted-foreground"
              )}
            >
              #{entry.rank}
            </span>

            {/* Avatar */}
            <Avatar
              src={entry.image}
              name={entry.name}
              size="sm"
              className="shrink-0"
            />

            {/* Name + Level */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={cn(
                  "truncate text-sm font-medium",
                  isCurrentUser ? "text-foreground" : "text-foreground"
                )}
              >
                {entry.name || "Anonymous"}
              </span>
              <LevelBadge level={entry.level} size="sm" />
            </div>

            {/* XP */}
            <span className="shrink-0 text-sm font-semibold text-foreground">
              {entry.totalXp.toLocaleString()} XP
            </span>

            {/* Streak */}
            {entry.currentStreak > 0 && (
              <div className="flex shrink-0 items-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-medium text-muted-foreground">
                  {entry.currentStreak}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

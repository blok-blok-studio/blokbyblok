"use client";

import { cn } from "@/lib/utils";
import { Flame, Snowflake } from "lucide-react";

interface StreakCounterProps {
  currentStreak: number;
  freezeAvailable?: boolean;
  longestStreak?: number;
  className?: string;
}

export function StreakCounter({
  currentStreak,
  freezeAvailable = false,
  longestStreak,
  className,
}: StreakCounterProps) {
  const isActive = currentStreak > 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Flame
          className={cn(
            "h-5 w-5",
            isActive ? "text-orange-500" : "text-muted-foreground"
          )}
        />
        {freezeAvailable && (
          <Snowflake className="absolute -right-1 -top-1 h-3 w-3 text-sky-400" />
        )}
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "text-sm font-bold leading-none",
            isActive ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {currentStreak} {currentStreak === 1 ? "day" : "days"}
        </span>
        {longestStreak !== undefined && (
          <span className="text-[10px] text-muted-foreground">
            Best: {longestStreak} days
          </span>
        )}
      </div>
    </div>
  );
}

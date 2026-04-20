"use client";

import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { LevelBadge } from "./level-badge";

interface GamificationStats {
  level: number;
  levelName: string;
  totalXp: number;
  xpForNext: number;
  progress: number;
  currentStreak: number;
}

interface StatsSidebarWidgetProps {
  className?: string;
}

export function StatsSidebarWidget({ className }: StatsSidebarWidgetProps) {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gamification/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={cn("space-y-3 p-3", className)}>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-pulse rounded-full bg-secondary" />
          <div className="h-4 w-20 animate-pulse rounded bg-secondary" />
        </div>
        <div className="h-2 w-full animate-pulse rounded-full bg-secondary" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-secondary" />
          <div className="h-3 w-12 animate-pulse rounded bg-secondary" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const currentXpInLevel = Math.round((stats.progress / 100) * stats.xpForNext);

  return (
    <div className={cn("space-y-3 p-3", className)}>
      {/* Level + Name */}
      <div className="flex items-center gap-2">
        <LevelBadge level={stats.level} size="md" />
        <span className="text-sm font-medium text-foreground">
          {stats.levelName}
        </span>
      </div>

      {/* Mini XP bar */}
      <div className="space-y-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500"
            style={{ width: `${Math.min(100, stats.progress)}%` }}
          />
        </div>
        <span className="text-[10px] text-muted-foreground">
          {currentXpInLevel.toLocaleString()} / {stats.xpForNext.toLocaleString()} XP
        </span>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-1.5">
        <Flame
          className={cn(
            "h-4 w-4",
            stats.currentStreak > 0 ? "text-orange-500" : "text-muted-foreground"
          )}
        />
        <span className="text-xs font-medium text-muted-foreground">
          {stats.currentStreak} day streak
        </span>
      </div>
    </div>
  );
}

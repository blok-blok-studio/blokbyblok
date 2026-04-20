"use client";

import { cn } from "@/lib/utils";
import { AchievementCard } from "./achievement-card";
import type { AchievementWithStatus } from "@/types/gamification";

interface AchievementGridProps {
  achievements: AchievementWithStatus[];
  className?: string;
}

export function AchievementGrid({ achievements, className }: AchievementGridProps) {
  // Group by category
  const grouped = achievements.reduce<Record<string, AchievementWithStatus[]>>(
    (acc, achievement) => {
      const category = achievement.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(achievement);
      return acc;
    },
    {}
  );

  // Preferred category order
  const categoryOrder = ["Learning", "Streaks", "Milestones"];
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <div className={cn("space-y-8", className)}>
      {sortedCategories.map((category) => (
        <div key={category}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {category}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {grouped[category].map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Check, Lock } from "lucide-react";
import type { AchievementWithStatus } from "@/types/gamification";

interface AchievementCardProps {
  achievement: AchievementWithStatus;
  className?: string;
}

export function AchievementCard({ achievement, className }: AchievementCardProps) {
  const { earned, earnedAt, icon, name, description } = achievement;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-4 transition-all duration-200",
        earned
          ? "border-border hover:border-primary/50"
          : "border-border/50 opacity-50 grayscale hover:opacity-70",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="relative shrink-0 text-2xl">
          {icon}
          {!earned && (
            <div className="absolute inset-0 flex items-center justify-center rounded bg-black/40">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground">
              {name}
            </span>
            {earned && <Check className="h-4 w-4 shrink-0 text-emerald-500" />}
          </div>

          <p className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {description}
          </p>

          {earned && earnedAt && (
            <span className="text-[10px] text-muted-foreground">
              Earned {new Date(earnedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

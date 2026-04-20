"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface XpProgressBarProps {
  totalXp: number;
  level: number;
  levelName: string;
  xpForNext: number;
  progress: number;
  className?: string;
}

export function XpProgressBar({
  totalXp,
  level,
  levelName,
  xpForNext,
  progress,
  className,
}: XpProgressBarProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedWidth(Math.min(1, Math.max(0, progress)) * 100);
    }, 100);
    return () => clearTimeout(timeout);
  }, [progress]);

  const currentXpInLevel = Math.round(progress * xpForNext);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          Level {level} &mdash; {levelName}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-700 ease-out"
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {currentXpInLevel.toLocaleString()} / {xpForNext.toLocaleString()} XP
        </span>
        <span className="text-xs text-muted-foreground">
          {totalXp.toLocaleString()} XP total
        </span>
      </div>
    </div>
  );
}

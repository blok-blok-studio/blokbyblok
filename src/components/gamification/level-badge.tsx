"use client";

import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LevelBadge({ level, size = "md", className }: LevelBadgeProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-8 w-8 text-xs",
    lg: "h-12 w-12 text-base",
  };

  const colorClasses = (() => {
    if (level >= 10) return "bg-gradient-to-br from-yellow-400 to-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.5)]";
    if (level >= 7) return "bg-gradient-to-br from-emerald-500 to-emerald-600";
    if (level >= 4) return "bg-gradient-to-br from-primary to-purple-600";
    return "bg-gradient-to-br from-slate-500 to-slate-600";
  })();

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold text-white",
        sizeClasses[size],
        colorClasses,
        className
      )}
    >
      {level}
    </div>
  );
}

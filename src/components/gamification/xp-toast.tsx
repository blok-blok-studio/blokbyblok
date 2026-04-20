"use client";

import { cn } from "@/lib/utils";
import { Sparkles, Trophy, X } from "lucide-react";
import { useEffect, useState } from "react";

interface XpToastProps {
  xpGained: number;
  levelUp?: { level: number; name: string } | null;
  newAchievements?: { name: string; icon: string }[];
  onClose: () => void;
}

export function XpToast({
  xpGained,
  levelUp,
  newAchievements,
  onClose,
}: XpToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[9000] flex flex-col gap-2 transition-all duration-300",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      )}
    >
      {/* XP Gained */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 shadow-lg">
        <Sparkles className="h-5 w-5 text-yellow-400" />
        <span className="text-lg font-bold text-foreground">
          +{xpGained} XP
        </span>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Level Up */}
      {levelUp && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/50 bg-gradient-to-r from-primary/20 to-purple-600/20 px-5 py-3 shadow-lg">
          <Trophy className="h-5 w-5 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-primary">Level Up!</span>
            <span className="text-sm font-bold text-foreground">
              Level {levelUp.level} &mdash; {levelUp.name}
            </span>
          </div>
        </div>
      )}

      {/* New Achievements */}
      {newAchievements?.map((achievement) => (
        <div
          key={achievement.name}
          className="flex items-center gap-3 rounded-xl border border-emerald-500/50 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 px-5 py-3 shadow-lg"
        >
          <span className="text-lg">{achievement.icon}</span>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-emerald-400">
              Achievement Unlocked
            </span>
            <span className="text-sm font-bold text-foreground">
              {achievement.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

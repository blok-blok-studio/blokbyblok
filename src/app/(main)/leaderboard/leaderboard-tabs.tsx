"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Flame, Trophy, Medal, Award } from "lucide-react";
import { LevelBadge } from "@/components/gamification/level-badge";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string | null;
  image: string | null;
  totalXp: number;
  weeklyXp: number;
  level: number;
  levelName: string;
  currentStreak: number;
  xp: number;
}

interface LeaderboardTabsProps {
  allTimeEntries: LeaderboardEntry[];
  weeklyEntries: LeaderboardEntry[];
  currentUserId: string;
}

const rankIcons = [
  null, // index 0
  <Trophy key="1" className="h-5 w-5 text-yellow-500" />,
  <Medal key="2" className="h-5 w-5 text-gray-400" />,
  <Award key="3" className="h-5 w-5 text-amber-700" />,
];

export function LeaderboardTabs({
  allTimeEntries,
  weeklyEntries,
  currentUserId,
}: LeaderboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"alltime" | "weekly">("alltime");
  const entries = activeTab === "alltime" ? allTimeEntries : weeklyEntries;

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-1 rounded-lg bg-secondary p-1">
        <button
          onClick={() => setActiveTab("alltime")}
          className={cn(
            "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "alltime"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          All Time
        </button>
        <button
          onClick={() => setActiveTab("weekly")}
          className={cn(
            "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "weekly"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          This Week
        </button>
      </div>

      {/* Entries */}
      <div className="space-y-2">
        {entries.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              {activeTab === "weekly"
                ? "No activity this week yet. Be the first!"
                : "No students on the leaderboard yet."}
            </CardContent>
          </Card>
        )}

        {entries.map((entry) => {
          const isCurrentUser = entry.userId === currentUserId;
          const isTop3 = entry.rank <= 3;

          return (
            <Card
              key={entry.userId}
              className={cn(
                "transition-colors",
                isCurrentUser && "border-primary/50 bg-primary/5",
                isTop3 && !isCurrentUser && "border-accent/20"
              )}
            >
              <CardContent className="flex items-center gap-4 p-4">
                {/* Rank */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                  {entry.rank <= 3 ? (
                    rankIcons[entry.rank]
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">
                      {entry.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <Avatar
                  src={entry.image}
                  name={entry.name}
                  size="sm"
                />

                {/* Name + Level */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn("font-medium truncate", isCurrentUser && "text-primary")}>
                      {entry.name || "Student"}
                      {isCurrentUser && " (You)"}
                    </p>
                    <LevelBadge level={entry.level} size="sm" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {entry.levelName}
                  </p>
                </div>

                {/* Streak */}
                {entry.currentStreak > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">{entry.currentStreak}</span>
                  </div>
                )}

                {/* XP */}
                <div className="text-right shrink-0">
                  <p className="font-bold">{entry.xp.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

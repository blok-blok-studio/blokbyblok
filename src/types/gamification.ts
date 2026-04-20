export interface LevelConfig {
  level: number;
  name: string;
  xpRequired: number;
}

export interface LevelInfo {
  level: number;
  name: string;
  currentXp: number;
  xpForNext: number;
  progress: number;
}

export interface XpAwardResult {
  xpGained: number;
  totalXp: number;
  newLevel: number | null;
  levelName: string;
  newAchievements: {
    id: string;
    key: string;
    name: string;
    icon: string;
  }[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string | null;
  image: string | null;
  totalXp: number;
  weeklyXp: number;
  level: number;
  levelName: string;
  currentStreak: number;
}

export interface AchievementWithStatus {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earned: boolean;
  earnedAt: Date | null;
}

export interface AchievementDefinition {
  key: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  threshold?: number;
  order: number;
}

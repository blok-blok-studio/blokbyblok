import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  getOrCreateUserStats,
  resetWeeklyXpIfNeeded,
  calculateLevel,
} from "@/lib/gamification";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  let stats;
  try {
    stats = await getOrCreateUserStats(userId);
  } catch {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Reset weekly XP if the week boundary has passed
  const resetResult = resetWeeklyXpIfNeeded(stats);
  if (resetResult) {
    stats = await resetResult;
  }

  const levelInfo = calculateLevel(stats.totalXp);

  return NextResponse.json({
    totalXp: stats.totalXp,
    level: levelInfo.level,
    levelName: levelInfo.name,
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    streakFreezeAvailable: stats.streakFreezeAvailable,
    weeklyXp: stats.weeklyXp,
    xpForNext: levelInfo.xpForNext,
    progress: Math.round(levelInfo.progress * 100),
  });
}

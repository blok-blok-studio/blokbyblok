import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  getOrCreateUserStats,
  awardXp,
  updateStreak,
  checkAndAwardAchievements,
  calculateLevel,
  XP_VALUES,
} from "@/lib/gamification";

export async function POST() {
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

  // Check if the user already logged in today
  if (stats.lastActivityDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActivity = new Date(stats.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);

    if (lastActivity.getTime() === today.getTime()) {
      // Already logged in today
      const levelInfo = calculateLevel(stats.totalXp);
      return NextResponse.json({
        alreadyLoggedIn: true,
        totalXp: stats.totalXp,
        level: levelInfo.level,
        levelName: levelInfo.name,
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
        weeklyXp: stats.weeklyXp,
        xpGained: 0,
        newAchievements: [],
      });
    }
  }

  // Award daily login XP
  const xpResult = await awardXp(userId, XP_VALUES.DAILY_LOGIN, "daily_login");

  // Update streak
  await updateStreak(userId);

  // Check for new achievements
  const newAchievements = await checkAndAwardAchievements(userId);

  // Get updated stats
  const updatedStats = await getOrCreateUserStats(userId);
  const levelInfo = calculateLevel(updatedStats.totalXp);

  return NextResponse.json({
    alreadyLoggedIn: false,
    totalXp: updatedStats.totalXp,
    level: levelInfo.level,
    levelName: levelInfo.name,
    currentStreak: updatedStats.currentStreak,
    longestStreak: updatedStats.longestStreak,
    weeklyXp: updatedStats.weeklyXp,
    xpGained: xpResult?.xpGained ?? 0,
    newAchievements,
  });
}

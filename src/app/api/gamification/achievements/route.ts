import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/gamification";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Get all achievements from the DB
  const achievements = await prisma.achievement.findMany({
    orderBy: { order: "asc" },
  });

  // Get which ones the user has earned
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    select: {
      achievementId: true,
      earnedAt: true,
    },
  });

  const earnedMap = new Map(
    userAchievements.map((ua) => [ua.achievementId, ua.earnedAt])
  );

  // If no achievements are seeded in the DB yet, fall back to definitions
  if (achievements.length === 0) {
    const result = ACHIEVEMENT_DEFINITIONS.map((def) => ({
      key: def.key,
      name: def.name,
      description: def.description,
      icon: def.icon,
      category: def.category,
      threshold: def.threshold ?? null,
      order: def.order,
      earned: false,
      earnedAt: null,
    }));

    return NextResponse.json(result);
  }

  const result = achievements.map((achievement) => ({
    id: achievement.id,
    key: achievement.key,
    name: achievement.name,
    description: achievement.description,
    icon: achievement.icon,
    category: achievement.category,
    threshold: achievement.threshold,
    order: achievement.order,
    earned: earnedMap.has(achievement.id),
    earnedAt: earnedMap.get(achievement.id) ?? null,
  }));

  return NextResponse.json(result);
}

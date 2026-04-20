import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { calculateLevel } from "@/lib/gamification";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "alltime";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 50);

  const orderBy =
    type === "weekly" ? { weeklyXp: "desc" as const } : { totalXp: "desc" as const };

  const entries = await prisma.userStats.findMany({
    orderBy,
    take: limit,
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  const leaderboard = entries.map((entry, index) => {
    const levelInfo = calculateLevel(entry.totalXp);
    return {
      rank: index + 1,
      name: entry.user.name || "Anonymous",
      image: entry.user.image,
      totalXp: entry.totalXp,
      weeklyXp: entry.weeklyXp,
      level: levelInfo.level,
      levelName: levelInfo.name,
      currentStreak: entry.currentStreak,
    };
  });

  return NextResponse.json(leaderboard);
}

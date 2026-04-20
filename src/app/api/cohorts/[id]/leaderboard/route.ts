import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateLevel } from "@/lib/gamification";

// GET — cohort leaderboard
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Must be a member
  const membership = await prisma.cohortMember.findUnique({
    where: { cohortId_userId: { cohortId: id, userId: session.user.id } },
  });
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 });
  }

  // Get all member IDs
  const members = await prisma.cohortMember.findMany({
    where: { cohortId: id },
    select: { userId: true },
  });
  const memberIds = members.map((m) => m.userId);

  // Get stats for all members
  const stats = await prisma.userStats.findMany({
    where: { userId: { in: memberIds } },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
    orderBy: { totalXp: "desc" },
  });

  const entries = stats.map((s, i) => {
    const level = calculateLevel(s.totalXp);
    return {
      rank: i + 1,
      userId: s.user.id,
      name: s.user.name,
      image: s.user.image,
      totalXp: s.totalXp,
      weeklyXp: s.weeklyXp,
      level: level.level,
      levelName: level.name,
      streak: s.currentStreak,
      isCurrentUser: s.user.id === session.user.id,
    };
  });

  return NextResponse.json(entries);
}

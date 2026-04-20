import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateLevel } from "@/lib/gamification";

// GET — teacher dashboard data
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Must be owner/teacher
  const membership = await prisma.cohortMember.findUnique({
    where: { cohortId_userId: { cohortId: id, userId: session.user.id } },
  });
  if (!membership || membership.role !== "teacher") {
    return NextResponse.json({ error: "Only teachers can view the dashboard" }, { status: 403 });
  }

  // Get all student members
  const members = await prisma.cohortMember.findMany({
    where: { cohortId: id, role: "student" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          stats: true,
          projects: {
            select: { id: true, status: true, lessonId: true },
          },
          projectComments: {
            select: { id: true, projectId: true },
          },
          progress: {
            where: { completed: true },
            select: { id: true },
          },
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });

  const students = members.map((m) => {
    const u = m.user;
    const level = u.stats ? calculateLevel(u.stats.totalXp) : calculateLevel(0);

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
      level: level.level,
      levelName: level.name,
      totalXp: u.stats?.totalXp || 0,
      streak: u.stats?.currentStreak || 0,
      lessonsCompleted: u.progress.length,
      projectsSubmitted: u.projects.length,
      commentsGiven: u.projectComments.length,
      joinedAt: m.joinedAt.toISOString(),
    };
  });

  return NextResponse.json({ students });
}

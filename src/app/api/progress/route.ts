import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  awardXp,
  updateStreak,
  checkAndAwardAchievements,
  getOrCreateUserStats,
  XP_VALUES,
  calculateLevel,
} from "@/lib/gamification";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { lessonId, completed } = await req.json();

  const progress = await prisma.progress.upsert({
    where: {
      userId_lessonId: { userId, lessonId },
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null,
    },
    create: {
      userId,
      lessonId,
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  // Gamification: only award XP when completing (not un-completing)
  if (completed) {
    let totalXpGained = 0;
    let newLevel: number | null = null;
    let levelName = "";

    // Get the lesson to determine XP amount (video vs text)
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            lessons: { select: { id: true } },
            course: {
              include: {
                modules: {
                  include: {
                    lessons: { select: { id: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (lesson) {
      // Award lesson completion XP
      const xpAmount = lesson.videoUrl
        ? XP_VALUES.VIDEO_LESSON_COMPLETE
        : XP_VALUES.LESSON_COMPLETE;

      const lessonXpResult = await awardXp(
        userId,
        xpAmount,
        "lesson_complete",
        lessonId
      );
      if (lessonXpResult && !lessonXpResult.duplicate) {
        totalXpGained += lessonXpResult.xpGained;
        newLevel = lessonXpResult.newLevel;
        levelName = lessonXpResult.levelName;
      }

      // Check if all lessons in the module are now complete
      const moduleLessonIds = lesson.module.lessons.map((l) => l.id);
      const completedInModule = await prisma.progress.count({
        where: {
          userId,
          lessonId: { in: moduleLessonIds },
          completed: true,
        },
      });

      if (completedInModule === moduleLessonIds.length) {
        const moduleXpResult = await awardXp(
          userId,
          XP_VALUES.MODULE_COMPLETE,
          "module_complete",
          lesson.module.id
        );
        if (moduleXpResult && !moduleXpResult.duplicate) {
          totalXpGained += moduleXpResult.xpGained;
          if (moduleXpResult.newLevel) {
            newLevel = moduleXpResult.newLevel;
            levelName = moduleXpResult.levelName;
          }
        }
      }

      // Check if all lessons in the course are now complete
      const allCourseLessonIds = lesson.module.course.modules.flatMap((m) =>
        m.lessons.map((l) => l.id)
      );
      const completedInCourse = await prisma.progress.count({
        where: {
          userId,
          lessonId: { in: allCourseLessonIds },
          completed: true,
        },
      });

      if (completedInCourse === allCourseLessonIds.length) {
        const courseXpResult = await awardXp(
          userId,
          XP_VALUES.COURSE_COMPLETE,
          "course_complete",
          lesson.module.course.id
        );
        if (courseXpResult && !courseXpResult.duplicate) {
          totalXpGained += courseXpResult.xpGained;
          if (courseXpResult.newLevel) {
            newLevel = courseXpResult.newLevel;
            levelName = courseXpResult.levelName;
          }
        }
      }
    }

    // Update streak
    await updateStreak(userId);

    // Check for new achievements
    const newAchievements = await checkAndAwardAchievements(userId);

    // Get final stats
    const stats = await getOrCreateUserStats(userId);
    const levelInfo = calculateLevel(stats.totalXp);

    return NextResponse.json({
      ...progress,
      xpGained: totalXpGained,
      totalXp: stats.totalXp,
      newLevel,
      levelName: levelName || levelInfo.name,
      newAchievements,
    });
  }

  // When un-completing, just return progress without subtracting XP
  return NextResponse.json(progress);
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: "courseId required" }, { status: 400 });
  }

  const progress = await prisma.progress.findMany({
    where: {
      userId: session.user.id,
      lesson: { module: { courseId } },
    },
  });

  return NextResponse.json(progress);
}

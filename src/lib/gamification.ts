import { prisma } from "@/lib/prisma";
import type { UserStats } from "@prisma/client";
import type {
  LevelConfig,
  LevelInfo,
  AchievementDefinition,
} from "@/types/gamification";

// ==========================================
// LEVEL CONFIGURATION
// ==========================================

export const LEVEL_CONFIG: LevelConfig[] = [
  { level: 1, name: "Fresh Blok", xpRequired: 0 },
  { level: 2, name: "Stacker", xpRequired: 100 },
  { level: 3, name: "Builder", xpRequired: 300 },
  { level: 4, name: "Operator", xpRequired: 600 },
  { level: 5, name: "Commander", xpRequired: 1000 },
  { level: 6, name: "Architect", xpRequired: 1500 },
  { level: 7, name: "Blok Chief", xpRequired: 2200 },
  { level: 8, name: "AI Weapon", xpRequired: 3000 },
  { level: 9, name: "Studio Lead", xpRequired: 4000 },
  { level: 10, name: "Blok Legend", xpRequired: 5500 },
];

// ==========================================
// XP VALUES
// ==========================================

export const XP_VALUES = {
  LESSON_COMPLETE: 25,
  VIDEO_LESSON_COMPLETE: 35,
  MODULE_COMPLETE: 50,
  COURSE_COMPLETE: 200,
  DAILY_LOGIN: 10,
  STREAK_BONUS_7: 50,
  STREAK_BONUS_30: 150,
  PROJECT_COMMENT: 10,
  COHORT_PARTICIPATION: 25,
} as const;

// ==========================================
// ACHIEVEMENT DEFINITIONS
// ==========================================

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // Learning
  {
    key: "first_lesson",
    name: "First Steps",
    description: "Complete your first lesson",
    icon: "BookOpen",
    category: "learning",
    threshold: 1,
    order: 1,
  },
  {
    key: "ten_lessons",
    name: "Dedicated Learner",
    description: "Complete 10 lessons",
    icon: "BookMarked",
    category: "learning",
    threshold: 10,
    order: 2,
  },
  {
    key: "fifty_lessons",
    name: "Knowledge Seeker",
    description: "Complete 50 lessons",
    icon: "Library",
    category: "learning",
    threshold: 50,
    order: 3,
  },
  {
    key: "first_course",
    name: "Course Champion",
    description: "Complete your first course",
    icon: "GraduationCap",
    category: "learning",
    threshold: 1,
    order: 4,
  },
  {
    key: "all_courses",
    name: "Completionist",
    description: "Complete all available courses",
    icon: "Trophy",
    category: "learning",
    order: 5,
  },
  // Streaks
  {
    key: "streak_3",
    name: "Getting Started",
    description: "Maintain a 3-day streak",
    icon: "Flame",
    category: "streaks",
    threshold: 3,
    order: 6,
  },
  {
    key: "streak_7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "Flame",
    category: "streaks",
    threshold: 7,
    order: 7,
  },
  {
    key: "streak_14",
    name: "Two-Week Titan",
    description: "Maintain a 14-day streak",
    icon: "Flame",
    category: "streaks",
    threshold: 14,
    order: 8,
  },
  {
    key: "streak_30",
    name: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "Flame",
    category: "streaks",
    threshold: 30,
    order: 9,
  },
  {
    key: "streak_100",
    name: "Unstoppable",
    description: "Maintain a 100-day streak",
    icon: "Zap",
    category: "streaks",
    threshold: 100,
    order: 10,
  },
  // Milestones
  {
    key: "level_5",
    name: "Rising Star",
    description: "Reach level 5",
    icon: "Star",
    category: "milestones",
    threshold: 5,
    order: 11,
  },
  {
    key: "level_10",
    name: "Living Legend",
    description: "Reach level 10",
    icon: "Crown",
    category: "milestones",
    threshold: 10,
    order: 12,
  },
  {
    key: "xp_1000",
    name: "XP Hunter",
    description: "Earn 1,000 total XP",
    icon: "Target",
    category: "milestones",
    threshold: 1000,
    order: 13,
  },
  {
    key: "xp_5000",
    name: "XP Legend",
    description: "Earn 5,000 total XP",
    icon: "Award",
    category: "milestones",
    threshold: 5000,
    order: 14,
  },
  // Community
  {
    key: "first_comment",
    name: "Conversation Starter",
    description: "Leave your first project comment",
    icon: "MessageSquare",
    category: "community",
    threshold: 1,
    order: 15,
  },
  {
    key: "ten_comments",
    name: "Active Critic",
    description: "Leave 10 project comments",
    icon: "MessageSquareMore",
    category: "community",
    threshold: 10,
    order: 16,
  },
  {
    key: "fifty_comments",
    name: "Community Pillar",
    description: "Leave 50 project comments",
    icon: "MessagesSquare",
    category: "community",
    threshold: 50,
    order: 17,
  },
];

// ==========================================
// CORE FUNCTIONS
// ==========================================

/**
 * Calculate level info from total XP (pure function).
 */
export function calculateLevel(totalXp: number): LevelInfo {
  let currentLevel = LEVEL_CONFIG[0];

  for (const config of LEVEL_CONFIG) {
    if (totalXp >= config.xpRequired) {
      currentLevel = config;
    } else {
      break;
    }
  }

  const currentIndex = LEVEL_CONFIG.indexOf(currentLevel);
  const nextLevel = LEVEL_CONFIG[currentIndex + 1];

  const xpForNext = nextLevel ? nextLevel.xpRequired : currentLevel.xpRequired;
  const xpIntoLevel = totalXp - currentLevel.xpRequired;
  const xpNeededForNext = nextLevel
    ? nextLevel.xpRequired - currentLevel.xpRequired
    : 0;
  const progress = xpNeededForNext > 0 ? xpIntoLevel / xpNeededForNext : 1;

  return {
    level: currentLevel.level,
    name: currentLevel.name,
    currentXp: totalXp,
    xpForNext,
    progress: Math.min(Math.max(progress, 0), 1),
  };
}

/**
 * Get or create user stats record.
 */
export async function getOrCreateUserStats(userId: string) {
  // Verify user exists first to avoid FK constraint errors
  const userExists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!userExists) {
    throw new Error(`User ${userId} not found`);
  }

  return prisma.userStats.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      totalXp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      weeklyXp: 0,
      weeklyResetAt: getStartOfWeek(),
      streakFreezeAvailable: true,
    },
  });
}

/**
 * Award XP to a user with duplicate prevention.
 * Returns old and new level for level-up detection.
 */
export async function awardXp(
  userId: string,
  amount: number,
  reason: string,
  referenceId?: string
) {
  // Duplicate check
  if (referenceId) {
    const existing = await prisma.xpEvent.findFirst({
      where: { userId, reason, referenceId },
    });
    if (existing) {
      const stats = await getOrCreateUserStats(userId);
      const levelInfo = calculateLevel(stats.totalXp);
      return {
        xpGained: 0,
        totalXp: stats.totalXp,
        oldLevel: levelInfo.level,
        newLevel: null,
        levelName: levelInfo.name,
        duplicate: true,
      };
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    // Get current stats
    const currentStats = await tx.userStats.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        totalXp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        weeklyXp: 0,
        weeklyResetAt: getStartOfWeek(),
        streakFreezeAvailable: true,
      },
    });

    const oldLevelInfo = calculateLevel(currentStats.totalXp);
    const newTotalXp = currentStats.totalXp + amount;
    const newLevelInfo = calculateLevel(newTotalXp);

    // Create XP event
    await tx.xpEvent.create({
      data: {
        userId,
        amount,
        reason,
        referenceId: referenceId ?? null,
      },
    });

    // Update stats
    await tx.userStats.update({
      where: { userId },
      data: {
        totalXp: newTotalXp,
        weeklyXp: currentStats.weeklyXp + amount,
        level: newLevelInfo.level,
      },
    });

    return {
      xpGained: amount,
      totalXp: newTotalXp,
      oldLevel: oldLevelInfo.level,
      newLevel:
        newLevelInfo.level > oldLevelInfo.level ? newLevelInfo.level : null,
      levelName: newLevelInfo.name,
      duplicate: false,
    };
  });

  return result;
}

/**
 * Update the user's daily streak.
 */
export async function updateStreak(userId: string) {
  const stats = await getOrCreateUserStats(userId);
  const today = getStartOfDay(new Date());

  if (!stats.lastActivityDate) {
    // First activity ever
    await prisma.userStats.update({
      where: { userId },
      data: {
        currentStreak: 1,
        longestStreak: Math.max(1, stats.longestStreak),
        lastActivityDate: today,
      },
    });
    return;
  }

  const lastActivity = getStartOfDay(stats.lastActivityDate);
  const diffMs = today.getTime() - lastActivity.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Same day, no-op
    return;
  }

  if (diffDays === 1) {
    // Yesterday: increment streak
    const newStreak = stats.currentStreak + 1;
    await prisma.userStats.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, stats.longestStreak),
        lastActivityDate: today,
      },
    });
    return;
  }

  // More than 1 day gap
  if (diffDays === 2 && stats.streakFreezeAvailable) {
    // Use streak freeze (covers the missed day)
    const newStreak = stats.currentStreak + 1;
    await prisma.userStats.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, stats.longestStreak),
        lastActivityDate: today,
        streakFreezeAvailable: false,
        streakFreezeUsedAt: new Date(),
      },
    });
  } else {
    // Reset streak
    await prisma.userStats.update({
      where: { userId },
      data: {
        currentStreak: 1,
        lastActivityDate: today,
      },
    });
  }
}

/**
 * Check and award any newly earned achievements.
 */
export async function checkAndAwardAchievements(userId: string) {
  const stats = await getOrCreateUserStats(userId);

  // Count completed lessons
  const completedLessonsCount = await prisma.progress.count({
    where: { userId, completed: true },
  });

  // Count completed courses (all lessons in a course completed)
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: {
                select: { id: true },
              },
            },
          },
        },
      },
    },
  });

  let completedCoursesCount = 0;
  const totalCoursesCount = await prisma.course.count({
    where: { published: true },
  });

  for (const enrollment of enrollments) {
    const allLessonIds = enrollment.course.modules.flatMap((m) =>
      m.lessons.map((l) => l.id)
    );
    if (allLessonIds.length === 0) continue;

    const completedInCourse = await prisma.progress.count({
      where: {
        userId,
        lessonId: { in: allLessonIds },
        completed: true,
      },
    });

    if (completedInCourse === allLessonIds.length) {
      completedCoursesCount++;
    }
  }

  // Count project comments
  const commentCount = await prisma.projectComment.count({
    where: { authorId: userId },
  });

  // Existing achievements for this user
  const existingAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
  });
  const earnedKeys = new Set(existingAchievements.map((a) => a.achievement.key));

  const newlyEarned: { id: string; key: string; name: string; icon: string }[] =
    [];

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    if (earnedKeys.has(def.key)) continue;

    let qualifies = false;

    switch (def.key) {
      // Learning
      case "first_lesson":
        qualifies = completedLessonsCount >= (def.threshold ?? 1);
        break;
      case "ten_lessons":
        qualifies = completedLessonsCount >= (def.threshold ?? 10);
        break;
      case "fifty_lessons":
        qualifies = completedLessonsCount >= (def.threshold ?? 50);
        break;
      case "first_course":
        qualifies = completedCoursesCount >= (def.threshold ?? 1);
        break;
      case "all_courses":
        qualifies =
          totalCoursesCount > 0 && completedCoursesCount >= totalCoursesCount;
        break;

      // Streaks
      case "streak_3":
      case "streak_7":
      case "streak_14":
      case "streak_30":
      case "streak_100":
        qualifies = stats.currentStreak >= (def.threshold ?? 0);
        break;

      // Milestones
      case "level_5":
      case "level_10":
        qualifies = stats.level >= (def.threshold ?? 0);
        break;
      case "xp_1000":
      case "xp_5000":
        qualifies = stats.totalXp >= (def.threshold ?? 0);
        break;

      // Community
      case "first_comment":
      case "ten_comments":
      case "fifty_comments":
        qualifies = commentCount >= (def.threshold ?? 0);
        break;
    }

    if (qualifies) {
      // Find or create the achievement definition in the DB
      const achievement = await prisma.achievement.upsert({
        where: { key: def.key },
        update: {},
        create: {
          key: def.key,
          name: def.name,
          description: def.description,
          icon: def.icon,
          category: def.category,
          threshold: def.threshold ?? null,
          order: def.order,
        },
      });

      // Double-check it hasn't been awarded in the meantime
      const alreadyAwarded = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
      });

      if (!alreadyAwarded) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });

        newlyEarned.push({
          id: achievement.id,
          key: achievement.key,
          name: achievement.name,
          icon: achievement.icon,
        });
      }
    }
  }

  return newlyEarned;
}

/**
 * Reset weekly XP if the weekly reset date has passed (Monday boundary).
 */
export function resetWeeklyXpIfNeeded(stats: UserStats) {
  const currentMonday = getStartOfWeek();
  if (stats.weeklyResetAt < currentMonday) {
    return prisma.userStats.update({
      where: { userId: stats.userId },
      data: {
        weeklyXp: 0,
        weeklyResetAt: currentMonday,
      },
    });
  }
  return null;
}

// ==========================================
// HELPERS
// ==========================================

/**
 * Get the start of today (midnight, no time component).
 */
function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the most recent Monday at midnight.
 */
function getStartOfWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  // day: 0=Sun, 1=Mon, ...
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(monday.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

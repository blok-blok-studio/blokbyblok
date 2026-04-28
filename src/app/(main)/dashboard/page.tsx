import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, Trophy, Flame, Zap, Sparkles, ArrowRight, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { LEVEL_CONFIG, calculateLevel } from "@/lib/gamification";
import { OnboardingChecklist } from "@/components/onboarding/onboarding-checklist";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  progress: {
                    where: { userId: session.user.id },
                  },
                },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  const totalLessonsCompleted = enrollments.reduce((acc, enrollment) => {
    return (
      acc +
      enrollment.course.modules.reduce(
        (mAcc, mod) =>
          mAcc + mod.lessons.filter((l) => l.progress.some((p) => p.completed)).length,
        0
      )
    );
  }, 0);

  const allCourses = await prisma.course.findMany({
    where: { published: true },
    include: { _count: { select: { enrollments: true } } },
    orderBy: { order: "asc" },
  });

  // Gamification stats
  const userStats = await prisma.userStats.findUnique({
    where: { userId: session.user.id },
  });
  const levelInfo = userStats ? calculateLevel(userStats.totalXp) : calculateLevel(0);

  // Day 0 Setup course — show a "Start Here" nudge until every lesson is done.
  const setupCourse = await prisma.course.findUnique({
    where: { slug: "setup" },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              progress: { where: { userId: session.user.id } },
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });
  const setupTotalLessons =
    setupCourse?.modules.reduce((n, m) => n + m.lessons.length, 0) ?? 0;
  const setupCompletedLessons =
    setupCourse?.modules.reduce(
      (n, m) =>
        n + m.lessons.filter((l) => l.progress.some((p) => p.completed)).length,
      0,
    ) ?? 0;
  const setupFirstLessonSlug =
    setupCourse?.modules[0]?.lessons.find((l) => l.order === 0)?.slug ??
    setupCourse?.modules[0]?.lessons[0]?.slug;
  const showSetupNudge =
    !!setupCourse &&
    setupTotalLessons > 0 &&
    setupCompletedLessons < setupTotalLessons;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {session.user.name?.split(" ")[0] || "Student"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Keep building. Your terminal is your superpower — pick up where you left off.
        </p>
      </div>

      {/* Day 0 Setup Nudge — shows until every setup lesson is complete */}
      {showSetupNudge && setupCourse && (
        <Card className="overflow-hidden border-accent/40 bg-gradient-to-r from-accent/10 via-background to-primary/10">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15">
              <Wrench className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Start Here
              </p>
              <p className="mt-0.5 font-semibold">
                Day 0: Set Up Your Computer
              </p>
              <p className="text-sm text-muted-foreground">
                Install Git, Node, Python, VS Code, and Claude Code before your first class.
                {setupCompletedLessons > 0 &&
                  ` ${setupCompletedLessons}/${setupTotalLessons} lessons done.`}
              </p>
            </div>
            <Link
              href={
                setupFirstLessonSlug
                  ? `/courses/setup/lesson/${setupFirstLessonSlug}`
                  : `/courses/setup`
              }
            >
              <Button size="sm" className="shrink-0 gap-1.5">
                {setupCompletedLessons > 0 ? "Continue Setup" : "Start Setup"}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Onboarding Checklist */}
      <OnboardingChecklist
        hasEnrollments={enrollments.length > 0}
        hasCompletedLesson={totalLessonsCompleted > 0}
        hasXp={(userStats?.totalXp || 0) > 0}
        userName={session.user.name}
      />

      {/* Gamification Banner */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Level + XP */}
            <div className="flex items-center gap-4 flex-1">
              <div className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white shrink-0",
                levelInfo.level >= 7 ? "bg-gradient-to-br from-emerald-500 to-emerald-700" :
                levelInfo.level >= 4 ? "bg-gradient-to-br from-primary to-purple-700" :
                "bg-gradient-to-br from-slate-500 to-slate-700"
              )}>
                {levelInfo.level}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">
                  Level {levelInfo.level} — {levelInfo.name}
                </p>
                <div className="mt-1.5 h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                    style={{ width: `${levelInfo.progress * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {userStats?.totalXp?.toLocaleString() || 0} / {levelInfo.xpForNext.toLocaleString()} XP
                </p>
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-3">
                <Flame className={cn("h-6 w-6", (userStats?.currentStreak || 0) > 0 ? "text-orange-500" : "text-muted-foreground")} />
                <div>
                  <p className="text-xl font-bold">{userStats?.currentStreak || 0}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-3">
                <Zap className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-xl font-bold">{userStats?.weeklyXp || 0}</p>
                  <p className="text-xs text-muted-foreground">Weekly XP</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{enrollments.length}</p>
              <p className="text-sm text-muted-foreground">Enrolled Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <CheckCircle2 className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalLessonsCompleted}</p>
              <p className="text-sm text-muted-foreground">Lessons Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{allCourses.length}</p>
              <p className="text-sm text-muted-foreground">Available Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Trophy className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {enrollments.filter((e) => {
                  const total = e.course.modules.reduce((a, m) => a + m.lessons.length, 0);
                  const done = e.course.modules.reduce(
                    (a, m) =>
                      a + m.lessons.filter((l) => l.progress.some((p) => p.completed)).length,
                    0
                  );
                  return total > 0 && done === total;
                }).length}
              </p>
              <p className="text-sm text-muted-foreground">Courses Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      {enrollments.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Your Courses</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => {
              const totalLessons = enrollment.course.modules.reduce(
                (a, m) => a + m.lessons.length,
                0
              );
              const completedLessons = enrollment.course.modules.reduce(
                (a, m) =>
                  a + m.lessons.filter((l) => l.progress.some((p) => p.completed)).length,
                0
              );
              const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

              // Find next incomplete lesson
              let nextLesson: { slug: string; moduleSlug?: string } | null = null;
              for (const mod of enrollment.course.modules) {
                for (const lesson of mod.lessons) {
                  if (!lesson.progress.some((p) => p.completed)) {
                    nextLesson = { slug: lesson.slug };
                    break;
                  }
                }
                if (nextLesson) break;
              }

              return (
                <Card key={enrollment.id} className="overflow-hidden">
                  <div className="h-2 bg-secondary">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">
                        {enrollment.course.title}
                      </CardTitle>
                      <Badge variant={progress === 100 ? "accent" : "secondary"}>
                        {Math.round(progress)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ProgressBar value={progress} />
                    <p className="text-sm text-muted-foreground">
                      {completedLessons} of {totalLessons} lessons
                    </p>
                    <Link
                      href={
                        nextLesson
                          ? `/courses/${enrollment.course.slug}/lesson/${nextLesson.slug}`
                          : `/courses/${enrollment.course.slug}`
                      }
                    >
                      <Button size="sm" className="w-full">
                        {progress === 100 ? "Review Course" : "Continue Learning"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Browse Courses */}
      {enrollments.length < allCourses.length && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Expand Your AI Command Skills</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allCourses
              .filter((c) => !enrollments.some((e) => e.courseId === c.id))
              .map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline">{course._count.enrollments} enrolled</Badge>
                    </div>
                    <Link href={`/courses/${course.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Course
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
      {/* Coming Soon Teaser */}
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 via-background to-accent/5">
        <CardContent className="flex items-center gap-6 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">New AI command courses dropping soon</p>
            <p className="text-sm text-muted-foreground">
              Full Stack with Claude, Hardware + AI, and more — all AI-first, no manual coding.
            </p>
          </div>
          <Link href="/courses">
            <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
              View All
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

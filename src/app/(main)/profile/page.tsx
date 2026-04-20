import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { BookOpen, CheckCircle2, Calendar, Flame, Zap, Trophy, Lock } from "lucide-react";
import { calculateLevel, LEVEL_CONFIG } from "@/lib/gamification";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              modules: {
                include: { lessons: { select: { id: true } } },
              },
            },
          },
        },
      },
      progress: { where: { completed: true } },
      stats: true,
      achievements: {
        include: { achievement: true },
      },
    },
  });

  if (!user) return null;

  // Gamification
  const levelInfo = user.stats ? calculateLevel(user.stats.totalXp) : calculateLevel(0);
  const allAchievements = await prisma.achievement.findMany({ orderBy: { order: "asc" } });
  const earnedIds = new Set(user.achievements.map((ua) => ua.achievementId));

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Profile Card */}
      <Card>
        <CardContent className="flex items-center gap-6 p-8">
          <Avatar src={user.image} name={user.name} size="lg" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex items-center gap-3">
              <Badge>{user.role}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Joined {user.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
            {user.bio && <p className="mt-3 text-sm">{user.bio}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Gamification Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className={cn(
              "mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white",
              levelInfo.level >= 7 ? "bg-gradient-to-br from-emerald-500 to-emerald-700" :
              levelInfo.level >= 4 ? "bg-gradient-to-br from-primary to-purple-700" :
              "bg-gradient-to-br from-slate-500 to-slate-700"
            )}>
              {levelInfo.level}
            </div>
            <p className="text-sm font-medium">{levelInfo.name}</p>
            <p className="text-xs text-muted-foreground">{user.stats?.totalXp?.toLocaleString() || 0} XP</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Flame className={cn("mx-auto mb-2 h-10 w-10", (user.stats?.currentStreak || 0) > 0 ? "text-orange-500" : "text-muted-foreground")} />
            <p className="text-2xl font-bold">{user.stats?.currentStreak || 0}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
            {(user.stats?.longestStreak || 0) > 0 && (
              <p className="text-xs text-muted-foreground mt-1">Best: {user.stats?.longestStreak} days</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold">{user.progress.length}</p>
            <p className="text-sm text-muted-foreground">Lessons Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold">
              {user.enrollments.filter((e) => {
                const total = e.course.modules.reduce((a, m) => a + m.lessons.length, 0);
                return total > 0 && user.progress.length >= total;
              }).length}
            </p>
            <p className="text-sm text-muted-foreground">Courses Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Level {levelInfo.level} — {levelInfo.name}</p>
            <p className="text-sm text-muted-foreground">
              {levelInfo.level < 10
                ? `${levelInfo.xpForNext - levelInfo.currentXp} XP to Level ${levelInfo.level + 1}`
                : "Max Level!"}
            </p>
          </div>
          <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
              style={{ width: `${levelInfo.progress * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <div>
        <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Achievements
          <Badge variant="outline">{user.achievements.length}/{allAchievements.length}</Badge>
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allAchievements.map((achievement) => {
            const earned = earnedIds.has(achievement.id);
            const earnedAt = user.achievements.find((ua) => ua.achievementId === achievement.id)?.earnedAt;
            return (
              <Card
                key={achievement.id}
                className={cn(
                  "transition-all",
                  earned ? "border-accent/30" : "opacity-50"
                )}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg text-lg shrink-0",
                    earned ? "bg-accent/10" : "bg-secondary"
                  )}>
                    {earned ? achievement.icon : <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                    {earned && earnedAt && (
                      <p className="text-xs text-accent mt-0.5">
                        Earned {new Date(earnedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Enrollment List */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Enrolled Courses</h2>
        <div className="space-y-3">
          {user.enrollments.map((enrollment) => {
            const totalLessons = enrollment.course.modules.reduce(
              (a, m) => a + m.lessons.length,
              0
            );
            const allLessonIds = enrollment.course.modules.flatMap((m) =>
              m.lessons.map((l) => l.id)
            );
            const completedCount = user.progress.filter(
              (p) => p.completed && allLessonIds.includes(p.lessonId)
            ).length;
            const progress =
              totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

            return (
              <Card key={enrollment.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <BookOpen className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{enrollment.course.title}</p>
                    <ProgressBar value={progress} className="mt-2" />
                  </div>
                  <Badge variant={progress === 100 ? "accent" : "outline"}>
                    {Math.round(progress)}%
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
          {user.enrollments.length === 0 && (
            <p className="text-muted-foreground text-sm">
              You haven&apos;t enrolled in any courses yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { LEVEL_CONFIG } from "@/lib/gamification";
import { LeaderboardTabs } from "./leaderboard-tabs";
import { LeaderboardFilter } from "./leaderboard-filter";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ cohortId?: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;

  const { cohortId } = await searchParams;

  // Get user's cohorts for the filter dropdown
  const userCohorts = await prisma.cohortMember.findMany({
    where: { userId: session.user.id },
    include: { cohort: { select: { id: true, name: true } } },
  });
  const cohortOptions = userCohorts.map((m) => ({ id: m.cohort.id, name: m.cohort.name }));

  // If filtering by cohort, get member IDs
  let memberFilter: string[] | undefined;
  if (cohortId) {
    const members = await prisma.cohortMember.findMany({
      where: { cohortId },
      select: { userId: true },
    });
    memberFilter = members.map((m) => m.userId);
  }

  // Get all-time leaderboard
  const allTimeStats = await prisma.userStats.findMany({
    orderBy: { totalXp: "desc" },
    take: 50,
    where: memberFilter ? { userId: { in: memberFilter } } : undefined,
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  // Get weekly leaderboard
  const weeklyStats = await prisma.userStats.findMany({
    orderBy: { weeklyXp: "desc" },
    take: 50,
    where: {
      weeklyXp: { gt: 0 },
      ...(memberFilter ? { userId: { in: memberFilter } } : {}),
    },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  const formatEntries = (stats: typeof allTimeStats, useWeekly = false) =>
    stats.map((s, i) => ({
      rank: i + 1,
      userId: s.user.id,
      name: s.user.name,
      image: s.user.image,
      totalXp: s.totalXp,
      weeklyXp: s.weeklyXp,
      level: s.level,
      levelName: LEVEL_CONFIG.find((l) => l.level === s.level)?.name || "Newcomer",
      currentStreak: s.currentStreak,
      xp: useWeekly ? s.weeklyXp : s.totalXp,
    }));

  const allTimeEntries = formatEntries(allTimeStats);
  const weeklyEntries = formatEntries(weeklyStats, true);

  // Current user's rank
  const userRank = allTimeEntries.findIndex((e) => e.userId === session.user.id) + 1;
  const userStats = allTimeEntries.find((e) => e.userId === session.user.id);

  const selectedCohortName = cohortId
    ? cohortOptions.find((c) => c.id === cohortId)?.name
    : null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="mt-1 text-muted-foreground">
            {selectedCohortName
              ? `Showing ${selectedCohortName} members`
              : "See how you stack up against all students."}
          </p>
        </div>
        {cohortOptions.length > 0 && (
          <LeaderboardFilter
            cohorts={cohortOptions}
            selectedCohortId={cohortId || null}
          />
        )}
      </div>

      {/* Your Rank Card */}
      {userStats && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
                #{userRank || "—"}
              </div>
              <div>
                <p className="font-semibold text-lg">{session.user.name || "You"}</p>
                <p className="text-sm text-muted-foreground">
                  Level {userStats.level} — {userStats.levelName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-right">
              <div>
                <p className="text-2xl font-bold">{userStats.totalXp.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total XP</p>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-lg font-bold">{userStats.currentStreak}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Tabs */}
      <LeaderboardTabs
        allTimeEntries={allTimeEntries}
        weeklyEntries={weeklyEntries}
        currentUserId={session.user.id}
      />
    </div>
  );
}

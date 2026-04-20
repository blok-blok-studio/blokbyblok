import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Crown, Users, FolderGit2, BookOpen } from "lucide-react";
import { calculateLevel } from "@/lib/gamification";
import { CohortTabs } from "./cohort-tabs";

export default async function CohortDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Verify membership
  const membership = await prisma.cohortMember.findUnique({
    where: { cohortId_userId: { cohortId: id, userId: session.user.id } },
  });
  if (!membership) notFound();

  const cohort = await prisma.cohort.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true } },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              stats: { select: { totalXp: true, level: true, currentStreak: true, weeklyXp: true } },
            },
          },
        },
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  if (!cohort) notFound();

  const isOwner = cohort.ownerId === session.user.id;
  const memberIds = cohort.members.map((m) => m.user.id);

  // Fetch assigned courses
  const cohortCourses = await prisma.cohortCourse.findMany({
    where: { cohortId: id },
    include: {
      course: {
        include: {
          modules: {
            include: { lessons: { select: { id: true, duration: true } } },
            orderBy: { order: "asc" },
          },
          _count: { select: { enrollments: true } },
          enrollments: session?.user?.id
            ? { where: { userId: session.user.id }, select: { id: true } }
            : false,
        },
      },
    },
  });

  // Fetch all published courses (for the teacher to assign)
  const allCourses = isOwner
    ? await prisma.course.findMany({
        where: { published: true },
        select: { id: true, title: true, slug: true },
        orderBy: { order: "asc" },
      })
    : [];

  const assignedCourseIds = cohortCourses.map((cc) => cc.courseId);

  const serializedCourses = cohortCourses.map((cc) => ({
    id: cc.course.id,
    title: cc.course.title,
    slug: cc.course.slug,
    description: cc.course.description,
    moduleCount: cc.course.modules.length,
    lessonCount: cc.course.modules.reduce((a, m) => a + m.lessons.length, 0),
    totalDuration: cc.course.modules.reduce(
      (a, m) => a + m.lessons.reduce((la, l) => la + (l.duration || 0), 0), 0
    ),
    enrollmentCount: cc.course._count.enrollments,
    isEnrolled: cc.course.enrollments && cc.course.enrollments.length > 0,
  }));

  // Fetch projects from members
  const projects = await prisma.project.findMany({
    where: { userId: { in: memberIds } },
    include: {
      user: { select: { id: true, name: true, image: true } },
      lesson: {
        select: {
          title: true,
          slug: true,
          module: { select: { title: true, course: { select: { title: true, slug: true } } } },
        },
      },
      _count: { select: { comments: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  // Leaderboard entries
  const leaderboard = cohort.members
    .map((m) => {
      const level = calculateLevel(m.user.stats?.totalXp || 0);
      return {
        userId: m.user.id,
        name: m.user.name,
        image: m.user.image,
        totalXp: m.user.stats?.totalXp || 0,
        weeklyXp: m.user.stats?.weeklyXp || 0,
        level: level.level,
        levelName: level.name,
        streak: m.user.stats?.currentStreak || 0,
        isCurrentUser: m.user.id === session.user.id,
        role: m.role,
      };
    })
    .sort((a, b) => b.totalXp - a.totalXp)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  // Members data
  const members = cohort.members.map((m) => ({
    userId: m.user.id,
    name: m.user.name,
    image: m.user.image,
    role: m.role,
    level: calculateLevel(m.user.stats?.totalXp || 0).level,
    totalXp: m.user.stats?.totalXp || 0,
    joinedAt: m.joinedAt.toISOString(),
  }));

  // Serialize projects
  const serializedProjects = projects.map((p) => ({
    id: p.id,
    repoUrl: p.repoUrl,
    status: p.status,
    submittedAt: p.submittedAt.toISOString(),
    commentCount: p._count.comments,
    authorId: p.user.id,
    authorName: p.user.name,
    authorImage: p.user.image,
    lessonTitle: p.lesson.title,
    lessonSlug: p.lesson.slug,
    moduleName: p.lesson.module.title,
    courseTitle: p.lesson.module.course.title,
    courseSlug: p.lesson.module.course.slug,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{cohort.name}</h1>
          {cohort.description && (
            <p className="mt-1 text-muted-foreground">{cohort.description}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {cohort.members.length} members
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {serializedCourses.length} courses
            </span>
            <span className="flex items-center gap-1.5">
              <FolderGit2 className="h-4 w-4" />
              {projects.length} projects
            </span>
          </div>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2">
            <span className="text-xs text-muted-foreground">Join code:</span>
            <code className="font-mono text-sm font-bold tracking-wider text-primary">{cohort.code}</code>
          </div>
        )}
      </div>

      {/* Tabs: Project Board, Leaderboard, Members */}
      <CohortTabs
        projects={serializedProjects}
        leaderboard={leaderboard}
        members={members}
        courses={serializedCourses}
        allCourses={allCourses}
        assignedCourseIds={assignedCourseIds}
        currentUserId={session.user.id}
        cohortId={id}
        isOwner={isOwner}
      />
    </div>
  );
}

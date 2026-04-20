import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, XCircle, Users, BookOpen, MessageSquare, FolderGit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { calculateLevel } from "@/lib/gamification";

export default async function TeacherDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Must be owner/teacher
  const membership = await prisma.cohortMember.findUnique({
    where: { cohortId_userId: { cohortId: id, userId: session.user.id } },
  });
  if (!membership || membership.role !== "teacher") notFound();

  const cohort = await prisma.cohort.findUnique({
    where: { id },
    select: { name: true, code: true },
  });
  if (!cohort) notFound();

  // Get all student members with full data
  const students = await prisma.cohortMember.findMany({
    where: { cohortId: id, role: "student" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          stats: true,
          projects: { select: { id: true } },
          projectComments: { select: { id: true } },
          progress: { where: { completed: true }, select: { id: true } },
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });

  const MIN_COMMENTS = 2;

  const studentData = students.map((s) => {
    const u = s.user;
    const level = calculateLevel(u.stats?.totalXp || 0);
    const meetsMinComments = u.projectComments.length >= MIN_COMMENTS;

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
      meetsMinComments,
    };
  });

  const totalStudents = studentData.length;
  const totalParticipating = studentData.filter((s) => s.meetsMinComments).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href={`/cohorts/${id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2">
          <ChevronLeft className="h-4 w-4" />
          Back to {cohort.name}
        </Link>
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          {cohort.name} — Join code: <code className="font-mono font-bold text-primary">{cohort.code}</code>
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalStudents}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <CheckCircle2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalParticipating}/{totalStudents}</p>
              <p className="text-xs text-muted-foreground">Meeting comment min ({MIN_COMMENTS}+)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FolderGit2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentData.reduce((a, s) => a + s.projectsSubmitted, 0)}</p>
              <p className="text-xs text-muted-foreground">Total Projects</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <MessageSquare className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentData.reduce((a, s) => a + s.commentsGiven, 0)}</p>
              <p className="text-xs text-muted-foreground">Total Comments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {studentData.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No students have joined yet. Share the code: <code className="font-mono font-bold text-primary">{cohort.code}</code>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">Level</th>
                    <th className="px-4 py-3 font-medium text-right">XP</th>
                    <th className="px-4 py-3 font-medium text-right">Lessons</th>
                    <th className="px-4 py-3 font-medium text-right">Projects</th>
                    <th className="px-4 py-3 font-medium text-right">Comments</th>
                    <th className="px-4 py-3 font-medium text-center">Participation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {studentData.map((s) => (
                    <tr key={s.id} className="hover:bg-secondary/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={s.image} name={s.name} size="sm" />
                          <div>
                            <p className="text-sm font-medium">{s.name || "Student"}</p>
                            <p className="text-xs text-muted-foreground">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-xs">
                          Lv.{s.level} {s.levelName}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium">{s.totalXp.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-sm">{s.lessonsCompleted}</td>
                      <td className="px-4 py-3 text-right text-sm">{s.projectsSubmitted}</td>
                      <td className="px-4 py-3 text-right text-sm">{s.commentsGiven}</td>
                      <td className="px-4 py-3 text-center">
                        {s.meetsMinComments ? (
                          <CheckCircle2 className="mx-auto h-5 w-5 text-accent" />
                        ) : (
                          <XCircle className="mx-auto h-5 w-5 text-destructive/60" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

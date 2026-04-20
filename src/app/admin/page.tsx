import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, GraduationCap, Plus, Edit, Film } from "lucide-react";

export default async function AdminDashboardPage() {
  const [userCount, courseCount, enrollmentCount, courses] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.course.findMany({
      include: {
        _count: { select: { enrollments: true, modules: true } },
        modules: { include: { _count: { select: { lessons: true } } } },
      },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Manage courses, users, and content.
          </p>
        </div>
        <Link href="/admin/courses/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Course
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userCount}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <BookOpen className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{courseCount}</p>
              <p className="text-sm text-muted-foreground">Total Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{enrollmentCount}</p>
              <p className="text-sm text-muted-foreground">Total Enrollments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/recordings">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Film className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Manage Recordings</p>
                <p className="text-sm text-muted-foreground">
                  Add and edit video recordings
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Course List */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">All Courses</h2>
        <div className="space-y-3">
          {courses.map((course) => {
            const totalLessons = course.modules.reduce(
              (a, m) => a + m._count.lessons,
              0
            );
            return (
              <Card key={course.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{course.title}</p>
                        <Badge variant={course.published ? "accent" : "secondary"}>
                          {course.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {course._count.modules} modules &middot; {totalLessons}{" "}
                        lessons &middot; {course._count.enrollments} enrolled
                      </p>
                    </div>
                  </div>
                  <Link href={`/admin/courses/${course.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  Users,
  PlayCircle,
  Video,
} from "lucide-react";
import { DRMVideoPlayer } from "@/components/protection/drm-video-player";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EnrollButton } from "@/components/courses/enroll-button";
import { CertificateButton } from "@/components/courses/certificate-button";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              progress: session?.user?.id
                ? { where: { userId: session.user.id } }
                : false,
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) notFound();

  const enrollment = session?.user?.id
    ? await prisma.enrollment.findUnique({
        where: {
          userId_courseId: { userId: session.user.id, courseId: course.id },
        },
      })
    : null;

  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
  const completedLessons = course.modules.reduce(
    (a, m) =>
      a + m.lessons.filter((l) => l.progress && l.progress.some((p) => p.completed)).length,
    0
  );
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const totalDuration = course.modules.reduce(
    (a, m) => a + m.lessons.reduce((la, l) => la + (l.duration || 0), 0),
    0
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Course Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            {course.modules.length} modules, {totalLessons} lessons
          </span>
          {totalDuration > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {totalDuration} minutes
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {course._count.enrollments} students
          </span>
        </div>

        {/* Progress / Enroll */}
        {enrollment ? (
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Your Progress</span>
                  <span className="text-muted-foreground">
                    {completedLessons}/{totalLessons} lessons ({Math.round(progress)}%)
                  </span>
                </div>
                <ProgressBar value={progress} />
              </div>
              <CertificateButton
                courseId={course.id}
                courseTitle={course.title}
                isComplete={totalLessons > 0 && completedLessons === totalLessons}
              />
            </CardContent>
          </Card>
        ) : (
          <EnrollButton courseSlug={slug} />
        )}
      </div>

      {/* Course Lecture Video */}
      {course.lectureVideoUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Video className="h-5 w-5 text-primary" />
              Full Course Lecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video overflow-hidden rounded-lg border border-border bg-black">
              {course.lectureVideoUrl.startsWith("/uploads/") ? (
                <DRMVideoPlayer
                  src={course.lectureVideoUrl}
                  className="h-full w-full"
                  userEmail={session?.user?.email || undefined}
                  sessionId={session?.user?.id}
                />
              ) : (
                <iframe
                  src={course.lectureVideoUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media"
                  allowFullScreen
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modules */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Course Content</h2>
        {course.modules.map((mod, i) => {
          const modLessons = mod.lessons.length;
          const modCompleted = mod.lessons.filter(
            (l) => l.progress && l.progress.some((p) => p.completed)
          ).length;

          return (
            <Card key={mod.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <CardTitle className="text-base">{mod.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {enrollment && (
                      <span>
                        {modCompleted}/{modLessons}
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {mod.lessons.map((lesson) => {
                    const isCompleted =
                      lesson.progress && lesson.progress.some((p) => p.completed);
                    return (
                      <li key={lesson.id}>
                        {enrollment ? (
                          <Link
                            href={`/courses/${slug}/lesson/${lesson.slug}`}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                            ) : (
                              <PlayCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                            )}
                            <span className={isCompleted ? "text-muted-foreground" : ""}>
                              {lesson.title}
                            </span>
                            {lesson.duration && (
                              <span className="ml-auto text-xs text-muted-foreground">
                                {lesson.duration} min
                              </span>
                            )}
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground">
                            <Circle className="h-4 w-4 shrink-0" />
                            <span>{lesson.title}</span>
                            {lesson.duration && (
                              <span className="ml-auto text-xs">
                                {lesson.duration} min
                              </span>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

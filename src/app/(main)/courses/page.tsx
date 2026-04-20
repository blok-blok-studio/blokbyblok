import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { BookOpen, Users, Clock, Lock, Bell, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function CoursesPage() {
  const session = await auth();

  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      modules: {
        include: {
          lessons: { select: { id: true, duration: true } },
        },
        orderBy: { order: "asc" },
      },
      _count: { select: { enrollments: true } },
      enrollments: session?.user?.id
        ? { where: { userId: session.user.id }, select: { id: true } }
        : false,
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold">Course Catalog</h1>
        <p className="mt-1 text-muted-foreground">
          Two paths, one mission: master AI. Start with AI Command to build, then go Under the Hood to understand.
        </p>
      </div>

      {/* ============================================ */}
      {/* PACKAGE 1: AI Command */}
      {/* ============================================ */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">AI Command</h2>
          </div>
          <p className="mt-1 text-muted-foreground">
            Build with AI — no coding required. These courses teach you to command AI tools and ship real projects.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.filter((c) => c.order <= 2).map((course) => {
            const totalLessons = course.modules.reduce(
              (a, m) => a + m.lessons.length,
              0
            );
            const totalDuration = course.modules.reduce(
              (a, m) =>
                a + m.lessons.reduce((la, l) => la + (l.duration || 0), 0),
              0
            );
            const isEnrolled = course.enrollments && course.enrollments.length > 0;

            return (
              <Card
                key={course.id}
                className="group overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    {isEnrolled && <Badge variant="accent">Enrolled</Badge>}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      {totalLessons} lessons
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {totalDuration > 0 ? `${totalDuration} min` : "Self-paced"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {course._count.enrollments}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {course.modules.slice(0, 3).map((m) => (
                      <Badge key={m.id} variant="secondary" className="text-xs">
                        {m.title}
                      </Badge>
                    ))}
                    {course.modules.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{course.modules.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <Link href={`/courses/${course.slug}`}>
                    <Button
                      variant={isEnrolled ? "default" : "outline"}
                      className="w-full"
                    >
                      {isEnrolled ? "Continue Learning" : "View Course"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* PACKAGE 2: Under the Hood */}
      {/* ============================================ */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-2xl font-bold">Under the Hood</h2>
          </div>
          <p className="mt-1 text-muted-foreground">
            Understand the code beneath the AI. For those who want to go deeper and learn what&apos;s really happening.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.filter((c) => c.order >= 3).map((course) => {
            const totalLessons = course.modules.reduce(
              (a, m) => a + m.lessons.length,
              0
            );
            const totalDuration = course.modules.reduce(
              (a, m) =>
                a + m.lessons.reduce((la, l) => la + (l.duration || 0), 0),
              0
            );
            const isEnrolled = course.enrollments && course.enrollments.length > 0;

            return (
              <Card
                key={course.id}
                className="group overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="h-1.5 bg-gradient-to-r from-muted-foreground/50 to-muted-foreground/20" />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    {isEnrolled && <Badge variant="accent">Enrolled</Badge>}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      {totalLessons} lessons
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {totalDuration > 0 ? `${totalDuration} min` : "Self-paced"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {course._count.enrollments}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {course.modules.slice(0, 3).map((m) => (
                      <Badge key={m.id} variant="secondary" className="text-xs">
                        {m.title}
                      </Badge>
                    ))}
                    {course.modules.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{course.modules.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <Link href={`/courses/${course.slug}`}>
                    <Button
                      variant={isEnrolled ? "default" : "outline"}
                      className="w-full"
                    >
                      {isEnrolled ? "Continue Learning" : "View Course"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* COMING SOON — Locked Course Teasers */}
      {/* ============================================ */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-muted-foreground">Coming Soon</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {COMING_SOON_COURSES.map((course) => (
          <Card
            key={course.title}
            className="group relative overflow-hidden border-border/50 opacity-75 transition-all duration-200 hover:opacity-90"
          >
            {/* Blurred overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/60 backdrop-blur-[2px]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary border border-border">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
              <Badge variant="outline" className="gap-1.5 px-3 py-1">
                <Sparkles className="h-3 w-3" />
                Coming Soon
              </Badge>
              {course.eta && (
                <p className="text-xs text-muted-foreground">{course.eta}</p>
              )}
              <button className="mt-1 flex items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                <Bell className="h-3 w-3" />
                Notify Me
              </button>
            </div>

            {/* Shadowed content underneath */}
            <div className="h-1.5 bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/10" />
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{course.title}</CardTitle>
              </div>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {course.lessons} lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {course.modules.map((m) => (
                  <Badge key={m} variant="secondary" className="text-xs opacity-60">
                    {m}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMING SOON COURSES — Edit these to tease future content
// ============================================
const COMING_SOON_COURSES = [
  {
    title: "Full Stack with Claude",
    description:
      "Ship complete web apps by directing Claude Code as your co-pilot. From database to deployment — you command, AI builds. Zero code written from scratch.",
    lessons: 24,
    duration: "450 min",
    modules: ["Database Design", "API Development", "Frontend Mastery", "DevOps"],
    eta: "Launching April 2026",
  },
  {
    title: "AI Monetization Blueprint",
    description:
      "Turn your AI operator skills into revenue. Learn to build and sell AI-powered products, SaaS tools, and services — all built by commanding AI, not coding manually.",
    lessons: 12,
    duration: "180 min",
    modules: ["Product Strategy", "Building SaaS", "Client Acquisition"],
    eta: "Launching May 2026",
  },
  {
    title: "Hardware + AI: Raspberry Pi Agents",
    description:
      "Deploy autonomous AI agents to physical hardware. Build agents that run 24/7 on a Raspberry Pi — controlling sensors, cameras, and IoT devices with OpenClaw and Claude.",
    lessons: 16,
    duration: "280 min",
    modules: ["Pi Setup", "Sensor Integration", "Agent Deployment", "Home Automation"],
    eta: "Launching June 2026",
  },
];

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Apple,
  Monitor,
  Terminal as TerminalIcon,
  Wrench,
  Clock,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Day 0: Set Up Your Computer | BlokSchool",
  description:
    "Free preview — install Git, Node.js, Python, VS Code, and Claude Code on Mac, Windows, or Linux. The housework before your first class.",
};

const moduleIcons: Record<string, typeof Wrench> = {
  "Welcome — Read This First": Wrench,
  "Mac Setup": Apple,
  "Windows Setup": Monitor,
  "Linux Setup (Ubuntu / Debian)": TerminalIcon,
};

export default async function SetupPreviewPage() {
  const course = await prisma.course.findUnique({
    where: { slug: "setup" },
    include: {
      modules: {
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) notFound();

  const totalLessons = course.modules.reduce(
    (n, m) => n + m.lessons.length,
    0,
  );
  const totalMinutes = course.modules.reduce(
    (n, m) => n + m.lessons.reduce((mm, l) => mm + (l.duration ?? 0), 0),
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold">
              Blok<span className="text-primary">School</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 lg:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to BlokSchool
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent mb-4">
            <Wrench className="h-3 w-3" />
            Free preview · No sign-in needed
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {course.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {course.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {Math.round(totalMinutes / 5) * 5} min total
            </span>
            <span>·</span>
            <span>{course.modules.length} modules</span>
            <span>·</span>
            <span>{totalLessons} lessons</span>
            <span>·</span>
            <span>Mac · Windows · Linux</span>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-5xl px-4 py-12 lg:py-16">
        <div className="space-y-6">
          {course.modules.map((mod, modIdx) => {
            const Icon = moduleIcons[mod.title] ?? Wrench;
            return (
              <Card key={mod.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Module {modIdx + 1}
                      </p>
                      <h2 className="text-xl font-semibold">{mod.title}</h2>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {mod.lessons.map((lesson, lessonIdx) => (
                      <li key={lesson.id}>
                        <Link
                          href={`/setup/lesson/${lesson.slug}`}
                          className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-background hover:border-primary/30 hover:bg-primary/5 transition-colors p-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-sm text-muted-foreground tabular-nums shrink-0">
                              {String(lessonIdx + 1).padStart(2, "0")}
                            </span>
                            <span className="font-medium truncate group-hover:text-primary transition-colors">
                              {lesson.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 text-sm text-muted-foreground">
                            {lesson.duration ? (
                              <span className="tabular-nums">{lesson.duration} min</span>
                            ) : null}
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sign-up CTA */}
        <Card className="mt-10 overflow-hidden border-primary/30 bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="font-semibold">Done with setup? Join the cohort.</p>
              <p className="text-sm text-muted-foreground">
                Class starts Monday. Sign up to enroll, track progress, submit homework, and join the community.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/register">
                <Button>
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

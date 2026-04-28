import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Clock,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SETUP_SLUG = "setup";

async function getSetupCourse() {
  return prisma.course.findUnique({
    where: { slug: SETUP_SLUG },
    include: {
      modules: {
        include: { lessons: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function generateStaticParams() {
  const course = await getSetupCourse();
  if (!course) return [];
  return course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ lessonSlug: l.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}): Promise<Metadata> {
  const { lessonSlug } = await params;
  const course = await getSetupCourse();
  if (!course) return { title: "Setup | BlokSchool" };
  const lesson = course.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.slug === lessonSlug);
  if (!lesson) return { title: "Setup | BlokSchool" };
  return {
    title: `${lesson.title} | Day 0 Setup | BlokSchool`,
    description:
      "Free preview — step-by-step install instructions for new students.",
  };
}

export default async function SetupLessonPage({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) {
  const { lessonSlug } = await params;
  const course = await getSetupCourse();
  if (!course) notFound();

  const flat = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ lesson: l, module: m })),
  );
  const idx = flat.findIndex((f) => f.lesson.slug === lessonSlug);
  if (idx === -1) notFound();

  const { lesson, module } = flat[idx];
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx < flat.length - 1 ? flat[idx + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
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

      <article className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link href="/setup" className="hover:text-foreground transition-colors">
            Day 0 Setup
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span>{module.title}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{lesson.title}</span>
        </div>

        {/* Title */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {lesson.title}
          </h1>
          {lesson.duration ? (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {lesson.duration} min
            </p>
          ) : null}
        </header>

        {/* Content */}
        <div
          className="prose prose-invert max-w-none prose-headings:tracking-tight prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-code:text-primary prose-code:before:content-none prose-code:after:content-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-kbd:rounded prose-kbd:border prose-kbd:border-border prose-kbd:bg-muted prose-kbd:px-1.5 prose-kbd:py-0.5 prose-kbd:text-xs"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />

        {/* Prev / Next */}
        <nav className="mt-12 grid grid-cols-2 gap-3">
          {prev ? (
            <Link href={`/setup/lesson/${prev.lesson.slug}`}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span className="truncate text-left">
                  <span className="block text-xs text-muted-foreground">Previous</span>
                  <span className="block truncate">{prev.lesson.title}</span>
                </span>
              </Button>
            </Link>
          ) : (
            <Link href="/setup">
              <Button variant="outline" className="w-full justify-start gap-2">
                <ArrowLeft className="h-4 w-4 shrink-0" />
                Back to Setup
              </Button>
            </Link>
          )}
          {next ? (
            <Link href={`/setup/lesson/${next.lesson.slug}`}>
              <Button className="w-full justify-end gap-2">
                <span className="truncate text-right">
                  <span className="block text-xs text-primary-foreground/80">Next</span>
                  <span className="block truncate">{next.lesson.title}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button className="w-full justify-end gap-2">
                Done — Join the cohort
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Button>
            </Link>
          )}
        </nav>

        {/* Sign-up CTA at bottom */}
        <Card className="mt-10 overflow-hidden border-primary/30 bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="font-semibold">Ready for class?</p>
              <p className="text-sm text-muted-foreground">
                Sign up to enroll in the cohort, track your progress, and unlock the History of AI and Claude courses.
              </p>
            </div>
            <Link href="/register" className="shrink-0">
              <Button>
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </article>
    </div>
  );
}

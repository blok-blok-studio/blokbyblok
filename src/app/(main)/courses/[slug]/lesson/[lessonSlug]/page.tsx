import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle2, PlayCircle, BookOpen, Terminal, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompletionToggle } from "@/components/courses/completion-toggle";
import { GitHubRepoCard } from "@/components/courses/github-repo-card";
import { ProtectedVideo } from "@/components/protection/protected-video";
import { DRMVideoPlayer } from "@/components/protection/drm-video-player";
import { CodePlayground } from "@/components/sandbox/code-playground";
import { AiTutorToggle } from "@/components/tutor/ai-tutor-toggle";
import { AiTutorPanel } from "@/components/tutor/ai-tutor-panel";
import { ProjectSubmission } from "@/components/projects/project-submission";
import { LessonNotes } from "@/components/lessons/lesson-notes";
import { LessonInteractive } from "./lesson-interactive";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Check if user has paid (admins bypass)
  if (session.user.role !== "ADMIN") {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { hasPaid: true },
    });
    if (!user?.hasPaid) {
      redirect("/buy");
    }
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              progress: { where: { userId: session.user.id } },
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) notFound();

  // Find current lesson
  let currentLesson = null;
  let currentModule = null;
  const allLessons: Array<{
    lesson: typeof course.modules[0]["lessons"][0];
    module: typeof course.modules[0];
  }> = [];

  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      allLessons.push({ lesson, module: mod });
      if (lesson.slug === lessonSlug) {
        currentLesson = lesson;
        currentModule = mod;
      }
    }
  }

  if (!currentLesson || !currentModule) notFound();

  const currentIndex = allLessons.findIndex((l) => l.lesson.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isCompleted = currentLesson.progress.some((p) => p.completed);

  // Fetch existing project for this lesson if project-enabled
  const existingProject = currentLesson.projectEnabled
    ? await prisma.project.findUnique({
        where: {
          userId_lessonId: {
            userId: session.user.id,
            lessonId: currentLesson.id,
          },
        },
      })
    : null;

  return (
    <div className="mx-auto max-w-6xl">
      {/* AI Tutor floating button + panel */}
      <LessonInteractive
        lessonId={currentLesson.id}
        lessonTitle={currentLesson.title}
      />

      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href={`/courses/${slug}`} className="hover:text-foreground transition-colors">
              {course.title}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span>{currentModule.title}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{currentLesson.title}</span>
          </div>

          {/* Lesson title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
            {currentLesson.duration && (
              <p className="text-sm text-muted-foreground">
                Estimated time: {currentLesson.duration} minutes
              </p>
            )}
          </div>

          {/* Video — DRM Protected */}
          {currentLesson.videoUrl && (
            <div className="aspect-video overflow-hidden rounded-xl border border-border bg-card">
              {currentLesson.videoUrl.startsWith("/uploads/") ? (
                <DRMVideoPlayer
                  src={currentLesson.videoUrl}
                  className="h-full w-full"
                  userEmail={session.user.email || undefined}
                  sessionId={session.user.id}
                />
              ) : (
                <iframe
                  src={currentLesson.videoUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media"
                  allowFullScreen
                />
              )}
            </div>
          )}

          {/* GitHub Repo */}
          {currentLesson.githubUrl && (
            <GitHubRepoCard url={currentLesson.githubUrl} />
          )}

          {/* Content */}
          <Card>
            <CardContent className="prose prose-invert max-w-none p-6">
              <div
                dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                className="text-foreground leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-secondary [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground"
              />
            </CardContent>
          </Card>

          {/* Code Sandbox / AI Terminal — always visible */}
          {(() => {
            const isAiCourse = course.order <= 2;
            const defaultLanguage = isAiCourse ? "javascript" : ((currentLesson.sandboxLanguage as any) || "javascript");

            // AI courses get a real terminal emulator
            // Under the Hood courses get a code sandbox
            const starterCode = currentLesson.sandboxStarterCode || undefined;

            // Example starter prompt for AI terminal
            const aiStarterPrompt = starterCode
              || `claude "help me ${currentLesson.title.toLowerCase()}"`;

            return (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  {isAiCourse ? (
                    <>
                      <Terminal className="h-5 w-5 text-primary" />
                      AI Command Terminal
                    </>
                  ) : (
                    <>
                      <Code className="h-5 w-5 text-primary" />
                      Code Playground
                    </>
                  )}
                </h2>
                <CodePlayground
                  language={defaultLanguage}
                  starterCode={isAiCourse ? aiStarterPrompt : starterCode}
                  testCode={currentLesson.sandboxTestCode || undefined}
                  lessonId={currentLesson.id}
                  mode={isAiCourse ? "terminal" : "sandbox"}
                  lessonTitle={currentLesson.title}
                />
              </div>
            );
          })()}

          {/* Project Submission */}
          {currentLesson.projectEnabled && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                Project
              </h2>
              {currentLesson.projectInstructions && (
                <Card>
                  <CardContent className="p-4 text-sm text-muted-foreground">
                    <div dangerouslySetInnerHTML={{ __html: currentLesson.projectInstructions }} />
                  </CardContent>
                </Card>
              )}
              <ProjectSubmission
                lessonId={currentLesson.id}
                existingProject={existingProject ? {
                  id: existingProject.id,
                  repoUrl: existingProject.repoUrl,
                  status: existingProject.status,
                  feedback: existingProject.feedback,
                } : undefined}
              />
            </div>
          )}

          {/* Lesson Notes */}
          <LessonNotes lessonId={currentLesson.id} />

          {/* Completion + Navigation */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
            {prevLesson ? (
              <Link href={`/courses/${slug}/lesson/${prevLesson.lesson.slug}`}>
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
              </Link>
            ) : (
              <div />
            )}

            <CompletionToggle
              lessonId={currentLesson.id}
              initialCompleted={isCompleted}
            />

            {nextLesson ? (
              <Link href={`/courses/${slug}/lesson/${nextLesson.lesson.slug}`}>
                <Button size="sm">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href={`/courses/${slug}`}>
                <Button size="sm">
                  Back to Course
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar - lesson list */}
        <aside className="hidden xl:block w-72 shrink-0">
          <div className="sticky top-20 space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Course Content
            </h3>
            {course.modules.map((mod) => (
              <div key={mod.id} className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground px-2 mb-1">
                  {mod.title}
                </p>
                {mod.lessons.map((lesson) => {
                  const lessonCompleted = lesson.progress.some((p) => p.completed);
                  const isCurrent = lesson.id === currentLesson.id;
                  return (
                    <Link
                      key={lesson.id}
                      href={`/courses/${slug}/lesson/${lesson.slug}`}
                      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors ${
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {lessonCompleted ? (
                        <CheckCircle2 className="h-3 w-3 shrink-0 text-accent" />
                      ) : (
                        <PlayCircle className="h-3 w-3 shrink-0" />
                      )}
                      <span className="truncate">{lesson.title}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Save,
  Loader2,
  Video,
  GitBranch,
  FileText,
  Upload,
  ChevronLeft,
  Eye,
  Code,
  ExternalLink,
  FolderGit2,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentEditor } from "@/components/admin/content-editor";

interface LessonData {
  id: string;
  title: string;
  slug: string;
  content: string;
  videoUrl: string | null;
  githubUrl: string | null;
  duration: number | null;
  sandboxEnabled: boolean;
  sandboxLanguage: string | null;
  sandboxStarterCode: string | null;
  sandboxSolution: string | null;
  sandboxTestCode: string | null;
  projectEnabled: boolean;
  projectInstructions: string | null;
  projectTemplateRepo: string | null;
  module: {
    id: string;
    title: string;
    course: { id: string; title: string; slug: string; order: number };
  };
}

type TabKey = "content" | "video" | "github" | "sandbox" | "project";

const SANDBOX_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "react", label: "React" },
];

export default function EditLessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("content");

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [duration, setDuration] = useState("");

  // Sandbox state
  const [sandboxEnabled, setSandboxEnabled] = useState(false);
  const [sandboxLanguage, setSandboxLanguage] = useState("javascript");
  const [sandboxStarterCode, setSandboxStarterCode] = useState("");
  const [sandboxSolution, setSandboxSolution] = useState("");
  const [sandboxTestCode, setSandboxTestCode] = useState("");

  // Project state
  const [projectEnabled, setProjectEnabled] = useState(false);
  const [projectInstructions, setProjectInstructions] = useState("");
  const [projectTemplateRepo, setProjectTemplateRepo] = useState("");

  useEffect(() => {
    fetch(`/api/admin/lessons/${lessonId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data: LessonData) => {
        setLesson(data);
        setTitle(data.title);
        setContent(data.content);
        setVideoUrl(data.videoUrl || "");
        setGithubUrl(data.githubUrl || "");
        setDuration(data.duration?.toString() || "");
        setSandboxEnabled(data.sandboxEnabled);
        setSandboxLanguage(data.sandboxLanguage || "javascript");
        setSandboxStarterCode(data.sandboxStarterCode || "");
        setSandboxSolution(data.sandboxSolution || "");
        setSandboxTestCode(data.sandboxTestCode || "");
        setProjectEnabled(data.projectEnabled);
        setProjectInstructions(data.projectInstructions || "");
        setProjectTemplateRepo(data.projectTemplateRepo || "");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load lesson");
        setLoading(false);
      });
  }, [lessonId]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          videoUrl,
          githubUrl,
          duration,
          sandboxEnabled,
          sandboxLanguage,
          sandboxStarterCode,
          sandboxSolution,
          sandboxTestCode,
          projectEnabled,
          projectInstructions,
          projectTemplateRepo,
        }),
      });

      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Upload failed");
        return;
      }

      const data = await res.json();
      setVideoUrl(data.url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Lesson not found
      </div>
    );
  }

  const isAiCommandCourse = lesson.module.course.order <= 2;

  const tabs = [
    { key: "content" as const, label: "Content", icon: FileText },
    { key: "video" as const, label: "Video", icon: Video },
    { key: "github" as const, label: "GitHub Repo", icon: GitBranch },
    { key: "sandbox" as const, label: "Sandbox", icon: Terminal },
    { key: "project" as const, label: "Project", icon: FolderGit2 },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href={`/admin/courses/${lesson.module.course.id}/edit`}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="h-3 w-3" />
              {lesson.module.course.title}
            </Link>
            <span>/</span>
            <span>{lesson.module.title}</span>
          </div>
          <h1 className="text-2xl font-bold">Edit Lesson</h1>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <Badge variant="accent" className="animate-in fade-in">
              Saved!
            </Badge>
          )}
          <Link
            href={`/courses/${lesson.module.course.slug}/lesson/${lesson.slug}`}
            target="_blank"
          >
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Title & Duration */}
      <Card>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Lesson Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lesson title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (minutes)</label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 15"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "video" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Video
            </CardTitle>
            <CardDescription>
              Add a video URL (YouTube/Vimeo embed) or upload a video file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Video Embed URL</label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/... or /uploads/videos/..."
              />
              <p className="text-xs text-muted-foreground">
                Paste a YouTube or Vimeo embed URL, or upload a video below.
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-foreground transition-colors">
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {uploading ? "Uploading..." : "Upload Video File"}
                  </div>
                </label>
                <p className="text-xs text-muted-foreground">
                  MP4, WebM, MOV (max depends on server config)
                </p>
              </div>
            </div>

            {/* Preview */}
            {videoUrl && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Preview</p>
                <div className="aspect-video overflow-hidden rounded-xl border border-border bg-secondary">
                  {videoUrl.startsWith("/uploads/") ? (
                    <video
                      src={videoUrl}
                      controls
                      className="h-full w-full"
                    />
                  ) : (
                    <iframe
                      src={videoUrl}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "github" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              GitHub Repository
            </CardTitle>
            <CardDescription>
              Link a GitHub repository to this lesson. It will be displayed as an
              interactive card with repo stats.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">GitHub Repository URL</label>
              <Input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
              />
              <p className="text-xs text-muted-foreground">
                Full URL to a GitHub repository (e.g.,
                https://github.com/anthropics/claude-code)
              </p>
            </div>

            {githubUrl && githubUrl.includes("github.com") && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Preview</p>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-4 hover:border-primary/50 transition-colors"
                >
                  <GitBranch className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {githubUrl.replace("https://github.com/", "")}
                  </span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 ml-auto" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "content" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Lesson Content
            </CardTitle>
            <CardDescription>
              Write your lesson content using the editor below. Use the toolbar
              for formatting, code blocks, and more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContentEditor value={content} onChange={setContent} />
          </CardContent>
        </Card>
      )}

      {activeTab === "sandbox" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              Code Sandbox
            </CardTitle>
            <CardDescription>
              Configure an interactive code sandbox for this lesson. Students can
              write and run code directly in the browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={sandboxEnabled}
                  onChange={(e) => setSandboxEnabled(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-secondary peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
              </div>
              <span className="text-sm font-medium">Enable Code Sandbox</span>
            </label>

            {sandboxEnabled && (
              <>
                {isAiCommandCourse && (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
                    <strong>Note:</strong> AI courses use the terminal emulator.
                    Starter code here becomes the example prompt.
                  </div>
                )}

                {/* Language */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <select
                    value={sandboxLanguage}
                    onChange={(e) => setSandboxLanguage(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {SANDBOX_LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Starter Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Starter Code</label>
                  <textarea
                    value={sandboxStarterCode}
                    onChange={(e) => setSandboxStarterCode(e.target.value)}
                    placeholder={
                      isAiCommandCourse
                        ? "Enter the example prompt for the AI terminal..."
                        : "// Starter code that students will see..."
                    }
                    rows={10}
                    className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    This code is shown to students as the starting point.
                  </p>
                </div>

                {/* Solution Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Solution Code</label>
                  <textarea
                    value={sandboxSolution}
                    onChange={(e) => setSandboxSolution(e.target.value)}
                    placeholder="// Solution code (hidden from students)..."
                    rows={10}
                    className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Hidden from students. Used as the reference solution.
                  </p>
                </div>

                {/* Test Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Test Code</label>
                  <textarea
                    value={sandboxTestCode}
                    onChange={(e) => setSandboxTestCode(e.target.value)}
                    placeholder="// Test code for auto-checking student submissions..."
                    rows={8}
                    className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tests that run against student code to verify correctness.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "project" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-primary" />
              Project Submission
            </CardTitle>
            <CardDescription>
              Enable project submissions for this lesson. Students can fork a
              template repo and submit their work for review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={projectEnabled}
                  onChange={(e) => setProjectEnabled(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-secondary peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
              </div>
              <span className="text-sm font-medium">Enable Project Submission</span>
            </label>

            {projectEnabled && (
              <>
                {/* Project Instructions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Instructions</label>
                  <textarea
                    value={projectInstructions}
                    onChange={(e) => setProjectInstructions(e.target.value)}
                    placeholder="Describe the project requirements, grading criteria, and submission guidelines... (HTML supported)"
                    rows={12}
                    className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y min-h-[150px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports HTML for rich formatting. Displayed to students on
                    the project submission page.
                  </p>
                </div>

                {/* Template Repo URL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Template Repository URL</label>
                  <Input
                    value={projectTemplateRepo}
                    onChange={(e) => setProjectTemplateRepo(e.target.value)}
                    placeholder="https://github.com/org/template-repo"
                  />
                  <p className="text-xs text-muted-foreground">
                    GitHub repository that students will fork as their starting
                    point.
                  </p>
                </div>

                {/* Preview */}
                {projectTemplateRepo && projectTemplateRepo.includes("github.com") && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Template Preview</p>
                    <a
                      href={projectTemplateRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-4 hover:border-primary/50 transition-colors"
                    >
                      <FolderGit2 className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {projectTemplateRepo.replace("https://github.com/", "")}
                      </span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 ml-auto" />
                    </a>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

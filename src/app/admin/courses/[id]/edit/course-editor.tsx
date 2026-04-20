"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Save,
  Eye,
  EyeOff,
  Video,
  Github,
  Code,
  FolderGit2,
  Pencil,
} from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  slug: string;
  content: string;
  videoUrl: string | null;
  githubUrl: string | null;
  duration: number | null;
  order: number;
  moduleId: string;
  sandboxEnabled: boolean;
  projectEnabled: boolean;
};

type Module = {
  id: string;
  title: string;
  order: number;
  courseId: string;
  lessons: Lesson[];
};

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  lectureVideoUrl: string | null;
  published: boolean;
  order: number;
  modules: Module[];
};

interface CourseEditorProps {
  course: Course;
}

export function CourseEditor({ course: initialCourse }: CourseEditorProps) {
  const router = useRouter();
  const [course, setCourse] = useState(initialCourse);
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [published, setPublished] = useState(course.published);
  const [lectureVideoUrl, setLectureVideoUrl] = useState(
    course.lectureVideoUrl || ""
  );
  const [order, setOrder] = useState(course.order);
  const [modules, setModules] = useState<Module[]>(course.modules);
  const [saving, setSaving] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingModuleTitle, setEditingModuleTitle] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ---- Course Save ----
  const saveCourse = useCallback(async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: course.id,
          title,
          description,
          published,
          lectureVideoUrl: lectureVideoUrl || null,
          order,
        }),
      });
    } finally {
      setSaving(false);
    }
  }, [course.id, title, description, published, lectureVideoUrl, order]);

  // ---- Save All ----
  const saveAll = useCallback(async () => {
    setSaving(true);
    try {
      // Save course
      await fetch("/api/admin/courses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: course.id,
          title,
          description,
          published,
          lectureVideoUrl: lectureVideoUrl || null,
          order,
        }),
      });

      // Save module orders
      await fetch("/api/admin/modules/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modules: modules.map((m, i) => ({ id: m.id, order: i })),
        }),
      });

      // Save lesson orders for each module
      for (const mod of modules) {
        if (mod.lessons.length > 0) {
          await fetch("/api/admin/lessons/reorder", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lessons: mod.lessons.map((l, i) => ({ id: l.id, order: i })),
            }),
          });
        }
      }

      router.refresh();
    } finally {
      setSaving(false);
    }
  }, [course.id, title, description, published, lectureVideoUrl, order, modules, router]);

  // ---- Module operations ----
  const addModule = useCallback(async () => {
    const res = await fetch("/api/admin/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course.id, title: "New Module" }),
    });
    const newModule = await res.json();
    setModules((prev) => [...prev, { ...newModule, lessons: [] }]);
  }, [course.id]);

  const updateModuleTitle = useCallback(
    async (moduleId: string, newTitle: string) => {
      await fetch("/api/admin/modules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: moduleId, title: newTitle }),
      });
      setModules((prev) =>
        prev.map((m) => (m.id === moduleId ? { ...m, title: newTitle } : m))
      );
      setEditingModuleId(null);
    },
    []
  );

  const deleteModule = useCallback(async (moduleId: string) => {
    await fetch(`/api/admin/modules?id=${moduleId}`, { method: "DELETE" });
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
    setDeleteConfirm(null);
  }, []);

  const moveModule = useCallback((index: number, direction: "up" | "down") => {
    setModules((prev) => {
      const next = [...prev];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= next.length) return prev;
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      return next;
    });
  }, []);

  // ---- Lesson operations ----
  const addLesson = useCallback(async (moduleId: string) => {
    const res = await fetch("/api/admin/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, title: "New Lesson" }),
    });
    const newLesson = await res.json();
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
      )
    );
  }, []);

  const deleteLesson = useCallback(
    async (lessonId: string, moduleId: string) => {
      await fetch(`/api/admin/lessons?id=${lessonId}`, { method: "DELETE" });
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
            : m
        )
      );
      setDeleteConfirm(null);
    },
    []
  );

  const moveLesson = useCallback(
    (moduleId: string, lessonIndex: number, direction: "up" | "down") => {
      setModules((prev) =>
        prev.map((m) => {
          if (m.id !== moduleId) return m;
          const lessons = [...m.lessons];
          const swapIndex =
            direction === "up" ? lessonIndex - 1 : lessonIndex + 1;
          if (swapIndex < 0 || swapIndex >= lessons.length) return m;
          [lessons[lessonIndex], lessons[swapIndex]] = [
            lessons[swapIndex],
            lessons[lessonIndex],
          ];
          return { ...m, lessons };
        })
      );
    },
    []
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Course</h1>
          <p className="text-muted-foreground mt-1">
            Manage modules and lessons for this course.
          </p>
        </div>
        <Button onClick={saveAll} disabled={saving} size="lg">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save All"}
        </Button>
      </div>

      {/* Course Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Course Details</CardTitle>
            <button
              onClick={() => setPublished(!published)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Badge variant={published ? "accent" : "secondary"}>
                {published ? (
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> Published
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <EyeOff className="h-3 w-3" /> Draft
                  </span>
                )}
              </Badge>
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Course title"
              className="text-lg font-semibold"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Course description"
              rows={3}
              className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Lecture Video URL
            </label>
            <div className="flex gap-2">
              <Input
                value={lectureVideoUrl}
                onChange={(e) => setLectureVideoUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Package
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOrder(Math.min(order, 2))}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  order <= 2
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                AI Command
                <span className="block text-xs font-normal mt-0.5 opacity-70">
                  Order 0–2
                </span>
              </button>
              <button
                type="button"
                onClick={() => setOrder(Math.max(order, 3))}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  order >= 3
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                Under the Hood
                <span className="block text-xs font-normal mt-0.5 opacity-70">
                  Order 3+
                </span>
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Sort order:</label>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                className="w-20 h-8 text-sm"
                min={0}
              />
              <span className="text-xs text-muted-foreground">
                (lower = appears first)
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-muted-foreground">
              Slug: <code className="text-foreground">{course.slug}</code>
            </span>
            <Button onClick={saveCourse} disabled={saving} variant="secondary">
              <Save className="h-3.5 w-3.5" />
              Save Course
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Modules ({modules.length})
          </h2>
          <Button onClick={addModule} variant="outline" size="sm">
            <Plus className="h-4 w-4" />
            Add Module
          </Button>
        </div>

        {modules.map((mod, modIndex) => (
          <Card key={mod.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />

                {/* Reorder buttons */}
                <div className="flex flex-col shrink-0">
                  <button
                    onClick={() => moveModule(modIndex, "up")}
                    disabled={modIndex === 0}
                    className="p-0.5 hover:text-primary disabled:opacity-30 cursor-pointer disabled:cursor-default"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveModule(modIndex, "down")}
                    disabled={modIndex === modules.length - 1}
                    className="p-0.5 hover:text-primary disabled:opacity-30 cursor-pointer disabled:cursor-default"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Module title */}
                <div className="flex-1 min-w-0">
                  {editingModuleId === mod.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingModuleTitle}
                        onChange={(e) => setEditingModuleTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateModuleTitle(mod.id, editingModuleTitle);
                          }
                          if (e.key === "Escape") {
                            setEditingModuleId(null);
                          }
                        }}
                        autoFocus
                        className="h-8"
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          updateModuleTitle(mod.id, editingModuleTitle)
                        }
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingModuleId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <CardTitle className="text-base">
                      Module {modIndex + 1}: {mod.title}
                    </CardTitle>
                  )}
                </div>

                {/* Module actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {editingModuleId !== mod.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingModuleId(mod.id);
                        setEditingModuleTitle(mod.title);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {deleteConfirm === `mod-${mod.id}` ? (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteModule(mod.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(`mod-${mod.id}`)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {mod.lessons.map((lesson, lessonIndex) => (
                  <li
                    key={lesson.id}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-secondary/50 group"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {/* Lesson reorder */}
                      <div className="flex flex-col shrink-0">
                        <button
                          onClick={() =>
                            moveLesson(mod.id, lessonIndex, "up")
                          }
                          disabled={lessonIndex === 0}
                          className="p-0.5 hover:text-primary disabled:opacity-30 cursor-pointer disabled:cursor-default"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() =>
                            moveLesson(mod.id, lessonIndex, "down")
                          }
                          disabled={lessonIndex === mod.lessons.length - 1}
                          className="p-0.5 hover:text-primary disabled:opacity-30 cursor-pointer disabled:cursor-default"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="truncate">
                        {modIndex + 1}.{lessonIndex + 1} {lesson.title}
                      </span>

                      {/* Status icons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {lesson.duration && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {lesson.duration}m
                          </Badge>
                        )}
                        {lesson.videoUrl && (
                          <Video className="h-3.5 w-3.5 text-primary" />
                        )}
                        {lesson.githubUrl && (
                          <Github className="h-3.5 w-3.5 text-accent-foreground" />
                        )}
                        {lesson.sandboxEnabled && (
                          <Code className="h-3.5 w-3.5 text-green-500" />
                        )}
                        {lesson.projectEnabled && (
                          <FolderGit2 className="h-3.5 w-3.5 text-orange-500" />
                        )}
                      </div>
                    </div>

                    {/* Lesson actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Link href={`/admin/lessons/${lesson.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </Link>
                      {deleteConfirm === `lesson-${lesson.id}` ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteLesson(lesson.id, mod.id)}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            setDeleteConfirm(`lesson-${lesson.id}`)
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addLesson(mod.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {modules.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>No modules yet. Add your first module to get started.</p>
              <Button onClick={addModule} variant="outline" className="mt-4">
                <Plus className="h-4 w-4" />
                Add Module
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Save */}
      {modules.length > 0 && (
        <div className="flex justify-end pt-4 border-t border-border">
          <Button onClick={saveAll} disabled={saving} size="lg">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save All"}
          </Button>
        </div>
      )}
    </div>
  );
}

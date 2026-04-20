"use client";

import { useState } from "react";
import { Save, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecordingData {
  id?: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  duration: string;
  courseId: string;
}

interface Course {
  id: string;
  title: string;
}

const CATEGORIES = [
  { value: "live-session", label: "Live Session" },
  { value: "tutorial", label: "Tutorial" },
  { value: "workshop", label: "Workshop" },
  { value: "q-and-a", label: "Q&A" },
];

interface RecordingFormProps {
  recording?: {
    id: string;
    title: string;
    description: string | null;
    videoUrl: string;
    category: string;
    duration: number | null;
    courseId: string | null;
  };
  courses: Course[];
  onSave: (data: RecordingData) => Promise<void>;
  onCancel: () => void;
}

export function RecordingForm({
  recording,
  courses,
  onSave,
  onCancel,
}: RecordingFormProps) {
  const [title, setTitle] = useState(recording?.title || "");
  const [description, setDescription] = useState(recording?.description || "");
  const [videoUrl, setVideoUrl] = useState(recording?.videoUrl || "");
  const [category, setCategory] = useState(recording?.category || "live-session");
  const [duration, setDuration] = useState(recording?.duration?.toString() || "");
  const [courseId, setCourseId] = useState(recording?.courseId || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim() || !category) {
      setError("Title, video URL, and category are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave({
        id: recording?.id,
        title: title.trim(),
        description: description.trim(),
        videoUrl: videoUrl.trim(),
        category,
        duration,
        courseId,
      });
    } catch {
      setError("Failed to save recording");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{recording ? "Edit Recording" : "Add Recording"}</CardTitle>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Recording title"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this recording..."
              rows={3}
              className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Video URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL</label>
              <div className="flex gap-2">
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/embed/... or upload"
                  required
                  className="flex-1"
                />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <div className="flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground hover:border-primary hover:text-foreground transition-colors">
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 45"
              />
            </div>
          </div>

          {/* Linked Course */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Linked Course (optional)</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">No linked course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {recording ? "Update Recording" : "Create Recording"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

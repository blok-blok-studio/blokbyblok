"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Clock, BookOpen, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecordingForm } from "./recording-form";

interface Recording {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  category: string;
  duration: number | null;
  courseId: string | null;
  publishedAt: string;
  course: { id: string; title: string } | null;
}

interface Course {
  id: string;
  title: string;
}

const CATEGORY_STYLES: Record<string, { label: string; variant: "default" | "secondary" | "accent" | "outline" }> = {
  "live-session": { label: "Live Session", variant: "accent" },
  tutorial: { label: "Tutorial", variant: "default" },
  workshop: { label: "Workshop", variant: "secondary" },
  "q-and-a": { label: "Q&A", variant: "outline" },
};

interface RecordingsListProps {
  initialRecordings: Recording[];
  courses: Course[];
}

export function RecordingsList({ initialRecordings, courses }: RecordingsListProps) {
  const [recordings, setRecordings] = useState<Recording[]>(initialRecordings);
  const [showForm, setShowForm] = useState(false);
  const [editingRecording, setEditingRecording] = useState<Recording | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSave(data: {
    id?: string;
    title: string;
    description: string;
    videoUrl: string;
    category: string;
    duration: string;
    courseId: string;
  }) {
    const method = data.id ? "PUT" : "POST";
    const res = await fetch("/api/admin/recordings", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Save failed");
    }

    const saved = await res.json();

    if (data.id) {
      setRecordings((prev) => prev.map((r) => (r.id === data.id ? saved : r)));
    } else {
      setRecordings((prev) => [saved, ...prev]);
    }

    setShowForm(false);
    setEditingRecording(null);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/recordings?id=${id}`, {
      method: "DELETE",
    });

    if (!res.ok) return;

    setRecordings((prev) => prev.filter((r) => r.id !== id));
    setDeletingId(null);
  }

  function handleEdit(recording: Recording) {
    setEditingRecording(recording);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingRecording(null);
  }

  return (
    <div className="space-y-6">
      {/* Add Recording Button */}
      {!showForm && (
        <Button onClick={() => { setEditingRecording(null); setShowForm(true); }}>
          <Plus className="h-4 w-4" />
          Add Recording
        </Button>
      )}

      {/* Form */}
      {showForm && (
        <RecordingForm
          recording={editingRecording ? {
            id: editingRecording.id,
            title: editingRecording.title,
            description: editingRecording.description,
            videoUrl: editingRecording.videoUrl,
            category: editingRecording.category,
            duration: editingRecording.duration,
            courseId: editingRecording.courseId,
          } : undefined}
          courses={courses}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Recordings List */}
      {recordings.length === 0 && !showForm ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Film className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No recordings yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Click &ldquo;Add Recording&rdquo; to create one.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {recordings.map((recording) => {
            const catStyle = CATEGORY_STYLES[recording.category] || {
              label: recording.category,
              variant: "secondary" as const,
            };

            return (
              <Card key={recording.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium truncate">{recording.title}</p>
                      <Badge variant={catStyle.variant}>{catStyle.label}</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                      {recording.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {recording.duration} min
                        </span>
                      )}
                      {recording.course && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {recording.course.title}
                        </span>
                      )}
                      <span>
                        {new Date(recording.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    {deletingId === recording.id ? (
                      <>
                        <span className="text-sm text-destructive mr-1">Delete?</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(recording.id)}
                        >
                          Yes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingId(null)}
                        >
                          No
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(recording)}
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingId(recording.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

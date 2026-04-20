"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { StickyNote, Check, Loader2 } from "lucide-react";

interface LessonNotesProps {
  lessonId: string;
}

export function LessonNotes({ lessonId }: LessonNotesProps) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load note on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/notes?lessonId=${encodeURIComponent(lessonId)}`);
        if (res.ok) {
          const data = await res.json();
          setContent(data.content || "");
        }
      } catch (err) {
        console.error("Failed to load note:", err);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, [lessonId]);

  // Auto-save with debounce
  const save = useCallback(
    async (text: string) => {
      setSaving(true);
      setSaved(false);
      try {
        await fetch("/api/notes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId, content: text }),
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        console.error("Failed to save note:", err);
      } finally {
        setSaving(false);
      }
    },
    [lessonId]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setSaved(false);

    // Debounce save
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => save(text), 1000);
  };

  if (!loaded) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <StickyNote className="h-4 w-4" />
          My Notes
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {saving && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </>
          )}
          {saved && (
            <>
              <Check className="h-3 w-3 text-accent" />
              Saved
            </>
          )}
        </div>
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Jot down notes, key takeaways, or reminders for this lesson..."
        rows={4}
        maxLength={10000}
        className="w-full resize-y rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-primary/50 focus:bg-secondary"
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompletionToggleProps {
  lessonId: string;
  initialCompleted: boolean;
}

export function CompletionToggle({ lessonId, initialCompleted }: CompletionToggleProps) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completed: !completed }),
      });
      if (res.ok) {
        setCompleted(!completed);
        router.refresh();
      }
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={toggle}
      variant={completed ? "secondary" : "default"}
      size="sm"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : completed ? (
        <CheckCircle2 className="h-4 w-4 text-accent" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {completed ? "Completed" : "Mark Complete"}
    </Button>
  );
}

"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, X, Sparkles } from "lucide-react";
import Link from "next/link";

interface OnboardingChecklistProps {
  hasEnrollments: boolean;
  hasCompletedLesson: boolean;
  hasXp: boolean;
  userName?: string | null;
}

interface ChecklistItem {
  id: string;
  label: string;
  href?: string;
  completed: boolean;
}

export function OnboardingChecklist({
  hasEnrollments,
  hasCompletedLesson,
  hasXp,
  userName,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(false);

  // Check localStorage for dismissal
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDismissed(localStorage.getItem("onboarding-dismissed") === "true");
    }
  }, []);

  const items: ChecklistItem[] = [
    {
      id: "profile",
      label: "Set up your profile",
      href: "/profile",
      completed: !!userName,
    },
    {
      id: "enroll",
      label: "Enroll in your first course",
      href: "/courses",
      completed: hasEnrollments,
    },
    {
      id: "lesson",
      label: "Complete your first lesson",
      completed: hasCompletedLesson,
    },
    {
      id: "xp",
      label: "Earn your first XP",
      completed: hasXp,
    },
  ];

  const completedCount = items.filter((i) => i.completed).length;
  const allDone = completedCount === items.length;

  // Auto-dismiss when all done
  useEffect(() => {
    if (allDone && !dismissed) {
      const t = setTimeout(() => {
        setDismissed(true);
        localStorage.setItem("onboarding-dismissed", "true");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [allDone, dismissed]);

  if (dismissed) return null;

  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-accent/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">
              {allDone ? "You're all set!" : "Getting Started"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {allDone
                ? "Welcome to BlokSchool. Start building!"
                : `${completedCount} of ${items.length} steps complete`}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setDismissed(true);
            localStorage.setItem("onboarding-dismissed", "true");
          }}
          className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
          style={{ width: `${(completedCount / items.length) * 100}%` }}
        />
      </div>

      {/* Checklist items */}
      <ul className="mt-4 space-y-2">
        {items.map((item) => {
          const inner = (
            <div
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                item.completed
                  ? "text-muted-foreground"
                  : item.href
                  ? "hover:bg-secondary cursor-pointer"
                  : ""
              }`}
            >
              {item.completed ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <span className={item.completed ? "line-through" : "font-medium"}>
                {item.label}
              </span>
            </div>
          );

          if (item.href && !item.completed) {
            return (
              <li key={item.id}>
                <Link href={item.href}>{inner}</Link>
              </li>
            );
          }
          return <li key={item.id}>{inner}</li>;
        })}
      </ul>
    </div>
  );
}

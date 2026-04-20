"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, CheckCircle2, AlertCircle, Users, Loader2 } from "lucide-react";

interface QueueProject {
  id: string;
  repoUrl: string;
  submittedAt: string;
  lesson: { title: string };
  user: { name: string | null };
}

export function ReviewQueue() {
  const [projects, setProjects] = useState<QueueProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQueue();
  }, []);

  async function fetchQueue() {
    try {
      const res = await fetch("/api/reviews?type=queue");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitReview(projectId: string, status: "approved" | "needs_changes") {
    if (!comment.trim()) {
      setError("Please add a comment for your review");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, status, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      // Remove from queue and reset
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setExpandedId(null);
      setComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 px-6 text-center">
        <Users className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="font-medium">No projects to review</p>
        <p className="text-sm text-muted-foreground mt-1">
          Check back later for new submissions from your peers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => {
        const isExpanded = expandedId === project.id;
        const firstName = project.user.name?.split(" ")[0] || "Student";

        return (
          <Card key={project.id} className={cn("transition-all", isExpanded && "border-primary/30")}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{project.lesson.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Submitted by {firstName}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Github className="h-4 w-4" />
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {!isExpanded && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setExpandedId(project.id)}
                    >
                      Review
                    </Button>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-3 pt-3 border-t border-border">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Github className="h-4 w-4" />
                    {project.repoUrl.replace("https://github.com/", "")}
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <textarea
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[100px] resize-y"
                    placeholder="Write your review comment... Be constructive and helpful."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSubmitReview(project.id, "approved")}
                      disabled={submitting}
                      className="gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSubmitReview(project.id, "needs_changes")}
                      disabled={submitting}
                      className="gap-1.5"
                    >
                      <AlertCircle className="h-4 w-4" />
                      Request Changes
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setExpandedId(null);
                        setComment("");
                        setError("");
                      }}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

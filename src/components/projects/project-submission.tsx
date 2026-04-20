"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Github, CheckCircle2, AlertCircle, Clock, Send } from "lucide-react";

interface ExistingProject {
  id: string;
  repoUrl: string;
  status: string;
  feedback?: string | null;
}

interface ProjectSubmissionProps {
  lessonId: string;
  existingProject?: ExistingProject;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "accent" | "outline"; icon: typeof CheckCircle2 }> = {
  submitted: { label: "Submitted", variant: "secondary", icon: Clock },
  approved: { label: "Approved", variant: "accent", icon: CheckCircle2 },
  needs_changes: { label: "Needs Changes", variant: "outline", icon: AlertCircle },
};

export function ProjectSubmission({ lessonId, existingProject }: ProjectSubmissionProps) {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!repoUrl.includes("github.com")) {
      setError("Please enter a valid GitHub repository URL");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, repoUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit project");
      }

      setRepoUrl("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (existingProject) {
    const config = statusConfig[existingProject.status] || statusConfig.submitted;
    const StatusIcon = config.icon;

    return (
      <Card className={cn(
        "border",
        existingProject.status === "approved" && "border-accent/30",
        existingProject.status === "needs_changes" && "border-destructive/30"
      )}>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-sm">Project Submitted</span>
            </div>
            <Badge variant={config.variant} className="gap-1">
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </Badge>
          </div>

          <a
            href={existingProject.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            {existingProject.repoUrl}
            <ExternalLink className="h-3 w-3" />
          </a>

          {existingProject.feedback && (
            <div className={cn(
              "rounded-lg p-3 text-sm",
              existingProject.status === "approved"
                ? "bg-accent/10 text-accent-foreground"
                : "bg-destructive/10 text-foreground"
            )}>
              <p className="font-medium mb-1">Feedback:</p>
              <p className="text-muted-foreground">{existingProject.feedback}</p>
            </div>
          )}

          {existingProject.status === "needs_changes" && (
            <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">Resubmit with updated repo:</p>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://github.com/you/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  required
                />
                <Button type="submit" size="sm" disabled={loading}>
                  {loading ? "..." : "Resubmit"}
                </Button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </form>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Github className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-sm">Submit Your Project</span>
          </div>

          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://github.com/you/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading} className="gap-1.5 shrink-0">
              <Send className="h-4 w-4" />
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <p className="text-xs text-muted-foreground">
            Paste your GitHub repository URL. Make sure your repo is public so reviewers can access it.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

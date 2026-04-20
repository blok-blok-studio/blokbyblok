"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, MessageSquare, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    repoUrl: string;
    status: string;
    lesson: {
      title: string;
    };
    submittedAt: string;
    feedback?: string | null;
    reviews: { id: string }[];
  };
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "accent" | "outline"; icon: typeof CheckCircle2 }> = {
  submitted: { label: "Submitted", variant: "secondary", icon: Clock },
  approved: { label: "Approved", variant: "accent", icon: CheckCircle2 },
  needs_changes: { label: "Needs Changes", variant: "outline", icon: AlertCircle },
};

export function ProjectCard({ project }: ProjectCardProps) {
  const config = statusConfig[project.status] || statusConfig.submitted;
  const StatusIcon = config.icon;
  const reviewCount = project.reviews?.length || 0;

  return (
    <Card className={cn(
      "transition-all hover:border-primary/20",
      project.status === "approved" && "border-accent/20",
      project.status === "needs_changes" && "border-destructive/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-1">
            {project.lesson.title}
          </CardTitle>
          <Badge variant={config.variant} className="gap-1 shrink-0">
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <Github className="h-4 w-4 shrink-0" />
          <span className="truncate">{project.repoUrl.replace("https://github.com/", "")}</span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {new Date(project.submittedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
          </span>
        </div>

        {project.feedback && (
          <div className={cn(
            "rounded-lg p-3 text-sm",
            project.status === "approved"
              ? "bg-accent/10"
              : "bg-destructive/10"
          )}>
            <p className="text-xs font-medium mb-1 text-muted-foreground">Feedback</p>
            <p className="text-sm line-clamp-2">{project.feedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

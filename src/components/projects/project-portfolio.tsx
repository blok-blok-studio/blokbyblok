"use client";

import { ProjectCard } from "@/components/projects/project-card";
import { FolderOpen } from "lucide-react";

interface ProjectData {
  id: string;
  repoUrl: string;
  status: string;
  lesson: {
    title: string;
  };
  submittedAt: string;
  feedback?: string | null;
  reviews: { id: string }[];
}

interface ProjectPortfolioProps {
  projects: ProjectData[];
}

export function ProjectPortfolio({ projects }: ProjectPortfolioProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 px-6 text-center">
        <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">No projects submitted yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Complete lessons with project assignments to build your portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

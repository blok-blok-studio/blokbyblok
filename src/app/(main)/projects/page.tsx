import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FolderGit2, CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectPortfolio } from "@/components/projects/project-portfolio";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          slug: true,
          module: {
            select: {
              title: true,
              course: { select: { title: true, slug: true } },
            },
          },
        },
      },
      reviews: {
        select: { id: true },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  const totalSubmitted = projects.length;
  const approvedCount = projects.filter((p) => p.status === "approved").length;
  const pendingCount = projects.filter((p) => p.status === "submitted").length;

  // Serialize dates for client components
  const serializedProjects = projects.map((p) => ({
    ...p,
    submittedAt: p.submittedAt.toISOString(),
    reviewedAt: p.reviewedAt?.toISOString() || null,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Projects</h1>
        <p className="mt-1 text-muted-foreground">
          Track your project submissions and review feedback.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FolderGit2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalSubmitted}</p>
              <p className="text-sm text-muted-foreground">Total Submitted</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <CheckCircle2 className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{approvedCount}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <ProjectPortfolio projects={serializedProjects} />

      {/* CTA if no projects */}
      {projects.length === 0 && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-background to-accent/5">
          <CardContent className="flex items-center gap-6 p-6">
            <div className="flex-1">
              <p className="font-semibold">Ready to build something?</p>
              <p className="text-sm text-muted-foreground">
                Browse courses and find lessons with project assignments to get started.
              </p>
            </div>
            <Link href="/courses">
              <Button size="sm" className="shrink-0 gap-1.5">
                Browse Courses
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

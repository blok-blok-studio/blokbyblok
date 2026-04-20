import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UsersRound, Crown, Users, Archive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CohortActions } from "./cohort-actions";

export default async function CohortsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const memberships = await prisma.cohortMember.findMany({
    where: { userId: session.user.id },
    include: {
      cohort: {
        include: {
          owner: { select: { name: true } },
          _count: { select: { members: true } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  const canCreate = session.user.role === "ADMIN" || session.user.role === "INSTRUCTOR";

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cohorts</h1>
          <p className="mt-1 text-muted-foreground">
            Your classrooms and study groups. Join with a code or create your own.
          </p>
        </div>
        <CohortActions canCreate={canCreate} />
      </div>

      {memberships.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <UsersRound className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">No cohorts yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Ask your instructor for a join code, or create your own cohort if you&apos;re teaching a class.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {memberships.map((m) => {
            const c = m.cohort;
            const isOwner = c.ownerId === session.user.id;

            return (
              <Card
                key={c.id}
                className={`group overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 ${
                  c.archived ? "opacity-60" : ""
                }`}
              >
                <div className={`h-1.5 ${isOwner ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-primary to-accent"}`} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{c.name}</CardTitle>
                    <div className="flex items-center gap-1.5">
                      {isOwner && (
                        <Badge variant="outline" className="gap-1 text-amber-500 border-amber-500/30">
                          <Crown className="h-3 w-3" /> Teacher
                        </Badge>
                      )}
                      {c.archived && (
                        <Badge variant="secondary" className="gap-1">
                          <Archive className="h-3 w-3" /> Archived
                        </Badge>
                      )}
                    </div>
                  </div>
                  {c.description && (
                    <CardDescription className="line-clamp-2">{c.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {c._count.members} members
                    </span>
                    <span>by {c.owner.name || "Instructor"}</span>
                  </div>
                  {isOwner && (
                    <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
                      <span className="text-xs text-muted-foreground">Join code:</span>
                      <code className="font-mono text-sm font-bold tracking-wider text-primary">{c.code}</code>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Link href={`/cohorts/${c.id}`} className="flex-1">
                      <Button variant="default" className="w-full" size="sm">
                        View Cohort
                      </Button>
                    </Link>
                    {isOwner && (
                      <Link href={`/cohorts/${c.id}/dashboard`}>
                        <Button variant="outline" size="sm">
                          Dashboard
                        </Button>
                      </Link>
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

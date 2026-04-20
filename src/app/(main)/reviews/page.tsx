import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReviewQueue } from "@/components/reviews/review-queue";
import { ReviewComment } from "@/components/reviews/review-comment";

export default async function ReviewsPage() {
  const session = await auth();
  if (!session?.user) return null;

  // Fetch reviews this user has given
  const myReviews = await prisma.peerReview.findMany({
    where: { reviewerId: session.user.id },
    include: {
      project: {
        include: {
          lesson: { select: { title: true } },
          user: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const approvedCount = myReviews.filter((r) => r.status === "approved").length;
  const changesCount = myReviews.filter((r) => r.status === "needs_changes").length;

  const serializedReviews = myReviews.map((r) => ({
    id: r.id,
    status: r.status,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
    reviewer: { name: session.user!.name || null },
    project: {
      lesson: r.project.lesson,
      user: r.project.user,
    },
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Peer Reviews</h1>
        <p className="mt-1 text-muted-foreground">
          Review your peers&apos; projects and help each other improve.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{myReviews.length}</p>
              <p className="text-sm text-muted-foreground">Reviews Given</p>
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
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{changesCount}</p>
              <p className="text-sm text-muted-foreground">Requested Changes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects to Review */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Projects to Review</h2>
        <ReviewQueue />
      </div>

      {/* Your Reviews */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Your Reviews</h2>
        {serializedReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 px-6 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-medium">No reviews yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start reviewing projects above to help your peers.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {serializedReviews.map((review) => (
              <div key={review.id}>
                <p className="text-sm text-muted-foreground mb-2">
                  {review.project.lesson.title} — by{" "}
                  {review.project.user.name?.split(" ")[0] || "Student"}
                </p>
                <ReviewComment review={review} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

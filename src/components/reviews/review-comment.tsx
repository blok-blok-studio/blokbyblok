import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ReviewCommentProps {
  review: {
    status: string;
    comment: string;
    reviewer: { name: string | null };
    createdAt: string;
  };
}

export function ReviewComment({ review }: ReviewCommentProps) {
  const isApproved = review.status === "approved";

  return (
    <div
      className={cn(
        "rounded-xl border p-4 space-y-2",
        isApproved ? "border-accent/30" : "border-destructive/30"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {review.reviewer.name || "Anonymous"}
          </span>
          <Badge
            variant={isApproved ? "accent" : "outline"}
            className="gap-1"
          >
            {isApproved ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <AlertCircle className="h-3 w-3" />
            )}
            {isApproved ? "Approved" : "Needs Changes"}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{review.comment}</p>
    </div>
  );
}

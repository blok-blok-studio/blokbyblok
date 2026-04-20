import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Video } from "lucide-react";
import { RecordingsFilter } from "./recordings-filter";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "live-session", label: "Live Sessions" },
  { value: "tutorial", label: "Tutorials" },
  { value: "workshop", label: "Workshops" },
  { value: "q-and-a", label: "Q&A" },
];

export default async function RecordingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const recordings = await prisma.recording.findMany({
    orderBy: { publishedAt: "desc" },
    include: {
      course: { select: { title: true, slug: true } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Video className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Recordings</h1>
        </div>
        <p className="text-muted-foreground">
          Live sessions, tutorials, and workshops — watch anytime.
        </p>
      </div>

      {/* Filter + Grid */}
      <RecordingsFilter
        recordings={recordings.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          videoUrl: r.videoUrl,
          thumbnail: r.thumbnail,
          duration: r.duration,
          category: r.category,
          publishedAt: r.publishedAt.toISOString(),
          order: r.order,
          course: r.course ? { title: r.course.title, slug: r.course.slug } : null,
        }))}
        categories={CATEGORIES}
      />
    </div>
  );
}

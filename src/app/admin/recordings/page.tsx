import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RecordingsList } from "./recordings-list";

export default async function RecordingsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [recordings, courses] = await Promise.all([
    prisma.recording.findMany({
      include: { course: { select: { id: true, title: true } } },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.course.findMany({
      select: { id: true, title: true },
      orderBy: { order: "asc" },
    }),
  ]);

  // Serialize dates to strings for client component
  const serializedRecordings = recordings.map((r) => ({
    ...r,
    publishedAt: r.publishedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Recordings</h1>
        <p className="mt-1 text-muted-foreground">
          Create and manage video recordings for courses.
        </p>
      </div>
      <RecordingsList
        initialRecordings={serializedRecordings}
        courses={courses}
      />
    </div>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET — all projects from cohort members
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Must be a member
  const membership = await prisma.cohortMember.findUnique({
    where: { cohortId_userId: { cohortId: id, userId: session.user.id } },
  });
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 });
  }

  // Get all member user IDs
  const members = await prisma.cohortMember.findMany({
    where: { cohortId: id },
    select: { userId: true },
  });
  const memberIds = members.map((m) => m.userId);

  // Get all projects from members
  const projects = await prisma.project.findMany({
    where: { userId: { in: memberIds } },
    include: {
      user: { select: { id: true, name: true, image: true } },
      lesson: {
        select: {
          title: true,
          slug: true,
          module: { select: { title: true, course: { select: { title: true, slug: true } } } },
        },
      },
      _count: { select: { comments: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(
    projects.map((p) => ({
      id: p.id,
      repoUrl: p.repoUrl,
      status: p.status,
      submittedAt: p.submittedAt.toISOString(),
      commentCount: p._count.comments,
      author: { id: p.user.id, name: p.user.name, image: p.user.image },
      lesson: {
        title: p.lesson.title,
        slug: p.lesson.slug,
        moduleName: p.lesson.module.title,
        courseTitle: p.lesson.module.course.title,
        courseSlug: p.lesson.module.course.slug,
      },
    }))
  );
}

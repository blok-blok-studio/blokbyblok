import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET — all comments on a project
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const comments = await prisma.projectComment.findMany({
    where: { projectId: id },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
      author: { id: c.author.id, name: c.author.name, image: c.author.image },
    }))
  );
}

// POST — add a comment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await req.json();
  if (!content || content.trim().length < 2) {
    return NextResponse.json({ error: "Comment must be at least 2 characters" }, { status: 400 });
  }

  // Verify project exists
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Can't comment on your own project
  if (project.userId === session.user.id) {
    return NextResponse.json({ error: "You can't comment on your own project" }, { status: 400 });
  }

  const comment = await prisma.projectComment.create({
    data: {
      projectId: id,
      authorId: session.user.id,
      content: content.trim().slice(0, 5000),
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });

  // Award XP for commenting (import dynamically to avoid circular deps)
  try {
    const { awardXp, checkAndAwardAchievements } = await import("@/lib/gamification");
    await awardXp(session.user.id, 10, "project_comment", comment.id);
    await checkAndAwardAchievements(session.user.id);
  } catch (err) {
    console.error("Failed to award comment XP:", err);
  }

  return NextResponse.json({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    author: { id: comment.author.id, name: comment.author.name, image: comment.author.image },
  });
}

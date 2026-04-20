import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (type === "queue") {
    // Projects available to review: not your own, status=submitted, you haven't reviewed yet
    const projects = await prisma.project.findMany({
      where: {
        status: "submitted",
        userId: { not: session.user.id },
        reviews: {
          none: {
            reviewerId: session.user.id,
          },
        },
      },
      include: {
        lesson: {
          select: { title: true },
        },
        user: {
          select: { name: true },
        },
      },
      orderBy: { submittedAt: "asc" },
    });

    return NextResponse.json(projects);
  }

  if (type === "mine") {
    // Reviews you've given
    const reviews = await prisma.peerReview.findMany({
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

    return NextResponse.json(reviews);
  }

  return NextResponse.json({ error: "type parameter required (queue or mine)" }, { status: 400 });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, status, comment } = await req.json();

  if (!projectId || !status || !comment) {
    return NextResponse.json(
      { error: "projectId, status, and comment are required" },
      { status: 400 }
    );
  }

  if (!["approved", "needs_changes"].includes(status)) {
    return NextResponse.json(
      { error: "Status must be 'approved' or 'needs_changes'" },
      { status: 400 }
    );
  }

  // Can't review your own project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (project.userId === session.user.id) {
    return NextResponse.json(
      { error: "You cannot review your own project" },
      { status: 403 }
    );
  }

  // Check if already reviewed
  const existing = await prisma.peerReview.findUnique({
    where: {
      projectId_reviewerId: {
        projectId,
        reviewerId: session.user.id,
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "You have already reviewed this project" },
      { status: 409 }
    );
  }

  const review = await prisma.peerReview.create({
    data: {
      projectId,
      reviewerId: session.user.id,
      status,
      comment,
    },
  });

  return NextResponse.json(review, { status: 201 });
}

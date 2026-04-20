import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId, repoUrl } = await req.json();

  if (!lessonId || !repoUrl) {
    return NextResponse.json(
      { error: "lessonId and repoUrl are required" },
      { status: 400 }
    );
  }

  if (!repoUrl.includes("github.com")) {
    return NextResponse.json(
      { error: "Please provide a valid GitHub repository URL" },
      { status: 400 }
    );
  }

  // Check if project already exists for this user + lesson
  const existing = await prisma.project.findUnique({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
  });

  if (existing) {
    // Update existing project
    const updated = await prisma.project.update({
      where: { id: existing.id },
      data: {
        repoUrl,
        status: "submitted",
        feedback: null,
        reviewedBy: null,
        reviewedAt: null,
      },
    });
    return NextResponse.json(updated);
  }

  const project = await prisma.project.create({
    data: {
      userId: session.user.id,
      lessonId,
      repoUrl,
    },
  });

  return NextResponse.json(project, { status: 201 });
}

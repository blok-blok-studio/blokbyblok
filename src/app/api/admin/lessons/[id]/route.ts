import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { module: { include: { course: true } } },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(lesson);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const lesson = await prisma.lesson.update({
    where: { id },
    data: {
      title: body.title,
      content: body.content,
      videoUrl: body.videoUrl || null,
      githubUrl: body.githubUrl || null,
      duration: body.duration ? parseInt(body.duration) : null,
      // Sandbox fields
      sandboxEnabled: body.sandboxEnabled ?? false,
      sandboxLanguage: body.sandboxLanguage || null,
      sandboxStarterCode: body.sandboxStarterCode || null,
      sandboxSolution: body.sandboxSolution || null,
      sandboxTestCode: body.sandboxTestCode || null,
      // Project fields
      projectEnabled: body.projectEnabled ?? false,
      projectInstructions: body.projectInstructions || null,
      projectTemplateRepo: body.projectTemplateRepo || null,
    },
  });

  return NextResponse.json(lesson);
}

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const recordings = await prisma.recording.findMany({
    include: { course: { select: { id: true, title: true } } },
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json(recordings);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();

  if (!body.title || !body.videoUrl || !body.category) {
    return NextResponse.json(
      { error: "Title, video URL, and category are required" },
      { status: 400 }
    );
  }

  const recording = await prisma.recording.create({
    data: {
      title: body.title,
      description: body.description || null,
      videoUrl: body.videoUrl,
      category: body.category,
      duration: body.duration ? parseInt(body.duration) : null,
      courseId: body.courseId || null,
    },
    include: { course: { select: { id: true, title: true } } },
  });

  return NextResponse.json(recording);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();

  if (!body.id) {
    return NextResponse.json({ error: "Recording ID is required" }, { status: 400 });
  }

  const recording = await prisma.recording.update({
    where: { id: body.id },
    data: {
      title: body.title,
      description: body.description || null,
      videoUrl: body.videoUrl,
      category: body.category,
      duration: body.duration ? parseInt(body.duration) : null,
      courseId: body.courseId || null,
    },
    include: { course: { select: { id: true, title: true } } },
  });

  return NextResponse.json(recording);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Recording ID is required" }, { status: 400 });
  }

  await prisma.recording.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

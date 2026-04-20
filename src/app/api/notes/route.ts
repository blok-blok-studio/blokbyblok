import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET — fetch note for a lesson
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lessonId = req.nextUrl.searchParams.get("lessonId");
  if (!lessonId) {
    return NextResponse.json({ error: "Missing lessonId" }, { status: 400 });
  }

  const note = await prisma.lessonNote.findUnique({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
  });

  return NextResponse.json({ content: note?.content || "" });
}

// PUT — save/update note for a lesson
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId, content } = await req.json();
  if (!lessonId) {
    return NextResponse.json({ error: "Missing lessonId" }, { status: 400 });
  }

  // Limit note size to 10,000 characters
  const trimmed = (content || "").slice(0, 10000);

  const note = await prisma.lessonNote.upsert({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
    update: { content: trimmed },
    create: {
      userId: session.user.id,
      lessonId,
      content: trimmed,
    },
  });

  return NextResponse.json({ saved: true, updatedAt: note.updatedAt });
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lessonId");

  if (!lessonId) {
    return NextResponse.json(
      { error: "Missing lessonId" },
      { status: 400 }
    );
  }

  const messages = await prisma.tutorChat.findMany({
    where: {
      userId: session.user.id,
      lessonId,
    },
    orderBy: { createdAt: "asc" },
    take: 50,
    select: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
    },
  });

  return NextResponse.json(messages);
}

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { lessons } = body as { lessons: { id: string; order: number }[] };

  if (!lessons || !Array.isArray(lessons)) {
    return NextResponse.json({ error: "Missing lessons array" }, { status: 400 });
  }

  await Promise.all(
    lessons.map((l) =>
      prisma.lesson.update({ where: { id: l.id }, data: { order: l.order } })
    )
  );

  return NextResponse.json({ success: true });
}

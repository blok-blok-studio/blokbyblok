import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { courseId, title } = body;

  if (!courseId || !title) {
    return NextResponse.json({ error: "Missing courseId or title" }, { status: 400 });
  }

  const maxOrder = await prisma.module.aggregate({
    where: { courseId },
    _max: { order: true },
  });

  const module = await prisma.module.create({
    data: {
      courseId,
      title,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  return NextResponse.json(module);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { id, title, order } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (order !== undefined) data.order = order;

  const module = await prisma.module.update({ where: { id }, data });
  return NextResponse.json(module);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.module.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

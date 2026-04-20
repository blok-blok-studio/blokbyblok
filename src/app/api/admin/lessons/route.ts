import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { moduleId, title } = body;

  if (!moduleId || !title) {
    return NextResponse.json({ error: "Missing moduleId or title" }, { status: 400 });
  }

  const maxOrder = await prisma.lesson.aggregate({
    where: { moduleId },
    _max: { order: true },
  });

  const baseSlug = slugify(title);
  // Ensure unique slug within module
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.lesson.findUnique({
      where: { moduleId_slug: { moduleId, slug } },
    });
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const lesson = await prisma.lesson.create({
    data: {
      moduleId,
      title,
      slug,
      content: "",
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  return NextResponse.json(lesson);
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

  await prisma.lesson.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

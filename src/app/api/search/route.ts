import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // Search courses
  const courses = await prisma.course.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { id: true, title: true, slug: true },
    take: 5,
  });

  // Search lessons
  const lessons = await prisma.lesson.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ],
      module: {
        course: { published: true },
      },
    },
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
    take: 10,
  });

  const results = [
    ...courses.map((c) => ({
      type: "course" as const,
      title: c.title,
      href: `/courses/${c.slug}`,
    })),
    ...lessons.map((l) => ({
      type: "lesson" as const,
      title: l.title,
      subtitle: `${l.module.course.title} → ${l.module.title}`,
      href: `/courses/${l.module.course.slug}/lesson/${l.slug}`,
    })),
  ];

  return NextResponse.json({ results });
}

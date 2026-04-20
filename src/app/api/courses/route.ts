import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      modules: {
        include: { lessons: { select: { id: true } } },
        orderBy: { order: "asc" },
      },
      _count: { select: { enrollments: true } },
    },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(courses);
}

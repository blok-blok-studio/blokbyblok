import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });

  if (existing) {
    return NextResponse.json({ message: "Already enrolled" });
  }

  const enrollment = await prisma.enrollment.create({
    data: { userId: session.user.id, courseId: course.id },
  });

  return NextResponse.json(enrollment);
}

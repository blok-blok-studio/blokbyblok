import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET — list courses assigned to this cohort
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Must be a member
  const membership = await prisma.cohortMember.findUnique({
    where: { cohortId_userId: { cohortId: id, userId: session.user.id } },
  });
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 });
  }

  const cohortCourses = await prisma.cohortCourse.findMany({
    where: { cohortId: id },
    include: {
      course: {
        include: {
          modules: {
            include: { lessons: { select: { id: true, duration: true } } },
            orderBy: { order: "asc" },
          },
          _count: { select: { enrollments: true } },
        },
      },
    },
  });

  return NextResponse.json(
    cohortCourses.map((cc) => ({
      id: cc.course.id,
      title: cc.course.title,
      slug: cc.course.slug,
      description: cc.course.description,
      moduleCount: cc.course.modules.length,
      lessonCount: cc.course.modules.reduce((a, m) => a + m.lessons.length, 0),
      enrollmentCount: cc.course._count.enrollments,
    }))
  );
}

// PUT — set courses for this cohort (owner only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cohort = await prisma.cohort.findUnique({ where: { id } });
  if (!cohort || cohort.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { courseIds } = await req.json();
  if (!Array.isArray(courseIds)) {
    return NextResponse.json({ error: "courseIds must be an array" }, { status: 400 });
  }

  // Delete existing and re-create
  await prisma.cohortCourse.deleteMany({ where: { cohortId: id } });

  if (courseIds.length > 0) {
    await prisma.cohortCourse.createMany({
      data: courseIds.map((courseId: string) => ({ cohortId: id, courseId })),
    });
  }

  return NextResponse.json({ success: true, count: courseIds.length });
}

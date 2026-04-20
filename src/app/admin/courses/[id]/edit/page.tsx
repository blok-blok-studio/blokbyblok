import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CourseEditor } from "./course-editor";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) notFound();

  return <CourseEditor course={course} />;
}

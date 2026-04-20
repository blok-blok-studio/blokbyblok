import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courseId = req.nextUrl.searchParams.get("courseId");
  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
  }

  // Verify course exists and user is enrolled
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  progress: { where: { userId: session.user.id } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
  }

  // Check 100% completion
  const totalLessons = enrollment.course.modules.reduce(
    (a, m) => a + m.lessons.length,
    0
  );
  const completedLessons = enrollment.course.modules.reduce(
    (a, m) =>
      a + m.lessons.filter((l) => l.progress.some((p) => p.completed)).length,
    0
  );

  if (totalLessons === 0 || completedLessons < totalLessons) {
    return NextResponse.json(
      { error: "Course not completed", completed: completedLessons, total: totalLessons },
      { status: 400 }
    );
  }

  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Generate SVG certificate
  const studentName = session.user.name || "Student";
  const courseTitle = enrollment.course.title;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="800" viewBox="0 0 1100 800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0f"/>
      <stop offset="50%" style="stop-color:#12141f"/>
      <stop offset="100%" style="stop-color:#0a0a0f"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#8b5cf6"/>
      <stop offset="100%" style="stop-color:#a78bfa"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f59e0b"/>
      <stop offset="100%" style="stop-color:#fbbf24"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1100" height="800" fill="url(#bg)"/>

  <!-- Border -->
  <rect x="30" y="30" width="1040" height="740" rx="16" fill="none" stroke="url(#accent)" stroke-width="2" opacity="0.4"/>
  <rect x="40" y="40" width="1020" height="720" rx="12" fill="none" stroke="url(#accent)" stroke-width="1" opacity="0.2"/>

  <!-- Corner accents -->
  <circle cx="60" cy="60" r="4" fill="#8b5cf6" opacity="0.6"/>
  <circle cx="1040" cy="60" r="4" fill="#8b5cf6" opacity="0.6"/>
  <circle cx="60" cy="740" r="4" fill="#8b5cf6" opacity="0.6"/>
  <circle cx="1040" cy="740" r="4" fill="#8b5cf6" opacity="0.6"/>

  <!-- Logo -->
  <text x="550" y="130" text-anchor="middle" fill="#8b5cf6" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" letter-spacing="2">BLOKSCHOOL</text>

  <!-- Certificate title -->
  <text x="550" y="210" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="300" letter-spacing="6">CERTIFICATE OF COMPLETION</text>

  <!-- Divider -->
  <line x1="350" y1="240" x2="750" y2="240" stroke="url(#accent)" stroke-width="1" opacity="0.5"/>

  <!-- This certifies -->
  <text x="550" y="300" text-anchor="middle" fill="#9ca3af" font-family="system-ui, -apple-system, sans-serif" font-size="16" letter-spacing="1">This certifies that</text>

  <!-- Student name -->
  <text x="550" y="370" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="700">${escapeXml(studentName)}</text>

  <!-- Name underline -->
  <line x1="250" y1="390" x2="850" y2="390" stroke="url(#gold)" stroke-width="1" opacity="0.4"/>

  <!-- Has completed -->
  <text x="550" y="440" text-anchor="middle" fill="#9ca3af" font-family="system-ui, -apple-system, sans-serif" font-size="16" letter-spacing="1">has successfully completed the course</text>

  <!-- Course title -->
  <text x="550" y="510" text-anchor="middle" fill="url(#accent)" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="600">${escapeXml(courseTitle)}</text>

  <!-- Lessons completed -->
  <text x="550" y="560" text-anchor="middle" fill="#6b7280" font-family="system-ui, -apple-system, sans-serif" font-size="14">${totalLessons} lessons completed</text>

  <!-- Date -->
  <text x="550" y="640" text-anchor="middle" fill="#9ca3af" font-family="system-ui, -apple-system, sans-serif" font-size="16">${completionDate}</text>

  <!-- Seal -->
  <circle cx="550" cy="710" r="24" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.5"/>
  <text x="550" y="716" text-anchor="middle" fill="#f59e0b" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" opacity="0.7">BS</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Content-Disposition": `attachment; filename="BlokSchool-${enrollment.course.slug}-certificate.svg"`,
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

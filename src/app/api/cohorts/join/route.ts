import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await req.json();
  if (!code || code.trim().length < 4) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  const cohort = await prisma.cohort.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!cohort) {
    return NextResponse.json({ error: "Cohort not found. Check the code and try again." }, { status: 404 });
  }

  if (cohort.archived) {
    return NextResponse.json({ error: "This cohort is no longer accepting new members." }, { status: 400 });
  }

  // Check if already a member
  const existing = await prisma.cohortMember.findUnique({
    where: {
      cohortId_userId: {
        cohortId: cohort.id,
        userId: session.user.id,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ error: "You're already in this cohort." }, { status: 400 });
  }

  await prisma.cohortMember.create({
    data: {
      cohortId: cohort.id,
      userId: session.user.id,
      role: "student",
    },
  });

  return NextResponse.json({ id: cohort.id, name: cohort.name });
}

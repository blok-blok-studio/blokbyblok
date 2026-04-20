import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// GET — list user's cohorts
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const memberships = await prisma.cohortMember.findMany({
    where: { userId: session.user.id },
    include: {
      cohort: {
        include: {
          owner: { select: { id: true, name: true } },
          _count: { select: { members: true } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  const cohorts = memberships.map((m) => ({
    id: m.cohort.id,
    name: m.cohort.name,
    code: m.cohort.code,
    description: m.cohort.description,
    ownerName: m.cohort.owner.name,
    isOwner: m.cohort.ownerId === session.user.id,
    memberCount: m.cohort._count.members,
    myRole: m.role,
    archived: m.cohort.archived,
    joinedAt: m.joinedAt.toISOString(),
  }));

  return NextResponse.json(cohorts);
}

// POST — create a cohort (INSTRUCTOR/ADMIN only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Only instructors can create cohorts" }, { status: 403 });
  }

  const { name, description } = await req.json();
  if (!name || name.trim().length < 2) {
    return NextResponse.json({ error: "Name is required (min 2 characters)" }, { status: 400 });
  }

  // Generate unique 6-char code
  let code: string;
  let attempts = 0;
  do {
    code = crypto.randomBytes(3).toString("hex").toUpperCase();
    const existing = await prisma.cohort.findUnique({ where: { code } });
    if (!existing) break;
    attempts++;
  } while (attempts < 10);

  const cohort = await prisma.cohort.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      code,
      ownerId: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          role: "teacher",
        },
      },
    },
  });

  return NextResponse.json({ id: cohort.id, name: cohort.name, code: cohort.code });
}

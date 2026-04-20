import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET — cohort detail with members
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

  const cohort = await prisma.cohort.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, image: true } },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              stats: { select: { totalXp: true, level: true, currentStreak: true } },
            },
          },
        },
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  if (!cohort) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: cohort.id,
    name: cohort.name,
    code: cohort.code,
    description: cohort.description,
    archived: cohort.archived,
    isOwner: cohort.ownerId === session.user.id,
    myRole: membership.role,
    owner: cohort.owner,
    members: cohort.members.map((m) => ({
      userId: m.user.id,
      name: m.user.name,
      image: m.user.image,
      role: m.role,
      level: m.user.stats?.level || 1,
      totalXp: m.user.stats?.totalXp || 0,
      streak: m.user.stats?.currentStreak || 0,
      joinedAt: m.joinedAt.toISOString(),
    })),
  });
}

// PATCH — update cohort (owner only)
export async function PATCH(
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

  const { name, description, archived } = await req.json();
  const updated = await prisma.cohort.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description: description?.trim() || null }),
      ...(archived !== undefined && { archived }),
    },
  });

  return NextResponse.json({ id: updated.id, name: updated.name, archived: updated.archived });
}

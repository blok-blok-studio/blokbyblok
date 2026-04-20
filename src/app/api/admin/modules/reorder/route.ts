import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { modules } = body as { modules: { id: string; order: number }[] };

  if (!modules || !Array.isArray(modules)) {
    return NextResponse.json({ error: "Missing modules array" }, { status: 400 });
  }

  await Promise.all(
    modules.map((m) =>
      prisma.module.update({ where: { id: m.id }, data: { order: m.order } })
    )
  );

  return NextResponse.json({ success: true });
}

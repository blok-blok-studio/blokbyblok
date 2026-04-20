import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    // Log protection violations for audit
    console.warn("[PROTECTION VIOLATION]", {
      user: session?.user?.email || "unknown",
      userId: session?.user?.id || "unknown",
      event: body.event,
      sessionId: body.sessionId,
      timestamp: body.timestamp,
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    });

    return NextResponse.json({ logged: true });
  } catch {
    return NextResponse.json({ logged: false }, { status: 500 });
  }
}

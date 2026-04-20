import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateStreamToken, verifyStreamToken } from "@/lib/drm";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

/**
 * Authenticated Video Streaming Endpoint
 *
 * GET /api/drm/stream?token=xxx
 *   Streams the video file if the token is valid
 *
 * POST /api/drm/stream
 *   Generates a new streaming token for a video
 *   Body: { videoId: string }
 *   Returns: { streamUrl: string, token: string }
 */

// POST: Generate a signed streaming URL
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has paid (admins bypass)
    if (session.user.role !== "ADMIN") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { hasPaid: true },
      });
      if (!user?.hasPaid) {
        return NextResponse.json({ error: "Payment required" }, { status: 403 });
      }
    }

    const body = await request.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json({ error: "videoId required" }, { status: 400 });
    }

    // Generate token that expires in 60 minutes
    const token = generateStreamToken(session.user.id, videoId, 60);

    // Log streaming request
    console.log("[STREAM REQUEST]", {
      user: session.user.email,
      videoId,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      streamUrl: `/api/drm/stream?token=${token}`,
      token,
      expiresIn: 3600, // seconds
    });
  } catch (error) {
    console.error("[STREAM TOKEN ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET: Stream the actual video file
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return new NextResponse("Missing token", { status: 401 });
    }

    // Verify the streaming token
    const verification = verifyStreamToken(token);

    if (!verification.valid) {
      return new NextResponse("Invalid or expired token", { status: 403 });
    }

    // The videoId maps to a file path (e.g., /uploads/videos/lesson-id.mp4)
    const videoPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "videos",
      `${verification.videoId}.mp4`
    );

    // Check if file exists
    if (!fs.existsSync(videoPath)) {
      return new NextResponse("Video not found", { status: 404 });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;

    // Handle range requests for seeking
    const range = request.headers.get("range");

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const stream = fs.createReadStream(videoPath, { start, end });

      return new NextResponse(stream as any, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": "video/mp4",
          "Cache-Control": "no-store, no-cache, must-revalidate, private",
          "X-Content-Type-Options": "nosniff",
          // Prevent direct URL sharing
          "Content-Disposition": "inline",
        },
      });
    }

    const stream = fs.createReadStream(videoPath);

    return new NextResponse(stream as any, {
      headers: {
        "Content-Length": fileSize.toString(),
        "Content-Type": "video/mp4",
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        "Accept-Ranges": "bytes",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    console.error("[STREAM ERROR]", error);
    return new NextResponse("Server error", { status: 500 });
  }
}

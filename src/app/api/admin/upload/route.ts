import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Sanitize filename
  const ext = path.extname(file.name).toLowerCase();
  const allowedExts = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
  if (!allowedExts.includes(ext)) {
    return NextResponse.json(
      { error: `File type ${ext} not allowed. Allowed: ${allowedExts.join(", ")}` },
      { status: 400 }
    );
  }

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "videos");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  const url = `/uploads/videos/${filename}`;
  return NextResponse.json({ url });
}

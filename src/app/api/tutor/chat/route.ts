import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, lessonId, deepDive } = await req.json();

  if (!message || !lessonId) {
    return NextResponse.json(
      { error: "Missing message or lessonId" },
      { status: 400 }
    );
  }

  // ============================================
  // RATE LIMITING — 20 messages/day, 3 deep dives/day
  // ============================================
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const messagesToday = await prisma.tutorChat.count({
    where: {
      userId: session.user.id,
      role: "user",
      createdAt: { gte: today },
    },
  });

  const DAILY_LIMIT = 20;
  const DEEP_DIVE_LIMIT = 3;

  if (messagesToday >= DAILY_LIMIT) {
    return NextResponse.json(
      {
        error: "Daily limit reached",
        limit: DAILY_LIMIT,
        remaining: 0,
        resetsAt: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      },
      { status: 429 }
    );
  }

  // Count deep dives today (stored as messages with [DEEP_DIVE] prefix in content)
  if (deepDive) {
    const deepDivesToday = await prisma.tutorChat.count({
      where: {
        userId: session.user.id,
        role: "user",
        content: { startsWith: "[DEEP_DIVE]" },
        createdAt: { gte: today },
      },
    });

    if (deepDivesToday >= DEEP_DIVE_LIMIT) {
      return NextResponse.json(
        {
          error: "Deep dive limit reached",
          limit: DEEP_DIVE_LIMIT,
          remaining: 0,
        },
        { status: 429 }
      );
    }
  }

  // Choose model based on mode
  const model = deepDive
    ? "claude-sonnet-4-20250514"    // Deep analysis — powerful but costs more
    : "claude-haiku-3-5-20241022";  // Default — fast, cheap, great for tutoring

  // Fetch lesson with module and course context
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // Strip HTML tags from lesson content for the system prompt
  const plainContent = lesson.content
    .replace(/<[^>]*>/g, "")
    .slice(0, 1500);

  const systemPrompt = `You are the BlokSchool AI Tutor. Your core philosophy: "You don't need to learn to code. You need to learn to command AI." The student is studying: Course: ${lesson.module.course.title}, Module: ${lesson.module.title}, Lesson: ${lesson.title}. Lesson content summary: ${plainContent}.

Help them understand this material through an AI-first lens. Key principles:
- Encourage students to think in terms of AI commands, prompts, and workflows — not manual coding.
- When showing examples, frame them as "here's how you'd tell Claude Code to do this" or "here's the prompt/command you'd use."
- Emphasize terminal commands, CLI tools, and AI-assisted workflows over writing code by hand.
- Reinforce that their terminal is their superpower and Claude Code is their co-pilot.
- If they ask how to code something, guide them toward commanding AI to build it instead.
- Be encouraging, concise, and practical. Focus on building real things, not abstract theory.
- Don't give full solutions unless explicitly asked — instead, guide them on how to prompt AI effectively.`;

  // Fetch last 20 messages for conversation history
  const history = await prisma.tutorChat.findMany({
    where: {
      userId: session.user.id,
      lessonId,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Reverse so they're in chronological order
  history.reverse();

  // Save the user message (prefix deep dives for tracking)
  const storedMessage = deepDive ? `[DEEP_DIVE] ${message}` : message;
  await prisma.tutorChat.create({
    data: {
      userId: session.user.id,
      lessonId,
      role: "user",
      content: storedMessage,
    },
  });

  // Build messages array for Anthropic
  const messages: { role: "user" | "assistant"; content: string }[] =
    history.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

  // Add the current user message
  messages.push({ role: "user", content: message });

  // Create Anthropic client and stream response
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        const response = anthropic.messages.stream({
          model,
          max_tokens: deepDive ? 2048 : 1024,
          system: systemPrompt,
          messages,
        });

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const text = event.delta.text;
            fullResponse += text;
            controller.enqueue(encoder.encode(text));
          }
        }

        // Save assistant message after stream completes
        await prisma.tutorChat.create({
          data: {
            userId: session.user.id,
            lessonId,
            role: "assistant",
            content: fullResponse,
          },
        });

        controller.close();
      } catch (error) {
        console.error("Tutor chat streaming error:", error);
        controller.error(error);
      }
    },
  });

  const remaining = DAILY_LIMIT - messagesToday - 1;

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
      "X-Messages-Remaining": remaining.toString(),
      "X-Model-Used": model,
    },
  });
}

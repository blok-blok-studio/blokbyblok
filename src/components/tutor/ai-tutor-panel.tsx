"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, Bot, User, Loader2, Zap } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface AiTutorPanelProps {
  lessonId: string;
  lessonTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AiTutorPanel({
  lessonId,
  lessonTitle,
  isOpen,
  onClose,
}: AiTutorPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Load chat history on mount / when lessonId changes
  useEffect(() => {
    if (!isOpen) return;

    async function loadHistory() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/tutor/history?lessonId=${encodeURIComponent(lessonId)}`
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to load tutor history:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadHistory();
  }, [lessonId, isOpen]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (deepDive = false) => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    // Add user message to UI immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    // Create a placeholder for the assistant response
    const assistantId = `temp-assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", createdAt: new Date().toISOString() },
    ]);

    try {
      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, lessonId, deepDive }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 429) {
          throw new Error(errorData.error || "Daily limit reached. Come back tomorrow!");
        }
        throw new Error("Chat request failed");
      }

      // Track remaining messages from response header
      const remainingHeader = res.headers.get("X-Messages-Remaining");
      if (remainingHeader) setRemaining(parseInt(remainingHeader));

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      }
    } catch (err) {
      console.error("Tutor chat error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content:
                  "Sorry, I encountered an error. Please try again.",
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render message content with basic code block support
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const inner = part.slice(3, -3);
        const newlineIdx = inner.indexOf("\n");
        const code = newlineIdx >= 0 ? inner.slice(newlineIdx + 1) : inner;
        return (
          <pre
            key={i}
            className="my-2 rounded-lg bg-black/40 p-3 overflow-x-auto text-sm"
          >
            <code className="text-green-400">{code}</code>
          </pre>
        );
      }
      return (
        <span key={i} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[400px] flex-col border-l border-white/10 bg-[#0f1117] shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
              <Bot className="h-4 w-4 text-purple-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white">AI Tutor</h3>
              <p className="truncate text-xs text-gray-400">{lessonTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
              <span className="ml-2 text-sm text-gray-400">
                Loading history...
              </span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                <Bot className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-sm font-medium text-white">
                Hi! I&apos;m your AI Tutor.
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Ask me anything about this lesson.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[85%] gap-2 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      msg.role === "user"
                        ? "bg-purple-500/30"
                        : "bg-gray-700"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-3 w-3 text-purple-300" />
                    ) : (
                      <Bot className="h-3 w-3 text-gray-300" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-[#1a1d27] text-gray-200"
                    }`}
                  >
                    {msg.role === "assistant"
                      ? renderContent(msg.content)
                      : msg.content}
                    {msg.role === "assistant" &&
                      isStreaming &&
                      msg.content === "" && (
                        <span className="inline-flex items-center gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:0ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:150ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:300ms]" />
                        </span>
                      )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/10 px-4 py-3">
          {/* Remaining messages indicator */}
          {remaining !== null && (
            <div className="mb-2 flex items-center justify-between text-[10px]">
              <span className={remaining <= 5 ? "text-orange-400" : "text-gray-500"}>
                {remaining} questions left today
              </span>
              <span className="text-gray-600">Resets at midnight</span>
            </div>
          )}
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              rows={1}
              disabled={isStreaming}
              className="flex-1 resize-none rounded-xl border border-white/10 bg-[#1a1d27] px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-purple-500/50 disabled:opacity-50"
            />
            {/* Deep Dive button */}
            <button
              onClick={() => handleSend(true)}
              disabled={!input.trim() || isStreaming}
              title="Deep analysis (Sonnet) — 3/day"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 transition-colors hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Zap className="h-4 w-4" />
            </button>
            {/* Normal send */}
            <button
              onClick={() => handleSend(false)}
              disabled={!input.trim() || isStreaming}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-gray-600">
            <span>⚡ = Deep Analysis (Sonnet, 3/day)</span>
            <span>AI may make mistakes</span>
          </div>
        </div>
      </div>
    </>
  );
}

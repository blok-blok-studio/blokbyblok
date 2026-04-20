"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string | null; image: string | null };
}

interface CommentThreadProps {
  projectId: string;
  currentUserId: string;
  isOwnProject: boolean;
}

export function CommentThread({ projectId, currentUserId, isOwnProject }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/comments`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [...prev, comment]);
        setInput("");
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <MessageSquare className="h-4 w-4" />
        Comments ({comments.length})
      </h3>

      {loading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">
          No comments yet. {isOwnProject ? "Wait for classmates to comment!" : "Be the first to leave feedback!"}
        </p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar src={c.author.image} name={c.author.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">
                    {c.author.id === currentUserId ? "You" : c.author.name || "Student"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-foreground whitespace-pre-wrap">{c.content}</p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}

      {/* Comment input — only if not own project */}
      {!isOwnProject && (
        <div className="flex items-end gap-2 pt-2 border-t border-border">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Leave feedback on this project..."
            rows={2}
            className="flex-1 resize-none rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm placeholder-muted-foreground outline-none focus:border-primary/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}

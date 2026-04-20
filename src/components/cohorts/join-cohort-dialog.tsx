"use client";

import { useState } from "react";
import { UserPlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JoinCohortDialogProps {
  onJoined: () => void;
}

export function JoinCohortDialog({ onJoined }: JoinCohortDialogProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cohorts/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to join");
        return;
      }
      setOpen(false);
      setCode("");
      onJoined();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="outline" size="sm">
        <UserPlus className="h-4 w-4" />
        Join with Code
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Join a Cohort</h3>
            <button onClick={() => { setOpen(false); setError(""); }} className="rounded-lg p-1 hover:bg-secondary">
              <X className="h-4 w-4" />
            </button>
          </div>
          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter join code</label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. A3F2B1"
              maxLength={6}
              className="text-center text-lg font-mono tracking-widest"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            />
          </div>
          <Button onClick={handleJoin} disabled={loading || code.trim().length < 4} className="w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Join Cohort
          </Button>
        </div>
      </div>
    </div>
  );
}

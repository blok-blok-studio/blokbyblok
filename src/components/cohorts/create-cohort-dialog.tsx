"use client";

import { useState } from "react";
import { Plus, Copy, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateCohortDialogProps {
  onCreated: () => void;
}

export function CreateCohortDialog({ onCreated }: CreateCohortDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ code: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cohorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create cohort");
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setDescription("");
    setResult(null);
    setError("");
    if (result) onCreated();
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="h-4 w-4" />
        Create Cohort
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
        {result ? (
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold">Cohort Created!</h3>
            <p className="text-sm text-muted-foreground">
              Share this code with your students:
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="rounded-lg bg-primary/10 px-6 py-3 text-2xl font-mono font-bold tracking-widest text-primary">
                {result.code}
              </code>
              <button onClick={handleCopy} className="rounded-lg p-2 hover:bg-secondary">
                {copied ? <Check className="h-5 w-5 text-accent" /> : <Copy className="h-5 w-5 text-muted-foreground" />}
              </button>
            </div>
            <Button onClick={handleClose} className="w-full">Done</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Create a Cohort</h3>
              <button onClick={handleClose} className="rounded-lg p-1 hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>
            {error && (
              <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Spring 2027 — Period 3"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this cohort for?"
                rows={2}
                className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>
            <Button onClick={handleCreate} disabled={loading || !name.trim()} className="w-full">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Cohort
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

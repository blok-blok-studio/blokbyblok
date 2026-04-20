"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TerminalEmulatorProps {
  output: string[];
  isRunning?: boolean;
  className?: string;
}

export function TerminalEmulator({
  output,
  isRunning = false,
  className,
}: TerminalEmulatorProps) {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-lg border border-border overflow-hidden",
        className
      )}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#0d0d14] border-b border-border">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-muted-foreground font-mono ml-2">
          Output
        </span>
        {isRunning && (
          <span className="ml-auto text-xs text-primary font-mono animate-pulse">
            Running...
          </span>
        )}
      </div>

      {/* Terminal body */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 bg-[#09090f] font-mono text-sm leading-relaxed"
      >
        {output.length === 0 && !isRunning ? (
          <span className="text-muted-foreground">
            {">"} Waiting for output...
          </span>
        ) : (
          output.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">
              <span
                className={
                  line.startsWith("Error") || line.startsWith("Traceback")
                    ? "text-red-400"
                    : "text-green-400"
                }
              >
                {line}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

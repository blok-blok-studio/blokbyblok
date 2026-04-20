"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2, RotateCcw } from "lucide-react";

interface AiTerminalProps {
  lessonTitle?: string;
  starterPrompt?: string;
  className?: string;
}

type OSType = "mac" | "windows" | "linux";

function detectOS(): OSType {
  if (typeof navigator === "undefined") return "mac";

  const ua = navigator.userAgent.toLowerCase();
  const platform = (navigator.platform || "").toLowerCase();

  if (platform.includes("mac") || ua.includes("macintosh") || ua.includes("mac os")) {
    return "mac";
  }
  if (platform.includes("win") || ua.includes("windows")) {
    return "windows";
  }
  return "linux";
}

function getUsername(): string {
  // We'll set this from the session, but default to a generic
  return "student";
}

interface TerminalLine {
  type: "prompt" | "output" | "command" | "error" | "info";
  content: string;
}

export function AiTerminal({
  lessonTitle,
  starterPrompt,
  className,
}: AiTerminalProps) {
  const [os, setOs] = useState<OSType>("mac");
  const [expanded, setExpanded] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Detect OS on mount
  useEffect(() => {
    setOs(detectOS());

    // Initial terminal lines
    const initLines: TerminalLine[] = [];

    const detectedOs = detectOS();

    if (detectedOs === "mac") {
      initLines.push(
        { type: "info", content: `Last login: ${new Date().toDateString()} on ttys000` },
      );
    } else if (detectedOs === "windows") {
      initLines.push(
        { type: "info", content: "Windows PowerShell" },
        { type: "info", content: "Copyright (C) Microsoft Corporation. All rights reserved." },
        { type: "info", content: "" },
        { type: "info", content: "Install the latest PowerShell for new features and improvements! https://aka.ms/PSWindows" },
        { type: "info", content: "" },
      );
    } else {
      initLines.push(
        { type: "info", content: `Welcome to BlokSchool Terminal` },
      );
    }

    if (lessonTitle) {
      initLines.push(
        { type: "info", content: "" },
        { type: "output", content: `📚 Lesson: ${lessonTitle}` },
        { type: "output", content: `💡 Type your Claude Code commands below. Try: claude "help me build something"` },
        { type: "info", content: "" },
      );
    }

    if (starterPrompt) {
      initLines.push(
        { type: "command", content: starterPrompt },
        { type: "output", content: "⏳ Claude is thinking..." },
        { type: "output", content: "" },
        { type: "output", content: "✅ I'll help you with that! Here's what I'll do:" },
        { type: "output", content: "   1. Analyze your request" },
        { type: "output", content: "   2. Generate the code" },
        { type: "output", content: "   3. Apply changes to your project" },
        { type: "output", content: "" },
      );
    }

    setLines(initLines);
  }, [lessonTitle, starterPrompt]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input on click anywhere in terminal
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Get prompt string based on OS
  const getPrompt = useCallback(() => {
    switch (os) {
      case "mac":
        return "student@MacBook ~ % ";
      case "windows":
        return "PS C:\\Users\\student> ";
      case "linux":
        return "student@blokschool:~$ ";
      default:
        return "$ ";
    }
  }, [os]);

  // Simulate command execution
  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add command to history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Add command line
    setLines((prev) => [...prev, { type: "command", content: trimmed }]);

    // Simulate responses
    const lower = trimmed.toLowerCase();

    if (lower === "clear" || lower === "cls") {
      setLines([]);
      return;
    }

    if (lower === "help") {
      setLines((prev) => [
        ...prev,
        { type: "info", content: "" },
        { type: "output", content: "BlokSchool AI Command Terminal" },
        { type: "output", content: "──────────────────────────────" },
        { type: "output", content: "" },
        { type: "output", content: "Available commands:" },
        { type: "output", content: '  claude "your prompt"    Ask Claude Code to do something' },
        { type: "output", content: "  help                    Show this help" },
        { type: "output", content: "  clear                   Clear the terminal" },
        { type: "output", content: "  whoami                  Show current user" },
        { type: "output", content: "  pwd                     Show current directory" },
        { type: "output", content: "  ls                      List files" },
        { type: "output", content: "" },
        { type: "info", content: "💡 Tip: Start with claude followed by your prompt in quotes" },
        { type: "info", content: "" },
      ]);
      return;
    }

    if (lower === "whoami") {
      setLines((prev) => [...prev, { type: "output", content: "student" }]);
      return;
    }

    if (lower === "pwd") {
      setLines((prev) => [
        ...prev,
        { type: "output", content: os === "windows" ? "C:\\Users\\student\\projects" : "/Users/student/projects" },
      ]);
      return;
    }

    if (lower === "ls" || lower === "dir") {
      setLines((prev) => [
        ...prev,
        { type: "output", content: "📁 my-ai-project/" },
        { type: "output", content: "📁 blokschool-exercises/" },
        { type: "output", content: "📄 README.md" },
        { type: "output", content: "📄 package.json" },
      ]);
      return;
    }

    if (lower.startsWith("claude ") || lower.startsWith("claude,") || lower.startsWith("claude\"")) {
      // Simulate Claude Code interaction
      const prompt = trimmed.replace(/^claude[\s,"]*/, "").replace(/"$/, "");
      setLines((prev) => [
        ...prev,
        { type: "info", content: "" },
        { type: "output", content: "⏳ Claude is analyzing your request..." },
      ]);

      // Simulate typing delay
      setTimeout(() => {
        setLines((prev) => [
          ...prev,
          { type: "output", content: "" },
          { type: "output", content: `╭─ Claude Code ────────────────────────────╮` },
          { type: "output", content: `│                                          │` },
          { type: "output", content: `│  📝 Understanding: "${prompt.slice(0, 35)}${prompt.length > 35 ? "..." : ""}"` },
          { type: "output", content: `│                                          │` },
          { type: "output", content: `│  ✅ Analyzing project structure...        │` },
          { type: "output", content: `│  ✅ Planning implementation...            │` },
          { type: "output", content: `│  ✅ Generating code...                    │` },
          { type: "output", content: `│                                          │` },
          { type: "output", content: `│  🎉 Done! Changes applied successfully.  │` },
          { type: "output", content: `│                                          │` },
          { type: "output", content: `╰──────────────────────────────────────────╯` },
          { type: "info", content: "" },
          { type: "output", content: "💡 In a real Claude Code session, the AI would now modify your files." },
          { type: "output", content: "   Try this in your actual terminal with: claude" },
          { type: "info", content: "" },
        ]);
      }, 1500);
      return;
    }

    if (lower.startsWith("git ")) {
      setLines((prev) => [
        ...prev,
        { type: "output", content: `Simulated: ${trimmed}` },
        { type: "info", content: "💡 Try running this in your real terminal for actual results." },
      ]);
      return;
    }

    // Unknown command
    setLines((prev) => [
      ...prev,
      {
        type: "error",
        content: os === "windows"
          ? `${trimmed} : The term '${trimmed.split(" ")[0]}' is not recognized. Try 'help' for available commands.`
          : `zsh: command not found: ${trimmed.split(" ")[0]}. Try 'help' for available commands.`,
      },
    ]);
  }, [os]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentInput);
      setCurrentInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setCurrentInput("");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const height = expanded ? "85vh" : "500px";

  return (
    <div
      className={cn(
        "rounded-xl border border-border overflow-hidden transition-all duration-300",
        expanded && "fixed inset-4 z-50 shadow-2xl shadow-black/50",
        className
      )}
      style={{ height }}
    >
      {/* Title bar */}
      {os === "mac" ? (
        // macOS title bar
        <div className="flex items-center justify-between bg-[#2d2d2d] px-4 py-2.5 select-none">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-gray-400 font-medium">
            student — zsh — 80×24
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setLines([]);
              }}
              className="text-gray-500 hover:text-gray-300 transition-colors"
              title="Clear"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-gray-300 transition-colors"
              title={expanded ? "Exit fullscreen" : "Fullscreen"}
            >
              {expanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </button>
          </div>
        </div>
      ) : os === "windows" ? (
        // Windows title bar
        <div className="flex items-center justify-between bg-[#012456] px-3 py-1.5 select-none">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-blue-300">⊞</span>
            <span className="text-xs text-gray-300 font-medium">
              Windows PowerShell
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLines([])}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              {expanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </button>
          </div>
        </div>
      ) : (
        // Linux title bar
        <div className="flex items-center justify-between bg-[#300a24] px-3 py-1.5 select-none">
          <span className="text-xs text-gray-300">Terminal</span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setLines([])} className="text-gray-400 hover:text-gray-200">
              <RotateCcw className="h-3 w-3" />
            </button>
            <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-200">
              {expanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </button>
          </div>
        </div>
      )}

      {/* Terminal body */}
      <div
        ref={scrollRef}
        onClick={focusInput}
        className={cn(
          "flex-1 overflow-y-auto font-mono text-sm leading-relaxed cursor-text p-4",
          os === "mac" && "bg-[#1e1e1e] text-[#d4d4d4]",
          os === "windows" && "bg-[#012456] text-[#cccccc]",
          os === "linux" && "bg-[#300a24] text-[#ffffff]"
        )}
        style={{ height: `calc(${height} - 36px)` }}
      >
        {/* Rendered lines */}
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line.type === "command" ? (
              <span>
                <span className={cn(
                  os === "mac" && "text-[#4ec9b0]",
                  os === "windows" && "text-[#ffff00]",
                  os === "linux" && "text-[#4ec9b0]"
                )}>
                  {getPrompt()}
                </span>
                <span className="text-white">{line.content}</span>
              </span>
            ) : line.type === "error" ? (
              <span className="text-red-400">{line.content}</span>
            ) : line.type === "info" ? (
              <span className="text-gray-500">{line.content}</span>
            ) : (
              <span>{line.content}</span>
            )}
          </div>
        ))}

        {/* Active input line */}
        <div className="flex items-center whitespace-pre">
          <span className={cn(
            os === "mac" && "text-[#4ec9b0]",
            os === "windows" && "text-[#ffff00]",
            os === "linux" && "text-[#4ec9b0]"
          )}>
            {getPrompt()}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white outline-none caret-white font-mono text-sm"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}

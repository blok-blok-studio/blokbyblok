"use client";

import { useState, useCallback } from "react";
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { cn } from "@/lib/utils";
import {
  Terminal,
  Eye,
  Play,
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
} from "lucide-react";

interface JsSandboxProps {
  starterCode?: string;
  language?: "javascript" | "typescript" | "react";
  className?: string;
}

const DARK_THEME = {
  colors: {
    surface1: "#09090f",
    surface2: "#111118",
    surface3: "#1a1a2e",
    clickable: "#9ca3af",
    base: "#f0f0f8",
    disabled: "#4b5563",
    hover: "#e0e0f0",
    accent: "#8b5cf6",
    error: "#ef4444",
    errorSurface: "#3b1212",
  },
  syntax: {
    plain: "#e0e0f0",
    comment: { color: "#6b7280", fontStyle: "italic" as const },
    keyword: "#c084fc",
    tag: "#14b8a6",
    punctuation: "#9ca3af",
    definition: "#67e8f9",
    property: "#a78bfa",
    static: "#f9a8d4",
    string: "#34d399",
  },
  font: {
    body: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
    mono: 'var(--font-geist-mono), "Fira Code", "JetBrains Mono", monospace',
    size: "13px",
    lineHeight: "1.6",
  },
};

function getTemplate(language?: string) {
  switch (language) {
    case "react":
      return "react" as const;
    case "typescript":
      return "vanilla-ts" as const;
    default:
      return "vanilla" as const;
  }
}

function getMainFile(language?: string) {
  switch (language) {
    case "react":
      return "/App.js";
    case "typescript":
      return "/src/index.ts";
    default:
      return "/src/index.js";
  }
}

const DEFAULT_CODE: Record<string, string> = {
  javascript: `// BlokSchool Command Terminal
// Type your AI prompts and commands here

// Example: Tell Claude Code what to build
"claude, create a new Next.js app with a landing page that has a hero section, navbar, and footer"

// Example: Ask Claude to modify code
"claude, add dark mode to this app using Tailwind CSS"

// Example: Debug with AI
"claude, this function is throwing an error on line 42. Can you fix it?"

// Try your own prompt below:

`,
  typescript: `// Welcome to BlokSchool Code Sandbox
// Write your TypeScript code here — hit Run to see output

const greeting: string = "Hello, BlokSchool!";
console.log(greeting);

interface Skill {
  name: string;
  level: number;
}

const skills: Skill[] = [
  { name: "Claude Code", level: 5 },
  { name: "AI Agents", level: 3 },
];

skills.forEach(s => console.log(\`\${s.name}: Level \${s.level}\`));
`,
  react: `// Welcome to BlokSchool Code Sandbox
// Build your React component here

export default function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui", background: "#09090f", color: "#f0f0f8", minHeight: "100vh" }}>
      <h1 style={{ color: "#8b5cf6" }}>Hello, BlokSchool!</h1>
      <p style={{ color: "#9ca3af" }}>Command AI. Build anything.</p>
    </div>
  );
}
`,
};

/** Inner component that has access to Sandpack context */
function SandboxInner({ language }: { language: string }) {
  const { sandpack, dispatch } = useSandpack();
  const [activeTab, setActiveTab] = useState<"console" | "preview">(
    language === "react" ? "preview" : "console"
  );
  const [expanded, setExpanded] = useState(false);
  const [outputVisible, setOutputVisible] = useState(true);

  const handleRun = useCallback(() => {
    // Force re-execution by touching the active file
    // This triggers Sandpack's bundler to re-compile and re-run
    const activeFile = sandpack.activeFile;
    const currentCode = sandpack.files[activeFile]?.code || "";

    // Add/remove a trailing newline to force a "change" that triggers re-bundling
    const hasTrailingNewline = currentCode.endsWith("\n\n");
    const tweakedCode = hasTrailingNewline
      ? currentCode.slice(0, -1)
      : currentCode + "\n";

    sandpack.updateFile(activeFile, tweakedCode);

    // Restore immediately — the bundler already picked up the change
    setTimeout(() => {
      sandpack.updateFile(activeFile, currentCode);
    }, 50);

    // Switch to console tab so user sees output
    if (language !== "react") {
      setOutputVisible(true);
      setActiveTab("console");
    }
  }, [sandpack, language]);

  const handleReset = useCallback(() => {
    sandpack.resetAllFiles();
    // Trigger re-run after reset
    setTimeout(() => {
      const activeFile = sandpack.activeFile;
      const code = sandpack.files[activeFile]?.code || "";
      sandpack.updateFile(activeFile, code + " ");
      setTimeout(() => sandpack.updateFile(activeFile, code), 50);
    }, 100);
  }, [sandpack]);

  const height = expanded ? "85vh" : "500px";

  return (
    <div
      className={cn(
        "flex flex-col bg-[#09090f] transition-all duration-300",
        expanded && "fixed inset-4 z-50 rounded-2xl border border-border shadow-2xl shadow-purple-500/10"
      )}
      style={{ height }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-white/5 bg-[#111118] px-3 py-2">
        <div className="flex items-center gap-2">
          {/* Run button */}
          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-500"
          >
            <Play className="h-3 w-3" fill="currentColor" />
            Run
          </button>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>

          {/* Output tabs */}
          <div className="ml-3 flex items-center gap-1 border-l border-white/10 pl-3">
            <button
              onClick={() => setActiveTab("console")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                activeTab === "console"
                  ? "bg-purple-500/20 text-purple-300"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Terminal className="h-3 w-3" />
              Console
            </button>
            {language === "react" && (
              <button
                onClick={() => setActiveTab("preview")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  activeTab === "preview"
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-gray-500 hover:text-gray-300"
                )}
              >
                <Eye className="h-3 w-3" />
                Preview
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Toggle output panel */}
          <button
            onClick={() => setOutputVisible(!outputVisible)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300"
            title={outputVisible ? "Hide output" : "Show output"}
          >
            {outputVisible ? (
              <PanelRightClose className="h-3.5 w-3.5" />
            ) : (
              <PanelRightOpen className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Expand/collapse */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300"
            title={expanded ? "Exit fullscreen" : "Fullscreen"}
          >
            {expanded ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Editor + Output */}
      <div className="flex flex-1 min-h-0">
        {/* Editor */}
        <div
          className={cn(
            "min-w-0 border-r border-white/5 transition-all duration-200",
            outputVisible ? "flex-1" : "w-full"
          )}
        >
          <SandpackCodeEditor
            showLineNumbers
            showTabs
            closableTabs={false}
            style={{ height: "100%" }}
          />
        </div>

        {/* Hidden preview iframe — REQUIRED for code execution & console output */}
        {language !== "react" && (
          <div style={{ width: 0, height: 0, overflow: "hidden", position: "absolute" }}>
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
            />
          </div>
        )}

        {/* Output panel */}
        {outputVisible && (
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Console */}
            <div
              style={{
                flex: 1,
                display: activeTab === "console" ? "flex" : "none",
                flexDirection: "column",
              }}
            >
              <SandpackConsole
                style={{ flex: 1 }}
                showHeader={false}
                showSyntaxError
                resetOnPreviewRestart
              />
            </div>

            {/* Preview — only for React */}
            {language === "react" && (
              <div
                style={{
                  flex: 1,
                  display: activeTab === "preview" ? "flex" : "none",
                  flexDirection: "column",
                }}
              >
                <SandpackPreview
                  showOpenInCodeSandbox={false}
                  showRefreshButton
                  style={{ flex: 1 }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function JsSandbox({
  starterCode,
  language = "javascript",
  className,
}: JsSandboxProps) {
  const template = getTemplate(language);
  const mainFile = getMainFile(language);
  const code = starterCode || DEFAULT_CODE[language] || DEFAULT_CODE.javascript;

  const files: Record<string, string> = {
    [mainFile]: code,
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border overflow-hidden bg-[#09090f]",
        className
      )}
    >
      <SandpackProvider
        template={template}
        theme={DARK_THEME}
        files={files}
        options={{
          activeFile: mainFile,
          recompileMode: "immediate",
          autorun: true,
          autoReload: true,
        }}
      >
        <SandboxInner language={language} />
      </SandpackProvider>
    </div>
  );
}

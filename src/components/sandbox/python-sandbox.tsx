"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TerminalEmulator } from "./terminal-emulator";


interface PythonSandboxProps {
  starterCode?: string;
  className?: string;
}

const DEFAULT_PYTHON_CODE = `# Welcome to BlokSchool Python Sandbox
# Write your Python code here

print("Hello, BlokSchool!")
`;

export function PythonSandbox({
  starterCode,
  className,
}: PythonSandboxProps) {
  const [code, setCode] = useState(starterCode || DEFAULT_PYTHON_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Loading Python runtime...");
  const pyodideRef = useRef<unknown>(null);
  const initializingRef = useRef(false);

  const initPyodide = useCallback(async () => {
    if (initializingRef.current || pyodideRef.current) return;
    initializingRef.current = true;

    try {
      setLoadingStatus("Downloading Pyodide...");
      // Dynamic import from CDN
      const pyodideUrl = "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.mjs";
      // @ts-ignore -- CDN module has no type declarations
      const { loadPyodide } = await import(/* webpackIgnore: true */ pyodideUrl);
      setLoadingStatus("Initializing Python runtime...");
      const pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/",
      });
      pyodideRef.current = pyodide;
      setPyodideReady(true);
      setLoadingStatus("");
    } catch (err) {
      setLoadingStatus("Failed to load Python runtime");
      setOutput((prev) => [
        ...prev,
        `Error: Failed to initialize Pyodide - ${err}`,
      ]);
      initializingRef.current = false;
    }
  }, []);

  useEffect(() => {
    initPyodide();
  }, [initPyodide]);

  const runCode = useCallback(async () => {
    const pyodide = pyodideRef.current as {
      runPythonAsync: (code: string) => Promise<unknown>;
      setStdout: (opts: { batched: (msg: string) => void }) => void;
      setStderr: (opts: { batched: (msg: string) => void }) => void;
    } | null;

    if (!pyodide) return;
    setIsRunning(true);
    setOutput([]);

    const outputLines: string[] = [];

    try {
      pyodide.setStdout({
        batched: (msg: string) => {
          outputLines.push(msg);
          setOutput([...outputLines]);
        },
      });
      pyodide.setStderr({
        batched: (msg: string) => {
          outputLines.push(`Error: ${msg}`);
          setOutput([...outputLines]);
        },
      });

      await pyodide.runPythonAsync(code);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      outputLines.push(`Error: ${errorMsg}`);
      setOutput([...outputLines]);
    } finally {
      setIsRunning(false);
    }
  }, [code]);

  return (
    <div
      className={cn(
        "h-[500px] rounded-xl border border-border overflow-hidden bg-[#09090f]",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111118] border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Python</span>
          {!pyodideReady && loadingStatus && (
            <span className="text-xs text-muted-foreground animate-pulse">
              {loadingStatus}
            </span>
          )}
          {pyodideReady && (
            <span className="text-xs text-green-400">Ready</span>
          )}
        </div>
        <Button
          size="sm"
          onClick={runCode}
          disabled={!pyodideReady || isRunning}
          className="gap-2"
        >
          {isRunning ? (
            <>
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Running
            </>
          ) : (
            <>
              <svg
                width="12"
                height="14"
                viewBox="0 0 12 14"
                fill="currentColor"
              >
                <path d="M0 0v14l12-7z" />
              </svg>
              Run
            </>
          )}
        </Button>
      </div>

      {/* Editor + Terminal split */}
      <div className="flex h-[calc(500px-41px)]">
        {/* Monaco Editor */}
        <div className="w-1/2 border-r border-border">
          <Editor
            height="100%"
            language="python"
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineHeight: 1.6,
              padding: { top: 12 },
              scrollBeyondLastLine: false,
              fontFamily:
                'var(--font-geist-mono), "Fira Code", "JetBrains Mono", monospace',
              tabSize: 4,
              automaticLayout: true,
              wordWrap: "on",
            }}
          />
        </div>

        {/* Terminal output */}
        <div className="w-1/2">
          <TerminalEmulator output={output} isRunning={isRunning} />
        </div>
      </div>
    </div>
  );
}

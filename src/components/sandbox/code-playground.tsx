"use client";

import { JsSandbox } from "./js-sandbox";
import { PythonSandbox } from "./python-sandbox";
import { AiTerminal } from "./ai-terminal";

interface CodePlaygroundProps {
  language: "javascript" | "typescript" | "python" | "react";
  starterCode?: string;
  testCode?: string;
  lessonId?: string;
  mode?: "terminal" | "sandbox";
  lessonTitle?: string;
}

export function CodePlayground({
  language,
  starterCode,
  testCode,
  lessonId,
  mode,
  lessonTitle,
}: CodePlaygroundProps) {
  // If mode is "terminal", show the AI terminal emulator
  if (mode === "terminal") {
    return (
      <AiTerminal
        lessonTitle={lessonTitle}
        starterPrompt={starterCode}
      />
    );
  }

  // Otherwise show code sandbox
  if (language === "python") {
    return <PythonSandbox starterCode={starterCode} />;
  }

  return <JsSandbox starterCode={starterCode} language={language} />;
}

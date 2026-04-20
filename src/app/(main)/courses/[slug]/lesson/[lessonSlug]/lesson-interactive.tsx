"use client";

import { useState } from "react";
import { AiTutorToggle } from "@/components/tutor/ai-tutor-toggle";
import { AiTutorPanel } from "@/components/tutor/ai-tutor-panel";

interface LessonInteractiveProps {
  lessonId: string;
  lessonTitle: string;
}

export function LessonInteractive({ lessonId, lessonTitle }: LessonInteractiveProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AiTutorToggle onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      <AiTutorPanel
        lessonId={lessonId}
        lessonTitle={lessonTitle}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

"use client";

import { MessageCircle, X } from "lucide-react";

interface AiTutorToggleProps {
  onClick: () => void;
  isOpen: boolean;
}

export function AiTutorToggle({ onClick, isOpen }: AiTutorToggleProps) {
  return (
    <div className="group fixed bottom-6 right-6 z-40">
      {/* Tooltip */}
      {!isOpen && (
        <div className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-[#1a1d27] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          Ask AI Tutor
          <div className="absolute -bottom-1 right-4 h-2 w-2 rotate-45 bg-[#1a1d27]" />
        </div>
      )}

      {/* Button */}
      <button
        onClick={onClick}
        className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
          isOpen
            ? "bg-[#1a1d27] text-gray-300 hover:text-white"
            : "bg-purple-600 text-white hover:bg-purple-500"
        }`}
      >
        {/* Pulse ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 animate-ping rounded-full bg-purple-600 opacity-20" />
        )}

        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

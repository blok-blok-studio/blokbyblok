"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Code,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Bold,
  Italic,
  Link,
  Image,
} from "lucide-react";

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "bash",
  "html",
  "css",
  "json",
  "sql",
  "rust",
  "go",
  "java",
  "ruby",
  "php",
  "yaml",
  "markdown",
  "plaintext",
];

export function ContentEditor({ value, onChange }: ContentEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showLangPicker, setShowLangPicker] = useState(false);

  function insertAtCursor(before: string, after: string = "", placeholder: string = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || placeholder;
    const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newValue);

    // Set cursor position after insert
    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPos = start + before.length + selected.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  }

  function insertCodeBlock(lang: string) {
    insertAtCursor(
      `<pre><code class="language-${lang}">`,
      "</code></pre>\n",
      "// your code here"
    );
    setShowLangPicker(false);
  }

  const tools = [
    {
      icon: Heading2,
      label: "Heading 2",
      action: () => insertAtCursor("<h2>", "</h2>", "Heading"),
    },
    {
      icon: Heading3,
      label: "Heading 3",
      action: () => insertAtCursor("<h3>", "</h3>", "Subheading"),
    },
    {
      icon: Bold,
      label: "Bold",
      action: () => insertAtCursor("<strong>", "</strong>", "bold text"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertAtCursor("<em>", "</em>", "italic text"),
    },
    { type: "divider" as const },
    {
      icon: List,
      label: "Bullet List",
      action: () =>
        insertAtCursor("<ul>\n<li>", "</li>\n</ul>", "List item"),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () =>
        insertAtCursor("<ol>\n<li>", "</li>\n</ol>", "List item"),
    },
    {
      icon: Quote,
      label: "Blockquote",
      action: () => insertAtCursor("<blockquote>", "</blockquote>", "Quote"),
    },
    { type: "divider" as const },
    {
      icon: Code,
      label: "Inline Code",
      action: () => insertAtCursor("<code>", "</code>", "code"),
    },
    {
      icon: Link,
      label: "Link",
      action: () =>
        insertAtCursor('<a href="URL">', "</a>", "link text"),
    },
    {
      icon: Image,
      label: "Image",
      action: () =>
        insertAtCursor('<img src="', '" alt="description" />', "image-url"),
    },
  ];

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-2">
        {tools.map((tool, i) => {
          if ("type" in tool && tool.type === "divider") {
            return (
              <div key={i} className="mx-1 h-6 w-px bg-border" />
            );
          }
          const Tool = tool as { icon: typeof Code; label: string; action: () => void };
          return (
            <button
              key={Tool.label}
              type="button"
              onClick={Tool.action}
              className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              title={Tool.label}
            >
              <Tool.icon className="h-4 w-4" />
            </button>
          );
        })}

        {/* Code Block button with language picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangPicker(!showLangPicker)}
            className="flex items-center gap-1 rounded px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Code Block"
          >
            <Code className="h-4 w-4" />
            Code Block
          </button>
          {showLangPicker && (
            <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-44 overflow-y-auto rounded-lg border border-border bg-card shadow-xl">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => insertCodeBlock(lang)}
                  className="block w-full px-3 py-1.5 text-left text-sm hover:bg-secondary transition-colors"
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[400px] w-full rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm leading-relaxed transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        placeholder="Write your lesson content here using HTML..."
        spellCheck={false}
      />

      {/* Preview toggle hint */}
      <p className="text-xs text-muted-foreground">
        Write content in HTML. Use the toolbar to insert elements, or the Code Block button for syntax-highlighted code.
      </p>
    </div>
  );
}

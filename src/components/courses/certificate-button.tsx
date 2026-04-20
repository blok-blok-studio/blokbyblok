"use client";

import { useState } from "react";
import { Award, Download, Loader2 } from "lucide-react";

interface CertificateButtonProps {
  courseId: string;
  courseTitle: string;
  isComplete: boolean;
}

export function CertificateButton({ courseId, courseTitle, isComplete }: CertificateButtonProps) {
  const [downloading, setDownloading] = useState(false);

  if (!isComplete) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/certificate?courseId=${encodeURIComponent(courseId)}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to generate certificate");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `BlokSchool-Certificate.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Certificate download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 px-4 py-2.5 text-sm font-medium text-amber-400 transition-all hover:from-amber-500/20 hover:to-amber-600/20 disabled:opacity-50"
    >
      {downloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Award className="h-4 w-4" />
      )}
      Download Certificate
    </button>
  );
}

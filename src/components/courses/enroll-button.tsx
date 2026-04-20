"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EnrollButton({ courseSlug }: { courseSlug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleEnroll() {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseSlug}/enroll`, {
        method: "POST",
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleEnroll} size="lg" disabled={loading}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      Enroll in Course — Free
    </Button>
  );
}

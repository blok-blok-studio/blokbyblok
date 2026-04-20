"use client";

import { useState } from "react";
import { Play, Clock, Calendar, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DRMVideoPlayer } from "@/components/protection/drm-video-player";

interface Recording {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnail: string | null;
  duration: number | null;
  category: string;
  publishedAt: string;
  order: number;
  course: { title: string; slug: string } | null;
}

interface Category {
  value: string;
  label: string;
}

interface RecordingsFilterProps {
  recordings: Recording[];
  categories: Category[];
}

const CATEGORY_COLORS: Record<string, string> = {
  "live-session": "bg-purple-500/20 text-purple-300",
  tutorial: "bg-blue-500/20 text-blue-300",
  workshop: "bg-emerald-500/20 text-emerald-300",
  "q-and-a": "bg-amber-500/20 text-amber-300",
};

const GRADIENT_COLORS: Record<string, string> = {
  "live-session": "from-purple-600/40 to-purple-900/60",
  tutorial: "from-blue-600/40 to-blue-900/60",
  workshop: "from-emerald-600/40 to-emerald-900/60",
  "q-and-a": "from-amber-600/40 to-amber-900/60",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCategoryLabel(value: string) {
  const labels: Record<string, string> = {
    "live-session": "Live Session",
    tutorial: "Tutorial",
    workshop: "Workshop",
    "q-and-a": "Q&A",
  };
  return labels[value] || value;
}

export function RecordingsFilter({ recordings, categories }: RecordingsFilterProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    activeCategory === "all"
      ? recordings
      : recordings.filter((r) => r.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={activeCategory === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveCategory(cat.value);
              setExpandedId(null);
            }}
            className="rounded-full"
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Recordings Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
          <Play className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No recordings found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((recording) => {
            const isExpanded = expandedId === recording.id;

            return (
              <div key={recording.id} className={isExpanded ? "md:col-span-2" : ""}>
                <Card className="overflow-hidden transition-all hover:border-primary/50">
                  {/* Thumbnail / Video Player */}
                  {isExpanded ? (
                    <div className="relative">
                      <div className="aspect-video bg-black">
                        {recording.videoUrl.startsWith("/uploads/") ? (
                          <DRMVideoPlayer
                            src={recording.videoUrl}
                            className="h-full w-full"
                          />
                        ) : (
                          <iframe
                            src={recording.videoUrl}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media"
                            allowFullScreen
                          />
                        )}
                      </div>
                      <button
                        onClick={() => setExpandedId(null)}
                        className="absolute right-3 top-3 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setExpandedId(recording.id)}
                      className="relative w-full cursor-pointer group"
                    >
                      {recording.thumbnail ? (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={recording.thumbnail}
                            alt={recording.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div
                          className={`aspect-video bg-gradient-to-br ${
                            GRADIENT_COLORS[recording.category] || "from-primary/40 to-primary/60"
                          }`}
                        />
                      )}
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-lg transition-transform group-hover:scale-110">
                          <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                      {/* Duration badge */}
                      {recording.duration && (
                        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                          {recording.duration} min
                        </span>
                      )}
                    </button>
                  )}

                  {/* Card Info */}
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-snug line-clamp-2">
                        {recording.title}
                      </h3>
                    </div>

                    {recording.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {recording.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          CATEGORY_COLORS[recording.category] || "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {getCategoryLabel(recording.category)}
                      </span>

                      {recording.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {recording.duration} min
                        </span>
                      )}

                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(recording.publishedAt)}
                      </span>

                      {recording.course && (
                        <Badge variant="secondary" className="text-xs">
                          {recording.course.title}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { FolderGit2, Trophy, Users, MessageSquare, ExternalLink, Crown, BookOpen, Clock, Check, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { CommentThread } from "@/components/cohorts/comment-thread";
import Link from "next/link";

interface Project {
  id: string;
  repoUrl: string;
  status: string;
  submittedAt: string;
  commentCount: number;
  authorId: string;
  authorName: string | null;
  authorImage: string | null;
  lessonTitle: string;
  lessonSlug: string;
  moduleName: string;
  courseTitle: string;
  courseSlug: string;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string | null;
  image: string | null;
  totalXp: number;
  weeklyXp: number;
  level: number;
  levelName: string;
  streak: number;
  isCurrentUser: boolean;
  role: string;
}

interface Member {
  userId: string;
  name: string | null;
  image: string | null;
  role: string;
  level: number;
  totalXp: number;
  joinedAt: string;
}

interface CohortCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  moduleCount: number;
  lessonCount: number;
  totalDuration: number;
  enrollmentCount: number;
  isEnrolled: boolean;
}

interface CohortTabsProps {
  projects: Project[];
  leaderboard: LeaderboardEntry[];
  members: Member[];
  courses: CohortCourse[];
  allCourses: { id: string; title: string; slug: string }[];
  assignedCourseIds: string[];
  currentUserId: string;
  cohortId: string;
  isOwner: boolean;
}

const tabs = [
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "projects", label: "Project Board", icon: FolderGit2 },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "members", label: "Members", icon: Users },
] as const;

export function CohortTabs({ projects, leaderboard, members, courses, allCourses, assignedCourseIds, currentUserId, cohortId, isOwner }: CohortTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("courses");
  const [managingCourses, setManagingCourses] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set(assignedCourseIds));
  const [savingCourses, setSavingCourses] = useState(false);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-lg bg-secondary p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Courses */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          {isOwner && !managingCourses && (
            <div className="flex justify-end">
              <button
                onClick={() => setManagingCourses(true)}
                className="text-sm text-primary hover:underline"
              >
                Manage assigned courses
              </button>
            </div>
          )}

          {managingCourses && isOwner ? (
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-sm">Select courses for this cohort</h3>
                <div className="space-y-2">
                  {allCourses.map((c) => (
                    <label key={c.id} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-secondary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCourses.has(c.id)}
                        onChange={(e) => {
                          const next = new Set(selectedCourses);
                          if (e.target.checked) next.add(c.id);
                          else next.delete(c.id);
                          setSelectedCourses(next);
                        }}
                        className="h-4 w-4 rounded accent-primary"
                      />
                      <span className="text-sm">{c.title}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      setSavingCourses(true);
                      await fetch(`/api/cohorts/${cohortId}/courses`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ courseIds: [...selectedCourses] }),
                      });
                      setSavingCourses(false);
                      setManagingCourses(false);
                      window.location.reload();
                    }}
                    disabled={savingCourses}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {savingCourses ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setManagingCourses(false);
                      setSelectedCourses(new Set(assignedCourseIds));
                    }}
                    className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : courses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <BookOpen className="mx-auto mb-3 h-8 w-8" />
                <p>No courses assigned yet.</p>
                {isOwner && (
                  <button
                    onClick={() => setManagingCourses(true)}
                    className="mt-2 text-sm text-primary hover:underline"
                  >
                    Assign courses to this cohort
                  </button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {courses.map((c) => (
                <Card key={c.id} className="group overflow-hidden transition-all hover:border-primary/50">
                  <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">{c.title}</h3>
                      {c.isEnrolled && <Badge variant="accent">Enrolled</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {c.lessonCount} lessons
                      </span>
                      {c.totalDuration > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {c.totalDuration} min
                        </span>
                      )}
                    </div>
                    <Link href={`/courses/${c.slug}`}>
                      <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        {c.isEnrolled ? "Continue Learning" : "View Course"}
                      </button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Project Board */}
      {activeTab === "projects" && (
        <div className="space-y-3">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <FolderGit2 className="mx-auto mb-3 h-8 w-8" />
                <p>No projects submitted yet. Complete a lesson with a project to get started!</p>
              </CardContent>
            </Card>
          ) : (
            projects.map((p) => {
              const isOwn = p.authorId === currentUserId;
              const isExpanded = expandedProject === p.id;
              return (
                <Card key={p.id} className="overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    {/* Project header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar src={p.authorImage} name={p.authorName} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {isOwn ? "You" : p.authorName || "Student"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {p.courseTitle} — {p.lessonTitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={p.status === "approved" ? "accent" : "secondary"}>
                          {p.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Repo link */}
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {p.repoUrl.replace("https://github.com/", "")}
                    </a>

                    {/* Comment toggle */}
                    <button
                      onClick={() => setExpandedProject(isExpanded ? null : p.id)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      {p.commentCount} comment{p.commentCount !== 1 ? "s" : ""}
                      <span className="text-muted-foreground">
                        {isExpanded ? "— hide" : "— show"}
                      </span>
                    </button>

                    {/* Expanded comment thread */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-border">
                        <CommentThread
                          projectId={p.id}
                          currentUserId={currentUserId}
                          isOwnProject={isOwn}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Leaderboard */}
      {activeTab === "leaderboard" && (
        <Card>
          <CardContent className="p-0">
            {leaderboard.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No leaderboard data yet.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.userId}
                    className={`flex items-center gap-4 px-4 py-3 ${
                      entry.isCurrentUser ? "bg-primary/5" : ""
                    }`}
                  >
                    <span className="w-8 text-center text-sm font-bold text-muted-foreground">
                      {entry.rank === 1 ? "🏆" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                    </span>
                    <Avatar src={entry.image} name={entry.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {entry.isCurrentUser ? "You" : entry.name || "Student"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Level {entry.level} — {entry.levelName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold">{entry.totalXp.toLocaleString()} XP</p>
                      {entry.streak > 0 && (
                        <p className="text-xs text-orange-500">{entry.streak}d streak</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Members */}
      {activeTab === "members" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <Card key={m.userId}>
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar src={m.image} name={m.name} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{m.name || "Student"}</p>
                    {m.role === "teacher" && (
                      <Crown className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Level {m.level} — {m.totalXp.toLocaleString()} XP
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

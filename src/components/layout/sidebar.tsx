"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  User,
  Settings,
  Shield,
  GraduationCap,
  Trophy,
  FolderGit2,
  MessageSquareCode,
  PlaySquare,
  UsersRound,
} from "lucide-react";
import { StatsSidebarWidget } from "@/components/gamification/stats-sidebar-widget";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/recordings", label: "Recordings", icon: PlaySquare },
  { href: "/projects", label: "Projects", icon: FolderGit2 },
  { href: "/reviews", label: "Reviews", icon: MessageSquareCode },
  { href: "/cohorts", label: "Cohorts", icon: UsersRound },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/community", label: "Community", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
];

const adminItems = [
  { href: "/admin", label: "Admin Panel", icon: Shield },
];

interface SidebarProps {
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string;
}

export function Sidebar({ userName, userEmail, userRole }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <GraduationCap className="h-7 w-7 text-primary" />
        <span className="text-lg font-bold">
          Blok<span className="text-primary">School</span>
        </span>
      </div>

      {/* User info + Gamification Stats */}
      <div className="border-b border-border px-6 py-4 space-y-3">
        <div>
          <p className="text-sm font-medium truncate">{userName || "Student"}</p>
          <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
        </div>
        <StatsSidebarWidget />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {userRole === "ADMIN" && (
          <>
            <div className="my-4 border-t border-border" />
            <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
              Admin
            </p>
            <ul className="space-y-1">
              {adminItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </nav>

      {/* Settings */}
      <div className="border-t border-border px-3 py-3">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { SearchBar } from "@/components/search/search-bar";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  onMenuToggle?: () => void;
}

export function Navbar({ user, onMenuToggle }: NavbarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-secondary">
            <Menu className="h-5 w-5" />
          </button>
        )}
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-bold">BlokSchool</span>
        </Link>
      </div>

      {/* Search — only show when logged in */}
      {user && (
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <SearchBar />
        </div>
      )}

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Avatar src={user.image} name={user.name} size="sm" />
            <form
              action={async () => {
                const res = await fetch("/api/auth/signout", { method: "POST" });
                if (res.ok) router.push("/login");
              }}
            >
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </form>
          </>
        ) : (
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

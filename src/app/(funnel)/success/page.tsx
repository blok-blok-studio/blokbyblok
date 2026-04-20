"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SuccessPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    // Give the webhook a moment to process
    const timer = setTimeout(() => setStatus("success"), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent" />
      <div className="relative z-10 mx-auto max-w-lg px-4 text-center">
        {status === "loading" ? (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">
              Setting up your account...
            </p>
          </div>
        ) : (
          <Card className="border-accent/30 shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <CheckCircle2 className="h-8 w-8 text-accent" />
              </div>

              <div>
                <h1 className="text-3xl font-bold">Welcome to BlokSchool!</h1>
                <p className="mt-2 text-muted-foreground">
                  Your payment was successful. You now have full access to all
                  courses and content.
                </p>
              </div>

              <div className="rounded-lg bg-secondary p-4 text-left text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>All 5 courses unlocked</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>70+ lessons available now</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>Community access enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>Lifetime access confirmed</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  If you don&apos;t have an account yet, create one with the
                  same email you used for payment.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/register" className="flex-1">
                    <Button className="w-full" size="lg">
                      Create Account
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">
                  A receipt has been sent to your email
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

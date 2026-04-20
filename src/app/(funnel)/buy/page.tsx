"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Terminal,
  GitBranch,
  Cpu,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  BookOpen,
  Headphones,
  Shield,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const aiCommandCourses = [
  {
    icon: Terminal,
    title: "Command AI with Claude Code",
    lessons: 20,
    desc: "Build real projects by commanding AI from your terminal",
  },
  {
    icon: Cpu,
    title: "Build AI Agents with OpenClaw",
    lessons: 13,
    desc: "Create autonomous AI agents that work for you",
  },
  {
    icon: Zap,
    title: "AI-Powered Workflows",
    lessons: 9,
    desc: "Connect AI tools into powerful automated workflows",
  },
];

const underTheHoodCourses = [
  {
    icon: GitBranch,
    title: "Git & GitHub Essentials",
    lessons: 16,
    desc: "The developer workflow that powers every AI tool",
  },
  {
    icon: Sparkles,
    title: "Python for AI Builders",
    lessons: 12,
    desc: "The language behind AI — debug, customize, go deeper",
  },
];

const included = [
  "All 5 courses (70+ lessons) across both packages",
  "3 AI Command courses — build with AI, no coding needed",
  "2 Under the Hood courses — understand the code beneath",
  "Full source code and project files",
  "Lifetime access to all content",
  "Access to all future course updates",
  "Live community of AI builders on TeamSpeak",
  "Progress tracking and completion status",
];

const testimonials = [
  {
    name: "Alex R.",
    role: "AI Builder",
    text: "I stopped trying to learn to code and started commanding AI instead. BlokSchool completely changed how I build things.",
  },
  {
    name: "Sarah K.",
    role: "Creator & Entrepreneur",
    text: "I built a real autonomous agent without writing code from scratch. The AI-first approach makes everything click.",
  },
  {
    name: "Mike T.",
    role: "Indie Hacker",
    text: "From zero to deploying my own AI agent in a weekend. My terminal is now my superpower. This is the future.",
  },
];

const faqs = [
  {
    q: "What if I'm a complete beginner?",
    a: "Perfect — that's who this is for. You don't need to know how to code. We teach you to command AI tools from day one. If you can type, you can build.",
  },
  {
    q: "Do I get lifetime access?",
    a: "Yes! One-time payment means you keep access forever, including all future updates and new courses.",
  },
  {
    q: "Is there a monthly option?",
    a: "Yes! You can choose between a one-time lifetime payment or a monthly subscription.",
  },
  {
    q: "What if I want a refund?",
    a: "We offer a 30-day money-back guarantee. If you're not happy, just reach out and we'll refund you.",
  },
  {
    q: "Can I access the community?",
    a: "Absolutely. All paid members get access to the TeamSpeak community with live sessions and Q&A.",
  },
];

export default function BuyPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"lifetime" | "monthly">(
    "lifetime"
  );

  async function handleCheckout() {
    setLoading(billingCycle);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceType: billingCycle }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold">
              Blok<span className="text-primary">School</span>
            </span>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Already a member? Sign in
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 lg:py-24 text-center">
          <Badge className="mb-6 text-sm" variant="secondary">
            Limited Time Offer
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            You don&apos;t need to learn to code.{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              You need to learn to command AI.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Master Claude Code, AI terminals, and CLI tools with 70+ hands-on
            lessons. Build and deploy real projects — without writing code from
            scratch. Your terminal is your superpower.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-6xl px-4 space-y-12">
          {/* Package 1: AI Command */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">AI Command</h2>
              <Badge variant="secondary" className="ml-2">For Everyone</Badge>
            </div>
            <p className="mb-6 text-muted-foreground">
              Build with AI — no coding required. The main track for anyone who wants to ship real projects.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {aiCommandCourses.map((course) => (
                <Card
                  key={course.title}
                  className="group transition-all hover:border-primary/50"
                >
                  <CardContent className="flex gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <course.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.lessons} lessons &middot; {course.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Package 2: Under the Hood */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-2xl font-bold">Under the Hood</h2>
              <Badge variant="outline" className="ml-2">Bonus</Badge>
            </div>
            <p className="mb-6 text-muted-foreground">
              Understand the code beneath the AI. Optional courses for those who want to go deeper.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {underTheHoodCourses.map((course) => (
                <Card
                  key={course.title}
                  className="group transition-all hover:border-primary/50"
                >
                  <CardContent className="flex gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
                      <course.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.lessons} lessons &middot; {course.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Get */}
      <section className="py-16 bg-card/50">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Everything you get
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {included.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16" id="pricing">
        <div className="mx-auto max-w-lg px-4">
          <h2 className="mb-2 text-center text-3xl font-bold">
            Choose your plan
          </h2>
          <p className="mb-8 text-center text-muted-foreground">
            Get instant access to everything. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="mb-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("lifetime")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                billingCycle === "lifetime"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Lifetime
              <span className="ml-1.5 text-xs opacity-75">Save 70%</span>
            </button>
          </div>

          <Card className="overflow-hidden border-primary/50 shadow-2xl shadow-primary/10">
            <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
            <CardContent className="p-8 text-center">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {billingCycle === "lifetime"
                  ? "Lifetime Access"
                  : "Monthly Access"}
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold">
                  ${billingCycle === "lifetime" ? "197" : "29"}
                </span>
                {billingCycle === "monthly" && (
                  <span className="text-muted-foreground">/month</span>
                )}
              </div>
              {billingCycle === "lifetime" && (
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="line-through">$497</span>{" "}
                  <span className="text-accent font-medium">
                    Save $300 today
                  </span>
                </p>
              )}

              <ul className="mt-6 space-y-3 text-left text-sm">
                {[
                  "All 5 courses (70+ lessons)",
                  "Full source code downloads",
                  billingCycle === "lifetime"
                    ? "Lifetime access — pay once, learn forever"
                    : "Access as long as you're subscribed",
                  "All future course updates included",
                  "Live TeamSpeak community access",
                  "30-day money-back guarantee",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className="mt-8 w-full text-base"
                onClick={handleCheckout}
                disabled={!!loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {billingCycle === "lifetime"
                  ? "Get Lifetime Access — $197"
                  : "Start Monthly — $29/mo"}
              </Button>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  Secure checkout
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Instant access
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-t border-border py-16 bg-card/50">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            What students are saying
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-6">
                  <div className="mb-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q}>
                <CardContent className="p-5">
                  <p className="font-semibold">{faq.q}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold">
            Start commanding AI today
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join BlokSchool and learn to build anything with AI as your tool.
            From zero to deploying real projects — Claude Code is your co-pilot.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              className="text-base"
              onClick={() => {
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                Blok<span className="text-primary">School</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} BlokBlok Studio. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

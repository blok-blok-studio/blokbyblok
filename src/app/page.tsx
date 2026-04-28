import Link from "next/link";
import {
  GraduationCap,
  Terminal,
  GitBranch,
  Cpu,
  Zap,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Code2,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const aiCommandFeatures = [
  {
    icon: Terminal,
    title: "Command AI with Claude Code",
    description:
      "Build real projects by commanding AI from your terminal. No coding experience needed — just learn to speak AI's language and ship anything.",
  },
  {
    icon: Cpu,
    title: "The History of AI",
    description:
      "A one-week class tracing AI from Turing and cybernetics to today's frontier models. Understand where the field came from so you can see where it's going.",
  },
  {
    icon: Zap,
    title: "AI-Powered Workflows",
    description:
      "Connect Claude Code, GitHub, APIs, and automation tools into powerful workflows that do the work for you.",
  },
];

const underTheHoodFeatures = [
  {
    icon: GitBranch,
    title: "Git & GitHub Essentials",
    description:
      "Understand version control, collaboration, and the developer workflow that powers every software project.",
  },
  {
    icon: Code2,
    title: "Python for AI Builders",
    description:
      "Learn Python — the language behind most AI tools. Debug, customize, and go deeper into what's really happening.",
  },
];

const benefits = [
  "Learn to command AI — not memorize syntax",
  "Build and deploy real projects using AI tools",
  "Live community sessions on TeamSpeak",
  "From zero to shipping — without writing code from scratch",
  "Access to all future course updates",
  "Direct access to instructors and mentors",
];

export default function LandingPage() {
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
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-3.5 w-3.5" />
              Now enrolling for all courses
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              You don&apos;t need to learn to code.
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                You need to learn to command AI.
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground lg:text-xl">
              BlokSchool teaches you to build real projects by commanding Claude Code,
              AI terminals, and CLI tools. No syntax memorization. No algorithms.
              Just you, your terminal, and AI as your co-pilot.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="text-base">
                  Start Learning Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/setup">
                <Button variant="outline" size="lg" className="text-base">
                  <Wrench className="h-4 w-4" />
                  Set Up Your Computer
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No account needed —{" "}
              <Link href="/setup" className="text-primary hover:underline">
                preview the Day 0 setup guide
              </Link>{" "}
              before you sign up.
            </p>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="border-t border-border bg-card/50 py-20">
        <div className="mx-auto max-w-6xl px-4 space-y-16">
          {/* Package 1: AI Command */}
          <div>
            <div className="mb-8 text-center">
              <div className="mb-2 inline-flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Package 1</span>
              </div>
              <h2 className="text-3xl font-bold">AI Command</h2>
              <p className="mt-2 text-muted-foreground">
                Build with AI — no coding required. The main track for everyone.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {aiCommandFeatures.map((feature) => (
                <Card
                  key={feature.title}
                  className="group transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardContent className="flex gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Package 2: Under the Hood */}
          <div>
            <div className="mb-8 text-center">
              <div className="mb-2 inline-flex items-center gap-2 text-muted-foreground">
                <Code2 className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Package 2</span>
              </div>
              <h2 className="text-3xl font-bold">Under the Hood</h2>
              <p className="mt-2 text-muted-foreground">
                Understand the code beneath the AI. For those who want to go deeper.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 mx-auto max-w-3xl">
              {underTheHoodFeatures.map((feature) => (
                <Card
                  key={feature.title}
                  className="group transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardContent className="flex gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-muted/80">
                      <feature.icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">
                Everything you need to
                <span className="text-primary"> become an AI operator</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Learn to speak AI&apos;s language. Our platform gives you the skills to
                command AI tools, ship real projects, and build anything with AI as your instrument.
              </p>
              <ul className="mt-8 space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/register">
                  <Button size="lg">
                    Join BlokSchool
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-border bg-card p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                      <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">5</p>
                      <p className="text-sm text-muted-foreground">Expert Courses</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10">
                      <BookOpen className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">70+</p>
                      <p className="text-sm text-muted-foreground">In-Depth Lessons</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">Live</p>
                      <p className="text-sm text-muted-foreground">
                        Community Sessions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to command AI?</h2>
          <p className="mt-4 text-muted-foreground">
            Create your free account and go from zero to deploying real
            projects — without writing code from scratch. Claude Code is your co-pilot.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg" className="text-base">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
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
              &copy; {new Date().getFullYear()} BlokBlok Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

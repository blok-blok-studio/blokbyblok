import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Headphones, MessageCircle, Users, Radio, ExternalLink } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-lg text-muted-foreground">
          Connect with fellow AI builders, share your projects, and get
          real-time help mastering AI tools. This is where AI operators level up together.
        </p>
      </div>

      {/* Teamspeak Card */}
      <Card className="overflow-hidden border-primary/20">
        <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Headphones className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>TeamSpeak Server</CardTitle>
              <CardDescription>Our primary live community hub</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg bg-secondary p-4">
              <Radio className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Live Sessions</p>
                <p className="text-xs text-muted-foreground">Weekly Q&A & workshops</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-secondary p-4">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Build Groups</p>
                <p className="text-xs text-muted-foreground">Ship projects with fellow AI builders</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-secondary p-4">
              <MessageCircle className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Office Hours</p>
                <p className="text-xs text-muted-foreground">Get 1-on-1 help</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold">How to Join</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </span>
                <span>Download TeamSpeak from the official website</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                <span>Click the join button below to connect to our server</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </span>
                <span>
                  Use your BlokSchool display name so we can identify you
                </span>
              </li>
            </ol>

            <div className="flex flex-wrap gap-3 pt-2">
              <a href="ts3server://blokschool.teamspeak.com" target="_blank" rel="noopener noreferrer">
                <Button size="lg">
                  <Headphones className="h-4 w-4" />
                  Join TeamSpeak
                </Button>
              </a>
              <a
                href="https://teamspeak.com/en/downloads/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  <ExternalLink className="h-4 w-4" />
                  Download TeamSpeak
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>Be respectful and supportive of fellow AI builders</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>Share knowledge freely — we all learn better together</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>Keep discussions on topic in designated channels</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>No spam, self-promotion, or harassment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>Have fun and help each other build with AI</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

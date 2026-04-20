"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GitBranch, Star, GitFork, ExternalLink } from "lucide-react";

interface RepoInfo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

export function GitHubRepoCard({ url }: { url: string }) {
  const [repo, setRepo] = useState<RepoInfo | null>(null);
  const [error, setError] = useState(false);

  // Extract owner/repo from GitHub URL
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  const owner = match?.[1];
  const repoName = match?.[2]?.replace(/\.git$/, "");

  useEffect(() => {
    if (!owner || !repoName) {
      setError(true);
      return;
    }

    fetch(`https://api.github.com/repos/${owner}/${repoName}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(setRepo)
      .catch(() => setError(true));
  }, [owner, repoName]);

  if (error || !owner || !repoName) {
    // Fallback: simple link card
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Card className="transition-colors hover:border-primary/50">
          <CardContent className="flex items-center gap-3 p-4">
            <GitBranch className="h-5 w-5 text-primary shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{url}</p>
              <p className="text-sm text-muted-foreground">GitHub Repository</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardContent>
        </Card>
      </a>
    );
  }

  if (!repo) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="h-5 w-5 rounded bg-secondary animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 rounded bg-secondary animate-pulse" />
            <div className="h-3 w-72 rounded bg-secondary animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const langColors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Rust: "#dea584",
    Go: "#00ADD8",
    Java: "#b07219",
    Ruby: "#701516",
    C: "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    PHP: "#4F5D95",
    Shell: "#89e051",
    HTML: "#e34c26",
    CSS: "#563d7c",
  };

  return (
    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
      <Card className="transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <GitBranch className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold truncate">{repo.full_name}</p>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </div>
              {repo.description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {repo.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                {repo.language && (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: langColors[repo.language] || "#8b8b8b",
                      }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" />
                  {repo.stargazers_count.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="h-3.5 w-3.5" />
                  {repo.forks_count.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

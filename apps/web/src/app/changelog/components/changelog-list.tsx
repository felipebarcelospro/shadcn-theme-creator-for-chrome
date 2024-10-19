'use client';

import { Markdown } from "@/app/components/markdown";
import { Release } from "@/lib/github";
import { formatDate } from "@/lib/utils";
import { Badge } from "@repo/ui/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ChangelogListProps {
  releases: Release[];
}

export function ChangelogList({ releases }: ChangelogListProps) {
  const [openReleases, setOpenReleases] = useState<string[]>([]);

  const toggleRelease = (id: string) => {
    setOpenReleases(prev =>
      prev.includes(id) ? prev.filter(releaseId => releaseId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {releases.map((release) => {
        const isOpen = openReleases.includes(release.id.toString());

        return (
          <Card key={release.id} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleRelease(release.id.toString())}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <CardTitle className="text-lg font-bold">{release.name}</CardTitle>
                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                  <Badge variant="secondary">{release.tagName}</Badge>
                  <span className="text-sm text-muted-foreground">{formatDate(release.publishedAt)}</span>
                  {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </div>
            </CardHeader>
            {isOpen && (
              <CardContent>
                <Markdown>{release.body}</Markdown>
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <a
                    href={`https://github.com/felipebarcelospro/shadcn-theme-creator-for-chrome/releases/tag/${release.tagName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View on GitHub
                  </a>
                  <a
                    href={`https://github.com/felipebarcelospro/shadcn-theme-creator-for-chrome/archive/refs/tags/${release.tagName}.zip`}
                    className="text-sm text-primary hover:underline"
                  >
                    Download ZIP
                  </a>
                  <a
                    href={`https://github.com/felipebarcelospro/shadcn-theme-creator-for-chrome/archive/refs/tags/${release.tagName}.tar.gz`}
                    className="text-sm text-primary hover:underline"
                  >
                    Download TAR
                  </a>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

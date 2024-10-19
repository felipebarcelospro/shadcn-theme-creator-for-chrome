import { getContributors, getReleases, getRepoInfo } from "@/lib/github";
import { Button } from "@repo/ui/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import { ChangelogList } from "./components/changelog-list";
import { ContributorRanking } from "./components/contributor-ranking";
import { RepoStats } from "./components/repo-stats";

export const metadata: Metadata = {
  title: "Changelog | Shadcn/UI Theme Creator for Chrome",
  description: "View the latest updates, improvements, and contributor information for the Shadcn/UI Theme Creator Chrome extension.",
};

export default async function ChangelogPage() {
  const releases = await getReleases();
  const contributors = await getContributors();
  const repoInfo = await getRepoInfo();

  return (
    <main className="container mx-auto px-8 py-16 sm:py-12 md:py-16 max-w-5xl">
      <section className="text-left mb-6 sm:mb-8 relative">
        <Link href="/" passHref>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-12 sm:-top-16 left-0 rounded-full bg-secondary hover:bg-secondary/80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight md:max-w-4xl">
          Changelog & Project Info
        </h1>
        <p className="text-lg sm:text-xl mb-8 sm:mb-10 md:mb-12 text-muted-foreground">
          View the latest updates, improvements, and contributor information for the Shadcn/UI Theme Creator Chrome extension.
        </p>
      </section>

      <section className="mb-8 p-4 border border-border rounded-lg bg-secondary/50">
        <div className="grid grid-cols-1">
          <div className="bg-secondary/10 p-6 sm:p-4 rounded-lg">
            <RepoStats repoInfo={repoInfo} />
          </div>
          <div className="bg-secondary/10 p-6 sm:p-4 rounded-lg">
            <ContributorRanking contributors={contributors.slice(0, 5)} />
          </div>
          <div className="bg-secondary/10 p-6 sm:p-4 rounded-lg">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">Release History</h2>
            <ChangelogList releases={releases} />
          </div>
        </div>
      </section>
    </main>
  );
}

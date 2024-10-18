import { config } from "@repo/shared/config";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import Link from "next/link";

async function getLastUpdateDate() {
  try {
    const response = await fetch(`https://api.github.com/repos/${config.githubUrl.split('/').slice(-2).join('/')}/commits?per_page=1`);
    const commits = await response.json();
    if (commits.length > 0) {
      return new Date(commits[0].commit.author.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  } catch (error) {
    console.error('Error fetching last commit:', error);
  }
  return 'N/A';
}

export async function Header() {
  const lastUpdateDate = await getLastUpdateDate();

  return (
    <header className="container mx-auto py-8">
      <nav className="flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <span className='bg-black dark:bg-white w-10 h-10 rounded-md flex items-center justify-center'>
            <img src="https://mediaresource.sfo2.digitaloceanspaces.com/wp-content/uploads/2024/04/20161105/shadcn-ui-logo-EF735EC0E5-seeklogo.com.png" className='w-6 h-6 invert dark:invert-0' alt="ShadCN UI Logo" />
          </span>
          <div>
            <h1 className="text-md font-semibold m-0 text-gray-900 dark:text-zinc-100">{config.projectName}</h1>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <Badge variant="outline">
            Last updated: {lastUpdateDate}
          </Badge>

          <Link href="/about" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>

          <Separator orientation="vertical" className="h-6 !mx-6" />

          <Button variant="outline" size="icon" asChild className="mr-2 shadow-sm">
            <a href={config.twitterUrl} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
              </svg>
              <span className="sr-only">Twitter</span>
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild className="shadow-sm">
            <a href={config.githubUrl} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
        </div>
      </nav>
    </header>
  );
}

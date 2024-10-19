import { config } from "@repo/shared/config";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerTrigger } from "@repo/ui/components/ui/drawer";
import { Separator } from "@repo/ui/components/ui/separator";
import { Menu } from "lucide-react";
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
    <header className="container mx-auto py-4 sm:py-6 md:py-8">
      <nav className="flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <span className='bg-black dark:bg-white w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center'>
            <img src="https://mediaresource.sfo2.digitaloceanspaces.com/wp-content/uploads/2024/04/20161105/shadcn-ui-logo-EF735EC0E5-seeklogo.com.png" className='w-5 h-5 sm:w-6 sm:h-6 invert dark:invert-0' alt="Shadcn/UI UI Logo" />
          </span>
          <div>
            <h1 className="text-sm sm:text-md font-semibold m-0 text-gray-900 dark:text-zinc-100">{config.projectName}</h1>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Badge variant="outline" className="hidden sm:inline-flex">
            Last updated: {lastUpdateDate}
          </Badge>

          <Link href="/about" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>

          <Link href="/changelog" className="text-foreground hover:text-primary transition-colors">
            Changelog
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

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="rounded-t-[20px] flex flex-col">
              <nav className="flex-grow px-4">
                <ul className="space-y-4">
                  <li>
                    <Link href="/about" className="flex items-center p-2 rounded-lg hover:bg-secondary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      <span className="text-lg">About</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/changelog" className="flex items-center p-2 rounded-lg hover:bg-secondary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <span className="text-lg">Changelog</span>
                    </Link>
                  </li>
                  <li>
                    <Link href={config.purchaseUrl} className="flex items-center p-2 rounded-lg hover:bg-secondary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <span className="text-lg">Get Extension</span>
                    </Link>
                  </li>
                  <li>
                    <Link href={config.termsOfUseUrl} className="flex items-center p-2 rounded-lg hover:bg-secondary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <span className="text-lg">Terms of Use</span>
                    </Link>
                  </li>
                  <li>
                    <Link href={config.privacyPolicyUrl} className="flex items-center p-2 rounded-lg hover:bg-secondary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      <span className="text-lg">Privacy Policy</span>
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center p-2 rounded-lg bg-secondary/50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <Badge variant="outline" className="text-sm">
                        Last updated: {lastUpdateDate}
                      </Badge>
                    </div>
                  </li>
                </ul>
              </nav>
              <DrawerFooter className="border-t pt-4 mt-auto">
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="icon" asChild className="rounded-full">
                    <a href={config.twitterUrl} target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                      </svg>
                      <span className="sr-only">Twitter</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild className="rounded-full">
                    <a href={config.githubUrl} target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                      <span className="sr-only">GitHub</span>
                    </a>
                  </Button>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </nav>
    </header>
  );
}

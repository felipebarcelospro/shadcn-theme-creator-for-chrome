import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";
import Link from 'next/link';

export default function About() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-2xl">
      <section className="text-left mb-24 relative">
        <Link href="/" passHref>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-16 left-0 rounded-full bg-secondary hover:bg-secondary/80"
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
        <div className="text-zinc-900">
          <Link href="https://twitter.com/feldbarcelospro" target="_blank">
            <img
              alt="Felipe Barcelos"
              src="https://media.licdn.com/dms/image/v2/D4D03AQHvSr_V9EAOjQ/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1728308774937?e=1734566400&v=beta&t=QAfLIR7Q60F1AEatAqPzGAXUjKTlhGvpFtexpyDki5U"
              width={96}
              height={96}
              className="mb-4 w-24 rounded-full transition-all hover:rotate-6 hover:bg-zinc-100 active:rotate-12 active:scale-90"
            />
          </Link>
          <h1 className="text-4xl">Hi! I'm Felipe</h1>
          <p className="text-lg text-zinc-700 pt-8 text-pretty font-medium tracking-tight">
            I'm a passionate software engineer and entrepreneur from 🇧🇷, dedicated to transforming ideas into scalable, profitable SaaS products. With extensive experience in developing innovative solutions, I've created tools like <a href="https://notifylog.com" target="_blank" rel="noopener noreferrer"><Button className="inline-flex items-center justify-center whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-primary underline-offset-4 bg-zinc-100 hover:bg-zinc-200 transition-all hover:no-underline my-0.5 rounded-full px-3 h-auto py-1 font-semibold tracking-tight">NotifyLog<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg></Button></a> for real-time event management and <a href="https://nextcron.co" target="_blank" rel="noopener noreferrer"><Button className="inline-flex items-center justify-center whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-primary underline-offset-4 bg-zinc-100 hover:bg-zinc-200 transition-all hover:no-underline my-0.5 rounded-full px-3 h-auto py-1 font-semibold tracking-tight">NextCron<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg></Button></a> for simplified task scheduling.
          </p>
          <p className="text-lg text-zinc-700 pt-8 text-pretty font-medium tracking-tight">
            My journey in tech has led me to create the <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer"><Button className="inline-flex items-center justify-center whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-primary underline-offset-4 bg-zinc-100 hover:bg-zinc-200 transition-all hover:no-underline my-0.5 rounded-full px-3 h-auto py-1 font-semibold tracking-tight">ShadCN Theme Creator<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg></Button></a>, a Chrome extension designed to help developers customize ShadCN UI themes effortlessly. This tool is a testament to my belief in creating solutions that enhance productivity and creativity in the dev community.
          </p>
          <p className="text-lg text-zinc-700 pt-8 text-pretty font-medium tracking-tight">
            I've built a thriving Brazilian indie-hacker community with over 10K members. In 2023, our SaaS ventures collectively generated more than $500K in revenue. I've personally helped launch over 30 successful projects, empowering fellow developers to turn their ideas into profitable businesses. My mission is to share knowledge and inspire others to build sustainable, scalable SaaS products that make a real impact in the tech world.
          </p>
          <p className="text-lg text-zinc-700 pt-8 text-pretty font-medium tracking-tight">
            Join me on this journey of innovation and entrepreneurship. Let's connect, collaborate, and create impactful solutions together!
          </p>

          <p className="pt-6 text-sm text-zinc-600">Ps. <a className="text-blue-500 underline" href="https://twitter.com/felipebarcelos">Follow me on Twitter</a> for updates on my projects and insights into SaaS development.</p>
        </div>
      </section>

      <section className="mb-24">
        <h2 className="text-3xl font-bold mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                  <path d="M12 9v4"></path>
                  <path d="M12 17h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Live Preview</h3>
            </div>
            <p className="text-lg text-muted-foreground">See your theme changes in real-time as you customize ShadCN UI components.</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  <path d="M12 3a6 6 0 0 1-9 9 9 9 0 0 0 9-9Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Easy Export</h3>
            </div>
            <p className="text-lg text-muted-foreground">Export your custom theme as a CSS file or JSON configuration with a single click.</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M7 7h10"></path>
                  <path d="M7 12h10"></path>
                  <path d="M7 17h10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Component Library</h3>
            </div>
            <p className="text-lg text-muted-foreground">Access a wide range of ShadCN UI components to customize and preview.</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Privacy-Focused</h3>
            </div>
            <p className="text-lg text-muted-foreground">All customizations happen locally in your browser, ensuring data privacy.</p>
          </Card>
        </div>
      </section>

      <section className="mb-24">
        <h2 className="text-5xl font-bold mb-6 leading-tight">Get ShadCN Theme Creator for Chrome</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Transform your ShadCN UI development workflow. Download our Chrome extension and start creating stunning, custom themes in minutes.
        </p>
        <Button asChild className="inline-flex items-center">
          <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
              <line x1="21.17" y1="8" x2="12" y2="8" />
              <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
              <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
            </svg>
            Install Extension
          </a>
        </Button>
      </section>
    </main>
  );
}

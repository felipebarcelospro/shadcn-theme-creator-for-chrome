import { config } from "@repo/shared/config";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@repo/ui/components/ui/accordion";
import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";

export default function Home() {
  return (    
    <main className="container mx-auto px-4 py-16">
      <section className="text-center mb-24">
        <p className="text-xl mb-6 text-muted-foreground">
          Instantly customize{" "}
          <a
            href="https://ui.shadcn.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mx-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors text-md"
          >
            Shadcn UI
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>{" "}
          themes directly in your browser
        </p>

        <h1 className="text-5xl font-bold mb-8 leading-tight md:max-w-4xl mx-auto">
          {config.projectTagline}
        </h1>

        <p className="text-2xl mb-12 text-muted-foreground max-w-3xl mx-auto">
          {config.projectDescription}
        </p>

        <div className="flex justify-center space-x-6">
          <Button size="lg" asChild className="inline-flex items-center">
            <a href={config.purchaseUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <line x1="21.17" y1="8" x2="12" y2="8" />
                <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
              </svg>
              Add to Chrome - It's Free!
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild className="inline-flex items-center">
            <a href={config.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              View on GitHub
            </a>
          </Button>
        </div>
      </section>

      <section id="features" className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {config.features.map((feature, index) => (
            <Card key={index} className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-lg text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="pt-24 bg-secondary/10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid gap-12">
            {/* Creator Card */}
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6">
                <img
                  src={config.developerImage}
                  alt={`${config.developerName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-3xl font-bold mb-3">{config.developerName}</h3>
              <p className="text-muted-foreground text-base mb-6 max-w-md text-center">
                {config.developerBio}
              </p>
              <div className="flex space-x-4">
                <a
                  href={config.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                  </svg>
                  Twitter
                </a>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div>
              <h3 className="text-md uppercase opacity-60 text-center mb-4">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="w-full">
                {config.faq.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index + 1}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import { config } from "@repo/shared/config";
import { Button } from "@repo/ui/components/ui/button";
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-5xl">
      <section className="text-left mb-8 relative">
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
        <h1 className="text-5xl font-bold mb-8 leading-tight md:max-w-4xl">
          Privacy Policy for {config.projectName}
        </h1>
        <p className="text-xl mb-12 text-muted-foreground">
          We are committed to protecting your privacy and ensuring the security of your data. This policy outlines our practices regarding the {config.projectName} extension.
        </p>
      </section>

      <section className="mb-8 p-4 border border-border rounded-lg bg-secondary/50">
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">1. Information Collection and Use</h2>
            <p className="text-lg text-muted-foreground">
              The {config.projectName} extension is designed with a privacy-first approach. We do not collect, store, or transmit any personal information. All theme customizations are performed locally within your browser, ensuring that your data remains under your control at all times.
            </p>
          </div>

          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">2. Data Storage</h2>
            <p className="text-lg text-muted-foreground">
              Any theme customizations you create are stored locally in your browser using Chrome's storage API. This data is accessible only to you and is not shared with us or any third parties. The security of your customizations is dependent on your local browser security settings.
            </p>
          </div>

          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">3. Third-Party Services</h2>
            <p className="text-lg text-muted-foreground">
              Our extension operates independently and does not integrate with any third-party services. This means that no external entities have access to your data or customizations, further protecting your privacy.
            </p>
          </div>

          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">4. Security Measures</h2>
            <p className="text-lg text-muted-foreground">
              We have implemented reasonable technical and organizational measures to protect the integrity of our extension. However, as the extension operates locally, we recommend keeping your browser and operating system up-to-date to maintain optimal security for your customizations.
            </p>
          </div>

          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">5. Updates to Privacy Policy</h2>
            <p className="text-lg text-muted-foreground">
              We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new privacy policy on this page and updating the "Last updated" date at the top of this policy.
            </p>
          </div>

          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
            <p className="text-lg text-muted-foreground">
              As we do not collect any personal data, there is no need for data access, correction, or deletion requests. You have full control over your theme customizations within the extension.
            </p>
          </div>

          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">7. Compliance with Laws</h2>
            <p className="text-lg text-muted-foreground">
              While we do not collect personal data, we are committed to complying with applicable data protection laws and regulations, including GDPR and CCPA, to the extent they apply to our operations.
            </p>
          </div>

          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p className="text-lg text-muted-foreground">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please don't hesitate to contact us at:
            </p>
            <p className="text-lg font-semibold mt-2">
              Email: {config.developerName}
            </p>
            <p className="text-lg font-semibold">
              GitHub: {config.githubUrl}
            </p>
          </div>
        </div>
      </section>

      <div className="text-center">
        <Button size="lg" asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </main>
  );
}

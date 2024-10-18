import { Button } from "@repo/ui/components/ui/button";
import Link from 'next/link';

export default function TermsOfUse() {
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
          Terms of Use for ShadCN Theme Creator for Chrome
        </h1>
        <p className="text-xl mb-12 text-muted-foreground">
          By using the ShadCN Theme Creator for Chrome extension, you agree to comply with and be bound by the following terms and conditions.
        </p>
      </section>

      <section className="mb-8 p-4 border border-border rounded-lg bg-secondary/50">
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-lg text-muted-foreground">
              By using the ShadCN Theme Creator for Chrome extension ("the Extension"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree to these terms, please refrain from using the Extension.
            </p>
          </div>

          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="text-lg text-muted-foreground">
              Felipe Barcelos grants you a personal, non-exclusive, non-transferable, revocable license to use the Extension for its intended purpose. This license is subject to these Terms of Use and does not include the right to modify, distribute, or create derivative works of the Extension without explicit permission.
            </p>
          </div>

          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property Rights</h2>
            <p className="text-lg text-muted-foreground">
              The Extension, including its code, design, and content, is protected by copyright, trademark, and other laws. The Extension remains the property of Felipe Barcelos. Our trademarks and trade dress may not be used in connection with any product or service without prior written consent.
            </p>
          </div>

          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
            <p className="text-lg text-muted-foreground">
              You may not use the Extension for any illegal or unauthorized purpose. You agree to comply with all local laws regarding online conduct and acceptable content. You are solely responsible for your use of the Extension.
            </p>
          </div>

          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">5. Disclaimer of Warranties</h2>
            <p className="text-lg text-muted-foreground">
              The Extension is provided "as is" without any warranties, expressed or implied. Felipe Barcelos does not warrant that the Extension will be error-free or uninterrupted. You use the Extension at your own risk.
            </p>
          </div>

          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="text-lg text-muted-foreground">
              Felipe Barcelos shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the Extension.
            </p>
          </div>

          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
            <p className="text-lg text-muted-foreground">
              Felipe Barcelos reserves the right to modify these Terms of Use at any time. We will notify users of any material changes by posting the new Terms of Use on this page. Your continued use of the Extension after any such changes constitutes your acceptance of the new Terms of Use.
            </p>
          </div>

          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
            <p className="text-lg text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of Brazil, without regard to its conflict of law provisions.
            </p>
          </div>

          <div className="bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
            <p className="text-lg text-muted-foreground">
              If you have any questions about these Terms of Use, please contact us at:
            </p>
            <p className="text-lg font-semibold mt-2">
              Email: felipe.barcelospro@gmail.com
            </p>
            <p className="text-lg font-semibold">
              GitHub: https://github.com/felipebarcelospro/shadcn-theme-creator-for-chrome
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

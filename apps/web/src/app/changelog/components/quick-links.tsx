import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import Link from "next/link";

export function QuickLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link href="https://github.com/felipebarcelospro/shadcn-theme-creator-for-chrome" className="block text-sm text-primary hover:underline">
          GitHub Repository
        </Link>
        <Link href="https://github.com/felipebarcelospro/shadcn-theme-creator-for-chrome/blob/main/CONTRIBUTING.md" className="block text-sm text-primary hover:underline">
          Contribution Guide
        </Link>
        <Link href="https://github.com/felipebarcelospro/shadcn-theme-creator-for-chrome/issues" className="block text-sm text-primary hover:underline">
          Issue Tracker
        </Link>
      </CardContent>
    </Card>
  );
}

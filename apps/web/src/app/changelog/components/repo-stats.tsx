import { RepoInfo } from "@/lib/github";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { AlertCircle, Clock, GitFork, Star } from "lucide-react";

interface RepoStatsProps {
  repoInfo: RepoInfo;
}

export function RepoStats({ repoInfo }: RepoStatsProps) {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader className="space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">Repository Stats</CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          Key metrics and information about the project repository
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        <StatItem icon={<Star className="w-5 h-5" />} label="Stars" value={repoInfo.stars} />
        <StatItem icon={<GitFork className="w-5 h-5" />} label="Forks" value={repoInfo.forks} />
        <StatItem icon={<AlertCircle className="w-5 h-5" />} label="Open Issues" value={repoInfo.openIssues} />
        <StatItem icon={<Clock className="w-5 h-5" />} label="Last Update" value={formatDate(repoInfo.lastUpdate)} />
      </CardContent>
    </Card>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="flex items-center space-x-2 border p-4 rounded-md">
      <span className="bg-primary/10 text-primary p-2 rounded-md">
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );
}

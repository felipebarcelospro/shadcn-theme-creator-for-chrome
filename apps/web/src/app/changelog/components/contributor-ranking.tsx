'use client'

import { Contributor } from "@/lib/github";
import { config } from "@repo/shared/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { GitCommit, Trophy, Users } from "lucide-react";
import Image from "next/image";

interface ContributorRankingProps {
  contributors: Contributor[];
}

export function ContributorRanking({ contributors }: ContributorRankingProps) {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader className="space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">Top Contributors</CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          Most active project contributors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {contributors.map((contributor, index) => (
          <ContributorItem
            key={contributor.login}
            rank={index + 1}
            contributor={contributor}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function ContributorItem({ rank, contributor }: { rank: number; contributor: Contributor }) {
  const icon = rank === 1 ? <Trophy className="w-5 h-5" /> : <Users className="w-5 h-5" />;

  const handleClick = () => {
    window.open(`${config.githubUrl}/commits?author=${contributor.login}`, '_blank');
  };

  return (
    <div 
      className="flex items-center space-x-2 border p-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer group relative"
      onClick={handleClick}
      title={`View ${contributor.login}'s contributions to this project`}
    >
      <div className="relative bg-primary rounded-full overflow-hidden">
        <Image
          src={contributor.avatarUrl}
          alt={contributor.login}
          width={32}
          height={32}
          className="rounded-full transition-opacity group-hover:opacity-70 "
        />
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors">{contributor.login}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">Rank: {rank}</p>
      </div>
      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
        <GitCommit className="w-4 h-4" />
        <span className="text-sm">{contributor.contributions}</span>
      </div>

      <span className="text-indigo-600">
        {icon}
      </span>
    </div>
  );
}

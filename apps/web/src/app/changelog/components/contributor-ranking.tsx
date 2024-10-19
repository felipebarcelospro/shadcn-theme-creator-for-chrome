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
      className="flex items-center space-x-2 border-b border-gray-200 pb-4 cursor-pointer group relative"
      onClick={handleClick}
      title={`View ${contributor.login}'s contributions to this project`}
    >
      <div className="relative">
        <Image
          src={contributor.avatarUrl}
          alt={contributor.login}
          width={32}
          height={32}
          className="rounded-full transition-opacity group-hover:opacity-70"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </div>
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

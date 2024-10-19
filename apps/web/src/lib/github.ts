import { Octokit } from "@octokit/rest";
import { config } from "@repo/shared/config";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * Represents information about a GitHub repository.
 */
export interface RepoInfo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  lastUpdate: string;
}

/**
 * Represents a contributor to a GitHub repository.
 */
export interface Contributor {
  login: string;
  avatarUrl: string;
  contributions: number;
}

/**
 * Represents a release of a GitHub repository.
 */
export interface Release {
  id: number;
  name: string;
  body: string;
  publishedAt: string;
  tagName: string;
}

/**
 * Fetches information about the specified GitHub repository.
 * @returns {Promise<RepoInfo>} A promise that resolves to the repository information.
 */
export async function getRepoInfo(): Promise<RepoInfo> {
  const { data } = await octokit.repos.get({
    owner: "felipebarcelospro",
    repo: "shadcn-theme-creator-for-chrome",
  });

  return {
    name: data.name,
    description: data.description || "",
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    lastUpdate: data.updated_at,
  };
}

/**
 * Fetches the list of contributors for the specified GitHub repository.
 * @returns {Promise<Contributor[]>} A promise that resolves to an array of contributors.
 */
export async function getContributors(): Promise<Contributor[]> {
  const { data } = await octokit.repos.listContributors({
    owner: "felipebarcelospro",
    repo: "shadcn-theme-creator-for-chrome",
  });

  const contributors = data.map((contributor) => ({
    login: contributor.login,
    avatarUrl: contributor.avatar_url,
    contributions: contributor.contributions,
  }));

  // Add the creator as the first contributor
  const { developerName, developerImage } = config;
  const creator: Contributor = {
    login: developerName,
    avatarUrl: developerImage,
    contributions: -1, // Use -1 to indicate creator status
  };

  // Fetch updated data for the creator
  try {
    const { data: creatorData } = await octokit.users.getByUsername({ username: developerName });
    creator.avatarUrl = creatorData.avatar_url;
  } catch (error) {
    console.error(`Failed to fetch updated data for creator: ${error}`);
  }

  return [creator, ...contributors];
}

/**
 * Fetches the list of releases for the specified GitHub repository.
 * @returns {Promise<Release[]>} A promise that resolves to an array of releases.
 */
export async function getReleases(): Promise<Release[]> {
  const { data } = await octokit.repos.listReleases({
    owner: "felipebarcelospro",
    repo: "shadcn-theme-creator-for-chrome",
  });

  return data.map((release) => ({
    id: release.id,
    name: release.name || release.tag_name,
    body: release.body || "",
    publishedAt: release.published_at,
    tagName: release.tag_name,
  }));
}

/**
 * Fetches the README content of the specified GitHub repository.
 * @returns {Promise<string>} A promise that resolves to the README content as a string.
 */
export async function getReadme(): Promise<string> {
  const { data } = await octokit.repos.getReadme({
    owner: "felipebarcelospro",
    repo: "shadcn-theme-creator-for-chrome",
  });

  return Buffer.from(data.content, 'base64').toString('utf-8');
}

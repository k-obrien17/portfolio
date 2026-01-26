const GITHUB_USERNAME = "keithobrien";
const GITHUB_API = "https://api.github.com";

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  url?: string;
  github: string;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string;
  readme?: string;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const response = await fetch(
      `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch GitHub repos:", response.statusText);
      return [];
    }

    const repos: GitHubRepo[] = await response.json();

    // Filter out forks, archived, and private repos
    const filteredRepos = repos.filter(
      (repo) => !repo.fork && !repo.archived && !repo.private
    );

    return filteredRepos.map((repo) => ({
      slug: repo.name,
      title: formatRepoName(repo.name),
      description: repo.description || "No description available",
      tags: repo.topics.length > 0 ? repo.topics : repo.language ? [repo.language] : [],
      url: repo.homepage || undefined,
      github: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updatedAt: repo.updated_at,
    }));
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    // Fetch repo details
    const repoResponse = await fetch(
      `${GITHUB_API}/repos/${GITHUB_USERNAME}/${slug}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!repoResponse.ok) {
      return null;
    }

    const repo: GitHubRepo = await repoResponse.json();

    // Fetch README
    let readme = "";
    try {
      const readmeResponse = await fetch(
        `${GITHUB_API}/repos/${GITHUB_USERNAME}/${slug}/readme`,
        {
          headers: {
            Accept: "application/vnd.github.v3.raw",
          },
          next: { revalidate: 3600 },
        }
      );
      if (readmeResponse.ok) {
        readme = await readmeResponse.text();
      }
    } catch {
      // README not found, that's okay
    }

    return {
      slug: repo.name,
      title: formatRepoName(repo.name),
      description: repo.description || "No description available",
      tags: repo.topics.length > 0 ? repo.topics : repo.language ? [repo.language] : [],
      url: repo.homepage || undefined,
      github: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updatedAt: repo.updated_at,
      readme,
    };
  } catch (error) {
    console.error("Error fetching GitHub repo:", error);
    return null;
  }
}

// Convert kebab-case or snake_case repo names to Title Case
function formatRepoName(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

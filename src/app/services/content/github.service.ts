import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { ProjectEntry, ProjectsContent } from 'src/app/models/content/site-content.model';
import { environment } from 'src/environments/environment';

/** The subset of GitHub's repository resource this site reads. */
interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[] | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
}

/** How long a repository list stays fresh in session storage. */
const CACHE_TTL_MS = 30 * 60 * 1000;
const CACHE_KEY_PREFIX = 'gh.repos.v1.';

interface CachedRepos {
  fetchedAt: number;
  repos: GitHubRepo[];
}

/**
 * Turns a GitHub account's public repositories into project cards.
 *
 * The projects section used to render three invented entries — "Payments API", "Docs Portal",
 * "Events Pipeline" — that shared a single screenshot and pointed at `https://github.com` rather
 * than at any repository. Real repositories are both true and self-maintaining.
 *
 * **Rate limiting matters here.** Unauthenticated GitHub allows 60 requests per hour *per visitor
 * IP*, and this runs in the browser on a public page. So the response is cached in session storage
 * for {@link CACHE_TTL_MS} and shared within the page, and a failure — including a 403 for an
 * exhausted quota — resolves to an empty list. The section then falls back to whatever curated
 * projects the admin has published, rather than showing an error.
 *
 * No credentials are involved: this reads public data through the public API, so there is no token
 * to leak into a browser bundle.
 */
@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly cache = new Map<string, Observable<GitHubRepo[]>>();

  constructor(private http: HttpClient) {}

  /**
   * Repositories for `username`, mapped and filtered per `config`.
   *
   * @returns project entries, newest first with pinned names hoisted to the top. Never errors.
   */
  projects(username: string, config: ProjectsContent['github']): Observable<ProjectEntry[]> {
    if (!config.enabled || !username) return of([]);

    return this.repos(username).pipe(
      map((repos) => this.toProjects(repos, config)),
      catchError(() => of([])),
    );
  }

  private repos(username: string): Observable<GitHubRepo[]> {
    const existing = this.cache.get(username);
    if (existing) return existing;

    const cached = this.readCache(username);
    if (cached) {
      const replayed = of(cached).pipe(shareReplay({ bufferSize: 1, refCount: false }));
      this.cache.set(username, replayed);
      return replayed;
    }

    // No custom headers: any would trigger a CORS preflight that api.github.com answers less
    // predictably than the plain GET.
    const url =
      `${environment.github.apiBase}/users/${encodeURIComponent(username)}` +
      `/repos?sort=pushed&direction=desc&per_page=100&type=owner`;

    const request$ = this.http.get<GitHubRepo[]>(url).pipe(
      map((repos) => (Array.isArray(repos) ? repos : [])),
      tap((repos) => this.writeCache(username, repos)),
      catchError(() => of<GitHubRepo[]>([])),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.cache.set(username, request$);
    return request$;
  }

  private toProjects(repos: GitHubRepo[], config: ProjectsContent['github']): ProjectEntry[] {
    const excluded = new Set(config.excluded.map((name) => name.toLowerCase()));
    const pinned = config.pinned.map((name) => name.toLowerCase());

    const eligible = repos.filter((repo) => {
      if (excluded.has(repo.name.toLowerCase())) return false;
      if (config.excludeForks && repo.fork) return false;
      if (config.excludeArchived && repo.archived) return false;
      return true;
    });

    // Pinned names first, in the order the admin listed them; everything else stays in pushed order.
    const rank = (repo: GitHubRepo): number => {
      const index = pinned.indexOf(repo.name.toLowerCase());
      return index === -1 ? Number.MAX_SAFE_INTEGER : index;
    };

    return [...eligible]
      .sort((a, b) => rank(a) - rank(b))
      .slice(0, Math.max(0, config.maxRepos))
      .map((repo) => this.toProject(repo, pinned.includes(repo.name.toLowerCase())));
  }

  private toProject(repo: GitHubRepo, isPinned: boolean): ProjectEntry {
    const topics = Array.isArray(repo.topics) ? repo.topics.slice(0, 6) : [];
    const tags = topics.length > 0 ? topics : repo.language ? [repo.language] : [];

    return {
      id: `github:${repo.id}`,
      title: this.humanise(repo.name),
      summary: repo.description?.trim() || 'No description provided on GitHub.',
      tags,
      link: repo.html_url,
      demoUrl: repo.homepage?.trim() ? repo.homepage.trim() : undefined,
      featured: isPinned,
      source: 'github',
      stars: repo.stargazers_count,
      language: repo.language ?? undefined,
      updatedAt: repo.pushed_at,
    };
  }

  /** `Omkr.WebApp.Portfolio` / `my-cool-repo` → `Omkr WebApp Portfolio` / `My Cool Repo`. */
  private humanise(name: string): string {
    return name
      .replace(/[-_.]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map((word) => (word.length > 1 ? word[0].toUpperCase() + word.slice(1) : word.toUpperCase()))
      .join(' ');
  }

  private readCache(username: string): GitHubRepo[] | null {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY_PREFIX + username);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as CachedRepos;
      if (!parsed?.fetchedAt || !Array.isArray(parsed.repos)) return null;
      if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
      return parsed.repos;
    } catch {
      return null;
    }
  }

  private writeCache(username: string, repos: GitHubRepo[]): void {
    if (repos.length === 0) return;
    try {
      const payload: CachedRepos = { fetchedAt: Date.now(), repos };
      sessionStorage.setItem(CACHE_KEY_PREFIX + username, JSON.stringify(payload));
    } catch {
      /* Quota or privacy mode — the in-memory replay still covers this page view. */
    }
  }
}

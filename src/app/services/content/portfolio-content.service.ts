import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import {
  DEFAULT_ABOUT_PARAGRAPHS,
  DEFAULT_EXPERIENCE,
  DEFAULT_NAV,
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
} from 'src/app/models/content/site-content.defaults';
import {
  ExperienceItem,
  NavLink,
  ProjectEntry,
  ProjectsContent,
  SkillCategory,
} from 'src/app/models/content/site-content.model';
import { GithubService } from './github.service';
import { ProfileService } from './profile.service';
import { SiteContentService } from './site-content.service';
import { StructuredContentService } from './structured-content.service';

const isRecord = StructuredContentService.isRecord;
const isText = StructuredContentService.isText;
const toStringArray = StructuredContentService.toStringArray;

/**
 * Every content-driven section of the site, as typed streams.
 *
 * Components inject this and render what it emits. None of them holds content of their own any
 * more, which is the point: the skills grid, the experience timeline, the navigation labels and the
 * project cards were all hardcoded TypeScript arrays before, so changing a job title meant a code
 * change and a deploy.
 *
 * Text lives in the translate store (per-locale, edited once per language); site data lives in the
 * website-content store (edited once). Everything falls back to a compiled-in default, so the site
 * is never blank and never shows a raw translation key.
 */
@Injectable({ providedIn: 'root' })
export class PortfolioContentService {
  /** About paragraphs. Already published; read here with validation rather than through the pipe. */
  readonly aboutParagraphs$: Observable<string[]>;

  readonly skills$: Observable<SkillCategory[]>;
  readonly experience$: Observable<ExperienceItem[]>;
  readonly nav$: Observable<NavLink[]>;

  /** Curated project cards, before GitHub repositories are merged in. */
  readonly curatedProjects$: Observable<ProjectEntry[]>;

  /** Curated projects followed by live GitHub repositories, de-duplicated. */
  readonly projects$: Observable<ProjectEntry[]>;

  constructor(
    private structured: StructuredContentService,
    private content: SiteContentService,
    private profile: ProfileService,
    private github: GithubService,
  ) {
    this.aboutParagraphs$ = this.structured.textList(
      'AboutMe.Paragraphs',
      DEFAULT_ABOUT_PARAGRAPHS,
    );

    this.skills$ = this.structured
      .mapList('Skills.Categories', DEFAULT_SKILLS, (raw) => this.toSkillCategory(raw))
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));

    this.experience$ = this.structured
      .mapList('Experience.Jobs', DEFAULT_EXPERIENCE, (raw) => this.toExperienceItem(raw))
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));

    this.nav$ = this.structured
      .mapList('Navigation.Items', DEFAULT_NAV, (raw) => this.toNavLink(raw))
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));

    this.curatedProjects$ = this.structured
      .mapList('Projects.Items', DEFAULT_PROJECTS.featured, (raw) => this.toProjectEntry(raw))
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));

    this.projects$ = this.buildProjects().pipe(
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }

  /** GitHub listing settings. Not translated, so it comes from the website-content store. */
  private get githubConfig$(): Observable<ProjectsContent['github']> {
    return this.content
      .get<Partial<ProjectsContent['github']>>('projects-config', DEFAULT_PROJECTS.github)
      .pipe(map((raw) => this.toGithubConfig(raw)));
  }

  /**
   * Curated entries first, then GitHub repositories that are not already represented.
   *
   * A repository the admin has also written a curated card for would otherwise appear twice, so
   * matching links are dropped from the GitHub half.
   */
  private buildProjects(): Observable<ProjectEntry[]> {
    return combineLatest([this.curatedProjects$, this.githubConfig$, this.profile.profile$]).pipe(
      switchMap(([curated, config, profile]) => {
        const username = config.username?.trim() || profile.githubUsername;
        const repos$ = config.enabled ? this.github.projects(username, config) : of<ProjectEntry[]>([]);

        return repos$.pipe(
          map((repos) => {
            const seen = new Set(
              curated
                .map((entry) => entry.link?.toLowerCase().replace(/\/+$/, ''))
                .filter((link): link is string => !!link),
            );
            const fresh = repos.filter(
              (repo) => !seen.has(repo.link?.toLowerCase().replace(/\/+$/, '') ?? ''),
            );
            return [...curated, ...fresh];
          }),
        );
      }),
    );
  }

  // ------------------------------- normalisers -------------------------------
  // Each returns null for an entry that cannot be rendered, so one bad row in the admin costs that
  // row rather than the whole section.

  private toSkillCategory(raw: Record<string, unknown>): SkillCategory | null {
    const label = raw['label'] ?? raw['Label'];
    if (!isText(label)) return null;

    const skills = toStringArray(raw['skills'] ?? raw['Skills']);
    if (skills.length === 0) return null;

    const icon = raw['icon'] ?? raw['Icon'];
    return {
      label: label.trim(),
      // Material Symbols renders an unknown ligature as text, so an unset icon gets a safe default.
      icon: isText(icon) ? icon.trim() : 'code',
      skills,
    };
  }

  private toExperienceItem(raw: Record<string, unknown>): ExperienceItem | null {
    const title = raw['Title'] ?? raw['title'];
    const companyRaw = raw['Company'] ?? raw['company'];
    if (!isText(title)) return null;

    // `Company` is an object in the published payload, but tolerate a bare string too.
    let name = '';
    let companyLink: string | undefined;
    let githubLink: string | undefined;

    if (isText(companyRaw)) {
      name = companyRaw.trim();
    } else if (isRecord(companyRaw)) {
      const rawName = companyRaw['Name'] ?? companyRaw['name'];
      if (isText(rawName)) name = rawName.trim();
      const link = companyRaw['CompanyLink'];
      if (isText(link)) companyLink = link.trim();
      const gh = companyRaw['GithubLink'];
      if (isText(gh)) githubLink = gh.trim();
    }
    if (!name) return null;

    const description = toStringArray(raw['Description'] ?? raw['description']);
    const summary = raw['summary'];
    // Older payloads carried a single summary paragraph rather than bullet points.
    const bullets = description.length > 0 ? description : isText(summary) ? [summary.trim()] : [];

    const date = raw['Date'] ?? raw['period'];
    const tab = raw['Tab'];

    return {
      Tab: isText(tab) ? tab.trim() : name,
      Company: { Name: name, CompanyLink: companyLink, GithubLink: githubLink },
      Title: title.trim(),
      Date: isText(date) ? date.trim() : '',
      Description: bullets,
      Stack: toStringArray(raw['Stack'] ?? raw['stack']),
    };
  }

  private toNavLink(raw: Record<string, unknown>): NavLink | null {
    if (raw['enabled'] === false) return null;

    const label = raw['label'] ?? raw['Label'];
    const target = raw['target'] ?? raw['Target'];
    if (!isText(label) || !isText(target)) return null;

    const rawType = raw['type'] ?? raw['Type'];
    const type: NavLink['type'] =
      rawType === 'route' || rawType === 'external' ? rawType : 'section';

    const id = raw['id'];
    return {
      id: isText(id) ? id.trim() : target.trim(),
      label: label.trim(),
      type,
      target: target.trim(),
    };
  }

  private toProjectEntry(raw: Record<string, unknown>): ProjectEntry | null {
    const title = raw['title'] ?? raw['Title'];
    if (!isText(title)) return null;

    const summary = raw['summary'] ?? raw['Summary'];
    const link = raw['link'] ?? raw['Link'];
    const demo = raw['demoUrl'] ?? raw['DemoUrl'];
    const image = raw['image'] ?? raw['Image'];
    const id = raw['id'];

    return {
      id: isText(id) ? id.trim() : `admin:${title.trim().toLowerCase().replace(/\s+/g, '-')}`,
      title: title.trim(),
      summary: isText(summary) ? summary.trim() : '',
      tags: toStringArray(raw['tags'] ?? raw['Tags']),
      link: isText(link) ? link.trim() : undefined,
      demoUrl: isText(demo) ? demo.trim() : undefined,
      image: isText(image) ? image.trim() : undefined,
      featured: raw['featured'] === true,
      source: 'admin',
    };
  }

  private toGithubConfig(raw: unknown): ProjectsContent['github'] {
    const base = DEFAULT_PROJECTS.github;
    if (!isRecord(raw)) return base;

    const num = (value: unknown, fallback: number): number =>
      typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback;
    const bool = (value: unknown, fallback: boolean): boolean =>
      typeof value === 'boolean' ? value : fallback;

    const username = raw['username'];
    return {
      enabled: bool(raw['enabled'], base.enabled),
      username: isText(username) ? username.trim() : undefined,
      maxRepos: num(raw['maxRepos'], base.maxRepos),
      excludeForks: bool(raw['excludeForks'], base.excludeForks),
      excludeArchived: bool(raw['excludeArchived'], base.excludeArchived),
      pinned: toStringArray(raw['pinned']),
      excluded: toStringArray(raw['excluded']),
    };
  }
}

/**
 * Shapes for the admin-managed content this site renders.
 *
 * Three different mechanisms feed this site, and which one a piece of content belongs to depends on
 * what kind of thing it is:
 *
 * | Kind                                   | Mechanism                    | Where it is edited            |
 * |----------------------------------------|------------------------------|-------------------------------|
 * | Per-locale text (about, skills, jobs)   | ngx-translate store, fed by  | admin → Website content, one  |
 * |                                         | {@link ApiTranslateLoader}   | row per language              |
 * | Site data that is not translated        | {@link SiteContentService}   | admin → Website content       |
 * | (URLs, handles, phone numbers)          |                              |                               |
 * | Cross-app config and feature flags      | {@link RuntimeConfigService} | admin → Configuration         |
 *
 * Every one of these has a compiled-in fallback in `site-content.defaults.ts`, so the site renders
 * correctly before the API answers and stays up if it never does. The fallback is a starting point
 * and a safety net — never a second source of truth.
 *
 * The JSON payloads that seed these keys are in `docs/content-keys.md`.
 */

/** Icon names this site is willing to render. See {@link IconRegistryService}. */
export type SocialIconName =
  | 'github'
  | 'linkedin'
  | 'youtube'
  | 'stackoverflow'
  | 'twitter'
  | 'instagram'
  | 'facebook'
  | 'email'
  | 'link';

/** One entry in the header actions, hero row and footer row. */
export interface SocialLink {
  /** Stable id, also used as the analytics label. */
  id: string;
  /** Accessible name. Not translated: these are proper nouns. */
  label: string;
  url: string;
  /**
   * Which icon to draw. Anything not in {@link SocialIconName} falls back to a generic link glyph
   * rather than throwing — content comes from a database and must never be able to break rendering.
   */
  icon: SocialIconName;
  /** Defaults to true. Lets an admin retire a link without deleting its history. */
  enabled?: boolean;
  /** Where it appears. Both default to true. */
  showInHero?: boolean;
  showInFooter?: boolean;
}

/**
 * Who the site is about. Deliberately *not* in the translation store: a phone number and a GitHub
 * handle are the same in every language, and putting them there would mean re-entering them per
 * locale.
 */
export interface SiteProfile {
  name: string;
  /** Rotated by the hero's typing animation. */
  roles: string[];
  avatarUrl: string;
  logoUrl: string;
  email: string;
  /** E.164, including the country code — this is what `tel:` needs. */
  phone: string;
  /**
   * Digits only, country code included, no `+`. This is what `wa.me` needs; it silently fails on a
   * number without a country code, which is exactly how the old hardcoded link was broken.
   */
  whatsapp: string;
  location: string;
  /** The GitHub account the live projects list and the avatar are read from. */
  githubUsername: string;
  socials: SocialLink[];
  /** File name offered when the visitor downloads the generated CV. */
  resumeFileName: string;
}

/** One item in the primary navigation. */
export interface NavLink {
  /** Matches the `id` of the section it scrolls to, when `type` is `section`. */
  id: string;
  label: string;
  /**
   * `section` scrolls to an element on the home page (navigating home first if needed);
   * `route` is an in-app router link; `external` opens in a new tab.
   */
  type: 'section' | 'route' | 'external';
  /** Element id, route path, or absolute URL depending on `type`. */
  target: string;
  enabled?: boolean;
}

/** A group of technologies in the Tech Stack section. */
export interface SkillCategory {
  label: string;
  /** Material Symbols ligature name. */
  icon: string;
  skills: string[];
}

/** The employer on an {@link ExperienceItem}. */
export interface ExperienceCompany {
  Name: string;
  CompanyLink?: string;
  GithubLink?: string;
}

/**
 * One job in the experience timeline.
 *
 * Field names are PascalCase because this mirrors the payload already published under the
 * `experience` content key, rather than a shape invented here. That payload is richer than the
 * timeline used to render — it carries a company link and per-role bullet points, where the
 * hardcoded array it replaces had only a single summary paragraph.
 */
export interface ExperienceItem {
  /** Short label for the company, used where space is tight. */
  Tab: string;
  Company: ExperienceCompany;
  /** Job title. */
  Title: string;
  /** Human-written date range, e.g. `January 2021 - July 2023`. */
  Date: string;
  /** Bullet points describing the role. */
  Description: string[];
  /** Technology badges. Optional: the originally seeded payload predates this field. */
  Stack?: string[];
}

/** A project card. Either hand-written in the admin, or derived from a GitHub repository. */
export interface ProjectEntry {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  /** Repository or live-site URL. Omitted entries simply render without the link buttons. */
  link?: string;
  /** Second link, shown as "Live" when present. */
  demoUrl?: string;
  image?: string;
  /** Sorts to the front and gets a "Featured" ribbon. */
  featured?: boolean;
  /** Set on entries built from the GitHub API, so the UI can label their source. */
  source?: 'admin' | 'github';
  /** GitHub only. */
  stars?: number;
  language?: string;
  updatedAt?: string;
}

/** How the projects section assembles its list. */
export interface ProjectsContent {
  /** Curated entries. Always shown, always before the GitHub ones. */
  featured: ProjectEntry[];
  github: {
    /** When false the section shows only `featured`, and GitHub is never called. */
    enabled: boolean;
    /** Falls back to {@link SiteProfile.githubUsername}. */
    username?: string;
    maxRepos: number;
    excludeForks: boolean;
    excludeArchived: boolean;
    /** Repo names to always include and pin to the front, in this order. */
    pinned: string[];
    /** Repo names to never show. */
    excluded: string[];
  };
}

/** A post summary rendered in the "From the blog" section. */
export interface BlogPostSummary {
  title: string;
  url: string;
  excerpt?: string;
  publishedAt?: string;
  tags?: string[];
  image?: string;
}

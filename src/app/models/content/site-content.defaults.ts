import { environment } from 'src/environments/environment';
import {
  ExperienceItem,
  NavLink,
  ProjectsContent,
  SiteProfile,
  SkillCategory,
} from './site-content.model';

/**
 * Compiled-in fallbacks for every admin-managed content key.
 *
 * These exist so the site renders correctly in three situations: before the API has answered on
 * first paint, when the API is unreachable, and when a key has not been seeded yet. They are a
 * safety net, not a source of truth — once a key exists in the admin, the admin wins.
 *
 * Keeping them here rather than inside each component is what makes the components themselves
 * content-free: a component reads from the service and never carries a hardcoded string.
 *
 * **Division of labour with `assets/i18n/en.json`.** That file is the other half of the offline
 * base, and the two used to overlap and disagree: `en.json` carried an `Experience.Jobs` with three
 * jobs — missing both of the two most recent — while `ExperienceComponent` carried a hardcoded array
 * of four, and whichever loaded won. The rule now is simple and worth keeping:
 *
 * - `en.json` holds **scalars** — headings, button labels — where being a plain translatable string
 *   is the whole point.
 * - This file holds **structured content** — lists and objects — where a type is worth having.
 *
 * So each piece of offline content lives in exactly one place.
 */

/**
 * Identity used to be spread across three different accounts: the header avatar pointed at
 * `keshavsingh4522` on the retired `avatars3.` host, the profile links at `keshavsingh3197`, and the
 * hero at a bare numeric-id avatar URL. They are unified here on the handle that
 * `environment.github.username` already declared.
 */
export const DEFAULT_PROFILE: SiteProfile = {
  name: 'Keshav Singh',
  roles: [
    'Backend Developer',
    '.NET & Cloud Engineer',
    'Microservices Architect',
    'API Craftsman',
  ],
  avatarUrl: environment.githubAvatarUrl,
  logoUrl: 'assets/images/k.png',
  email: 'keshavsingh4522@gmail.com',
  phone: '+919982761929',
  // Country code included. The old hardcoded link was `wa.me/9982761929`, which omitted the 91 and
  // therefore resolved to no account at all.
  whatsapp: '919982761929',
  location: 'India',
  githubUsername: environment.github.username,
  resumeFileName: 'Keshav_Singh_CV.pdf',
  socials: [
    {
      id: 'github',
      label: 'GitHub',
      url: `https://github.com/${environment.github.username}`,
      icon: 'github',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/keshavsingh3197/',
      icon: 'linkedin',
    },
    {
      id: 'stackoverflow',
      label: 'Stack Overflow',
      url: 'https://stackoverflow.com/users/11732730/keshav-singh',
      icon: 'stackoverflow',
      showInHero: false,
    },
    {
      id: 'youtube',
      label: 'YouTube',
      url: 'https://www.youtube.com/channel/UCVP_DbP7xIOc_LFQTqaLbyg',
      icon: 'youtube',
      showInHero: false,
    },
    {
      id: 'email',
      label: 'Email',
      url: 'mailto:keshavsingh4522@gmail.com',
      icon: 'email',
    },
  ],
};

/**
 * The default primary navigation. `section` entries scroll to an element on the home page; the
 * header navigates home first when the visitor is on another route, which is what the old
 * `href="#about"` markup failed to do.
 */
export const DEFAULT_NAV: NavLink[] = [
  { id: 'home', label: 'Home', type: 'section', target: 'homeHeader' },
  { id: 'about', label: 'About', type: 'section', target: 'about' },
  { id: 'skills', label: 'Skills', type: 'section', target: 'skills' },
  { id: 'experience', label: 'Experience', type: 'section', target: 'experience' },
  { id: 'projects', label: 'Projects', type: 'section', target: 'projects' },
  { id: 'blog', label: 'Blog', type: 'section', target: 'blog' },
  { id: 'contact', label: 'Contact', type: 'section', target: 'contact' },
  { id: 'resume', label: 'Resume', type: 'route', target: '/resume' },
];

/**
 * About copy, moved out of `en.json` so it is not duplicated. Rendered with `innerHTML`, so inline
 * markup is allowed.
 */
export const DEFAULT_ABOUT_PARAGRAPHS: string[] = [
  'A diligent backend developer with a strong foundation in .NET Core, ASP.NET Core Web API, and a suite of AWS services. My experience spans creating high-performance microservices, enhancing API response times, and contributing to agile, cross-functional teams. I\'m passionate about continuous learning, embracing everyday challenges, and leveraging my skills for meaningful project contributions. Mentorship from industry experts has honed my problem-solving abilities and shaped my approach to innovative software development.',
];

/** The chip row under the about copy. */
export const DEFAULT_KEY_SKILLS: string[] = [
  '.NET Core',
  'AWS',
  'Azure',
  'Azure DevOps',
  'Microservices',
  'Swagger',
  'Jira',
  'TDD',
  'CI/CD',
  'gRPC',
];

export const DEFAULT_SKILLS: SkillCategory[] = [
  {
    label: 'Backend',
    icon: 'memory',
    skills: [
      'C#',
      '.NET Core',
      'ASP.NET Web API',
      'Node.js',
      'NestJS',
      'gRPC',
      'Entity Framework',
      'LINQ',
      'MassTransit',
      'SignalR',
    ],
  },
  {
    label: 'Cloud & DevOps',
    icon: 'cloud',
    skills: [
      'Azure',
      'AWS',
      'Docker',
      'Kubernetes',
      'CI/CD',
      'Azure DevOps',
      'JFrog',
      'SonarQube',
      'Datadog',
      'SQS',
      'Lambda',
    ],
  },
  {
    label: 'Databases',
    icon: 'storage',
    skills: ['SQL Server', 'PostgreSQL', 'Redis', 'MongoDB', 'Azure Cosmos DB', 'AWS RDS'],
  },
  {
    label: 'Frontend',
    icon: 'web',
    skills: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Bootstrap', 'Angular Material', 'Blazor'],
  },
  {
    label: 'Architecture & Practices',
    icon: 'hub',
    skills: [
      'Microservices',
      'Event-Driven',
      'REST APIs',
      'OAuth2 / OpenID',
      'TDD',
      'DDD',
      'Agile / Scrum',
      'Clean Architecture',
    ],
  },
];

/**
 * The timeline's offline base, in the same shape as the published `experience` content key.
 *
 * Converted from the array that used to be hardcoded in `ExperienceComponent`. The single `summary`
 * paragraph each job carried there is split into bullet points here, which is what the published
 * payload uses and what the timeline now renders.
 */
export const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  {
    Tab: 'Publicis Sapient',
    Company: {
      Name: 'Publicis Sapient',
      CompanyLink: 'https://www.publicissapient.com/',
    },
    Title: 'Senior Associate Technology L1',
    Date: 'July 2025 — Present',
    Description: [
      'Built the UPS Prism landing page in Angular from Figma designs.',
      'Delivered .NET Core services with OpenAPI contracts and SonarQube quality gates.',
      'Shipped through Azure DevOps pipelines with JFrog artifact management.',
    ],
    Stack: ['.NET Core', 'Angular', 'Azure DevOps', 'JFrog', 'SonarQube', 'TypeScript'],
  },
  {
    Tab: 'R Systems',
    Company: {
      Name: 'R Systems',
      CompanyLink: 'https://www.rsystems.com/',
    },
    Title: 'Senior Software Engineer',
    Date: 'Feb 2024 — July 2025',
    Description: [
      'Integrated OAuth2 and Azure AD B2C authentication across multiple applications.',
      'Delivered push notifications over SignalR and migrated services to gRPC microservices.',
      'Deployed to Kubernetes with ARM templates and wired up Datadog observability.',
      'Built event-driven flows on AWS and supported the team across Angular, Blazor and .NET Core.',
    ],
    Stack: [
      '.NET Core',
      'Angular',
      'Blazor',
      'Azure',
      'Kubernetes',
      'AWS',
      'gRPC',
      'Datadog',
      'SignalR',
    ],
  },
  {
    Tab: 'Marlabs',
    Company: {
      Name: 'Marlabs',
      CompanyLink: 'https://www.marlabs.com/',
    },
    Title: 'Backend Developer',
    Date: 'July 2023 — Oct 2023',
    Description: [
      'Developed and optimised APIs built on Entity Framework.',
      'Integrated AWS KMS encryption and decryption at the model binder level.',
    ],
    Stack: ['.NET Core', 'Entity Framework', 'AWS KMS', 'SQL'],
  },
  {
    Tab: 'Unthinkable',
    Company: {
      Name: 'Unthinkable Solutions LLP',
      CompanyLink: 'https://www.unthinkable.co/',
    },
    Title: 'Backend .NET Developer',
    Date: 'Jan 2021 — July 2023',
    Description: [
      'Implemented gRPC microservices in .NET Core, improving API response times by 40%.',
      'Used AWS SQS, Lambda and API Gateway to build scalable, event-driven solutions.',
      'Created reusable NuGet packages and prepared root-cause analysis reports.',
      'Practised test-driven development with NUnit and Moq inside an agile team.',
      'Mentored junior developers on .NET Core and AWS services.',
    ],
    Stack: [
      '.NET Core',
      'gRPC',
      'AWS',
      'SQS',
      'MassTransit',
      'NUnit',
      'Moq',
      'API Gateway',
      'Lambda',
    ],
  },
];

/**
 * No curated projects by default. The three that used to be hardcoded here — "Payments API",
 * "Docs Portal", "Events Pipeline" — were placeholders sharing one screenshot, two of them linking
 * to `https://github.com` rather than to any repository. Showing real GitHub repositories is a
 * better default than showing invented ones; add genuine highlights through the admin.
 */
export const DEFAULT_PROJECTS: ProjectsContent = {
  featured: [],
  github: {
    enabled: true,
    maxRepos: 9,
    excludeForks: true,
    excludeArchived: true,
    pinned: [],
    excluded: [],
  },
};

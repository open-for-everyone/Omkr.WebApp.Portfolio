# Admin-managed content

Everything a visitor reads on this site is editable without a deploy. This document lists what is
editable, where it is edited, and the exact JSON to paste in.

Nothing here requires a code change or an admin code change — the admin's **Website content** screen
already accepts arbitrary `siteKey` / `contentKey` pairs with a JSON payload.

---

## The three mechanisms

Which one a piece of content belongs to depends on what kind of thing it is.

| Kind | Lives in | Edited at | Per-language? |
|---|---|---|---|
| Structured text — lists and objects (about paragraphs, jobs, skill groups, nav labels) | `website_content` | admin → **Website content** | Yes, one row per language |
| Site data that is never translated (URLs, handles, phone numbers) | `website_content` | admin → **Website content** | No, one row |
| Single strings (section titles, button labels) | i18n bundle | admin → **Localization** | Yes |
| Cross-app config and feature flags | `config` | admin → **Configuration** | No |

Structured blocks reach the app through `ApiTranslateLoader`, which merges them into the
ngx-translate store under a prefix. Site data is read directly by `SiteContentService`.

**Every key below is optional.** Each has a compiled-in default in
`src/app/models/content/site-content.defaults.ts`, so the site renders correctly before anything is
seeded, and keeps rendering if the API goes down. Publishing a key overrides the default; deleting it
restores the default.

---

## Website content keys

All use **site key `portfolio`**. Set *Published* to true or the public endpoint will not serve them.

> One key, `resume`, was originally seeded under the site key `omkr-portfolio`. `SiteContentService`
> falls back to that older key, so nothing broke — but re-saving it under `portfolio` and deleting
> the old row lets `LEGACY_SITE_KEY` be removed from the code.

### `profile` — identity, contact details, social links

Not translated. Any field you omit keeps its built-in default, so a payload of just
`{"phone": "+91..."}` is valid.

```json
{
  "name": "Keshav Singh",
  "roles": [
    "Backend Developer",
    ".NET & Cloud Engineer",
    "Microservices Architect",
    "API Craftsman"
  ],
  "avatarUrl": "https://avatars.githubusercontent.com/u/43788985?v=4",
  "logoUrl": "assets/images/k.png",
  "email": "keshavsingh4522@gmail.com",
  "phone": "+919982761929",
  "whatsapp": "919982761929",
  "location": "India",
  "githubUsername": "keshavsingh3197",
  "resumeFileName": "Keshav_Singh_CV.pdf",
  "socials": [
    { "id": "github", "label": "GitHub", "url": "https://github.com/keshavsingh3197", "icon": "github" },
    { "id": "linkedin", "label": "LinkedIn", "url": "https://www.linkedin.com/in/keshavsingh3197/", "icon": "linkedin" },
    { "id": "stackoverflow", "label": "Stack Overflow", "url": "https://stackoverflow.com/users/11732730/keshav-singh", "icon": "stackoverflow", "showInHero": false },
    { "id": "youtube", "label": "YouTube", "url": "https://www.youtube.com/channel/UCVP_DbP7xIOc_LFQTqaLbyg", "icon": "youtube", "showInHero": false },
    { "id": "email", "label": "Email", "url": "mailto:keshavsingh4522@gmail.com", "icon": "email" }
  ]
}
```

Field notes, because two of these have bitten before:

- **`whatsapp` must include the country code and no `+`.** `wa.me` silently resolves to no account
  otherwise — the old hardcoded link was `wa.me/9982761929`, missing the `91`. Non-digits are
  stripped, so `+91 99827-61929` also works; anything under 8 digits is rejected as a typo.
- **`phone` is the opposite** — E.164 *with* the `+`, because that is what `tel:` expects.
- `icon` must be one of `github`, `linkedin`, `youtube`, `stackoverflow`, `twitter`, `instagram`,
  `facebook`, `email`, `link`. Anything else renders the generic link glyph rather than breaking.
- `url` must be `http:`, `https:`, `mailto:` or `tel:`. Other schemes are dropped.
- `enabled: false` retires a link without deleting it. `showInHero` / `showInFooter` control placement
  and both default to true.

### `projects-config` — how the GitHub list is built

Not translated.

```json
{
  "enabled": true,
  "username": "keshavsingh3197",
  "maxRepos": 9,
  "excludeForks": true,
  "excludeArchived": true,
  "pinned": ["Omkr.WebApp.Portfolio", "content-blog"],
  "excluded": ["keshavsingh3197"]
}
```

- `pinned` names sort to the front, in the order listed, and get a "Featured" ribbon.
- `username` is optional; it falls back to `profile.githubUsername`.
- Set `enabled: false` to show only curated projects and never call GitHub.

GitHub's unauthenticated API allows **60 requests per hour per visitor IP**. Responses are cached in
session storage for 30 minutes, and a rate-limited response falls back to the curated list rather
than showing an error.

### `about` — About section (translated: one row per language)

Reaches templates as `AboutMe.*`.

```json
{
  "Paragraphs": [
    "A diligent backend developer with a strong foundation in .NET Core, cloud platforms and distributed systems.",
    "I care about APIs that are boring to operate: clear contracts, useful errors, and observability that answers questions at 3am."
  ],
  "KeySkills": [
    ".NET Core", "AWS", "Azure", "Azure DevOps",
    "Microservices", "Swagger", "Jira", "TDD", "CI/CD", "gRPC"
  ]
}
```

Paragraphs are rendered with `innerHTML`, so inline markup such as `<strong>` works. That also means
the payload is trusted content — Angular sanitises it, but only publish text you wrote.

### `skills` — Tech Stack (translated)

Reaches templates as `Skills.Categories`.

```json
{
  "Categories": [
    { "label": "Backend", "icon": "memory", "skills": ["C#", ".NET Core", "gRPC", "SignalR"] },
    { "label": "Cloud & DevOps", "icon": "cloud", "skills": ["Azure", "AWS", "Docker", "Kubernetes"] },
    { "label": "Databases", "icon": "storage", "skills": ["SQL Server", "PostgreSQL", "MongoDB"] },
    { "label": "Frontend", "icon": "web", "skills": ["Angular", "TypeScript", "Bootstrap"] },
    { "label": "Architecture", "icon": "hub", "skills": ["Microservices", "Event-Driven", "DDD"] }
  ]
}
```

`icon` is a [Material Icons](https://fonts.google.com/icons) ligature name — the site loads the
classic `Material+Icons` font, so names from Material *Symbols* will not render. An omitted icon
falls back to `code`. A category with no skills is dropped.

### `experience` — timeline (translated)

Reaches templates as `Experience.Jobs`. **This key was already published and already being fetched
before this work — the component just ignored it and rendered a hardcoded array instead.** It now
renders the payload, bullet points and company link included.

```json
{
  "Jobs": [
    {
      "Tab": "Publicis Sapient",
      "Company": {
        "Name": "Publicis Sapient",
        "CompanyLink": "https://www.publicissapient.com/"
      },
      "Title": "Senior Associate Technology L1",
      "Date": "July 2025 — Present",
      "Description": [
        "Built the UPS Prism landing page in Angular from Figma designs.",
        "Delivered .NET Core services with OpenAPI contracts and SonarQube quality gates."
      ],
      "Stack": [".NET Core", "Angular", "Azure DevOps", "JFrog"]
    }
  ]
}
```

`Stack` is new and optional — payloads written before it existed keep working. `Company` may also be
a plain string if there is no link. An older single-`summary` field is still accepted and becomes a
one-item bullet list.

### `projects` — curated project cards (translated)

Reaches templates as `Projects.Items`. These render **before** the GitHub repositories, and a curated
entry whose `link` matches a repository suppresses that repository, so nothing appears twice.

```json
{
  "Items": [
    {
      "id": "portfolio",
      "title": "Portfolio & CMS",
      "summary": "Angular front end whose entire content model is served from the admin API.",
      "tags": ["Angular", "TypeScript", ".NET"],
      "link": "https://github.com/open-for-everyone/Omkr.WebApp.Portfolio",
      "demoUrl": "https://keshavsingh.in",
      "featured": true
    }
  ]
}
```

`image` is optional — entries without one get a generated cover rather than a broken image.

### `navigation` — primary nav (translated)

Reaches templates as `Navigation.Items`. Drives both the header and the footer's "Explore" column.

```json
{
  "Items": [
    { "id": "home", "label": "Home", "type": "section", "target": "homeHeader" },
    { "id": "about", "label": "About", "type": "section", "target": "about" },
    { "id": "skills", "label": "Skills", "type": "section", "target": "skills" },
    { "id": "experience", "label": "Experience", "type": "section", "target": "experience" },
    { "id": "projects", "label": "Projects", "type": "section", "target": "projects" },
    { "id": "blog", "label": "Blog", "type": "section", "target": "blog" },
    { "id": "contact", "label": "Contact", "type": "section", "target": "contact" },
    { "id": "resume", "label": "Resume", "type": "route", "target": "/resume" }
  ]
}
```

- `type: "section"` — `target` is the `id` of an element on the home page. The link goes to `/` with
  that fragment, so it works from any route; the router scrolls.
- `type: "route"` — `target` is an in-app path.
- `type: "external"` — `target` is an absolute URL, opened in a new tab.
- `enabled: false` hides an entry.

A `section` target must match an `id` in `home.component.html`. Point one at an element that does not
exist and the link navigates home and scrolls nowhere.

### `resume` — the `/resume` page and the generated PDF

Shape is `ResumeData` in `src/app/models/resume/resume.model.ts`. The offline copy in
`src/assets/data/resume.json` is the reference payload; the same data drives both the page and the
downloadable PDF.

---

## Single strings — admin → Localization

Scalars live in the i18n bundle, namespace **`portfolio`**, not in website content.

| Key | Renders as |
|---|---|
| `Banner.Pretitle` | Line above the name in the hero |
| `Banner.Description` | Hero paragraph (accepts inline HTML) |
| `Banner.ActionBtn` | Hero primary button |
| `Header.cvBtn` | Hero secondary button, and the Resume label |
| `AboutMe.Title` | About heading |
| `Skills.Title` | Tech Stack heading |
| `Experience.Title` | Experience heading |
| `Projects.Title` | Projects heading |
| `Blog.Title` | Blog section heading |
| `Contact.Pretitle`, `Contact.Title`, `Contact.Content`, `Contact.Btn` | Contact section |
| `Legal.*.Title` | Legal page headings |

Adding a language is entirely an admin task — see `admin/docs/LOCALIZATION.md`. Open tabs pick up a
change on their next poll.

---

## Configuration — admin → Configuration

The site reads these existing keys; it does not define any new ones, so the shared
`@keshavsingh3197/web-config` package needs no change.

| Key | Used for |
|---|---|
| `ui.brand.name` | Accessible name of the header brand link |
| `url.blog` | Blog links in the header, footer and blog section |
| `url.identity` | Admin link in the header and footer |
| `i18n.showlanguagepicker` | Whether the language picker appears |

---

## Seeding checklist

1. Sign in to the admin as Editor or Admin.
2. **Website content** → New. Site key `portfolio`, content key from the table above.
3. Pick the language. Translated keys need one row per language; untranslated keys need one row.
4. Paste the JSON, tick **Published**, save.
5. Reload the portfolio. If a section still shows built-in text, it either did not save as published
   or the payload failed validation — check the browser console and the shape against this document.

A malformed payload never breaks the page: each entry is validated, invalid entries are dropped, and
a block that is entirely invalid falls back to the built-in default.

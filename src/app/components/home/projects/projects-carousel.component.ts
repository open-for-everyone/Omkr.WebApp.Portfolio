import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ProjectEntry } from 'src/app/models/content/site-content.model';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';
import { PortfolioContentService } from 'src/app/services/content/portfolio-content.service';
import { StructuredContentService } from 'src/app/services/content/structured-content.service';

/**
 * The projects grid.
 *
 * What used to be here: three invented entries — "Payments API", "Docs Portal", "Events Pipeline" —
 * that shared one screenshot, two of which linked to `https://github.com` rather than to any
 * repository, and one of which had no link at all.
 *
 * What is here now: repositories read live from GitHub, merged behind whatever projects an admin has
 * curated. Both halves are configurable, and if GitHub is unreachable or rate-limited the section
 * quietly shows just the curated ones.
 */
@Component({
  standalone: false,
  selector: 'app-projects-carousel',
  templateUrl: './projects-carousel.component.html',
  styleUrls: ['./projects-carousel.component.css'],
})
export class ProjectsCarouselComponent implements OnInit, OnDestroy {
  title = 'Highlighted Projects';
  projects: ProjectEntry[] = [];
  loading = true;

  query = '';
  selectedTag: string | null = null;

  /**
   * Filter results and the tag list are recomputed when something changes, not read from a getter.
   *
   * A getter would run several times per change-detection pass and allocate a new array each time;
   * with `*ngFor` bound to it, only `trackBy` was keeping that from re-creating the DOM.
   */
  filtered: ProjectEntry[] = [];
  tags: string[] = [];

  /** Fixed array: an inline `[1,2,3]` in the template is a new identity on every check. */
  readonly skeletons = [0, 1, 2];

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private content: PortfolioContentService,
    private structured: StructuredContentService,
    public analyticsService: AnalyticService,
  ) {}

  ngOnInit(): void {
    this.content.projects$.pipe(takeUntil(this.destroyed$)).subscribe((projects) => {
      this.projects = projects;
      this.loading = false;
      this.tags = this.collectTags(projects);
      this.applyFilter();
    });

    this.structured
      .text('Projects.Title', 'Highlighted Projects')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((title) => (this.title = title));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /** Recomputes the visible list. Called when the data, the query or the tag changes. */
  applyFilter(): void {
    const q = this.query.toLowerCase().trim();
    this.filtered = this.projects.filter((project) => {
      if (this.selectedTag && !project.tags.includes(this.selectedTag)) return false;
      if (!q) return true;
      return (
        project.title.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        project.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }

  selectTag(tag: string | null): void {
    this.selectedTag = tag;
    this.applyFilter();
  }

  private collectTags(projects: ProjectEntry[]): string[] {
    const set = new Set<string>();
    for (const project of projects) {
      for (const tag of project.tags) set.add(tag);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }

  /** True when there is content but the current filter excludes all of it. */
  get isFilteredEmpty(): boolean {
    return !this.loading && this.projects.length > 0 && this.filtered.length === 0;
  }

  /** True when there is genuinely nothing to show — no curated entries and no repositories. */
  get isEmpty(): boolean {
    return !this.loading && this.projects.length === 0;
  }

  trackProject(_index: number, project: ProjectEntry): string {
    return project.id;
  }

  clearFilters(): void {
    this.query = '';
    this.selectedTag = null;
    this.applyFilter();
  }

  openDetails(project: ProjectEntry): void {
    this.analyticsService.sendAnalyticEvent('open_project', 'projects', project.title);
    this.dialog.open(ProjectDialogComponent, {
      data: project,
      panelClass: 'project-dialog',
      autoFocus: 'dialog',
      ariaLabel: project.title,
    });
  }
}

/**
 * Project details in a dialog.
 *
 * The styles here were dark-only — a literal `#e6eef8` heading on a translucent white chip — so in
 * light theme the title rendered near-white on white. Everything is a token now, which is also why
 * this renders correctly in high contrast.
 */
@Component({
  standalone: false,
  selector: 'app-project-dialog',
  template: `
    <div class="dialog">
      <img *ngIf="data.image" [src]="data.image" [alt]="data.title" loading="lazy" width="800" height="450" />

      <h3>{{ data.title }}</h3>

      <p class="meta" *ngIf="data.source === 'github'">
        <span *ngIf="data.language">{{ data.language }}</span>
        <span *ngIf="data.stars !== undefined">★ {{ data.stars }}</span>
        <span *ngIf="data.updatedAt">Updated {{ data.updatedAt | date: 'mediumDate' }}</span>
      </p>

      <p>{{ data.summary }}</p>

      <ul class="chips" *ngIf="data.tags.length">
        <li class="chip" *ngFor="let t of data.tags">{{ t }}</li>
      </ul>

      <div class="actions">
        <a class="btn-modern" *ngIf="data.link" [href]="data.link" target="_blank" rel="noopener noreferrer">
          View code
        </a>
        <a
          class="btn-modern secondary"
          *ngIf="data.demoUrl"
          [href]="data.demoUrl"
          target="_blank"
          rel="noopener noreferrer">
          Live site
        </a>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog {
        max-width: 680px;
        padding: var(--space-4);
        color: var(--text-soft);
      }
      img {
        width: 100%;
        border-radius: var(--radius-md);
        margin-bottom: var(--space-3);
      }
      h3 {
        color: var(--text-strong);
        margin: var(--space-1) 0;
      }
      p {
        margin: 0 0 var(--space-2);
      }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3);
        font-size: 0.8rem;
        color: var(--muted);
        font-family: var(--font-mono);
      }
      .chips {
        display: flex;
        gap: 0.4rem;
        flex-wrap: wrap;
        margin: var(--space-3) 0 0;
        padding: 0;
        list-style: none;
      }
      .chip {
        background: var(--glass-strong);
        border: 1px solid var(--border);
        padding: 0.25rem 0.6rem;
        border-radius: var(--radius-pill);
        font-size: 0.8rem;
      }
      .actions {
        margin-top: var(--space-4);
        display: flex;
        gap: var(--space-2);
        flex-wrap: wrap;
      }
      .btn-modern.secondary {
        background: transparent;
        border: 1px solid var(--accent);
        color: var(--accent);
      }
    `,
  ],
})
export class ProjectDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ProjectEntry) {}
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DEFAULT_EXPERIENCE } from 'src/app/models/content/site-content.defaults';
import { ExperienceItem } from 'src/app/models/content/site-content.model';
import { PortfolioContentService } from 'src/app/services/content/portfolio-content.service';
import { StructuredContentService } from 'src/app/services/content/structured-content.service';

/**
 * The experience timeline.
 *
 * This section had a dead data path worth describing, because it is the clearest example of what
 * "make it dynamic" was actually about here. {@link ApiTranslateLoader} already fetched the
 * `experience` content block from the admin, per locale, and merged it into the translate store
 * under `Experience.*`. The seeded payload was richer than the UI — company links and per-role
 * bullet points. And the component ignored all of it, rendering a hardcoded TypeScript array
 * instead. The data was fetched on every page load and thrown away.
 *
 * It now renders what was already being downloaded, bullets and links included.
 */
@Component({
  standalone: false,
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css'],
})
export class ExperienceComponent implements OnInit, OnDestroy {
  title = 'Experience';
  items: ExperienceItem[] = DEFAULT_EXPERIENCE;

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private content: PortfolioContentService,
    private structured: StructuredContentService,
  ) {}

  ngOnInit(): void {
    this.content.experience$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((items) => (this.items = items));

    this.structured
      .text('Experience.Title', 'Experience')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((title) => (this.title = title));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  trackItem(_index: number, item: ExperienceItem): string {
    return `${item.Company.Name}-${item.Title}-${item.Date}`;
  }
}

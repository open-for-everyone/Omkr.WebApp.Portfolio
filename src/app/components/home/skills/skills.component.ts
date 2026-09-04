import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DEFAULT_SKILLS } from 'src/app/models/content/site-content.defaults';
import { SkillCategory } from 'src/app/models/content/site-content.model';
import { PortfolioContentService } from 'src/app/services/content/portfolio-content.service';
import { StructuredContentService } from 'src/app/services/content/structured-content.service';

/**
 * The Tech Stack grid.
 *
 * The five categories used to be an `@Input` default — forty-odd technology names compiled into the
 * bundle, so adding a skill meant a code change and a deploy. They come from the `skills` content
 * key now, per locale, with {@link DEFAULT_SKILLS} as the offline base.
 */
@Component({
  standalone: false,
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
})
export class SkillsComponent implements OnInit, OnDestroy {
  title = 'Tech Stack';
  categories: SkillCategory[] = DEFAULT_SKILLS;

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private content: PortfolioContentService,
    private structured: StructuredContentService,
  ) {}

  ngOnInit(): void {
    this.content.skills$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((categories) => (this.categories = categories));

    this.structured
      .text('Skills.Title', 'Tech Stack')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((title) => (this.title = title));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  trackCategory(_index: number, category: SkillCategory): string {
    return category.label;
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DEFAULT_KEY_SKILLS, DEFAULT_PROFILE } from 'src/app/models/content/site-content.defaults';
import { SiteProfile } from 'src/app/models/content/site-content.model';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';
import { PortfolioContentService } from 'src/app/services/content/portfolio-content.service';
import { ProfileService } from 'src/app/services/content/profile.service';
import { StructuredContentService } from 'src/app/services/content/structured-content.service';

/**
 * The About section.
 *
 * Paragraphs and chips come from the `about` content key, per locale. They were previously read
 * straight through the `| translate` pipe, which iterates the raw key name character by character
 * when the key is missing — one `<p>` per letter. Reading them through
 * {@link StructuredContentService} validates the shape first.
 *
 * The e-mail and LinkedIn buttons were hardcoded anchors; they now follow the profile, so there is
 * one place to change an address.
 */
@Component({
  standalone: false,
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit, OnDestroy {
  profile: SiteProfile = DEFAULT_PROFILE;
  paragraphs: string[] = [];
  keySkills: string[] = DEFAULT_KEY_SKILLS;

  private readonly destroyed$ = new Subject<void>();

  constructor(
    public readonly analyticsService: AnalyticService,
    private profileService: ProfileService,
    private content: PortfolioContentService,
    private structured: StructuredContentService,
  ) {}

  ngOnInit(): void {
    this.profileService.profile$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((profile) => (this.profile = profile));

    this.content.aboutParagraphs$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((paragraphs) => (this.paragraphs = paragraphs));

    this.structured
      .textList('AboutMe.KeySkills', DEFAULT_KEY_SKILLS)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((skills) => (this.keySkills = skills));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  get mailtoHref(): string {
    return `mailto:${this.profile.email}`;
  }

  /** The LinkedIn entry from the profile's social links, if there is one. */
  get linkedInUrl(): string | null {
    return this.profile.socials.find((social) => social.icon === 'linkedin')?.url ?? null;
  }
}

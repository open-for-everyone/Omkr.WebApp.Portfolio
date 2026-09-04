import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeoService } from 'src/app/services/general/seo.service';

/**
 * The 404 page.
 *
 * The previous implementation mutated global state in `ngOnInit` and never undid it:
 *
 * ```ts
 * renderer2.setStyle(document.body, 'background-color', '#0a192f');
 * renderer2.setStyle(document.body, 'overflow', 'hidden');
 * ```
 *
 * With no `ngOnDestroy`, both survived navigation. Hitting a bad URL and then clicking "Home" left
 * the entire site with scrolling disabled and a hardcoded background overriding the theme, until the
 * visitor reloaded. Styling is scoped to this component now, so there is nothing to undo.
 *
 * It also pulled a decorative GIF from `media.giphy.com` on every render — a third-party request
 * made before any cookie choice, for an effect that is now drawn in CSS.
 */
@Component({
  standalone: false,
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent implements OnInit {
  /** The path that missed, echoed back so the visitor can see the typo. */
  attemptedPath = '';

  constructor(
    private location: Location,
    private router: Router,
    private seo: SeoService,
  ) {}

  ngOnInit(): void {
    // The router has already rewritten the URL to /404, so the original path comes from history.
    this.attemptedPath = this.router.url;

    // Search engines should not index a 404 as a real page.
    this.seo.update({
      title: 'Page not found — 404',
      description: 'The page you are looking for could not be found.',
    });
  }

  goBack(): void {
    this.location.back();
  }
}

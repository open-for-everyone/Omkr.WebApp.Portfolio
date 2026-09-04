import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConsentService } from 'src/app/services/general/consent.service';
import { PageViewService } from 'src/app/services/PageView/page-view.service';

/**
 * The home route: a thin shell that composes the sections.
 *
 * It used to carry a second, unused confetti implementation — `startConfetti`, `stopConfetti`,
 * `getRandomColor` and an `ngOnChanges` driven by a `show` input that a routed component can never
 * receive — duplicating {@link ConfettiComponent}, which AppComponent already renders. That, an
 * injected `MatDialog` nothing opened, an unused `currentEvent`, and a `setTimeout` whose comment
 * said five seconds while the value said fifty, are all gone.
 *
 * Page titles and meta tags are set centrally from route data in `AppRoutingModule`, so there is no
 * SEO call here.
 */
@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  pageUrl = '';

  constructor(
    private pageViewService: PageViewService,
    private router: Router,
    private consent: ConsentService,
  ) {}

  ngOnInit(): void {
    this.pageUrl = this.router.url;

    // Analytics only with consent; the service swallows its own failures.
    if (this.consent.isAllowed('analytics')) {
      this.pageViewService.incrementPageView(this.router.url).subscribe();
    }
  }
}

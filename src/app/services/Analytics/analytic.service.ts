import { Injectable, isDevMode } from '@angular/core';
import { ConsentService } from '../general/consent.service';

/**
 * Interaction analytics.
 *
 * There is no event-collection endpoint yet — the admin API records page visits
 * ({@link PageViewService}) but not individual clicks — so this stays a seam rather than a
 * transport. The method signatures are the contract; swapping the body for a real call is the only
 * change a future integration needs.
 *
 * Two things it no longer does. It used to `console.log` on every single click, in production, from
 * a dozen call sites: a visitor opening the console saw a running commentary of their own browsing.
 * And it reported regardless of the cookie banner's answer, which made the banner's analytics toggle
 * decorative for everything except the page counter.
 */
@Injectable({
  providedIn: 'root',
})
export class AnalyticService {
  constructor(private consent: ConsentService) {}

  sendAnalyticEvent(action: string, category: string, label: string): void {
    if (!this.canReport()) return;
    this.debug('event', { action, category, label });
  }

  sendAnalyticPageView(path: string, title: string): void {
    if (!this.canReport()) return;
    this.debug('pageview', { path, title });
  }

  /** Honours the visitor's choice; nothing is reported without consent. */
  private canReport(): boolean {
    return this.consent.isAllowed('analytics');
  }

  /**
   * Development only; silent in the built site.
   *
   * Uses `isDevMode()` rather than `environment.production`, which cannot be trusted here: with no
   * `fileReplacements` in angular.json there is one environment file for every configuration, and
   * its `production` flag is hardcoded `false` — so it reads false in the deployed site too.
   */
  private debug(kind: string, payload: Record<string, string>): void {
    if (!isDevMode()) return;
    console.debug(`[analytics] ${kind}`, payload);
  }
}

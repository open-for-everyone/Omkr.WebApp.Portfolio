import { Component } from '@angular/core';
import { ConsentKey, ConsentService } from 'src/app/services/general/consent.service';

/**
 * Cookie/consent panel. Shown unprompted on a first visit, and reopenable afterwards from the footer
 * or from any feature that needs a permission the visitor hasn't granted — otherwise a single
 * "Decline" would lock features like "Use my location" off forever with no way back.
 */
@Component({
  standalone: false,
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.css']
})
export class CookieConsentComponent {
  constructor(public consent: ConsentService) {}

  get visible(): boolean {
    return this.consent.isPanelOpen();
  }

  /** True once the visitor has decided before, which is when per-choice toggles are worth showing. */
  get reviewing(): boolean {
    return this.consent.hasAnyDecision();
  }

  isAllowed(key: ConsentKey): boolean {
    return this.consent.isAllowed(key);
  }

  toggle(key: ConsentKey, allowed: boolean): void {
    this.consent.set(key, allowed);
  }

  acceptAll() {
    this.consent.setMany({ analytics: true, geolocation: true });
    this.consent.closePreferences();
  }

  rejectAll() {
    this.consent.setMany({ analytics: false, geolocation: false });
    this.consent.closePreferences();
  }

  /** Keeps whatever is currently set — the panel is a review, not a decision, once reopened. */
  close() {
    if (!this.consent.hasAnyDecision()) this.consent.setMany({ analytics: false, geolocation: false });
    this.consent.closePreferences();
  }
}

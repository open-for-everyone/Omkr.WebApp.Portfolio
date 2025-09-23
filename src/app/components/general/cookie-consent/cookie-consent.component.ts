import { Component } from '@angular/core';
import { ConsentService } from 'src/app/services/general/consent.service';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.css']
})
export class CookieConsentComponent {
  constructor(public consent: ConsentService) {}

  get visible(): boolean {
    return !this.consent.hasAnyDecision();
  }

  acceptAll() {
    this.consent.setMany({ analytics: true, geolocation: true });
  }

  rejectAll() {
    this.consent.setMany({ analytics: false, geolocation: false });
  }
}

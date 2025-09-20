import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';


import { VisitorDetail } from './models/admin/visitor/visitor-detail';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Keshav Singh Portfolio';
  visitorData: VisitorDetail={
    userAgent: '',
    browserName: '',
    browserVersion: '',
    cookiesEnabled: false,
    platform: '',
    language: ''
  };

  constructor(private titleService: Title,
    private metaService: Meta,
    private translateService: TranslateService,
    private location: Location) {
    translateService.setDefaultLang('en');
    // or
    translateService.use('en');

    this.visitorData = this.getVisitorInfo();
  }

  getVisitorInfo(): VisitorDetail {
    return {
      userAgent: navigator.userAgent,
      browserName: navigator.appName,
      browserVersion: navigator.appVersion,
      cookiesEnabled: navigator.cookieEnabled,
      platform: navigator.platform,
      language: navigator.language,
    };
  }
}

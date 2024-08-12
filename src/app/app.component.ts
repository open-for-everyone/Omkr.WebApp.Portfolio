import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';


import * as AOS from 'aos';
import { VisitorDetail } from './models/admin/visitor/visitor-detail';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Keshav Singh Portfolio';
  visitorData: VisitorDetail={
    userAgent: '',
    browserName: '',
    browserVersion: '',
    cookiesEnabled: false,
    platform: '',
    language: ''
  };

  constructor(private router: Router, private titleService: Title,
    private metaService: Meta,
    private translateService: TranslateService,
    private location: Location) {
    translateService.setDefaultLang('en');
    // or
    translateService.use('en');

    this.visitorData = this.getVisitorInfo();
  }

  ngOnInit(): void {

    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     AOS.refresh();
    //   }
    // });

    AOS.init();

    console.log('Visitor Data: ' + JSON.stringify(this.visitorData));
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

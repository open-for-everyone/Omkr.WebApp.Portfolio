import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';


import { VisitorDetail } from './models/admin/visitor/visitor-detail';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Keshav Singh Portfolio';
  showBackToTop = false;
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
    private location: Location,
    private router: Router,
    private route: ActivatedRoute) {
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

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Toggle back-to-top visibility on scroll
  onWindowScroll = () => {
    this.showBackToTop = (window.scrollY || document.documentElement.scrollTop) > 400;
  };

  ngOnInit(): void {
    // Update title from route data on navigation
    const appTitle = 'Keshav Singh — Portfolio';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let child = this.route.firstChild;
        while (child?.firstChild) {
          child = child.firstChild;
        }
        const routeTitle = child?.snapshot.data?.['title'] as string | undefined;
        this.titleService.setTitle(routeTitle || appTitle);
      }
    });
    window.addEventListener('scroll', this.onWindowScroll, { passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onWindowScroll);
  }
}

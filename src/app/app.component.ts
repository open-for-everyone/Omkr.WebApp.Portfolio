import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';


import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Keshav Singh Portfolio';

  constructor(private router: Router, private titleService: Title,
    private metaService: Meta,
    private translateService: TranslateService,
    private location: Location) {
    translateService.setDefaultLang('en');
    // or
    translateService.use('en');
  }

  ngOnInit(): void {

    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     AOS.refresh();
    //   }
    // });

    AOS.init();
  }
}

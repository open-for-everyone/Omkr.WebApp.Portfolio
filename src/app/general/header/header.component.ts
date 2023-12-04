import { Component, HostListener, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger("animateMenu", [
      transition(":enter", [
        query("*", [
          style({ opacity: 0, transform: "translateY(-50%)" }),
          stagger(50, [
            animate(
              "250ms cubic-bezier(0.35, 0, 0.25, 1)",
              style({ opacity: 1, transform: "none" }))
          ])
        ])
      ])
    ])
  ]
})

export class HeaderComponent implements OnInit {
  // Declare a variable to hold the authentication status
  responsiveMenuVisible = false;
  pageYPosition = 0;
  cvName = "";
  languageFormControl: FormControl = new FormControl();

  constructor(protected authService: AuthService, private router: Router, public analyticsService: AnalyticService) { }
  ngOnInit(): void {
    console.log('navbar page loaded');
  }
  isLoggedIn(): boolean {
    // return this.authService.isLoggedIn();
    return false;
  }
  logout(): void {
    this.authService.logout();
  }

  goToLogin() {
    this.router.navigate(['/signin']);
  }

  isNavbarCollapsed = true;

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }


  scroll(elementId: string) {
    if (document.getElementById(elementId)) {
      document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/home']).then(() => document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' }));
    }
    this.responsiveMenuVisible = false;
  }

  downloadCV() {
    // app url
    const url = window.location.href;

    // Open a new window with the CV
    window.open(url + "/../assets/cv/" + this.cvName, "_blank");
  }

  @HostListener('window:scroll', ['$event'])
  getScrollPosition(event: Event) {
    this.pageYPosition = window.pageYOffset;
  }

}

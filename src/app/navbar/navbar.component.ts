import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  // Declare a variable to hold the authentication status
  constructor(protected authService: AuthService, private router: Router) { }
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
}

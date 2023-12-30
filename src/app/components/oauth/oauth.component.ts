import { Component } from '@angular/core';
import { AuthService } from 'src/app/guards/auth/auth.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.css']
})
export class OauthComponent {
  constructor(private authService: AuthService) {}
  public handleLoginRequest(service: string): void {
    console.log(`Login requested for: ${service}`);
    this.authService.loginWithOAuth(service);
  }
}

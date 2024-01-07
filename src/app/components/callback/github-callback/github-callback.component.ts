import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/guards/auth/auth.service';

@Component({
  selector: 'app-github-callback',
  templateUrl: './github-callback.component.html',
  styleUrls: ['./github-callback.component.css']
})
export class GithubCallbackComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.handleAuthentication();
  }
}

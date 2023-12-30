import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-failure',
  templateUrl: './login-failure.component.html',
  styleUrls: ['./login-failure.component.css']
})
export class LoginFailureComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Here you can access the query parameters from the URL to display error messages
    // You might also provide options to retry the login or contact support
    console.log('Login failure page loaded');
  }

}

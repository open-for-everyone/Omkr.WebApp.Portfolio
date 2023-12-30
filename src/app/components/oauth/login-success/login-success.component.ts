import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.css']
})
export class LoginSuccessComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // You can access the query parameters from the URL here and perform actions accordingly
    // For example, you might want to store an authentication token, redirect to a dashboard, etc.
    console.log('Login success page loaded');
  }

}

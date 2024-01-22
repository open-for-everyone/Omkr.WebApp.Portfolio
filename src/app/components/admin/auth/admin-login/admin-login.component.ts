import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError!: string;
  /**
   *
   */
  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {
    console.log('AdminLogin page loaded');
  }

  onSubmit() {
    // Log the form data to the console
    console.log('Form Data:', this.loginForm.value);

    if (this.loginForm.valid) {

      // Implement your authentication logic here.
      // If successful, navigate to the dashboard or appropriate page.
      // On failure, set this.loginError to the error message.
      const { userName, password } = this.loginForm.value;

      if (userName !== 'admin' && password !== 'admin') {
        console.log('Invalid username or password');
        this.loginError = 'Invalid username or password';
      }
      else {
        console.log('Form is valid.');

        console.log("username: " + userName + '; password: ' + password);
        // this.authService.login(organizationId, userName, password);
        localStorage.setItem('isAdminLoggedIn', "true");
        this.router.navigate(['/admin']);
      }
    }
    else {
      // If the form is invalid, you may want to log that as well
      console.log('Form is not valid');
    }
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    // Log the form data to the console
    console.log('Form Data:', this.loginForm.value);

    if (this.loginForm.valid) {

      // Implement your authentication logic here.
      // If successful, navigate to the dashboard or appropriate page.
      // On failure, set this.loginError to the error message.
      if (false) {
        console.log('Invalid username or password');
        this.loginError = 'Invalid username or password';
      }
      else {
        this.router.navigate(['/employee']);
      }
    }
    else {
      // If the form is invalid, you may want to log that as well
      console.log('Form is not valid');
    }

    const { email, password } = this.loginForm.value;
  }
}

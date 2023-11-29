import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  signupForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    this.signupForm = this.formBuilder.group({
      organizationName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {

    console.log('Form Data:', this.signupForm.value);

    if (this.signupForm.valid) {
      console.log('Form Data is valid');
      // Handle form submission, e.g. call a service method to send the form data to your server

      // Match the passwords
      if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
        console.log('Passwords do not match');
        return;
      }

      // Redirect to home page
      this.router.navigate(['/']);
    }
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganizationDetails } from 'src/app/abstraction/organization-details';
import { AuthService } from 'src/app/auth.service';
import { OrganizationService } from 'src/app/services/organization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError!: string;

  organizations: OrganizationDetails[] = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private organizationService: OrganizationService) {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      organizationId: ['', [Validators.required]] // Ensure you have this control defined
    });
  }
  ngOnInit(): void {
    this.getOrganizations();
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
        console.log('Form is valid.');

        const { userName, password, organizationId } = this.loginForm.value;
        console.log("username: " + userName + '; organizationId: ' + organizationId);
        this.authService.login(organizationId, userName, password);
        this.router.navigate(['/setting/basic-info']);
      }
    }
    else {
      // If the form is invalid, you may want to log that as well
      console.log('Form is not valid');
    }
  }

  getOrganizations(): void {
    this.organizationService.getAll().subscribe(
      (data: OrganizationDetails[]) => {
        console.log("Fetching organizations data.");
        this.organizations = data;
      },
      (error) => {
        console.error('There was an error retrieving organizations', error);
      }
    );
  }
}

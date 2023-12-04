import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { OrganizationDetails } from 'src/app/abstraction/organization-details';
import { UserDetails } from 'src/app/abstraction/user-details';
import { AuthService } from 'src/app/auth.service';
import { CountryDetails } from 'src/app/models/country-details.model';
import { CountryService } from 'src/app/services/country.service';
import { OrganizationService } from 'src/app/services/organization.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  organizations: OrganizationDetails[] = [];
  userDetail: UserDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    countryCode: '',
    countryName: '',
    userName: '',
    organizationId: '',
    password: '',
    name: 'temp'
  };
  countries: CountryDetails[] = [];
  countryControl = new FormControl();
  filteredCountries: Observable<CountryDetails[]> = new Observable();

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private organizationService: OrganizationService, private profileService: ProfileService,
    private countryService: CountryService) {
    this.signupForm = this.formBuilder.group({
      organizationId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      countryCode: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getOrganizations();
    this.getCountryDetails();
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

      this.createUser();

      // Redirect to home page
      this.router.navigate(['/']);
    }
  }

  createUser(): void {
    this.userDetail.countryCode = this.signupForm.value.countryCode;
    this.userDetail.organizationId = this.signupForm.value.organizationId;
    this.userDetail.email = this.signupForm.value.email;
    this.userDetail.firstName = this.signupForm.value.firstName;
    this.userDetail.lastName = this.signupForm.value.lastName;
    this.userDetail.phoneNumber = this.signupForm.value.phoneNumber;
    this.userDetail.password = this.signupForm.value.password;
    this.userDetail.userName = this.signupForm.value.userName;


    console.log('User data', this.userDetail);

    this.profileService.insert(this.userDetail).subscribe(
      response => {
        // Handle the successful response here
        console.log('User inserted successfully', response);
      },
      error => {
        // Handle errors here
        console.error('Error inserting user', error);
      }
    );
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
  getCountryDetails(): void {
    this.countryService.getCountries().subscribe(
      (data: CountryDetails[]) => {
        console.log("Fetching countries data.");
        this.countries = data;

        // Sort countries by name
        this.countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

        // Set up the filter for the select input
        this.filteredCountries = this.countryControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCountries(value))
        );
        console.log("filtered countries are: " + this.filteredCountries);

      },
      (error) => {
        console.error('There was an error retrieving organizations', error);
      }
    );

  }

  private _filterCountries(value: string): CountryDetails[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(country =>
      country.name.common.toLowerCase().includes(filterValue)
    );
  }
}

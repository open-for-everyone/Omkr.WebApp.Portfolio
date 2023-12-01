import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {
  // userDetails: any;

  // Define the userDetails property. The type should match the structure of your user details.
  // For example, if you expect firstName, lastName, email, phoneNumber, and countryCode properties:
  userDetails: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    countryCode?: string;
  } = {}; // Initialize with an empty object or appropriate default values.

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getUserDetails().subscribe(
      (data) => {
        this.userDetails = data;
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }
}

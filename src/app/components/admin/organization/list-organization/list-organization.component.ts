import { Component } from '@angular/core';
import { OrganizationDetails } from 'src/app/models/organization-details';
import { OrganizationService } from 'src/app/services/organization/organization.service';

@Component({
  selector: 'app-list-organization',
  templateUrl: './list-organization.component.html',
  styleUrls: ['./list-organization.component.css']
})
export class ListOrganizationComponent {
  organizations: OrganizationDetails[] = [];

  constructor(private organizationService: OrganizationService) {
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

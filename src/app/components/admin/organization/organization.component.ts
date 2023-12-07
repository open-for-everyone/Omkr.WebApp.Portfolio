import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrganizationDetails } from 'src/app/models/organization-details';
import { OrganizationService } from 'src/app/services/organization/organization.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit{
  organizations: OrganizationDetails[] = [];
  displayedColumns: string[] = ['id', 'name','type']; // Add column keys here
  dataSource = new MatTableDataSource(this.organizations);
  constructor(private organizationService: OrganizationService) { }
  ngOnInit(): void {
    this.getOrganizations();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

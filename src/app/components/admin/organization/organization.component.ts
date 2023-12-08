import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrganizationDetails } from 'src/app/models/organization-details';
import { OrganizationService } from 'src/app/services/organization/organization.service';
import { AdminConstant } from 'src/app/models/admin/admin-constant';
import { MatDialog } from '@angular/material/dialog';
import { EditOrganizationComponent } from './edit-organization/edit-organization.component';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', animate('300ms ease-in')),
    ])
  ]
})
export class OrganizationComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'type', 'action']; // Add column keys here
  dataSource = new MatTableDataSource();
  filterOptions = AdminConstant.filterOptions;

  constructor(private organizationService: OrganizationService, public dialog: MatDialog) { }
  ngOnInit(): void {
    this.getOrganizations();
  }

  getOrganizations(): void {
    this.organizationService.getAll().subscribe(
      (data: OrganizationDetails[]) => {
        console.log("Fetching organizations data.");
        this.dataSource.data = data;
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

  openEditCard(element: OrganizationDetails): void {
    console.log("element:" + element.id);
    const dialogRef = this.dialog.open(EditOrganizationComponent, {
      width: '250px',
      data: {
        organization: element // Passing the entire OrganizationDetails object
        // Alternatively, if you only want to pass the id, use:
        // organizationId: element.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after closing the dialog, if necessary
    });
  }


  // Delete the organization
  confirmDelete(organizationId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px'
      // data: { ... } // Pass any data if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed the deletion, proceed with the delete operation
        this.deleteOrganization(organizationId);
      } else {
        // User dismissed the dialog, do not delete
      }
    });
  }

  deleteOrganization(organizationId: string): void {
    // Implement the logic to delete the organization, e.g., call a service
    console.log(`Deleting organization with ID: ${organizationId}`);
    // Perform the actual deletion operation here...
  }
}

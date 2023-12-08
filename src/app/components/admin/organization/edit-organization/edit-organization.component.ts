import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrganizationType } from 'src/app/models/admin/admin-constant';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.css']
})

export class EditOrganizationComponent implements OnInit {
  // Create an array of enum keys
  // This will hold the array of objects for the dropdown
  organizationTypes = this.getOrganizationTypeOptions();
  editOrganizationForm: FormGroup;
  myControl = new FormControl();

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditOrganizationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Contains the passed in organization or organizationId
  ) {
    this.editOrganizationForm = this.formBuilder.group({
      organizationName: ['', [Validators.required]],
      organizationType: ['', [Validators.required]] // Ensure you have this control defined
    });
  }

  ngOnInit(): void {
    // You can now access the passed in organization details or id
    console.log('Received organization details:', this.data.organization);
    // Or, if you passed just the id:
    console.log('Received organization id:', this.data.organization.id);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Here you would typically handle the saving logic, such as making an HTTP request to
    // update the data on the server. After saving, you can close the dialog.
    // For this example, we'll simply log the updated organization and close the dialog.

    console.log('Saving organization:', this.data.organization);
    this.dialogRef.close(this.data.organization); // Optionally pass back the updated organization
  }

  // Convert the enum to an array of objects with label and value properties
  private getOrganizationTypeOptions(): { label: string; value: OrganizationType }[] {
    return Object.values(OrganizationType).map(value => ({
      label: value,
      value: value as OrganizationType
    }));
  }
}

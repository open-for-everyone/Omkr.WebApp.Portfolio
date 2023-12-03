import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AddOrganizationComponent } from '../admin/organization/add-organization/add-organization.component';
import { ListOrganizationComponent } from '../admin/organization/list-organization/list-organization.component';


@NgModule({
  declarations: [
    AdminComponent,
    AddOrganizationComponent,
    ListOrganizationComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }

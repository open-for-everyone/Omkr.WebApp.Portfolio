import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AddOrganizationComponent } from './organization/add-organization/add-organization.component';
import { ListOrganizationComponent } from './organization/list-organization/list-organization.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SideNavComponent } from './navigation/side-nav/side-nav.component';
import { TopNavComponent } from './navigation/top-nav/top-nav.component';
import { BottomNavComponent } from './navigation/bottom-nav/bottom-nav.component';

import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NavigationComponent } from './navigation/navigation.component';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TopNavbarProfileDropdownComponent } from './navigation/dropdowns/top-navbar-profile-dropdown/top-navbar-profile-dropdown.component';
import { UserComponent } from './user/user/user.component';
import { OrganizationComponent } from './organization/organization.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { EditOrganizationComponent } from './organization/edit-organization/edit-organization.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AdminComponent,
    AddOrganizationComponent,
    ListOrganizationComponent,
    DashboardComponent,
    SideNavComponent,
    TopNavComponent,
    BottomNavComponent,
    NavigationComponent,
    TopNavbarProfileDropdownComponent,
    UserComponent,
    OrganizationComponent,
    EditOrganizationComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    MatGridListModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class AdminModule { }

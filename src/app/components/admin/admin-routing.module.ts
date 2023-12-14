import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AddOrganizationComponent } from './organization/add-organization/add-organization.component';
import { ListOrganizationComponent } from './organization/list-organization/list-organization.component';
import { OrganizationComponent } from './organization/organization.component';
import { VisitorComponent } from './visitor/visitor.component';

const routes: Routes = [{
  path: "", component: AdminComponent, children: [
    { path: "add-organization", component: AddOrganizationComponent },
    { path: "list-organization", component: ListOrganizationComponent },
    { path: "organization", component: OrganizationComponent },
    { path: "visitor", component: VisitorComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

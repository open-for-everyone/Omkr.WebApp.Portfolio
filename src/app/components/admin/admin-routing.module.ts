import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AddOrganizationComponent } from './organization/add-organization/add-organization.component';
import { ListOrganizationComponent } from './organization/list-organization/list-organization.component';
import { OrganizationComponent } from './organization/organization.component';
import { VisitorComponent } from './visitor/visitor.component';
import { ChatComponent } from './chat/chat.component';
import { MarkdownRendererComponent } from './markdown-renderer/markdown-renderer.component';
import { FileUploadComponent } from '../general/file/file-upload/file-upload.component';
import { CsharpInterviewQaComponent } from './topic/csharp-interview-qa/csharp-interview-qa.component';
import { UserComponent } from './user/user/user.component';
import { adminGuard } from 'src/app/guards/admin/admin.guard';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';

const routes: Routes = [{
  path: "", component: AdminComponent, children: [
    { path: "add-organization", component: AddOrganizationComponent },
    { path: "list-organization", component: ListOrganizationComponent },
    { path: "organization", component: OrganizationComponent },
    { path: "visitor", component: VisitorComponent },
    { path: "chat", component: ChatComponent },
    { path: "markdown-renderer", component: MarkdownRendererComponent },
    { path: "file", component: FileUploadComponent },
    { path: "topic", component: CsharpInterviewQaComponent },
    { path: "user", component: UserComponent }
  ], canActivate: [adminGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

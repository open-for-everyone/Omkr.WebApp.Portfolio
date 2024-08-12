import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { VisitorComponent } from './visitor/visitor.component';
import { MarkdownRendererComponent } from './markdown-renderer/markdown-renderer.component';
import { FileUploadComponent } from '../general/file/file-upload/file-upload.component';
import { CsharpInterviewQaComponent } from './topic/csharp-interview-qa/csharp-interview-qa.component';
import { UserComponent } from './user/user/user.component';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [{
  path: "", component: AdminComponent, children: [
    { path: "visitor", component: VisitorComponent },
    { path: "markdown-renderer", component: MarkdownRendererComponent },
    { path: "file", component: FileUploadComponent },
    { path: "topic", component: CsharpInterviewQaComponent },
    { path: "user", component: UserComponent }
  ], canActivate: [MsalGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

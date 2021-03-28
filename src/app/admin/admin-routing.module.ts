import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
import { UserManagementComponent } from './user-management.component';

const routes: Routes = [
    {
        path: '', component: AdminLayoutComponent,
        children: [
            { path: 'user-management', component: UserManagementComponent }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class AdminRoutingModule { }
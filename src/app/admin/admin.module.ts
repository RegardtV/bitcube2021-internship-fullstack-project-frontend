import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminRoutingModule } from './admin-routing.module';
import { UserManagementComponent } from './user-management.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AdminRoutingModule
    ],
    declarations: [
        AdminLayoutComponent,
        UserManagementComponent
    ]
})
export class AdminModule { }
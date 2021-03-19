import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


import { UserAccountRoutingModule } from './user-account-routing.module';
import { UserAccountLayoutComponent } from './user-account-layout.component';
import { AddEditAdvertComponent } from './add-edit-advert.component';
import { JwPaginationModule } from 'jw-angular-pagination';
import { MyAdvertsComponent } from './my-adverts.component';
import { AdvertDetailComponent } from './advert-detail.component';




@NgModule({
    declarations: [
        AdvertDetailComponent,
        MyAdvertsComponent,
        AddEditAdvertComponent,
        UserAccountLayoutComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UserAccountRoutingModule,
        JwPaginationModule
    ],
    providers: [],
})
export class UserAccountModule { }

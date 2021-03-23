import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditAdvertGuard } from '@app/_guards/add-edit-advert.guard';
import { AddEditAdvertComponent } from './add-edit-advert.component';
import { ManageAccountComponent } from './manage-account.component';

import { MyAdvertsComponent } from './my-adverts.component';
import { SellerProfileComponent } from './seller-profile.component';
import { UserAccountLayoutComponent } from './user-account-layout.component';

const routes: Routes = [
    {
        path: '', component: UserAccountLayoutComponent,
        children: [
            { path: 'my-adverts', component: MyAdvertsComponent },
            { path: 'my-adverts/add', canDeactivate: [AddEditAdvertGuard], component: AddEditAdvertComponent },
            { path: 'my-adverts/edit/:id', canDeactivate: [AddEditAdvertGuard], component: AddEditAdvertComponent },
            { path: 'manage', component: ManageAccountComponent },
            { path: 'seller-profile', component: SellerProfileComponent },
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class UserAccountRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditAdvertGuard } from '@app/_guards/add-edit-advert.guard';
import { AddEditAdvertComponent } from './add-edit-advert.component';

import { MyAdvertsComponent } from './my-adverts.component';
import { UserAccountLayoutComponent } from './user-account-layout.component';

const routes: Routes = [
    {
        path: '', component: UserAccountLayoutComponent,
        children: [
            { path: '', component: MyAdvertsComponent },
            { path: 'add', canDeactivate: [AddEditAdvertGuard], component: AddEditAdvertComponent },
            { path: 'edit/:id', canDeactivate: [AddEditAdvertGuard], component: AddEditAdvertComponent }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class UserAccountRoutingModule { }

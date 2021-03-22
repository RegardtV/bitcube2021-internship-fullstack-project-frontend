import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvertDetailComponent } from './advert-detail.component';
import { ForSaleComponent } from './for-sale.component';

import { PublicLayoutComponent } from './public-layout.component';

const routes: Routes = [
    {
        path: '', component: PublicLayoutComponent,
        children: [
            { path: '', component: ForSaleComponent },
            { path: ':id', component: AdvertDetailComponent }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class PublicRoutingModule { }
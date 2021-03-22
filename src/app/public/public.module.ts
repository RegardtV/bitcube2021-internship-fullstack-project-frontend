import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { JwPaginationModule } from 'jw-angular-pagination';
import { PublicLayoutComponent } from './public-layout.component';
import { ForSaleComponent } from './for-sale.component';
import { ForSaleListComponent } from './for-sale-list.component';
import { PublicRoutingModule } from './public-routing.module';
import { AdvertDetailComponent } from './advert-detail.component';



@NgModule({
  declarations: [
      PublicLayoutComponent,
      ForSaleComponent,
      ForSaleListComponent,
      AdvertDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PublicRoutingModule,
    JwPaginationModule
  ]
})
export class PublicModule { }

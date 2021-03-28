import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { JwPaginationModule } from 'jw-angular-pagination';
import { PublicLayoutComponent } from './public-layout.component';
import { ForSaleComponent } from './for-sale.component';
import { PublicRoutingModule } from './public-routing.module';
import { AdvertDetailComponent } from './advert-detail.component';
import { SharedModule } from '@app/_components/shared.module';
import { ContactSellerComponent } from './contact-seller.component';


@NgModule({
  declarations: [
      PublicLayoutComponent,
      ForSaleComponent,
      AdvertDetailComponent,
      ContactSellerComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PublicRoutingModule,
    JwPaginationModule,
    SharedModule
  ]
})
export class PublicModule { }

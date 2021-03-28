import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ForSaleListComponent } from './for-sale-list.component';
import { SearchComponent } from './search.component';




@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [
        SearchComponent,
        ForSaleListComponent
    ],
    exports: [
        SearchComponent,
        ForSaleListComponent
    ]
})
export class SharedModule { }

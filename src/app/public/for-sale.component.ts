import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Advert, User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { AdvertService } from '@app/_services/advert.service';
import * as moment from 'moment';

@Component({
    selector: 'app-for-sale',
    templateUrl: './for-sale.component.html'
})
export class ForSaleComponent implements OnInit {

    pageTitle: string = 'Homes For Sale';
    adverts: Advert[] = [];
    pageOfAdverts: Advert[] = [];
    loading: boolean = true;
    noResultsMessage: string = '';

    constructor(private router: Router) {}

    ngOnInit(): void {
    }

    onAdvertsEmit(adverts: Advert[]): void {
        if (!adverts.length) {
            this.noResultsMessage = 'No results found'
        } else {
            this.noResultsMessage = '';
        }
        
        this.adverts = adverts;
        this.pageOfAdverts = adverts;
        this.loading = false;
        
    }
    
    onChangePage(pageOfAdverts: Advert[]): void {
        // update current page of items
        this.pageOfAdverts = pageOfAdverts;
    }

    routeTo(advertId: number): void {
        this.router.navigate([`/for-sale/${advertId}`]);
    }
}

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
    listFilter: string = '';
    adverts: Advert[] = [];
    filteredAdverts: Advert[] = [];
    pageOfAdverts: Advert[] = [];
    loading: boolean = true;
    filterControl: FormControl = new FormControl('');
    orderBy: FormControl = new FormControl('1');
    

    constructor(private adService: AdvertService,
                private alertService: AlertService) {}

    ngOnInit(): void {
        this.getAllAdverts();
        // subscribe to changes in filterControl to update filter for lists to display
        this.filterControl.valueChanges
            .subscribe((value: string) => {
                this.listFilter = value;
                this.filteredAdverts = this.listFilter ? this.performFilter(this.listFilter) : this.adverts;
                this.pageOfAdverts = this.performSort(this.orderBy.value);
            })
        this.orderBy.valueChanges
            .subscribe((value: number) => {
                this.pageOfAdverts = this.performSort(value);
        })
    }
    
    onChangePage(pageOfAdverts: Advert[]): void {
        // update current page of items
        this.pageOfAdverts = pageOfAdverts;
    }

    // private method to pefrom filter based on filter input
    private performFilter(filterBy: string): Advert[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.adverts.filter((advert: Advert) =>
            advert.header.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
            advert.description.toLocaleLowerCase().indexOf(filterBy) !== -1
        );
    }

    // private method to perform sort based on selected "order by" criteria
    private performSort(orderBy: number): Advert[] {
        // most recent
        if (orderBy == 1) {
            return this.filteredAdverts.sort((ad1,ad2) => {
                const date1 = moment(ad1.date,"dd-MM-yyyy").toDate();
                const date2 = moment(ad2.date,"dd-MM-yyyy").toDate();
                if (date1 < date2)
                    return 1;
                if (date1 > date2) 
                    return -1;
                return 0;
            });
        }
        // highest price
        if (orderBy == 2) {
            return this.filteredAdverts.sort((ad1,ad2) => {
                if (ad1.price > ad2.price)
                    return 1;
                if (ad1.price < ad2.price) 
                    return -1;
                return 0;
            });
        }
        // lowest price
        if (orderBy == 3) {
            return this.filteredAdverts.sort((ad1,ad2) => {
                if (ad1.price < ad2.price)
                    return 1;
                if (ad1.price > ad2.price) 
                    return -1;
                
                return 0;
            });
        }
        return this.filteredAdverts;
    }

    // private method to get currentUser adverts and assign to adverts and filtered adverts lists
    private getAllAdverts(): void {
        this.adService.getAllAdverts().subscribe({
            next: (adverts: Advert[]) => {
                this.loading = false;
                this.adverts = adverts.filter((ad: Advert) => ad.state !== "Deleted" && ad.state !== "Hidden");
                this.filteredAdverts = this.adverts;
            },
            error: (err: any) => {
                this.loading = false;
                this.alertService.error(err);
            }
        });
    }
}

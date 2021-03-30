import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Advert, AdvertSearch, User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { UserService } from '@app/_services/user.service';
import * as moment from 'moment';

@Component({
    selector: 'app-my-adverts',
    templateUrl: './my-adverts.component.html'
})
export class MyAdvertsComponent implements OnInit {

    pageTitle: string = 'My Adverts';
    listFilter: string = '';
    adverts: Advert[] = [];
    filteredAdverts: Advert[] = [];
    pageOfAdverts: Advert[] = [];
    loading: boolean = true;
    filterControl: FormControl = new FormControl('');
    orderBy: FormControl = new FormControl('1');
    noAdvertsMessage: string = "";
    
    private user: User;

    constructor(private router: Router,
                private accountService: AccountService, 
                private userService: UserService,
                private alertService: AlertService) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    ngOnInit(): void {
        this.getAllUserAdverts();
        // subscribe to changes in filterControl to update filter for lists to display
        this.filterControl.valueChanges
            .subscribe((value: string) => {
                this.listFilter = value;
                this.filteredAdverts = this.listFilter ? this.performFilter(this.listFilter) : this.adverts;
                if (!this.filteredAdverts.length) {
                    this.noAdvertsMessage = 'No adverts to show'
                } else {
                    this.noAdvertsMessage = '';
                }
            })
        this.orderBy.valueChanges
            .subscribe((orderByValue: string) => {
                this.searchUserAdverts(+orderByValue);
        })
    }
    
    onChangePage(pageOfAdverts: Advert[]): void {
        // update current page of items
        this.pageOfAdverts = pageOfAdverts;
    }

    toggleShowHideAdvert(advert: Advert): void {
        
        advert.state === 'Hidden' ? advert.state = 'Live' : advert.state = 'Hidden'

        this.updateUserAdvertById(advert);
    }

    toggleFeatured(advert: Advert): void {
        
        if (advert.featured){
            advert.featured = false;
        } else {
            advert.featured = true;
        }

        this.updateUserAdvertById(advert);
    }

    routeTo(advertId: number): void {
        this.router.navigate([`user-account/my-adverts/edit/${advertId}`]);
    }

    onDelete(advert: Advert): void {
        if (confirm('Are you sure you want to delete this advert? This action cannot be undone, are you sure you want to continue?')) {
            // delete advert
            advert.state = "Deleted";
            this.updateUserAdvertById(advert);
        }
    }

    // private method to pefrom filter based on filter input
    private performFilter(filterBy: string): Advert[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.adverts.filter((advert: Advert) =>
            advert.header.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
            advert.description.toLocaleLowerCase().indexOf(filterBy) !== -1
        );
    }

    // private method to get currentUser adverts and assign to adverts and filtered adverts lists
    private getAllUserAdverts(): void {
        this.userService.getAllUserAdverts(this.user.id).subscribe({
            next: (adverts: Advert[]) => {
                this.loading = false;
                this.adverts = adverts;
                this.filteredAdverts = this.listFilter ? this.performFilter(this.listFilter) : this.adverts;
                if (!this.filteredAdverts.length) {
                    this.noAdvertsMessage = 'No adverts to show'
                } else {
                    this.noAdvertsMessage = '';
                }             
            },
            error: (err: any) => {
                this.loading = false;
                this.alertService.error(err);
            }
        });
    }

    private searchUserAdverts(orderByValue: number): void {
        var searchObject = new AdvertSearch();
        searchObject.orderBy = orderByValue;
        this.userService.searchUserAdverts(this.user.id, searchObject).subscribe({
            next: (adverts: Advert[]) => {
                this.adverts = adverts;
                this.filteredAdverts = this.listFilter ? this.performFilter(this.listFilter) : this.adverts;
            },
            error: (err: any) => {
                this.alertService.error(err);
            }
        });
    }

    private updateUserAdvertById(advert: Advert): void {

        this.userService.updateUserAdvertById(this.user.id, advert.id, advert)            
        .subscribe({
            next: () => this.getAllUserAdverts(),
         error: (err: any) => this.alertService.error(err)
        });     
    }
}

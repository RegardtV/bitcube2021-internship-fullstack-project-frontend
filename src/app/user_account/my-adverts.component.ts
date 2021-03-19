import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Advert, User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { AdvertService } from '@app/_services/advert.service';

@Component({
    selector: 'app-my-adverts',
    templateUrl: './my-adverts.component.html'
})
export class MyAdvertsComponent implements OnInit {

    pageTitle: string = 'My Adverts';
    listFilter: string = '';
    adverts: Advert[] = [];
    filteredAdverts: Advert[] = [];
    pageOfAdverts: Advert[];
    loading: boolean = true;
    filterControl: FormControl = new FormControl('');
    
    private user: User;

    constructor(private accountService: AccountService, 
                private adService: AdvertService,
                private alertService: AlertService) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    ngOnInit(): void {
        this.getAllUserAdverts();
        // subscribe to changes in filterControl to update filter for lists to display
        this.filterControl.valueChanges
            .subscribe((value: string) => {
                this.listFilter = value;
                this.filteredAdverts = this.listFilter ? this.performFilter(this.listFilter) : this.adverts
            })
    }
    
    onChangePage(pageOfAdverts: Advert[]): void {
        // update current page of items
        this.pageOfAdverts = pageOfAdverts;
    }

    hideAdvert(advert: Advert): void {
        this.loading = true;
        advert.state = "Hidden";
        this.adService.updateUserAdvertById(this.user.id, advert.id, advert)
            .subscribe({
                next: () => this.getAllUserAdverts(),
                error: (err: any) => this.alertService.error(err)
            });
    }

    showAdvert(advert: Advert): void {
        this.loading = true;
        advert.state = "Live";
        this.adService.updateUserAdvertById(this.user.id, advert.id, advert)            
            .subscribe({
                next: () => this.getAllUserAdverts(),
             error: (err: any) => this.alertService.error(err)
            });
    }

    onDelete(advert: Advert): void {
        if (confirm('Are you sure you want to delete this advert? This action cannot be undone, are you sure you want to continue?')) {
            this.loading = true;
            // delete advert
            advert.state = "Deleted";
            this.adService.updateUserAdvertById(this.user.id, advert.id, advert) 
                .subscribe({
                    next: () => this.getAllUserAdverts(),
                    error: (err: any) => this.alertService.error(err)
                });
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
        this.adService.getAllUserAdverts(this.user.id).subscribe({
            next: (adverts: Advert[]) => {
                this.loading = false;
                this.adverts = adverts.filter((ad: Advert) => ad.state !== "Deleted");
                this.filteredAdverts = this.listFilter ? this.performFilter(this.listFilter) : this.adverts
            },
            error: (err: any) => {
                this.loading = false;
                this.alertService.error(err);
            }
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Advert, User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { UserService } from '@app/_services/user.service';

@Component({
    selector: 'app-favourites',
    templateUrl: './favourites.component.html'
})
export class FavouritesComponent implements OnInit {

    pageTitle: string = 'My Favourites';
    listFilter: string = '';
    adverts: Advert[] = [];
    filteredAdverts: Advert[] = [];
    pageOfAdverts: Advert[] = [];
    loading: boolean = true;
    filterControl: FormControl = new FormControl('');
    noFavouritesMessage: string = "";
    
    private user: User;

    constructor(private router: Router,
                private accountService: AccountService, 
                private userService: UserService,
                private alertService: AlertService) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    ngOnInit(): void {
        this.getUserFavourites();
        // subscribe to changes in filterControl to update filter for lists to display
        this.filterControl.valueChanges
            .subscribe((value: string) => {
                this.listFilter = value;
                this.filteredAdverts = this.listFilter ? this.performFilter(this.listFilter) : this.adverts;
                this.filteredAdverts.length? this.noFavouritesMessage = '' : this.noFavouritesMessage = 'No favourites to show'; 
            })
    }
    
    onChangePage(pageOfAdverts: Advert[]): void {
        // update current page of items
        this.pageOfAdverts = pageOfAdverts;
    }

    onRemoveFavourite(advert: Advert): void {

        this.removeFavourite(advert);
    }

    routeTo(advertId: number): void {
        this.router.navigate([`/for-sale/${advertId}`]);
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
    private getUserFavourites(): void {
        this.userService.getUserFavourites(this.user.id).subscribe({
            next: (adverts: Advert[]) => {
                this.loading = false;
                this.adverts = adverts;
                this.filteredAdverts = this.listFilter ? this.performFilter(this.listFilter) : this.adverts;
                this.filteredAdverts.length? this.noFavouritesMessage = '' : this.noFavouritesMessage = 'No favourites to show';           
            },
            error: (err: any) => {
                this.loading = false;
                this.alertService.error(err);
            }
        });
    }

    private removeFavourite(advert: Advert): void {
        this.userService.addRemoveUserFavourite(this.user.id, advert.id)            
        .subscribe({
            next: () => {
                this.getUserFavourites();
                this.alertService.success("Favourite removed successfully", { autoClose: true, keepAfterRouteChange: true });

            },
            error: (err: any) => this.alertService.error(err)
        });     
    }
}

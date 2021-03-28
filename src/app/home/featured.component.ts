import { Component} from '@angular/core';
import { Router } from '@angular/router';

import { Advert } from '@app/_models';
import { AlertService } from '@app/_services';
import { AdvertService } from '@app/_services/advert.service';

@Component({selector: 'app-featured',
            templateUrl: 'featured.component.html' },
)
export class FeatruedComponent {
    
    adverts: Advert[] = [];
    loading: boolean = true;
    noFeaturedAdvertsMessage: string = "";

    constructor(private router: Router,
                private adService: AdvertService,
                private alertService: AlertService) {}

    ngOnInit(): void {

        this.adService.getAllFeaturedAdverts()
            .subscribe({
                next: (adverts) => {
                    this.adverts = adverts;
                    this.loading = false;
                    if (!adverts.length) {
                        this.noFeaturedAdvertsMessage = 'No featured adverts'
                    } else {
                        this.noFeaturedAdvertsMessage = '';
                    }
                    
                },
                error: err => {
                    this.alertService.error(err);
                    this.loading = false;
                }
            });
    }

    routeTo(advertId: number): void {
        this.router.navigate([`/for-sale/${advertId}`]);
    }

}
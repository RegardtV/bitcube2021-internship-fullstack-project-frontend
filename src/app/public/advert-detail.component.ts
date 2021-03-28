import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Advert } from '@app/_models';
import { AlertService } from '@app/_services';
import { AdvertService } from '@app/_services/advert.service';

@Component({
    selector: 'app-advert-detail',
    templateUrl: './advert-detail.component.html'
})

export class AdvertDetailComponent implements OnInit {
    
    advert: Advert;
    advertId: number;
    loading: boolean = true;

    constructor(private route: ActivatedRoute, 
                private adService: AdvertService,
                private alertService: AlertService) { }

    ngOnInit(): void {
        this.advertId = this.route.snapshot.params['id'];
        this.adService.getAdvertById(this.advertId).subscribe({
            next: ad => {
                this.advert = ad;
                this.loading = false;
            },
            error: err => {
                this.alertService.error(err);
                this.loading = false;
            }
        });
    }

}

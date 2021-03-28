import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Advert, AdvertSearch, City, Province, User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { AdvertService } from '@app/_services/advert.service';
import { first } from 'rxjs/operators';

@Component({selector: 'app-search',
            templateUrl: 'search.component.html' },
)
export class SearchComponent {
    
    form: FormGroup;
    loading: boolean;
    user: User;
    searchObject: AdvertSearch;
    provinces: Province[] = [];
    cities: City[] = [];
    prices: number[] = [];
    adverts: Advert[] = [];
    thisUrl: string = "";


    @Output() emitAdverts: EventEmitter<Advert[]> = new EventEmitter<Advert[]>();

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private adService: AdvertService,
                private alertService: AlertService,   
                private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }

    ngOnInit(): void {

        this.prices.push(100000);
        this.prices.push(250000)
        this.prices.push(500000);
        this.prices.push(750000)
        this.prices.push(1000000);
        this.prices.push(2000000);
        this.prices.push(5000000);
        this.prices.push(2000000);
        this.prices.push(10000000);

        this.getAllProvinces()
        this.getAllCities()

        this.form = this.formBuilder.group({
            search: [null],
            province: ['0'],
            city: ['0'],
            minPrice: ['0'],
            maxPrice: ['0'],
            orderBy: ['1']
        });
        
        this.thisUrl = this.getUrlWithoutParams();
        if (this.thisUrl !== '/') {

            this.searchObject = JSON.parse(localStorage.getItem('searchObject'))
            if (this.searchObject) {
                this.form.get('search').setValue(this.searchObject.keywords?.join(' '));
                this.form.get('province').setValue(this.searchObject.provinceId);
                this.form.get('city').setValue(this.searchObject.cityId);
                this.form.get('minPrice').setValue(this.searchObject.minPrice);
                this.form.get('maxPrice').setValue(this.searchObject.maxPrice);
                this.form.get('orderBy').setValue(this.searchObject.orderBy);   
            }
            this.searchFeaturedAdverts(this.initSearchObject());
        }
            
        

        this.form.get('province').valueChanges
        .subscribe((value: string) => {
            this.onChangeProvince(value);
        })

        this.form.get('orderBy').valueChanges
        .subscribe(() => {
            this.searchFeaturedAdverts(this.initSearchObject());;
        })
    }

    onChangeProvince(provinceId: string) {
        
        if (provinceId === '0') {
            this.getAllCities()
        } else {
            this.adService.getAllProvinceCities(+provinceId).subscribe({
                next: cities => {
                    this.cities = cities;
                    this.form.get('city').setValue('0');
                },
                error: err => {
                    this.alertService.error(err);
                }
            });
        }   
    }

    onReset(): void {
        
        localStorage.removeItem('searchObject');

        this.form.get('search').reset();
        this.form.get('province').setValue('0');
        this.form.get('city').setValue('0');
        this.form.get('minPrice').setValue('0');
        this.form.get('maxPrice').setValue('0');
        this.form.get('orderBy').setValue('1');
    }

    onSubmit(): void {
        
        var searchObject = this.initSearchObject();
        localStorage.setItem('searchObject', JSON.stringify(searchObject));

        if (this.thisUrl === "/") {
            this.router.navigate(['/for-sale']);
        } else {
            this.searchFeaturedAdverts(searchObject);
        }
    }

    private searchFeaturedAdverts(searchObject: AdvertSearch): void {
        
        this.adService.searchFeaturedAdverts(searchObject).subscribe({
            next: featAds => {
                this.adverts = featAds;
                this.searchNonFeaturedAdverts(searchObject);
            },
            error: err => {
                this.alertService.error(err);
            }
        });
    }

    private searchNonFeaturedAdverts(searchObject: AdvertSearch): void {

        this.adService.searchNonFeaturedAdverts(searchObject).subscribe({
            next: nonFeatAds => {
                this.adverts = this.adverts.concat(nonFeatAds);
                this.emitAdverts.emit(this.adverts);
            },
            error: err => {
                this.alertService.error(err);
            }
        });
    }

    private initSearchObject(): AdvertSearch {
        return {
            keywords: this.form.get('search').value?.split(' '),
            provinceId: +this.form.get('province').value,
            cityId: +this.form.get('city').value,
            minPrice: +this.form.get('minPrice').value,
            maxPrice: +this.form.get('maxPrice').value,
            orderBy: +this.form.get('orderBy').value,
        };
    }
    
    private getUrlWithoutParams() {
        let urlTree = this.router.parseUrl(this.router.url);
        urlTree.queryParams = {}; 
        return urlTree.toString();
    }

    private getAllProvinces(): void {

        this.adService.getAllProvinces().pipe(first()).subscribe({
            next: provinces => {
                this.provinces = provinces;
            },
            error: err => {
                this.alertService.error(err);
            }
        });
    }

    private getAllCities(): void {

        this.adService.getAllCities().pipe(first()).subscribe({
            next: cities=> {
                this.cities = cities;
            },
            error: err => {
                this.alertService.error(err);
            }
        });
    }
}
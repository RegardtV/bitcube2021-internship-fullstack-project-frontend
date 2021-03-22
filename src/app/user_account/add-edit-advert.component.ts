import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageProcessor } from '@app/_helpers';
import { DateGenerator } from '@app/_helpers/date-generator';
import { Advert, City, User } from '@app/_models';
import { Province } from '@app/_models/province';
import { AccountService, AlertService } from '@app/_services';
import { AdvertService } from '@app/_services/advert.service';
import { UserService } from '@app/_services/user.service';
import { StringValidator } from '@app/_validators/string.validator';
import {  Observable, fromEvent, merge } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';


@Component({
    selector: 'app-add-edit-advert',
    templateUrl: './add-edit-advert.component.html',
})
export class AddEditAdvertComponent implements OnInit {

    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    pageTitle: string = '';
    displayMessage: { [key: string]: string } = {};
    form: FormGroup;
    advertId: number;
    isAddMode: boolean;
    loading: boolean;
    provinces: Province[] = [];
    cities: City[] = [];

    // validation properties
    private minChars: number = 10;
    private headerMaxChars: number = 100;
    private descriptionMaxChars: number = 1000;
    private priceMaxRange: number = 100000000;
    private priceMinRange: number = 10000;

    private msgProcessor: MessageProcessor;
    private advert: Advert;
    private user: User;

    formattedPrice: string;

    private validationMessages: { [key: string]: { [key: string]: string } } = {
        header: {
            required: 'Please enter an advert heading.',
            minlength: `The advert header must contain at least ${this.minChars} non-whitespace characters.`,
            maxlength: `The advert header must contain less than ${this.headerMaxChars} characters.`
        },
        description: {
            required: 'Please enter the advert details',
            minlength: `The description must contain at least ${this.minChars} non-whitespace characters.`,
            maxlength: `The description must contain less than ${this.descriptionMaxChars} characters.`,
        },
        province: {
            required: 'Please select a province'
        },
        city: {
            required: 'Please select a city'
        },
        price: {
            required: 'Please enter a price.',
            min: `The price must be at least R${this.priceMinRange}`,
            max: `The price can't exceed R${this.priceMaxRange}`
        }
    };

    constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private adService: AdvertService,
        private accountService: AccountService,
        private alertService: AlertService) {

        this.msgProcessor = new MessageProcessor(this.validationMessages);
        this.accountService.user.subscribe(x => this.user = x);
    }

    ngOnInit(): void {

        this.adService.getAllProvinces().pipe(first()).subscribe({
            next: provinces => {
                this.provinces = provinces;
            },
            error: err => {
                this.alertService.error(err);
            }
        });

        this.adService.getAllCities().pipe(first()).subscribe({
            next: cities=> {
                this.cities = cities;
            },
            error: err => {
                this.alertService.error(err);
            }
        });
        
        this.advertId = this.route.snapshot.params['id'];
        this.isAddMode = !this.advertId;

        if (this.isAddMode) {
            this.pageTitle = 'Enter Advert details (* required):';
        } else {
            this.pageTitle = "Edit Advert details (* required):";
        }

        this.form = this.formBuilder.group({
            header: ['', [Validators.required, StringValidator.minLengthWithoutWhitespace(this.minChars), Validators.maxLength(this.headerMaxChars)]],
            description: ['', [Validators.required, StringValidator.minLengthWithoutWhitespace(this.minChars), Validators.maxLength(this.descriptionMaxChars)]],
            province: ['', Validators.required],
            city: ['', Validators.required],
            price: ['', [Validators.required, Validators.min(this.priceMinRange), Validators.max(this.priceMaxRange)]],
        });

        if (!this.isAddMode) {
            this.userService.getUserAdvertById(this.user.id, this.advertId)
                .pipe(first())
                .subscribe({
                    next: advert => {

                        this.advert = advert;
                        this.form.get("header").setValue(advert.header);
                        this.form.get("description").setValue(advert.description);
                        this.form.get("province").setValue(advert.province);
                        this.onChangeProvince(advert.province);
                        this.form.get("city").setValue(advert.city);
                        this.form.get("price").setValue(advert.price);
                        this.transformPrice();
                    },
                    error: err => this.alertService.error(err)
                });
        }
        
        this.form.get("province").valueChanges
        .subscribe((provinceName: string) => {
            this.onChangeProvince(provinceName);
        })
    }

    ngAfterViewInit(): void {
        // Watch for the blur event from any input element on the form.
        // This is required because the valueChanges does not provide notification on blur
        const controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
        // Merge the blur event observable with the valueChanges observable
        // so we only need to subscribe once.
        merge(this.form.valueChanges, ...controlBlurs)
            .pipe(debounceTime(800))
            .subscribe(() => {
                this.displayMessage = this.msgProcessor.processMessages(this.form, null);
            });
    }

    transformPrice(): void {
        this.formattedPrice = this.form.get("price").value.toFixed(2);
        this.form.get("price").setValue(+this.formattedPrice);
    }

    onChangeProvince(provinceName: string) {
        const province = this.provinces.find(province => province.name === provinceName)
        if (province) {
            this.adService.getAllProvinceCities(province.id).subscribe({
                next: cities => {
                    this.cities = cities;
                },
                error: err => {
                    this.alertService.error(err);
                }
            });
        } else {
            this.cities = null;
        }
    }

    onSubmit(): void {

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;

        if (this.isAddMode) {
            this.createUserAdvert();
        } else {
            this.updateUserAdvert();
        }
    }

    private createUserAdvert(): void {
        const advert: Advert = this.form.value;
        var dateGen = new DateGenerator();
        advert.date = dateGen.getCurrentDate() // set date property to current date
        advert.state = "Live";

        this.userService.createUserAdvertById(this.user.id, advert)
            .pipe(first())
            .subscribe({
                next: advert => {
                    this.alertService.success('Advert added successfully', {  autoClose: true, keepAfterRouteChange: true });
                    this.form.reset();
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error: err => {
                    this.alertService.error(err);
                    this.loading = false;
                }
            });
    }

    private updateUserAdvert(): void {

        const advert = { ...this.advert, ...this.form.value };

        this.userService.updateUserAdvertById(this.user.id, this.advertId, advert)
            .pipe(first())
            .subscribe({
                next: advert => {
                    this.alertService.success('Edit successful', {  autoClose: true, keepAfterRouteChange: true });
                    this.form.reset();
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error: err => {
                    this.alertService.error(err);
                    this.loading = false;
                }
            });
    }
}


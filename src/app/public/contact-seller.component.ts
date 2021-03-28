import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageProcessor } from '@app/_helpers';
import { Advert, User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { AdvertService } from '@app/_services/advert.service';
import { UserService } from '@app/_services/user.service';
import { WhitespaceValidator } from '@app/_validators';
import { StringValidator } from '@app/_validators/string.validator';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'app-contact-seller',
    templateUrl: './contact-seller.component.html',
})
export class ContactSellerComponent implements OnInit {

    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    pageTitle: string = 'Contact seller (* required)'
    form: FormGroup;
    loading: boolean = true;
    advert: Advert = new Advert();
    advertId: number;
    user: User;
    seller: User;
    favouriteButtonText: string = 'Add Favourite';
    addRemoveFavouriteSuccessText: string = '';
    isFavourite: boolean;

    // validation members
    nameMinChars: number = 5;
    emailMinChars: number = 6;
    messageMinChars: number = 10;
    maxChars: number = 100;
    messageMaxChars: number = 2000;
    
    private msgProcessor: MessageProcessor;

    // validation messages
    displayMessage: { [key: string]: string } = {};
    validationMessages: { [key: string]: { [key: string]: string } } = {
        email: {
            required: 'Please enter your email address. ',
            minlength: `Your email address must contain at least ${this.emailMinChars} characters. `,
            maxlength: `Your email address must contain less than ${this.maxChars} characters. `,
            email: 'Please enter a valid email address. '
        },
        name: {
            required: 'Please enter your name.',
            minlength: `Your name must contain at least ${this.nameMinChars} characters. `,
            maxlength: `Your name must contain less than ${this.maxChars} characters. `,
        },
        phoneNumber: {
            maxlength: `Your phone number must contain less than ${this.maxChars} digits. `,
        },
        message: {
            required: 'Please enter your message',
            minlength: `Your message must contain at least ${this.messageMinChars} non-whitespace characters.`,
            maxlength: `Your message must contain less than ${this.messageMaxChars} characters.`,
        }
    };

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private adService: AdvertService,
                private userService: UserService,
                private accountService: AccountService,
                private alertService: AlertService) {
        this.msgProcessor = new MessageProcessor(this.validationMessages);
        this.accountService.user.subscribe(x => this.user = x);

    }

    ngOnInit(): void {
        
        this.advertId = +this.route.snapshot.params['id'];

        this.adService.getAdvertById(this.advertId).subscribe({
            next: ad => {
                this.advert = ad;
                this.getSeller();
            },
            error: err => {
                this.alertService.error(err);
                this.loading = false;
            }
        });

        if (this.user)
            this.getUserFavourites()
        

        this.form = this.formBuilder.group({
            email: ['', [WhitespaceValidator.removeSpaces, 
                        Validators.required, 
                        Validators.email,
                        Validators.minLength(this.emailMinChars), 
                        Validators.maxLength(this.maxChars)]],
            name: ['', [WhitespaceValidator.removeSpaces, 
                        Validators.required, 
                        Validators.minLength(this.nameMinChars), 
                        Validators.maxLength(this.maxChars)]],
            phone: ['', [ WhitespaceValidator.removeSpaces,
                                Validators.maxLength(this.maxChars)]],
            message: ['', [ Validators.required, 
                            StringValidator.minLengthWithoutWhitespace(this.messageMinChars), 
                            Validators.maxLength(this.messageMaxChars)]]
        });

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

    onAddFavourite(): void {
        
        if (this.user) {
            this.addRemoveUserFavourite();

        } else {
            this.router.navigate(['/account/register']);
        }
    }

    onSubmit(): void {

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.alertService.success('Message sent', { autoClose: true });
        this.form.reset();
    }
    
    private getSeller(): void {
        
        this.userService.getUserById(this.advert.userId).subscribe({
            next: user => {
                this.seller = user;
                this.loading = false;
            },
            error: err => {
                this.alertService.error(err);
                this.loading = false;
            }
        });
    }

    private getUserFavourites(): void {
        
        this.userService.getUserFavourites(this.user.id).subscribe({
            next: favourites => {

                if (favourites.find(ad => ad.id === this.advertId)) {
                    this.isFavourite = true;
                    this.favouriteButtonText = 'Remove Favourite';
                }
                else {
                    this.isFavourite = false;
                    this.favouriteButtonText = 'Add Favourite';
                }
            },
            error: err => {
                this.alertService.error(err);
            }
        });
    }

    private addRemoveUserFavourite(): void {
        
        this.userService.addRemoveUserFavourite(this.user.id, this.advertId).subscribe({
            next: () => {
                if (this.isFavourite) {
                    this.isFavourite = false;
                    this.alertService.success('Removed from favourites', { autoClose: true });
                    this.favouriteButtonText = 'Add Favourite';
                } else {
                    this.isFavourite = true;
                    this.alertService.success('Added to favourites', { autoClose: true });
                    this.favouriteButtonText = 'Remove Favourite';
                }
            },
            error: err => {
                this.alertService.error(err);
            }
        });
    }
}


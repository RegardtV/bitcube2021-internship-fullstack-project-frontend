import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageProcessor } from '@app/_helpers';
import { User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { WhitespaceValidator } from '@app/_validators';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';


@Component({
    selector: 'app-seller-profile',
    templateUrl: './seller-profile.component.html',
})
export class SellerProfileComponent implements OnInit {

    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    pageTitle: string = 'Edit contact details (* required)';
    form: FormGroup;
    loading: boolean;

    // validation members
    minChar: number = 6;
    emailMaxChars: number = 100;
    phoneNumberMaxChars: number = 30;
    
    private msgProcessor: MessageProcessor;
    private user: User;

    // validation messages
    displayMessage: { [key: string]: string } = {};
    validationMessages: { [key: string]: { [key: string]: string } } = {
        email: {
            required: 'Please enter your email address.',
            minlength: `Your email address must contain at least ${this.minChar} characters.`,
            maxlength: `Your email address must contain less than ${this.emailMaxChars} characters.`,
            email: 'Please enter a valid email address.'
        },
        phoneNumber: {
            minlength: `Your phone number must contain at least ${this.minChar} digits.`,
            maxlength: `Your phone number must contain less than ${this.phoneNumberMaxChars} digits.`,
        }
    };

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private accountService: AccountService,
                private alertService: AlertService) {
        this.msgProcessor = new MessageProcessor(this.validationMessages);
        this.accountService.user.subscribe(u => this.user = u);
    }

    ngOnInit(): void {

        this.form = this.formBuilder.group({
            email: ['', [WhitespaceValidator.removeSpaces, 
                        Validators.required, 
                        Validators.email,
                        Validators.minLength(this.minChar), 
                        Validators.maxLength(this.emailMaxChars)]],
            phoneNumber: ['', [ Validators.minLength(this.minChar), 
                                Validators.maxLength(this.phoneNumberMaxChars)]]
        });
    

        this.form.get('email').setValue(this.user.email);
        this.form.get('phoneNumber').setValue(this.user.phoneNumber);
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

    onSubmit(): void {

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        
        this.accountService.updateAccount(this.user.id, this.initUser())
        .pipe(first())
        .subscribe({
            next: () => {
                this.alertService.success('Profile updated successfully', {  autoClose: true, keepAfterRouteChange: true });
                this.form.reset();
                this.router.navigate(['/user-account/my-adverts']);
            },
            error: err => {
                this.alertService.error(err);
                this.loading = false;
            }
        });
    }

    // private method used in onSubmit method
    private initUser(): User {
        return {
            id: null,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.form.get('email').value,
            phoneNumber: this.form.get('phoneNumber').value,
            password: null,
            token: null
        };
    }
}


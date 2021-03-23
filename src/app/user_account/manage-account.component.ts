import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageProcessor } from '@app/_helpers';
import { User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { MatchValidator, WhitespaceValidator } from '@app/_validators';
import {  Observable, fromEvent, merge } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';


@Component({
    selector: 'app-manage-account',
    templateUrl: './manage-account.component.html',
})
export class ManageAccountComponent implements OnInit {

    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    pageTitle: string = 'Edit account details (* required)';
    form: FormGroup;
    loading: boolean;
    passwordToggleMessage: string = 'show passwords';
    passwordInputType = 'password';
    required: string = '';

    // validation members
    maxChars: number = 100;
    firstNameMinChar: number = 1;
    lastNameMinChar: number = 3;
    emailMinChar: number = 6;

    private msgProcessor: MessageProcessor;
    private user: User;

    // validation messages
    displayMessage: { [key: string]: string } = {};
    validationMessages: { [key: string]: { [key: string]: string } } = {
        firstName: {
            required: 'Please enter your first name.',
            minlength: `Your first name must contain at least ${this.firstNameMinChar} characters.`,
            maxlength: `Your first name must contain less than ${this.maxChars} characters.`
        },
        lastName: {
            required: 'Please enter your last name.',
            minlength: `Your last name must contain at least ${this.lastNameMinChar} characters.`,
            maxlength: `Your last name must contain less than ${this.maxChars} characters.`
        },
        email: {
            required: 'Please enter your email address.',
            minlength: `Your email address must contain at least ${this.emailMinChar} characters.`,
            maxlength: `Your email address must contain less than ${this.maxChars} characters.`,
            email: 'Please enter a valid email address.'
        },
        oldPassword: {
            maxlength: `Your password must contain less than ${this.maxChars} characters.`,
            pattern: 'Please enter a valid password.' 
        },
        passwordGroup: {
            match: 'Please make sure the confirmation matches your new password.',
        },
        newPassword: {
            required: 'Please enter your newly chosen password.',
            maxlength: `Your password must contain less than ${this.maxChars} characters.`,
            pattern: 'Please enter a valid password.'
        },
        confirmNewPassword: {
            required: 'Please confirm your password.',
            maxlength: `Your password must contain less than ${this.maxChars} characters.`,
            pattern: 'Please enter a valid password.'
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
        
        const passwordValidators = [ WhitespaceValidator.removeSpaces, 
                                        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,100}$/), 
                                        Validators.maxLength(this.maxChars)];

        this.form = this.formBuilder.group({
            firstName: ['', [WhitespaceValidator.removeSpaces, Validators.required,
            Validators.minLength(this.firstNameMinChar), Validators.maxLength(this.maxChars)]],
            lastName: ['', [WhitespaceValidator.removeSpaces, Validators.required,
            Validators.minLength(this.lastNameMinChar), Validators.maxLength(this.maxChars)]],
            email: ['', [WhitespaceValidator.removeSpaces, Validators.required, Validators.email,
            Validators.minLength(this.emailMinChar), Validators.maxLength(this.maxChars)]],
            oldPassword: ['', passwordValidators],
            passwordGroup: this.formBuilder.group({
                newPassword: [{value: null, disabled: true}, passwordValidators],
                confirmNewPassword: [{value: null, disabled: true}, passwordValidators],
            })
        });

        // add match validator to password form group after form initialization in order to access child form controls
        const passwordFormGroup = this.form.get('passwordGroup');
        passwordFormGroup.setValidators(MatchValidator.match(passwordFormGroup.get('newPassword'), passwordFormGroup.get('confirmNewPassword')));

        const oldPasswordControl: AbstractControl = this.form.get('oldPassword')
        oldPasswordControl.valueChanges
        .subscribe(() => {
            const newPasswordControl: AbstractControl = this.form.get('passwordGroup.newPassword');
            const confirmNewPasswordControl: AbstractControl = this.form.get('passwordGroup.confirmNewPassword');
            if (oldPasswordControl.valid){
                this.required = '*';
                passwordValidators.push(Validators.required)
                newPasswordControl.setValidators(passwordValidators);
                newPasswordControl.enable();
                confirmNewPasswordControl.setValidators(passwordValidators);
                confirmNewPasswordControl.enable();
            } 
            
            if (!oldPasswordControl.value) {
                this.required ='';
                newPasswordControl.reset()
                newPasswordControl.disable();
                confirmNewPasswordControl.reset();
                confirmNewPasswordControl.disable();
            }
        })

        this.form.get('firstName').setValue(this.user.firstName);
        this.form.get('lastName').setValue(this.user.lastName);
        this.form.get('email').setValue(this.user.email);
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
        const passwordToCheck: string = this.form.get('oldPassword').value;

        if (passwordToCheck) {
            this.accountService.checkUserPassword(this.user.id, passwordToCheck)
            .pipe(first())
            .subscribe({
                next: ()=> {
                    this.updateAccount();
                },
                error: err => {
                    this.alertService.error(err);
                    this.loading = false;
                }
            });
        } else {
            this.updateAccount();
        }
    }

    private updateAccount(): void {
        this.accountService.updateAccount(this.user.id, this.initUser())
        .pipe(first())
        .subscribe({
            next: () => {
                this.alertService.success('Account updated successfully', {  autoClose: true, keepAfterRouteChange: true });
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
            firstName: this.form.get('firstName').value,
            lastName: this.form.get('lastName').value,
            email: this.form.get('email').value,
            password: this.form.get('passwordGroup.newPassword').value,
            phoneNumber: this.user.phoneNumber,
            token: null
        };
    }

    // method called on click of password button to toggle whether password can be viewed
    showPassword(): void {
        if (this.passwordInputType === 'text') {
            this.passwordInputType = 'password';
            this.passwordToggleMessage = 'show password'
        } else {
            this.passwordInputType = 'text';
            this.passwordToggleMessage = 'hide password'
        }
    }
}


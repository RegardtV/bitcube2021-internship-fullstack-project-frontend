import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { debounceTime, first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { WhitespaceValidator } from '@app/_validators';
import { MessageProcessor } from '@app/_helpers';
import { fromEvent, merge, Observable } from 'rxjs';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
    
    form: FormGroup;
    msgProcessor: MessageProcessor;
    loading: boolean = false;
    submitted: boolean = false;
    returnUrl: string;
    passwordToggleMessage: string = 'show password';
    passwordInputType = 'password';

    // validation members
    maxChars: number = 100;
    emailMinChar: number = 6;

    // validation messages
    displayMessage: { [key: string]: string } = {};
    validationMessages: { [key: string]: { [key: string]: string } } = {
        email: {
            required: 'Please enter your email address.',
            minlength: `Your email address must contain at least ${this.emailMinChar} characters.`,
            maxlength: `Your email address must contain less than ${this.maxChars} characters.`,
            email: 'Please enter a valid email address.'
        },
        password: {
            required: 'Please enter your chosen password.',
            maxlength: `Your password must contain less than ${this.maxChars} characters.`,
            pattern: 'Please enter a valid password.'
        }
    };

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {
        this.msgProcessor = new MessageProcessor(this.validationMessages);
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.minLength(this.emailMinChar),
                        Validators.maxLength(this.maxChars), Validators.email, WhitespaceValidator.removeSpaces]],
            password: ['', [Validators.required, Validators.maxLength(this.maxChars),
                            Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,100}$/), 
                            WhitespaceValidator.removeSpaces]]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
    
    onSubmit(): void {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.login(this.form.get("email").value, this.form.get("password").value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success("Login successfull", { autoClose: true, keepAfterRouteChange: true });
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
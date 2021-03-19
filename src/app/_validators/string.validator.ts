import { AbstractControl, ValidatorFn } from "@angular/forms";

export class StringValidator {
    static minLengthWithoutWhitespace(minLength: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            const isTooShort: boolean = control.value?.split(' ').join('').length < minLength;
            const isValid: boolean = !isTooShort;
            return isValid ? null : { 'minlength': true };
        };
    }
}
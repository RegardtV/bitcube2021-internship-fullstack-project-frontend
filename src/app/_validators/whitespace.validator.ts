import { AbstractControl } from "@angular/forms";

export class WhitespaceValidator {
    // validator method to remove whitespaces in the form controls
    static removeSpaces(control: AbstractControl): {[key: string]: boolean} {
        if (control && control.value) {
            let removedSpaces = control.value.split(' ').join('');
            control.value !== removedSpaces && control.setValue(removedSpaces);
        }
        return null;
    }

    static noWhitespace(control: AbstractControl): {[key: string]: boolean}  {
        const isWhitespace: boolean = control.value?.split(' ').join('').length < control.value?.length;
        const isValid: boolean = !isWhitespace;
        return isValid ? null : { 'whitespace': true };;
    }

    static trimmedWhitespace(control: AbstractControl): {[key: string]: boolean} {
        const isWhitespace: boolean = control.value?.trim().length === 0;
        const isValid: boolean = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }
}
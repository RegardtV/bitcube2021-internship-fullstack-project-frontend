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
}
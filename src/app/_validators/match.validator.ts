import { AbstractControl, ValidatorFn } from "@angular/forms";

export class MatchValidator {
    // validator method to validate whether two input values match
    static match(control_1: AbstractControl, control_2: AbstractControl): ValidatorFn {
        return (c: AbstractControl): {[key: string]: boolean} | null => {
        if (control_1.pristine || control_2.pristine) {
            return null;
        }
        if (control_1.value === control_2.value) {
            return null;
        }
        return { match: true };
        };
    }      
}
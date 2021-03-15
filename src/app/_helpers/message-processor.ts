import { AbstractControl } from "@angular/forms";

export class MessageProcessor {

    constructor(private validationMessages: { [key: string]: { [key: string]: string } }) {}
    
    // iterates thourgh forms and nested forms and controls and creates message item based on validation errors
    processMessages(control: AbstractControl, controlKey: string): { [key: string]: string } {
        const messages: { [key: string]: string} = {};
        if (control['controls']) {
            Object.keys(control['controls']).forEach(controlKey => {
                if (this.validationMessages[controlKey]) {
                    messages[controlKey] = '';
                    if ((control.get(controlKey).dirty || control.get(controlKey).touched) && control.get(controlKey).errors) {
                        Object.keys(control.get(controlKey).errors).forEach(errorKey => {
                            if (this.validationMessages[controlKey][errorKey]) {
                                messages[controlKey] += this.validationMessages[controlKey][errorKey] + ' ';
                            }
                        })
                    }
                }
                const childMessages: { [key: string]: string } = this.processMessages(control.get(controlKey), controlKey)
                Object.assign(messages, childMessages);
            })
        } else {
            if (this.validationMessages[controlKey]) {
                messages[controlKey] = '';
                if ((control.dirty || control.touched) && control.errors) {
                    Object.keys(control.errors).forEach(errorKey => {
                        if (this.validationMessages[controlKey][errorKey]) {
                            messages[controlKey] += this.validationMessages[controlKey][errorKey] + ' ';
                        }
                    })
                }
            }
        }
        return messages;
    }
}
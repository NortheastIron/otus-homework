import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {

    if (!control.value?.trim()) {
        return { whitespace: true};
    }

    return null;
}
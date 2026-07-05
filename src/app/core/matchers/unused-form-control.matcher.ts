import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class UnusedFormControlMatcher implements ErrorStateMatcher {
    public isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return !!(form && control && control.invalid && (control.dirty || control.touched));
    }
}
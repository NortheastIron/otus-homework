import { Component, input, InputSignal } from '@angular/core';

@Component({
    selector: 'button[app-icon-button-class]',
    templateUrl: './icon-button.component.html',
    styleUrl: './icon-button.component.scss',
})
export class IconButtonComponent {
    public iconClass: InputSignal<string> = input.required({alias: 'app-icon-button-class'});
}

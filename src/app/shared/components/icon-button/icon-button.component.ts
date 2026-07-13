import { Component, computed, input, InputSignal, Signal } from '@angular/core';

type TypesIconsType = 'CANCEL' | 'CONFIRM';

@Component({
    selector: 'button[app-icon-button-class]',
    templateUrl: './icon-button.component.html',
    styleUrl: './icon-button.component.scss',
    host: {
        class: 'app-icon-button',
    },
})
export class IconButtonComponent {
    public iconClass: InputSignal<TypesIconsType> = input.required({ alias: 'app-icon-button-class' });

    protected computedIconClass: Signal<string> = computed(() => this.iconClass().toLowerCase());
}

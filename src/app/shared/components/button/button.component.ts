import { Component, computed, input, InputSignal, Signal } from '@angular/core';

export const TYPES_BUTTON = {
    DELETE: 'delete',
    ADD: 'add',
} as const;

type TypesButtonType = typeof TYPES_BUTTON[keyof typeof TYPES_BUTTON];

@Component({
    selector: 'button[app-button-title]',
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    host: {
        class: 'app-button',
        '[class]': 'this.typeButtonClass()',
    },
})
export class ButtonComponent {
    public title: InputSignal<string> = input.required({ alias: 'app-button-title' });
    public appButtonType: InputSignal<TypesButtonType | null> = input<TypesButtonType | null>(null);

    protected typeButtonClass: Signal<string> = computed(() => this.appButtonType() ? `app-button_${this.appButtonType()}` : '');
}

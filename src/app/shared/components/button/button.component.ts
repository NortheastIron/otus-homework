import { Component, computed, input, InputSignal, Signal } from '@angular/core';

const TYPES_BUTTON = {
    DELETE: 'DELETE',
    ADD: 'ADD',
} as const;

type TypesButtonType = typeof TYPES_BUTTON[keyof typeof TYPES_BUTTON];

@Component({
    selector: 'button[app-button-title]',
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    host: {
        class: 'app-button',
        '[class]': 'this.typeButtonClass()',
    }
})
export class ButtonComponent {
    public title: InputSignal<string> = input.required({ alias: 'app-button-title' });
    public typeButton: InputSignal<TypesButtonType | null> = input<TypesButtonType | null>(null, { alias: 'app-button-type' });

    protected typeButtonClass: Signal<string> = computed(() => {
        switch(this.typeButton()) {
            case TYPES_BUTTON.ADD:
                return 'app-button_add';
            case TYPES_BUTTON.DELETE:
                return 'app-button_delete';
            default:
                return '';
        }
    });
}

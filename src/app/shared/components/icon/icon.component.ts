import { Component, input, InputSignal } from '@angular/core';

export const TYPES_ICON = {
    INFO: 'INFO',
    SUCCESS: 'SUCCESS',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
} as const;

type TypesIcon = typeof TYPES_ICON[keyof typeof TYPES_ICON];

@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.scss',
    host: {
        class: 'app-icon',
    },
})
export class IconComponent {
    public iconType: InputSignal<TypesIcon> = input.required<TypesIcon>();

    protected typesIcon = TYPES_ICON;
}

import { Component, inject } from '@angular/core';

import { IconComponent, TYPES_ICON } from '@shared';

import { ToastService } from '@common/toasts/services';
import { TYPES_TOAST } from '@common/toasts/constants';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';

@Component({
    selector: 'app-toasts',
    templateUrl: './toasts.component.html',
    styleUrl: './toasts.component.scss',
    imports: [
        IconComponent,
        AsyncPipe,
    ],
})
export class ToastsComponent {
    protected toasts$ = inject(ToastService).toasts$.pipe(
        map(items => items.reverse()),
    );
    
    protected typesToast = TYPES_TOAST;
    protected toastToIconMap: Record<typeof TYPES_TOAST[keyof typeof TYPES_TOAST], typeof TYPES_ICON[keyof typeof TYPES_ICON]> = {
        [TYPES_TOAST.ERROR]: TYPES_ICON.ERROR,
        [TYPES_TOAST.INFO]: TYPES_ICON.INFO,
        [TYPES_TOAST.SUCCESS]: TYPES_ICON.SUCCESS,
        [TYPES_TOAST.WARNING]: TYPES_ICON.WARNING,
    };
}

import { Component, computed, inject } from '@angular/core';

import { IconComponent } from '@shared/components/icon';

import { ToastService } from '@common/toasts/services';
import { TYPES_TOAST } from '@common/toasts/constants';

@Component({
    selector: 'app-toasts',
    templateUrl: './toasts.component.html',
    styleUrl: './toasts.component.scss',
    imports: [IconComponent],
})
export class ToastsComponent {
    private toastService = inject(ToastService);
    protected revertedToasts = computed(() => [...this.toastService.toasts()].reverse());

    protected typesToast = TYPES_TOAST;
}

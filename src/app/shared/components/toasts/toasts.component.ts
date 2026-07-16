import { Component, computed, inject } from '@angular/core';

import { ToastService, TYPES_TOAST } from '@core';

import { IconComponent } from '@shared/components/icon';

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

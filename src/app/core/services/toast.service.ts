import { Injectable, signal, WritableSignal } from '@angular/core';

import { TYPES_TOAST } from '@core/constants';
import { Toast } from '@core/types';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private _toasts: WritableSignal<Toast[]> = signal([]);
    public readonly toasts = this._toasts.asReadonly();

    public show(toast: Omit<Toast, 'id'>, duration: number = 5000): void {
        if (!toast.text.trim()) {
            return;
        }

        const id = crypto.randomUUID();
        this._toasts.update(items => [
            ...items,
            {
                id,
                text: toast.text.trim(),
                type: toast.type || TYPES_TOAST.INFO
            }
        ]);

        setTimeout(() => {
            this.remove(id);
        }, duration);
    }

    private remove(id: string): void {
        this._toasts.update(items => items.filter(item => item.id !== id));
    }
}

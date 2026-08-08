import { Injectable, signal, WritableSignal } from '@angular/core';

import { Toast } from '@common/toasts/types';
import { TYPES_TOAST } from '@common/toasts/constants';

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
                type: toast.type || TYPES_TOAST.INFO,
            },
        ]);

        setTimeout(() => {
            this.remove(id);
        }, duration);
    }

    private remove(id: string): void {
        this._toasts.update(items => items.filter(item => item.id !== id));
    }
}

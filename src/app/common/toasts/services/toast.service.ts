import { Injectable } from '@angular/core';

import { Toast } from '@common/toasts/types';
import { TYPES_TOAST } from '@common/toasts/constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private _toastSubject = new BehaviorSubject<Toast[]>([]);
    public readonly toasts$ = this._toastSubject.asObservable();

    public show(toast: Omit<Toast, 'id'>, duration: number = 5000): void {
        if (!toast.text.trim()) {
            return;
        }

        const id = crypto.randomUUID();

        this._toastSubject.next([
            ...this._toastSubject.value,
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
        this._toastSubject.next([
            ...this._toastSubject.value.filter((item) => item.id !== id),
        ]);
    }
}

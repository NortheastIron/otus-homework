import { Injectable } from '@angular/core';

import { Toast } from '@core/types';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private toasts: Toast[] = [];

    public show(toast: Toast, duration: number = 5000): void {
        this.toasts.push(toast);

        setTimeout(() => {
            this.remove(toast.text);
        }, duration);
    }

    public getToasts(): Toast[] {
        return this.toasts;
    }

    private remove(text: string): void {
        this.toasts = this.toasts.filter(item => item.text !== text);
    }
}

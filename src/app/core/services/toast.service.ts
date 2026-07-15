import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private toast: string[] = [];

    public show(message: string, duration: number = 5000): void {
        this.toast.push(message);

        setTimeout(() => {
            this.remove(message);
        }, duration);
    }

    public getToast(): string[] {
        return this.toast;
    }

    private remove(toast: string): void {
        this.toast = this.toast.filter(item => item !== toast);
    }
}

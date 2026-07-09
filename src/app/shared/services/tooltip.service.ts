import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TooltipService {
    private _activeElement: WritableSignal<HTMLElement | null> = signal(null);
    public readonly activeElement = this._activeElement.asReadonly();
    
    private tooltipsList: HTMLElement[] = [];

    public enter(el: HTMLElement): void {
        this.tooltipsList.push(el);
        this.updateActive();
    }

    public leave(el: HTMLElement): void {
        this.tooltipsList = this.tooltipsList.filter(tooltipEl => tooltipEl !== el);
        this.updateActive();
    }

    private updateActive(): void {
        const element = this.tooltipsList[this.tooltipsList.length - 1] || null;
        this._activeElement.set(element);
    }
}

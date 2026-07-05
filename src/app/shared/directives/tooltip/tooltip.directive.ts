import { Directive, effect, ElementRef, inject, input, InputSignal, OnDestroy, Renderer2 } from '@angular/core';

import { TooltipService } from '@shared/services';

@Directive({
    selector: '[app-tooltip]',
    host: {
        '(mouseenter)': 'show($event)',
        '(mouseleave)': 'hide()',
        '(focus)': 'show($event)',
        '(blur)': 'hide()',
    },
})
export class TooltipDirective implements OnDestroy {
    public appTooltip: InputSignal<string> = input('', {alias: 'app-tooltip'});

    private readonly el: ElementRef<HTMLElement> = inject(ElementRef);
    private readonly renderer: Renderer2 = inject(Renderer2);
    private readonly tooltipService: TooltipService = inject(TooltipService);    
    private tooltipElement: HTMLElement | null = null;
    private tooltipEvent: MouseEvent | FocusEvent | null = null;

    constructor() {
        effect(() => {
            if (this.el.nativeElement === this.tooltipService.activeElement()) {
                this.showElement();
            } else {
                this.hideElement();
            }
        });
    }

    ngOnDestroy(): void {
        this.hide();
        this.hideElement();
    }

    protected show($event: MouseEvent | FocusEvent) {
        this.tooltipService.enter(this.el.nativeElement);
        this.tooltipEvent = $event;
    }

    protected hide() {
        this.tooltipService.leave(this.el.nativeElement);
    }

    private showElement(): void {
        if (this.tooltipElement) {
            return;
        }

        const tooltipText = this.appTooltip() || this.el.nativeElement.innerText;

        if (!tooltipText) {
            return;
        }

        this.tooltipElement = this.renderer.createElement('div');
        this.renderer.addClass(this.tooltipElement, 'app-tooltip');

        const textNode: HTMLElement = this.renderer.createText(tooltipText);

        this.renderer.appendChild(this.tooltipElement, textNode);
        this.renderer.appendChild(document.body, this.tooltipElement);
        this.setPosition();
    }

    private hideElement(): void {
        if (this.tooltipElement) {
            this.renderer.removeChild(document.body, this.tooltipElement);
            this.tooltipElement = null;
        }
    }

    private setPosition(): void {
        if (!this.tooltipElement) {
            return;
        }

        const tooltipEvent = this.tooltipEvent;
        const hostRect: DOMRect = this.el.nativeElement.getBoundingClientRect();
        const tooltipRect: DOMRect = this.tooltipElement.getBoundingClientRect();
        const viewportWidth: number = window.innerWidth;

        let top: number = hostRect.top - tooltipRect.height + window.scrollY - 10;
        let left: number = hostRect.left + (hostRect.width - tooltipRect.width) / 2 + window.scrollX;

        if (tooltipEvent instanceof MouseEvent) {
            top = tooltipEvent.clientY  - tooltipRect.height + window.scrollY - 15;
            left = tooltipEvent.clientX - tooltipRect.width / 2 + window.scrollX;
        }

        if (left - window.scrollX < 0) {
            left = window.scrollX + 15;
        } else if (left + tooltipRect.width > viewportWidth) {
            left = viewportWidth - tooltipRect.width - 15;
        }

        if (top - window.scrollY < 0) {
            top = window.scrollY + 15; 
        }

        this.renderer.setStyle(this.tooltipElement, 'top', `${ top }px`);
        this.renderer.setStyle(this.tooltipElement, 'left', `${ left }px`);
    }
}



import { Component, provideZonelessChangeDetection, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TooltipDirective } from './tooltip.directive';
import { TooltipService } from '@common/tooltip/services';

class FakeTooltipService {
    activeElement: WritableSignal<HTMLElement | null> = signal<HTMLElement | null>(null);

    enter = vi.fn((el: HTMLElement) => this.activeElement.set(el));
    leave = vi.fn((el: HTMLElement) => {
        if (this.activeElement() === el) this.activeElement.set(null);
    });
}

@Component({
    standalone: true,
    imports: [TooltipDirective],
    template: `
        <button appTooltip
                [appTooltip]="text"
                [appTooltipIsDisabled]="disabled">
            {{ inner }}
        </button>
    `,
})
class HostComponent {
    text = '';
    disabled = false;
    inner = 'Button label';
}
describe('TooltipDirective', () => {
    let fixture: ComponentFixture<HostComponent>;
    let host: HostComponent;
    let service: FakeTooltipService;
    let buttonEl: HTMLElement;
 
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [HostComponent],
            providers: [{ provide: TooltipService, useClass: FakeTooltipService }, provideZonelessChangeDetection()],
        });
        fixture = TestBed.createComponent(HostComponent);
        host = fixture.componentInstance;
        service = TestBed.inject(TooltipService) as unknown as FakeTooltipService;
        buttonEl = fixture.debugElement.query(By.directive(TooltipDirective)).nativeElement;
        await fixture.whenStable();
    });

    function tooltipInDom(): HTMLElement | null {
        return document.querySelector('.app-tooltip');
    }

    it('calls service.enter with the host element on mouseenter', () => {
        buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
        expect(service.enter).toHaveBeenCalledWith(buttonEl);
    });

    it('calls service.leace with the host element on mouseleave', () => {
        buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
        buttonEl.dispatchEvent(new MouseEvent('mouseleave'));
        expect(service.leave).toHaveBeenCalledWith(buttonEl);
    });

    it('calls service.enter on focus and service.leave on blur', () => {
        buttonEl.dispatchEvent(new FocusEvent('focus'));
        expect(service.enter).toHaveBeenCalledWith(buttonEl);
        buttonEl.dispatchEvent(new FocusEvent('blur'));
        expect(service.leave).toHaveBeenCalledWith(buttonEl);
    });

    // данный тест не доработан!!!
    // it('removes the tooltip element when another element becomes active', async () => {
    //   buttonEl.dispatchEvent(new MouseEvent('mouseenter'));
    // //   fixture.detectChanges();
    // // setTimeout(() => {
    // //     expect(tooltipInDom()).not.toBeNull();
    // // }, 1000);
    
    // // TestBed.tick();
    // fixture.detectChanges();
    // await fixture.whenStable();
    // // // await flush(5);
    // console.log(' ???? ', tooltipInDom());

    // await new Promise(resolve => setTimeout(resolve, 1000));
    //   expect(tooltipInDom()).not.toBeNull();
    // //   service.activeElement.set(document.createElement('span')); // someone else active
    // // //   fixture.detectChanges();
    // //   expect(tooltipInDom()).toBeNull();
    // });
});


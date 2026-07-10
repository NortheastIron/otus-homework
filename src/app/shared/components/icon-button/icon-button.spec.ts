import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { IconButtonComponent } from './icon-button.component';


@Component({
    template: `<button app-icon-button-class="CANCEL">X</button>`,
    imports: [IconButtonComponent],
})
class TestComponent {}

describe('IconButton', () => {
    let hostComponent: TestComponent;
    let hostFixture: ComponentFixture<TestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent, IconButtonComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestComponent);
        hostComponent = hostFixture.componentInstance;

        hostFixture.detectChanges();
    });

    it('should create TestComponent', () => {
        expect(hostComponent).toBeTruthy();
    });

    it('should render icon with class', () => {
        const iconElement = hostFixture.nativeElement.querySelector('i');
        expect(iconElement).toBeTruthy();
        expect(iconElement.classList).toContain('app-icon-button__icon_cancel');
    });
});

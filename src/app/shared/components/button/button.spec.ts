import { ComponentFixture, TestBed } from '@angular/core/testing';
import { inputBinding } from '@angular/core';

import { ButtonComponent } from './button.component';

// тут сделать на проверку с обёрткой ... ну и получается в самой кнопке сделать шаблон с тэгом а не просто {{}}
describe('Button', () => {
    let component: ButtonComponent;
    let fixture: ComponentFixture<ButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ButtonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ButtonComponent, {
            bindings: [
                inputBinding('app-button-title', () => 'TEST'),
            ],
        });
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

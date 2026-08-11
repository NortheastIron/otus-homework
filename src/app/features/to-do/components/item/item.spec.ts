import { inputBinding } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoItemComponent } from './to-do.item.component';

// т.к. изменились входные параметры можно задать тесты на проверку этого поведения

describe('Item', () => {
    let component: ToDoItemComponent;
    let fixture: ComponentFixture<ToDoItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ToDoItemComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ToDoItemComponent, {
            bindings: [
                inputBinding('isSelect', () => true),
                inputBinding('isView', () => false),
                inputBinding('data', () => ({id: 1, text: 'test', description: 'test'})),
            ],
        });
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

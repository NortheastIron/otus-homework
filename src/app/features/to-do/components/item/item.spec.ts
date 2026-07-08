import { inputBinding } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoItemComponent } from './to-do.item.component';

describe('Item', () => {
    let component: ToDoItemComponent;
    let fixture: ComponentFixture<ToDoItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ToDoItemComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ToDoItemComponent, {
            bindings: [
                inputBinding('isSelected', () => true),
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

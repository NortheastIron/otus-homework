import { Component, input, InputSignal, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher } from '@angular/material/core';

import { noWhitespaceValidator } from '@core';

import { ButtonComponent, IconButtonComponent, TYPES_BUTTON } from '@shared';

import { TooltipDirective } from '@common';

import { Task } from '@features/to-do/types';


@Component({
    selector: 'app-to-do-item',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        ButtonComponent,
        TooltipDirective,
        IconButtonComponent,
    ],
    host: {
        '(click)': 'onItemClick($event)',
        '(dblclick)': 'onItemDblClick($event)',
    },
    templateUrl: './to-do.item.component.html',
    styleUrl: './to-do.item.component.scss',
})
export class ToDoItemComponent {
    public data: InputSignal<Task> = input.required();
    public isSelect: InputSignal<boolean> = input.required();
    public isView: InputSignal<boolean> = input.required();

    public itemDelete: OutputEmitterRef<number> = output();
    public itemCheckboxChanged: OutputEmitterRef<number> = output();
    public itemSaveEdit: OutputEmitterRef<Task> = output();
    public itemClicked: OutputEmitterRef<number> = output();

    protected typesButton = TYPES_BUTTON;
    protected isEdit: WritableSignal<boolean> = signal(false);

    protected taskNameControl = new FormControl('', [noWhitespaceValidator]);
    protected defaultMatcher = new ErrorStateMatcher();

    private isSingleClickAllowed: boolean = false;
    private clickTimer: number | undefined;

    protected onRemove(): void {
        this.itemDelete.emit(this.data().id);
    }

    protected onItemClick($event: PointerEvent): void {
        const target = $event.target as HTMLElement;

        if (this.isEdit() || target.closest('input') || target.closest('button')) {
            return;
        }

        this.isSingleClickAllowed = true;

        this.clickTimer = setTimeout(() => {
            if (this.isSingleClickAllowed) {
                this.itemClicked.emit(this.data().id);
            }
        }, 200);
    }

    protected onItemDblClick($event: MouseEvent): void {
        const target = $event.target as HTMLElement;

        if (this.isEdit() || target.closest('input') || target.closest('button')) {
            return;
        }

        this.isSingleClickAllowed = false;
        clearTimeout(this.clickTimer);

        this.taskNameControl.setValue(this.data().text);
        this.isEdit.set(true);
    }

    protected onSaveChanges(): void {
        if (!this.taskNameControl.value) {
            return;
        }

        this.itemSaveEdit.emit({...this.data(), text: this.taskNameControl.value.trim()});
        this.isEdit.set(false);
    }

    protected onCancelChanges(): void {
        this.isEdit.set(false);
    }

    protected onCheckboxChanged() {
        this.itemCheckboxChanged.emit(this.data().id);
    }
}

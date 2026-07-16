import { Component, inject, input, InputSignal, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { noWhitespaceValidator, ToastService, TYPES_TOAST } from '@core';

import { ButtonComponent, IconButtonComponent, TooltipDirective, TYPES_BUTTON } from '@shared';

import { Task } from '@features/to-do/types';
import { ErrorStateMatcher } from '@angular/material/core';
import { ToDoService } from '@features/to-do/services';

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
        '(click)': 'onItemClick()',
        '(dblclick)': 'onItemDblClick()',
    },
    templateUrl: './to-do.item.component.html',
    styleUrl: './to-do.item.component.scss',
})
export class ToDoItemComponent {
    private toDoService = inject(ToDoService);
    private toastService = inject(ToastService);

    public data: InputSignal<Task> = input.required();
    public isSelected: InputSignal<boolean> = input.required();

    public itemDelete: OutputEmitterRef<number> = output();
    public itemSelect: OutputEmitterRef<number> = output();

    protected typesButton = TYPES_BUTTON;
    protected isEdited: WritableSignal<boolean> = signal(false);

    protected taskNameControl = new FormControl('', [noWhitespaceValidator]);
    protected defaultMatcher = new ErrorStateMatcher();

    private isSingleClickAllowed: boolean = false;
    private clickTimer: number | undefined;

    protected onRemove($event: PointerEvent): void {
        $event.stopPropagation();
        this.itemDelete.emit(this.data().id);
    }

    protected onItemClick(): void {
        if (this.isEdited()) {
            return;
        }

        this.isSingleClickAllowed = true;

        this.clickTimer = setTimeout(() => {
            if (this.isSingleClickAllowed) {
                this.itemSelect.emit(this.data().id);
            }
        }, 200);
    }

    protected onItemDblClick(): void {
        this.isSingleClickAllowed = false;
        clearTimeout(this.clickTimer);

        this.taskNameControl.setValue(this.data().text);
        this.isEdited.set(true);
    }

    protected onSaveChanges($event: PointerEvent): void {
        $event.stopPropagation();
        if (!this.taskNameControl.value) {
            return;
        }

        this.toDoService.updateTask({
            id: this.data().id,
            text: this.taskNameControl.value.trim(),
            description: this.data().description,
        });
        this.toastService.show({
            text: 'Toast updated!',
            type: TYPES_TOAST.SUCCESS
        });
        this.isEdited.set(false);
    }

    protected onCancelChanges($event: PointerEvent): void {
        $event.stopPropagation();
        this.isEdited.set(false);
    }
}

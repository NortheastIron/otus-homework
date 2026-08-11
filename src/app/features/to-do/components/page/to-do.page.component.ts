import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { noWhitespaceValidator } from '@core';

import {
    ButtonComponent,
    IconButtonComponent,
    TYPES_BUTTON,
    LoadingIndicatorComponent,
} from '@shared';

import { ToastService, TYPES_TOAST } from '@common/toasts'
import { TooltipDirective } from '@common/tooltip';

import { ToDoItemComponent } from '@features/to-do/components/item';
import { Task, TaskStatus } from '@features/to-do/types';
import { ToDoService } from '@features/to-do/services';
import { TASK_STATUS } from '@features/to-do/constants';


type ToDoForm = {
    taskName: FormControl<string | null>;
    taskDescription: FormControl<string | null>;
}

@Component({
    selector: 'app-to-do-page',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        ToDoItemComponent,
        ButtonComponent,
        TooltipDirective,
        IconButtonComponent,
        LoadingIndicatorComponent,
    ],
    templateUrl: './to-do.page.component.html',
    styleUrl: './to-do.page.component.scss',
})
export class ToDoPageComponent implements OnInit {
    private fb: FormBuilder = inject(FormBuilder);
    private toastService = inject(ToastService);
    private toDoService = inject(ToDoService);

    protected tasks = this.toDoService.tasks;
    protected isLoading: WritableSignal<boolean> = signal(true);
    protected isEmptyOrLoading: Signal<boolean> = computed(() => this.isLoading() || !this.tasks().length);
    protected viewItemId: WritableSignal<number | null> = signal(null); 
    protected viewItem: Signal<Task | null> = computed(() => this.tasks().find(item => item.id === this.viewItemId()) || null);
    protected form: FormGroup<ToDoForm> = this.fb.group({
        taskName: ['', [Validators.required, noWhitespaceValidator]],
        taskDescription: [''],
    });
    protected selectedIds: WritableSignal<Set<number>> = signal(new Set([]));
    protected selectedCount = computed(() => this.selectedIds().size);

    protected typesButton = TYPES_BUTTON;
    protected taskStatus = TASK_STATUS;

    ngOnInit(): void {
        setTimeout(() => {
            this.isLoading.set(false);
        }, 500);

        this.toastService.show({
            text: 'ToDo page WELCOME',
            type: TYPES_TOAST.INFO,
        });
    }

    protected onHandlerItemDelete(id: number): void {
        if (this.viewItemId() === id) {
            this.viewItemId.set(null);
        }
        this.toDoService.removeTask(id);

        this.toastService.show({
            text: `Task deleted`,
            type: TYPES_TOAST.SUCCESS,
        });
    }
    
    protected onHandlerItemClicked(id: number): void {
        this.viewItemId.set(id);
    }

    protected onHandlerItemCheckboxChanged(id: number): void {
        this.selectedIds.update(set => {
            const nSet = new Set(set);

            if (nSet.has(id)) {
                nSet.delete(id);
            } else {
                nSet.add(id);
            }

            return nSet;
        });
    }

    protected onSubmitToDoForm() {
        const { taskName, taskDescription } = this.form.value;

        if (!taskName) {
            return;
        }

        this.toDoService.addTask({
            text: taskName,
            description: taskDescription || '',
        });
        // покачто ошибок нет чисто удача

        this.toastService.show({
            text: `Task created - "${taskName}"`,
            type: TYPES_TOAST.SUCCESS,
        });

        this.form.reset();
    }

    protected onCloseDetails() {
        this.viewItemId.set(null);
    }

    protected onHandlerItemSaveEdit(task: Task) {
        this.toDoService.updateTask(task);
        this.toastService.show({
            text: `Task updated! - "${task.text}"`,
            type: TYPES_TOAST.SUCCESS,
        });
    }

    protected onStatusChange(status: TaskStatus) {
        this.toDoService.updateStatus(status, [...this.selectedIds().values()]);
        this.selectedIds.update(() => {
            return new Set();
        });
        this.toastService.show({
            text: `Status updated`,
            type: TYPES_TOAST.SUCCESS,
        });
    }
}

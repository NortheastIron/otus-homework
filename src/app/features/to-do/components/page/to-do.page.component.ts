import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
    ButtonComponent,
    IconButtonComponent,
    LoadingIndicatorComponent,
} from '@shared';

import { ToastService, TYPES_TOAST } from '@common/toasts'
import { TooltipDirective } from '@common/tooltip';

import { ToDoItemComponent } from '@features/to-do/components/item';
import { Task, TaskStatus } from '@features/to-do/types';
import { ToDoService } from '@features/to-do/services';
import { TASK_STATUS } from '@features/to-do/constants';
import { ToDoCreateItemComponent } from '@features/to-do/components/create-item';

@Component({
    selector: 'app-to-do-page',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ToDoItemComponent,
        ButtonComponent,
        TooltipDirective,
        IconButtonComponent,
        LoadingIndicatorComponent,
        ToDoCreateItemComponent,
    ],
    templateUrl: './to-do.page.component.html',
    styleUrl: './to-do.page.component.scss',
})
export class ToDoPageComponent implements OnInit {
    private toastService = inject(ToastService);
    private toDoService = inject(ToDoService);
    
    protected filteredTasks = computed(() => {
        const tasks = this.tasks();
        const status = this.selectedStatus();

        return status === null ? tasks : tasks.filter(task => task.status === status);
    });
    protected isLoading: WritableSignal<boolean> = signal(true);
    protected isEmptyOrLoading: Signal<boolean> = computed(() => this.isLoading() || !this.filteredTasks().length);
    protected viewItemId: WritableSignal<number | null> = signal(null); 
    protected viewItem: Signal<Task | null> = computed(() => this.tasks().find(item => item.id === this.viewItemId()) || null);
    protected selectedIds: WritableSignal<Set<number>> = signal(new Set([]));
    protected selectedCount = computed(() => this.selectedIds().size);
    protected selectedStatus: WritableSignal<TaskStatus | null> = signal(null);
    protected taskStatuses = [
        {value: TASK_STATUS.NEW, viewValue: 'New'},
        {value: TASK_STATUS.INPROGRESS, viewValue: 'In progress'},
        {value: TASK_STATUS.COMPLETED, viewValue: 'Completed'},
    ];

    protected TASK_STATUS = TASK_STATUS;

    private tasks = this.toDoService.tasks;

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

    protected onHandlerCreateItemSubmit(nTask: Omit<Task, 'id' | 'status'>): void {
        const { text, description } = nTask;

        this.toDoService.addTask({
            text, description
        });

        this.toastService.show({
            text: `Task created - "${text}"`,
            type: TYPES_TOAST.SUCCESS,
        });
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

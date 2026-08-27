import { Component, computed, DestroyRef, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

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
    private destroyRef = inject(DestroyRef);
    
    protected filteredTasks = computed(() => {
        const tasks = this.tasks();
        const status = this.selectedStatus();

        return status === null ? tasks : tasks.filter(task => task.status === status);
    });
    protected isLoadingTasks: Signal<boolean> = this.toDoService.isLoadingTasks;
    protected isLocalLoading: WritableSignal<boolean> = signal(false);
    protected isLoading: Signal<boolean> = computed(() => this.isLoadingTasks() || this.isLocalLoading());
    protected isEmptyOrLoading: Signal<boolean> = computed(() => this.isLoading() || !this.filteredTasks().length);
    protected viewItemId: WritableSignal<string | null> = signal(null); 
    protected viewItem: Signal<Task | null> = computed(() => this.filteredTasks().find(item => item.id === this.viewItemId()) || null);
    protected selectedIds: WritableSignal<Set<string>> = signal(new Set([]));
    protected selectedCount = computed(() => this.selectedIds().size);
    protected selectedStatus: WritableSignal<TaskStatus | null> = signal(null);
    protected taskStatuses = [
        {value: TASK_STATUS.NEW, viewValue: 'New'},
        {value: TASK_STATUS.INPROGRESS, viewValue: 'In progress'},
        {value: TASK_STATUS.COMPLETED, viewValue: 'Completed'},
    ];
    protected errorMessage: WritableSignal<string> = signal('');

    protected TASK_STATUS = TASK_STATUS;

    private tasks = this.toDoService.tasks;

    ngOnInit(): void {
        this.toDoService.loadTasks().pipe(
            takeUntilDestroyed(this.destroyRef),
        ).subscribe({
            error: (err) => {
                console.error(err);

                this.errorMessage.set(err.message || 'Произошла ошибка в загрузке данных');

                this.toastService.show({
                    text: `Tasks loading error`,
                    type: TYPES_TOAST.ERROR,
                });
            }
        });

        this.toastService.show({
            text: 'ToDo page WELCOME',
            type: TYPES_TOAST.INFO,
        });
    }

    protected onHandlerItemDelete(id: string): void {
        this.isLocalLoading.set(true);

        this.toDoService.removeTask(id).pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => {
                this.isLocalLoading.set(false);
            }),
        ).subscribe({
            next: (deletedTask) => {
                if (this.viewItemId() === id) {
                    this.viewItemId.set(null);
                }

                if (this.selectedIds().has(id)) {
                    this.updateSelectedIds(id);
                }

                this.toastService.show({
                    text: `Task "${deletedTask.text}" deleted`,
                    type: TYPES_TOAST.SUCCESS,
                });
            },
            error: (err) => {
                console.error(err);

                this.toastService.show({
                    text: `Task delete error`,
                    type: TYPES_TOAST.ERROR,
                });
            },
        });
    }
    
    protected onHandlerItemClicked(id: string): void {
        this.viewItemId.set(id);
    }

    protected onHandlerItemCheckboxChanged(id: string): void {
        this.updateSelectedIds(id);
    }

    protected onHandlerCreateItemSubmit(nTask: Omit<Task, 'id' | 'status'>): void {
        const { text, description } = nTask;

        this.isLocalLoading.set(true);

        this.toDoService.addTask({
            text, description,
        }).pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => {
                this.isLocalLoading.set(false);
            }),
        ).subscribe({
            next: (addedTask) => {
                this.toastService.show({
                    text: `Task created - "${addedTask.text}"`,
                    type: TYPES_TOAST.SUCCESS,
                });
            },
            error: (err) => {
                console.error(err);

                this.toastService.show({
                    text: `Task creation error`,
                    type: TYPES_TOAST.ERROR,
                });
            },
        });
    }

    protected onCloseDetails() {
        this.viewItemId.set(null);
    }

    protected onHandlerItemSaveEdit(task: Task) {
        this.isLocalLoading.set(true);

        this.toDoService.updateTask(task).pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => {
                this.isLocalLoading.set(false);
            }),
        ).subscribe({
            next: (updatedTask) => {
                this.toastService.show({
                    text: `Task updated - "${updatedTask.text}"`,
                    type: TYPES_TOAST.SUCCESS,
                });
            },
            error: (err) => {
                console.error(err);

                this.toastService.show({
                    text: `Task update error`,
                    type: TYPES_TOAST.ERROR,
                });
            },
        });
    }

    protected onStatusChange(status: TaskStatus) {
        this.isLocalLoading.set(true);

        this.toDoService.updateStatus(status, [...this.selectedIds().values()]).pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => {
                this.isLocalLoading.set(false);
            }),
        ).subscribe(res => {
            const successArr = res.filter(item => item.success);

            if (successArr.length === res.length) {
                this.selectedIds.set(new Set());
                this.toastService.show({
                    text: `Status updated`,
                    type: TYPES_TOAST.SUCCESS,
                });
            } else if (successArr.length > 0) {
                const successIds = successArr.map(item => item.id);
                this.deleteIdsFromSelectedIds(successIds);
                this.toastService.show({
                    text: `Status partially updated`,
                    type: TYPES_TOAST.WARNING,
                });
            } else {
                this.toastService.show({
                    text: `Status not updated`,
                    type: TYPES_TOAST.ERROR,
                });
            }
        });
    }

    protected onSelectionStatusChange() {
        if (this.viewItemId() && this.viewItem() === null) {
            this.viewItemId.set(null);
        }

        const selected = this.selectedIds();

        if (selected.size) {
            const filteredTasksIdsSet = new Set(this.filteredTasks().map(task => task.id));
            const extraIds: string[] = [];

            for (const id of selected) {
                if (!filteredTasksIdsSet.has(id)) {
                    extraIds.push(id);
                }
            }

            if (extraIds.length) {
                if (extraIds.length === selected.size) {
                    this.selectedIds.set(new Set());
                } else {
                    this.deleteIdsFromSelectedIds(extraIds);
                }
            }
        }
    }

    private updateSelectedIds(id: string): void {
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

    private deleteIdsFromSelectedIds(ids: string[]): void {
        this.selectedIds.update(set => {
            const nSet = new Set(set);

            for (const id of ids) {
                nSet.delete(id);
            }

            return nSet;
        });
    }
}

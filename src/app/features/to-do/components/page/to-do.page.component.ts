import { 
    Component,
    computed,
    DestroyRef,
    inject,
    OnDestroy,
    OnInit,
    OutputRefSubscription,
    Signal,
    signal,
    WritableSignal,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { filter, finalize, map } from 'rxjs';

import {
    ButtonComponent,
    LoadingIndicatorComponent,
} from '@shared';

import { ToastService, TYPES_TOAST } from '@common/toasts'
import { TooltipDirective } from '@common/tooltip';

import { ToDoItemComponent } from '@features/to-do/components/item';
import { Task, TaskStatus } from '@features/to-do/types';
import { ToDoService } from '@features/to-do/services';
import { REG_URL_TASKID, TASK_STATUS, TASKS_PAGE_URL } from '@features/to-do/constants';
import { ToDoCreateItemComponent } from '@features/to-do/components/create-item';
import { ToDoDetailsComponent } from '@features/to-do/components/details';

type possibleRouteComponents = ToDoDetailsComponent;

@Component({
    selector: 'app-to-do-page',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ToDoItemComponent,
        ButtonComponent,
        TooltipDirective,
        LoadingIndicatorComponent,
        ToDoCreateItemComponent,
        RouterOutlet,
    ],
    templateUrl: './to-do.page.component.html',
    styleUrl: './to-do.page.component.scss',
})
export class ToDoPageComponent implements OnInit, OnDestroy {
    private toastService = inject(ToastService);
    private toDoService = inject(ToDoService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
        
    private viewIdRexExp = new RegExp(REG_URL_TASKID);
    
    protected filteredTasks = computed(() => {
        const tasks = this.tasks();
        const status = this.selectedStatus();

        return status === null ? tasks : tasks.filter(task => task.status === status);
    });
    protected isLoadingTasks: Signal<boolean> = this.toDoService.isLoadingTasks;
    protected isLocalLoading: WritableSignal<boolean> = signal(false);
    protected isLoading: Signal<boolean> = computed(() => this.isLoadingTasks() || this.isLocalLoading());
    protected isEmptyOrLoading: Signal<boolean> = computed(() => this.isLoading() || !this.filteredTasks().length);
    protected selectedIds: WritableSignal<Set<string>> = signal(new Set([]));
    protected selectedCount = computed(() => this.selectedIds().size);
    protected selectedStatus: WritableSignal<TaskStatus | null> = signal(null);
    protected taskStatuses = [
        {value: TASK_STATUS.NEW, viewValue: 'New'},
        {value: TASK_STATUS.INPROGRESS, viewValue: 'In progress'},
        {value: TASK_STATUS.COMPLETED, viewValue: 'Completed'},
    ];
    protected errorMessage: WritableSignal<string> = signal('');
    protected viewTaskId = toSignal(this.router.events.pipe(
        filter(ev => ev instanceof NavigationEnd),
        map(ev => this.viewIdRexExp.exec(ev.urlAfterRedirects)?.[1]),
    ), { initialValue: this.viewIdRexExp.exec(this.router.url)?.[1]});
    protected TASK_STATUS = TASK_STATUS;

    private tasks = this.toDoService.tasks;
    private toDoDetailsCloseSub: OutputRefSubscription | null = null;

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
            },
        });

        this.toastService.show({
            text: 'ToDo page WELCOME',
            type: TYPES_TOAST.INFO,
        });
    }

    ngOnDestroy() {
        this.toDoDetailsCloseSub?.unsubscribe();
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
                if (this.viewTaskId() === id) {
                    this.goToTasks();
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
        this.router.navigate([id], { relativeTo: this.route });
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
        const viewItemId = this.viewTaskId();

        if (viewItemId) {
            const viewTask = this.filteredTasks().find(item => item.id === viewItemId);

            if (!viewTask) {
                this.goToTasks();
            }
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

    protected onActivateRouterComponent(component: possibleRouteComponents) {
        this.toDoDetailsCloseSub?.unsubscribe();

        if (component instanceof ToDoDetailsComponent) {
            this.toDoDetailsCloseSub = (component as ToDoDetailsComponent).detailsClose.subscribe(() => {
                this.goToTasks();
            });
        }
    }

    protected onDeactivateRouterComponent(component: possibleRouteComponents) {
        if (component instanceof ToDoDetailsComponent) {
            this.toDoDetailsCloseSub?.unsubscribe();
            this.toDoDetailsCloseSub = null;
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

    private goToTasks() {
        this.router.navigate([TASKS_PAGE_URL]);
    }
}

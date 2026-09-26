import {
    Component,
    computed,
    DestroyRef,
    inject,
    OnDestroy,
    OutputRefSubscription,
    Signal,
    signal,
    WritableSignal,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { filter, finalize, map } from 'rxjs';

import { ToastService, TooltipDirective, TYPES_TOAST } from '@common';

import { ButtonComponent, LoadingIndicatorComponent } from '@shared';

import { ToDoItemComponent } from '@features/to-do/components/item';
import { ToDoCreateItemComponent } from '@features/to-do/components/create-item';
import { Task, TaskStatus } from '@features/to-do/types';
import { BACKLOG_PAGE_URL, REG_URL_TASKID, TASK_STATUS } from '@features/to-do/constants';
import { ToDoService } from '@features/to-do/services';
import { ToDoDetailsComponent } from '@features/to-do/components/details';

type possibleRouteComponents = ToDoDetailsComponent;

@Component({
  selector: 'app-to-do-backlog',
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
  templateUrl: './to-do.backlog.component.html',
  styleUrl: './to-do.backlog.component.scss',
})
export class ToDoBacklogComponent implements OnDestroy {

    private toDoService = inject(ToDoService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toastService = inject(ToastService);    
    private destroyRef = inject(DestroyRef);
    private viewIdRexExp = new RegExp(REG_URL_TASKID);

    protected selectedStatus: WritableSignal<TaskStatus | null> = signal(null);
    protected taskStatuses = [
        {value: TASK_STATUS.NEW, viewValue: 'New'},
        {value: TASK_STATUS.INPROGRESS, viewValue: 'In progress'},
        {value: TASK_STATUS.COMPLETED, viewValue: 'Completed'},
    ];
    protected TASK_STATUS = TASK_STATUS;
    protected filteredTasks = computed(() => {
        const tasks = this.tasks();
        const status = this.selectedStatus();

        return status === null ? tasks : tasks.filter(task => task.status === status);
    });
    protected isLoadingTasks: Signal<boolean> = this.toDoService.isLoadingTasks;
    protected isLocalLoading: WritableSignal<boolean> = signal(false);
    protected isLoading: Signal<boolean> = computed(() => this.isLoadingTasks() || this.isLocalLoading());
    protected isEmptyOrLoading: Signal<boolean> = computed(() => this.isLoading() || !!this.errorMessage() || !this.tasks().length);
    protected viewTaskId = toSignal(this.router.events.pipe(
        filter(ev => ev instanceof NavigationEnd),
        map(ev => this.viewIdRexExp.exec(ev.urlAfterRedirects)?.[1]),
    ), { initialValue: this.viewIdRexExp.exec(this.router.url)?.[1]});
    protected selectedIds: WritableSignal<Set<string>> = signal(new Set([]));
    protected selectedCount = computed(() => this.selectedIds().size);
    protected errorMessage = this.toDoService.errorMessage;
    protected tasks = toSignal(this.toDoService.tasks$, { initialValue: [] });

    private toDoDetailsCloseSub: OutputRefSubscription | null = null;


    ngOnDestroy() {
        this.toDoDetailsCloseSub?.unsubscribe();
    }
    
    protected onSelectionStatusChange() {
        const viewItemId = this.viewTaskId();
        const tasks = this.tasks();

        if (viewItemId) {
            const viewTask = tasks.find(item => item.id === viewItemId);

            if (!viewTask) {
                this.goToBacklog();
            }
        }

        const selected = this.selectedIds();

        if (selected.size) {

            const tasksIdsSet = new Set(tasks.map(task => task.id));
            const extraIds: string[] = [];

            for (const id of selected) {
                if (!tasksIdsSet.has(id)) {
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

    protected onHandlerItemDelete(id: string): void {
        this.isLocalLoading.set(true);

        this.toDoService.remove(id).pipe(
            takeUntilDestroyed(this.destroyRef),
            finalize(() => {
                this.isLocalLoading.set(false);
            }),
        ).subscribe({
            next: (deletedTask) => {
                if (this.viewTaskId() === id) {
                    this.goToBacklog();
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

        this.toDoService.add({
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

        this.toDoService.update(task).pipe(
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



    protected onActivateRouterComponent(component: possibleRouteComponents) {
        this.toDoDetailsCloseSub?.unsubscribe();

        if (component instanceof ToDoDetailsComponent) {
            this.toDoDetailsCloseSub = (component as ToDoDetailsComponent).detailsClose.subscribe(() => {
                this.goToBacklog();
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

    private goToBacklog() {
        this.router.navigate([BACKLOG_PAGE_URL]);
    }

}

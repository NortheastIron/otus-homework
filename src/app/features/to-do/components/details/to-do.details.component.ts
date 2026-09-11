import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { map } from 'rxjs';

import { IconButtonComponent, LoadingIndicatorComponent } from '@shared';

import { ToDoService } from '@features/to-do/services';
import { Task } from '@features/to-do/types';
import { TASK_STATUS, TASKS_PAGE_URL } from '@features/to-do/constants';

@Component({
    selector: 'app-to-do-details',
    imports: [
        IconButtonComponent,
        LoadingIndicatorComponent,
    ],
    templateUrl: './to-do.details.component.html',
    styleUrl: './to-do.details.component.scss',
})
export class ToDoDetailsComponent {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private toDoService = inject(ToDoService);

    protected task: WritableSignal<Task | null> = signal(null);
    protected isLoading = signal(false);
    protected taskStatuses = {
        [TASK_STATUS.NEW]: 'New',
        [TASK_STATUS.INPROGRESS]: 'In progress',
        [TASK_STATUS.COMPLETED]: 'Completed',
    };

    private id = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));

    constructor() {
        effect(() => {
            this.isLoading.set(true);

            const id = this.id();
            const isLoadingTasks = this.toDoService.isLoadingTasks();

            if (!id || isLoadingTasks) {
                return;
            }

            const task = this.toDoService.get(id);

            if (!task) {
                this.goToTasks();
            }
            this.task.set(task);
            this.isLoading.set(false);
        })
    }

    protected onCloseDetails() {
        this.goToTasks();
    }

    private goToTasks() {
        this.router.navigate([TASKS_PAGE_URL]);
    }
}

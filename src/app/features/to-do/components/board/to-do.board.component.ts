import { Component, computed, inject, Signal } from '@angular/core';

import { LoadingIndicatorComponent } from '@shared';

import { TASK_STATUS } from '@features/to-do/constants';
import { ToDoService } from '@features/to-do/services';

@Component({
    selector: 'app-to-do-board',
    imports: [LoadingIndicatorComponent],
    templateUrl: './to-do.board.component.html',
    styleUrl: './to-do.board.component.scss',
})
export class ToDoBoardComponent {
    private toDoService = inject(ToDoService);

    protected taskStatuses = [
        {value: TASK_STATUS.NEW, viewValue: 'New'},
        {value: TASK_STATUS.INPROGRESS, viewValue: 'In progress'},
        {value: TASK_STATUS.COMPLETED, viewValue: 'Completed'},
    ];
    protected errorMessage = this.toDoService.errorMessage;
    protected tasksByStatus = computed(() => {
        const tasks = this.tasks();

        return tasks.reduce((acc, task) => {
            acc[task.status].push(task);
            return acc;
        }, {
            [TASK_STATUS.NEW]: [] as typeof tasks,
            [TASK_STATUS.INPROGRESS]: [] as typeof tasks,
            [TASK_STATUS.COMPLETED]: [] as typeof tasks,
        });
    });

    protected isLoadingTasks: Signal<boolean> = this.toDoService.isLoadingTasks;
    protected isEmptyOrLoading: Signal<boolean> = computed(() => this.isLoadingTasks() || !!this.errorMessage());

    private tasks = this.toDoService.tasks;
}

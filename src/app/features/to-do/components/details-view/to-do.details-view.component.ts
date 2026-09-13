import { Component, input } from '@angular/core';

import { Task } from '@features/to-do/types';
import { TASK_STATUS } from '@features/to-do/constants';

@Component({
    selector: 'app-to-do-details-view',
    templateUrl: './to-do.details-view.component.html',
    styleUrl: './to-do.details-view.component.scss',
})
export class ToDoDetailsViewComponent {

    public data = input.required<Task>();

    protected taskStatuses = {
        [TASK_STATUS.NEW]: 'New',
        [TASK_STATUS.INPROGRESS]: 'In progress',
        [TASK_STATUS.COMPLETED]: 'Completed',
    };
}

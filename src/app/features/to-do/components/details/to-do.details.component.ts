import {
    Component,
    computed,
    effect,
    inject,
    input,
    output,
    OutputEmitterRef,
    Signal,
    signal,
    WritableSignal
} from '@angular/core';

import { IconButtonComponent, LoadingIndicatorComponent } from '@shared';

import { ToDoService } from '@features/to-do/services';
import { Task } from '@features/to-do/types';
import { ToDoDetailsViewComponent } from '@features/to-do/components/details-view';

@Component({
    selector: 'app-to-do-details',
    imports: [
        IconButtonComponent,
        LoadingIndicatorComponent,
        ToDoDetailsViewComponent,
    ],
    templateUrl: './to-do.details.component.html',
    styleUrl: './to-do.details.component.scss',
})
export class ToDoDetailsComponent {
    private readonly toDoService = inject(ToDoService);

    public id = input.required<string>();

    public detailsClose: OutputEmitterRef<void> = output();

    protected task: WritableSignal<Task | null> = signal(null);
    protected isLoading = signal(false);
    protected isEmptyOrLoading: Signal<boolean> = computed(() => this.isLoading() || !this.task());

    constructor() {
        effect(() => {
            this.isLoading.set(true);

            const id = this.id();
            const isLoadingTasks = this.toDoService.isLoadingTasks();

            if (!id || isLoadingTasks) {
                return;
            }

            const task = this.toDoService.getTaskById(id);

            if (!task) {
                this.onCloseDetails();
            }

            this.task.set(task);
            this.isLoading.set(false);
        })
    }

    protected onCloseDetails() {
        this.detailsClose.emit();
    }
}

import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToDoItemComponent } from '@features';
import { Task, TaskEvent } from '@features/to-do/types';

@Component({
    selector: 'app-to-do-list',
    imports: [
    FormsModule,
    ToDoItemComponent
],
    templateUrl: './to-do.list.component.html',
    styleUrl: './to-do.list.component.scss',
})
export class ToDoListComponent {
    protected tasks: WritableSignal<Task[]> = signal([]);
    protected taskName: string = '';

    protected onAddTask(): void {
        this.tasks.update((items: Task[]) => [...items, {id: crypto.randomUUID(), name: this.taskName}]);
        this.taskName = '';
    }

    protected onHandlerItemEvent(event: TaskEvent): void {

    }
}

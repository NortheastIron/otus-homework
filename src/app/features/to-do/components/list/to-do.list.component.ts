import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppEvents } from '@core';

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
    protected taskText: string = '';

    protected onAddTask(): void {
        this.tasks.update((items: Task[]) => [...items, {id: crypto.randomUUID(), text: this.taskText}]);
        this.taskText = '';
    }

    protected onHandlerItemEvent(event: TaskEvent): void {
        if (event.type === AppEvents.REMOVE) {
            const tasks = this.tasks().filter(item => item.id !== event.id);
            this.tasks.update(_items => tasks);
        }
    }
}

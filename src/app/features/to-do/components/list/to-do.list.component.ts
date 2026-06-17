import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import { AppEvents } from '@core';

import { ToDoItemComponent } from '@features';
import { Task, TaskEvent } from '@features/to-do/types';

@Component({
    selector: 'app-to-do-list',
    imports: [
        FormsModule,
        ToDoItemComponent,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './to-do.list.component.html',
    styleUrl: './to-do.list.component.scss'
})
export class ToDoListComponent {
    protected tasks: WritableSignal<Task[]> = signal([
        {
            // id: 'o-1-n-e', //c1
            id: 1,
            text: 'One'
        }
    ]);
    protected taskText: string = '';

    protected onAddTask(): void {
        let maxId: number = 1;

        this.tasks().forEach(item => {
            maxId = Math.max(item.id + 1, maxId);
        });
        // this.tasks.update((items: Task[]) => [...items, {id: crypto.randomUUID(), text: this.taskText}]); //c1
        this.tasks.update((items: Task[]) => [...items, {id: maxId, text: this.taskText}]);
        this.taskText = '';
    }

    protected onHandlerItemEvent(event: TaskEvent): void {
        if (event.type === AppEvents.REMOVE) {
            const tasks = this.tasks().filter(item => item.id !== event.id);
            this.tasks.update(_items => tasks);
        }
    }
}

/*
//c1 - судя по заданию id это число ..  пока что закомитил randomUUID мб в будущем вернусь к этому решению
*/
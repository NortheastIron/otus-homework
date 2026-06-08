import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

import { AppEvents } from '@core';

import { Task, TaskEvent } from '@features/to-do/types';

@Component({
    selector: 'app-to-do-item',
    imports: [],
    templateUrl: './to-do.item.component.html',
    styleUrl: './to-do.item.component.scss',
})
export class ToDoItemComponent {
    public data: InputSignal<Task> = input.required();
    public itemEvent: OutputEmitterRef<TaskEvent> = output();

    protected onRemove() {
        this.itemEvent.emit({
            type: AppEvents.REMOVE,
            id: this.data().id
        });
    }
}

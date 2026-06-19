import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

import { Task } from '@features/to-do/types';

@Component({
    selector: 'app-to-do-item',
    imports: [],
    templateUrl: './to-do.item.component.html',
    styleUrl: './to-do.item.component.scss',
})
export class ToDoItemComponent {
    public data: InputSignal<Task> = input.required();
    public itemDeleteEvent: OutputEmitterRef<number> = output();

    protected onRemove(): void {
        this.itemDeleteEvent.emit(this.data().id);
    }
}

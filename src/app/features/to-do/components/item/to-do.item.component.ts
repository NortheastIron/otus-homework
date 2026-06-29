import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

import { Task } from '@features/to-do/types';
import { ButtonComponent } from '@shared';

@Component({
    selector: 'app-to-do-item',
    imports: [
        ButtonComponent,
    ],
    templateUrl: './to-do.item.component.html',
    styleUrl: './to-do.item.component.scss',
})
export class ToDoItemComponent {
    public data: InputSignal<Task> = input.required();
    public itemDelete: OutputEmitterRef<number> = output();

    protected onRemove(): void {
        this.itemDelete.emit(this.data().id);
    }
}

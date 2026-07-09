import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

import { Task } from '@features/to-do/types';
import { ButtonComponent, TooltipDirective } from '@shared';

@Component({
    selector: 'app-to-do-item',
    imports: [
        ButtonComponent,
        TooltipDirective,
    ],
    host: {
        '(click)': 'onItemClick()',
    },
    templateUrl: './to-do.item.component.html',
    styleUrl: './to-do.item.component.scss',
})
export class ToDoItemComponent {
    public data: InputSignal<Task> = input.required();
    public isSelected: InputSignal<boolean> = input.required();

    public itemDelete: OutputEmitterRef<number> = output();
    public itemSelect: OutputEmitterRef<number> = output();

    protected onRemove($event: PointerEvent): void {
        $event.stopPropagation();
        this.itemDelete.emit(this.data().id);
    }

    protected onItemClick(): void {
        this.itemSelect.emit(this.data().id);
    }
}

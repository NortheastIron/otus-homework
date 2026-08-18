import { Component, inject, output, OutputEmitterRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { noWhitespaceValidator } from '@core';

import { TooltipDirective } from '@common';

import { ButtonComponent, TYPES_BUTTON } from '@shared';

import { Task } from '@features/to-do/types';

type ToDoForm = {
    taskName: FormControl<string | null>;
    taskDescription: FormControl<string | null>;
}

@Component({
    selector: 'app-to-do-create-item',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        ButtonComponent,
        TooltipDirective,
    ],
    templateUrl: './to-do.create-item.component.html',
    styleUrl: './to-do.create-item.component.scss',
    host: {
        class: 'app-to-do-create-item',
    },
})
export class ToDoCreateItemComponent {
    private fb: FormBuilder = inject(FormBuilder);

    public createItemSubmit: OutputEmitterRef<Omit<Task, 'id' | 'status'>> = output();

    protected TYPES_BUTTON = TYPES_BUTTON;
    protected form: FormGroup<ToDoForm> = this.fb.group({
        taskName: ['', [Validators.required, noWhitespaceValidator]],
        taskDescription: [''],
    });

    protected onSubmitToDoForm() {
        const { taskName, taskDescription } = this.form.value;

        if (!taskName) {
            return;
        }

        this.createItemSubmit.emit({text: taskName, description: taskDescription || ''});
        this.form.reset();
    }

}

import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ButtonComponent, IconButtonComponent, TooltipDirective } from '@shared';

import { ToDoItemComponent } from '@features/to-do/components/item';
import { Task } from '@features/to-do/types';

type ToDoForm = {
    taskName: FormControl<string | null>;
    taskDescription: FormControl<string | null>;
}

@Component({
  selector: 'app-to-do-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ToDoItemComponent,
    ButtonComponent,
    TooltipDirective,
    IconButtonComponent,
  ],
  templateUrl: './to-do.page.component.html',
  styleUrl: './to-do.page.component.scss',
})
export class ToDoPageComponent implements OnInit {
    private fb: FormBuilder = inject(FormBuilder);

    protected tasks: WritableSignal<Task[]> = signal([
        {
            id: 1,
            text: 'First',
            description: 'First task',
        },
    ]);
    protected isLoading: WritableSignal<boolean> = signal(true);
    protected isEmptyOrLoading: Signal<boolean> = computed(() => this.isLoading() || !this.tasks().length);
    protected selectedItemId: WritableSignal<number | null> = signal(null); 
    protected selectedItem: Signal<Task | null> = computed(() => this.tasks().find(item => item.id === this.selectedItemId()) || null);
    protected form: FormGroup<ToDoForm> = this.fb.group({
        taskName: ['', [Validators.required, this.noWhitespaceValidator]],
        taskDescription: [''],
    });

    ngOnInit(): void {
        setTimeout(() => {
            this.isLoading.set(false);
        }, 500);
    }

    protected onHandlerItemDelete(id: number): void {
        if (this.selectedItemId() === id) {
            this.selectedItemId.set(null);
        }
        this.tasks.update(items => items.filter(item => item.id !== id));
    }
    
    protected onHandlerItemSelected(id: number): void {
        this.selectedItemId.set(id);
    }

    protected onSubmitToDoForm() {
        const { taskName, taskDescription } = this.form.value;

        if (!taskName) {
            return;
        }

        const maxId: number = Math.max(1, ...this.tasks().map(item => item.id + 1));

        this.tasks.update((items: Task[]) => [
            ...items,
            {
                id: maxId,
                text: taskName.trim(),
                description: taskDescription?.trim() || '',
            },
        ]);
        this.form.reset();
    }

    protected onCloseDetails() {
        this.selectedItemId.set(null);
    }

    private noWhitespaceValidator(control: FormControl): Record<string, boolean> | null {

        if (!control.value?.trim()) {
            return { whitespace: true};
        }

        return null;
    }
}

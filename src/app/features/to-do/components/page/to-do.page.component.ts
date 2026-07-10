import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { noWhitespaceValidator } from '@core';

import { ButtonComponent, IconButtonComponent, TooltipDirective, TYPES_BUTTON } from '@shared';

import { ToDoItemComponent } from '@features/to-do/components/item';
import { Task } from '@features/to-do/types';
import { ToDoService } from '@features/to-do/services';


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

    protected toDoService = inject(ToDoService);
    protected tasks = this.toDoService.tasks;
    protected isLoading: WritableSignal<boolean> = signal(true);
    protected isEmptyOrLoading: Signal<boolean> = computed(() => this.isLoading() || !this.tasks().length);
    protected selectedItemId: WritableSignal<number | null> = signal(null); 
    protected selectedItem: Signal<Task | null> = computed(() => this.tasks().find(item => item.id === this.selectedItemId()) || null);
    protected form: FormGroup<ToDoForm> = this.fb.group({
        taskName: ['', [Validators.required, noWhitespaceValidator]],
        taskDescription: [''],
    });

    protected typesButton = TYPES_BUTTON;

    ngOnInit(): void {
        setTimeout(() => {
            this.isLoading.set(false);
        }, 500);
    }

    protected onHandlerItemDelete(id: number): void {
        if (this.selectedItemId() === id) {
            this.selectedItemId.set(null);
        }
        this.toDoService.removeTask(id);
    }
    
    protected onHandlerItemSelected(id: number): void {
        this.selectedItemId.set(id);
    }

    protected onSubmitToDoForm() {
        const { taskName, taskDescription } = this.form.value;

        if (!taskName) {
            return;
        }

        this.toDoService.addTask({
            text: taskName,
            description: taskDescription || ''
        });
        this.form.reset();
    }

    protected onCloseDetails() {
        this.selectedItemId.set(null);
    }
}

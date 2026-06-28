import { Component, computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import { ButtonComponent } from '@shared';

import { ToDoItemComponent } from '@features';
import { Task } from '@features/to-do/types';

@Component({
    selector: 'app-to-do-list',
    imports: [
        FormsModule,
        ToDoItemComponent,
        MatFormFieldModule,
        MatInputModule,
        ButtonComponent,
    ],
    templateUrl: './to-do.list.component.html',
    styleUrl: './to-do.list.component.scss',
})
export class ToDoListComponent implements OnInit {
    protected tasks: WritableSignal<Task[]> = signal([
        {
            id: 1,
            text: 'One',
        },
    ]);
    protected taskText: string = '';
    protected isLoading: WritableSignal<boolean> = signal(true);
    protected isEmptyOrLoading: Signal<boolean> = computed(() => this.isLoading() || !this.tasks().length);

    ngOnInit(): void {
        setTimeout(() => {
            this.isLoading.set(false);
        }, 500);
    }

    protected onAddTask(): void {
        const maxId: number = Math.max(1, ...this.tasks().map(item => item.id + 1));

        this.tasks.update((items: Task[]) => [...items, {id: maxId, text: this.taskText.trim()}]);
        this.taskText = '';
    }

    protected onHandlerItemDelete(id: number): void {
        this.tasks.update(items => items.filter(item => item.id !== id));
    }
}
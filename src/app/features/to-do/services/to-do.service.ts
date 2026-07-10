import { Injectable, signal, WritableSignal } from '@angular/core';

import { Task } from '@features/to-do/types';

@Injectable({
    providedIn: 'root',
})
export class ToDoService {
    private _tasks: WritableSignal<Task[]> = signal([
        {
            id: 1,
            text: 'First',
            description: 'First task',
        },
    ]);

    public readonly tasks = this._tasks.asReadonly();

    public addTask(task: Omit<Task, 'id'>): void {
        const maxId: number = Math.max(1, ...this._tasks().map(item => item.id + 1));

        this._tasks.update((items: Task[]) => [
            ...items,
            {
                id: maxId,
                text: task.text.trim(),
                description: task.description.trim(),
            },
        ]);
    }

    public removeTask(id: number): void {
        this._tasks.update(items => items.filter(item => item.id !== id));
    }

    public updateTask(task: Task): void {
        this._tasks.update(items => items.map(item => item.id === task.id ? { ...task } : item));
    }
}

import { Injectable, signal, WritableSignal } from '@angular/core';

import { Task, TaskStatus } from '@features/to-do/types';
import { TASK_STATUS } from '@features/to-do/constants';

@Injectable({
    providedIn: 'root',
})
export class ToDoService {
    private _tasks: WritableSignal<Task[]> = signal([
        {
            id: 1,
            text: 'First',
            description: 'First task',
            status: TASK_STATUS.INPROGRESS,
        },
    ]);

    public readonly tasks = this._tasks.asReadonly();

    public addTask(task: Omit<Task, 'id' | 'status'>): void {
        const nextId: number = Math.max(1, ...this._tasks().map(item => item.id + 1));

        this._tasks.update((items: Task[]) => [
            ...items,
            {
                id: nextId,
                text: task.text.trim(),
                description: task.description.trim(),
                status: TASK_STATUS.NEW,
            },
        ]);
    }

    public removeTask(id: number): void {
        this._tasks.update(items => items.filter(item => item.id !== id));
    }

    public updateTask(task: Task): void {
        this._tasks.update(items => items.map(item => item.id === task.id ? { ...task } : item));
    }

    public updateStatus(status: TaskStatus, ids: number[]) {
        this._tasks.update(items => items.map(item => ids.includes(item.id) ? { ...item, status } : item));
    }
}

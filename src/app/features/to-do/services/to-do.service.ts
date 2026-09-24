import { Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, finalize, from, map, mergeMap, Observable, of, tap, toArray } from 'rxjs';

import { AbstractHttpService } from '@core';

import { Task, TaskStatus } from '@features/to-do/types';
import { TASK_STATUS } from '@features/to-do/constants';

@Injectable({
    providedIn: 'root',
})
export class ToDoService extends AbstractHttpService<Task, Omit<Task, 'id'>> {
    private _tasks: WritableSignal<Task[]> = signal([]);
    private _isLoadingTasks: WritableSignal<boolean> = signal(false);
    private _errorMessage: WritableSignal<string> = signal('');

    public readonly tasks = this._tasks.asReadonly();
    public readonly isLoadingTasks = this._isLoadingTasks.asReadonly();
    public readonly errorMessage = this._errorMessage.asReadonly();

    constructor() {
        super();
        this.setApiUrl('/tasks');
    }

    public loadTasks(): Observable<Task[]> {
        this._isLoadingTasks.set(true);

        return this.all().pipe(
            tap({
                next: tasks => this._tasks.set(tasks),
                error: err => this._errorMessage.set(err.message),
            }),
            finalize(() => {
                this._isLoadingTasks.set(false);
            }),
        );
    }

    public getTaskById(id: string): Task | null {
        return this._tasks().find(task => task.id === id) || null;
    }

    public override add(task: Omit<Task, 'id' | 'status'>): Observable<Task> {
        return super.add({
            text: task.text.trim(),
            description: task.description.trim(),
            status: TASK_STATUS.NEW,
        }).pipe(
            tap({
                next: (nTask) => {
                    this._tasks.update((items: Task[]) => [
                        ...items,
                        nTask,
                    ]);
                },
            }),
        );
    }

    public override remove(id: string) {
        return super.remove(id).pipe(
            tap({
                next: () => this._tasks.update(items => items.filter(item => item.id !== id)),
            }),
        );
    }

    public override update(task: Task): Observable<Task> {
        return super.update(task).pipe(
            tap({
                next: () => this._tasks.update(items => items.map(item => item.id === task.id ? { ...task } : item)),
            }),
        );
    }

    public updateStatus(status: TaskStatus, ids: string[]): Observable<{ success: boolean, id: string }[]> {
        return from(ids).pipe(
            mergeMap(id => super.patch({ status }, id).pipe(
                map(task => ({ success: true, id: task.id})),
                catchError((err) => {
                    console.error(err);
                    return of({ success: false, id });
                }),
            )),
            toArray(),
            tap(res => {
                const successIdsArr = res.filter(item => item.success).map(item => item.id);
                this._tasks.update(items => items.map(item => successIdsArr.includes(item.id) ? { ...item, status } : item));
            }),
        );
    }
}

import { inject, Injectable, signal, WritableSignal } from '@angular/core';

import { Task, TaskStatus } from '@features/to-do/types';
import { TASK_STATUS } from '@features/to-do/constants';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, first, from, map, mergeMap, Observable, of, tap, toArray } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToDoService {
    private http: HttpClient = inject(HttpClient);

    private apiUrl = '/api/tasks';
    private _tasks: WritableSignal<Task[]> = signal([]);
    private _isLoadingTasks: WritableSignal<boolean> = signal(false);

    public readonly tasks = this._tasks.asReadonly();
    public readonly isLoadingTasks = this._isLoadingTasks.asReadonly();

    public loadTasks(): Observable<Task[]> {
        this._isLoadingTasks.set(true);

        return this.http.get<Task[]>(this.apiUrl).pipe(
            tap({
                next: (tasks) => this._tasks.set(tasks)
            }),
            first(),
            finalize(() => {
                this._isLoadingTasks.set(false);
            }),
        );
    }

    public addTask(task: Omit<Task, 'id' | 'status'>): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, {
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
            first(),
        );
    }

    public removeTask(id: string): Observable<Task> {
        return this.http.delete<Task>(`${this.apiUrl}/${id}`).pipe(
            tap({
                next: () => this._tasks.update(items => items.filter(item => item.id !== id)),
            }),
            first(),
        );
    }

    public updateTask(task: Task): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task).pipe(
            tap({
                next: () => this._tasks.update(items => items.map(item => item.id === task.id ? { ...task } : item)),
            }),
            first(),
        );
    }

    public updateStatus(status: TaskStatus, ids: string[]): Observable<{ success: boolean, id: string }[]> {
        return from(ids).pipe(
            mergeMap(id => this.http.patch<Task>(`${this.apiUrl}/${id}`, { status }).pipe(
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

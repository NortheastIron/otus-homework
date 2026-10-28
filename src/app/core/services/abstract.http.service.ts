import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class AbstractHttpService<
    ItemObject extends { id: string } = { id: string },
    AddItemObject =  Omit<ItemObject, 'id'>,
    PatchItemObject = Partial<ItemObject>,
> {
    private http: HttpClient = inject(HttpClient);
    private apiUrl: string = '';

    public all(): Observable<ItemObject[]> {
        return this.http.get<ItemObject[]>(this.apiUrl);
    }

    public get(id: string): Observable<ItemObject> {
        return this.http.get<ItemObject>(`${this.apiUrl}/${id}`);
    }

    public add(obj: AddItemObject): Observable<ItemObject> {
        return this.http.post<ItemObject>(this.apiUrl, obj);
    }

    public update(obj: ItemObject): Observable<ItemObject> {
        return this.http.put<ItemObject>(`${this.apiUrl}/${obj.id}`, obj);
    }

    public patch(obj: PatchItemObject, id: string): Observable<ItemObject> {
        return this.http.patch<ItemObject>(`${this.apiUrl}/${id}`, obj);
    }

    public remove(id: string): Observable<ItemObject> {
        return this.http.delete<ItemObject>(`${this.apiUrl}/${id}`);
    }

    protected setApiUrl(url: string): void {
        this.apiUrl = url;
    }
}
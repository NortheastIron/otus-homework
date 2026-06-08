import { Routes } from '@angular/router';

import { ToDoListComponent } from '@features';

export const routes: Routes = [
    {
        path: '',
        component: ToDoListComponent,
        title: 'ToDoList',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '',
    }
];

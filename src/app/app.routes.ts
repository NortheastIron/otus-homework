import { Routes } from '@angular/router';

import { ToDoPageComponent } from '@features';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/tasks',
        pathMatch: 'full',
    },
    {
        path: 'tasks',
        component: ToDoPageComponent,
        title: 'ToDoApp',
    },
    {
        path: '**',
        redirectTo: '/tasks',
    },
];

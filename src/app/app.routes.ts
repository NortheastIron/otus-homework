import { Routes } from '@angular/router';

import { ToDoDetailsComponent, ToDoPageComponent } from '@features';

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
        children: [
            {
                path: ':id',
                component: ToDoDetailsComponent,
            },
        ],
    },
    {
        path: '**',
        redirectTo: '/tasks',
    },
];

import { Routes } from '@angular/router';

import { ToDoPageComponent } from '@features';

export const routes: Routes = [
    {
        path: '',
        component: ToDoPageComponent,
        title: 'ToDoApp',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: '',
    },
];

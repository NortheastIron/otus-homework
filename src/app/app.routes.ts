import { Routes } from '@angular/router';

import {
    ToDoBacklogComponent,
    ToDoBoardComponent,
    ToDoDetailsComponent,
    ToDoPageComponent,
} from '@features';

export const routes: Routes = [
    {
        path: '',
        component: ToDoPageComponent,
        title: 'TasksBoard',
        children: [
            {
                path: '',
                redirectTo: 'backlog',
                pathMatch: 'full',
            },
            {
                path: 'backlog',
                component: ToDoBacklogComponent,
                children: [
                    {
                        path: ':id',
                        component: ToDoDetailsComponent,
                    },
                ],
            },
            {
                path: 'board',
                component: ToDoBoardComponent,
            },
        ],
    },
    {
        path: '**',
        redirectTo: '',
    },
];
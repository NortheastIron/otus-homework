import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';

import { filter, map } from 'rxjs';

import { ToastService, TYPES_TOAST } from '@common';

import { ToDoService } from '@features/to-do/services';

@Component({
    selector: 'app-to-do-page',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        RouterOutlet,
        RouterLinkWithHref,
    ],
    templateUrl: './to-do.page.component.html',
    styleUrl: './to-do.page.component.scss',
})

export class ToDoPageComponent implements OnInit {

    private router = inject(Router);
    private toDoService = inject(ToDoService);
    private destroyRef = inject(DestroyRef);
    private toastService = inject(ToastService);  

    protected readonly tabs: { key: string, name: string, url: string }[] = [
        {
            key: 'backlog',
            name: 'Backlog',
            url: '/backlog',
        },
        {
            key: 'board',
            name: 'Board',
            url: '/board',
        },
    ];

    protected activeTab = toSignal(this.router.events.pipe(
        filter(ev => ev instanceof NavigationEnd),
        map((ev) => {
            const tabKey = ev.urlAfterRedirects.split('/')[1];
            return this.tabs.find(tab => tab.key === tabKey);
        }),
    ), { initialValue: this.tabs[0]});

    ngOnInit(): void {
        this.toDoService.loadTasks().pipe(
            takeUntilDestroyed(this.destroyRef),
        ).subscribe({
            error: (err) => {
                console.error(err);

                this.toastService.show({
                    text: `Tasks loading error`,
                    type: TYPES_TOAST.ERROR,
                });
            },
        });
    }
}

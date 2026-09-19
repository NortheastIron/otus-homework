import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';

import { filter, map } from 'rxjs';

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

export class ToDoPageComponent {

    private router = inject(Router);

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
}

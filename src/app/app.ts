import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastsComponent } from '@common';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        ToastsComponent,
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {}

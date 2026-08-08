import { Component } from '@angular/core';

@Component({
    selector: 'app-loading-indicator',
    templateUrl: './loading-indicator.component.html',
    styleUrl: './loading-indicator.component.scss',
    host: {
        class: 'app-loading-indicator',
    },
})
export class LoadingIndicatorComponent {}

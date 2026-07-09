import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ErrorStateMatcher } from '@angular/material/core';
import { UnusedFormControlMatcher } from '@core';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        {
            provide: ErrorStateMatcher,
            useClass: UnusedFormControlMatcher,
        },
    ],
};

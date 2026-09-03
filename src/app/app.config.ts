import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ErrorStateMatcher } from '@angular/material/core';
import { baseInterceptor, UnusedFormControlMatcher } from '@core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        {
            provide: ErrorStateMatcher,
            useClass: UnusedFormControlMatcher,
        },
        provideHttpClient(
            withInterceptors([baseInterceptor]),
        ),
    ],
};

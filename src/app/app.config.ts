import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

import { routes } from './app.routes';
import { AuthService } from './services/security/auth.service';
import { customHttpInterceptor } from './services/security/custom-http.interceptor';

const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eff7ff',
      100: '#d9ecff',
      200: '#b8d9f7',
      300: '#8ebdf9',
      400: '#5d9ed8',
      500: '#2d6197',
      600: '#0f4c81',
      700: '#00355f',
      800: '#002b4d',
      900: '#001c37',
      950: '#001224'
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([customHttpInterceptor])),
    provideAppInitializer(() => inject(AuthService).initialize()),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: AppPreset,
        options: {
          darkModeSelector: '.app-dark', // Disables automatic OS dark mode
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng, components, utilities',
          },
        },
      },
    }),
  ],
};

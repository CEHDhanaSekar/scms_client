import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { LoginComponent } from './features/auth/login';
import { DashboardComponent } from './features/dashboard/dashboard';
import { authGuard, loginGuard } from './guards/auth.guard';
import { UserSignal } from './services/signals/user.signal';

export const routes: Routes = [
  {
    path: '',
    redirectTo: () => (inject(UserSignal).accessToken() ? '/dashboard' : '/login'),
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '/login' },
];

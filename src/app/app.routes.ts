import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login';
import { DashboardComponent } from './features/dashboard/dashboard';
import { authGuard, defaultRouteGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', canActivate: [defaultRouteGuard], pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '/login' },
];

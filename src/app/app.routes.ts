import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login';
import { HomeComponent } from './features/home/home';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },

  { path: '**', redirectTo: '/login' },
];

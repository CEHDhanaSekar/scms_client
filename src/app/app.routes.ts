import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { LoginComponent } from './features/auth/login';
import { DashboardComponent } from './features/dashboard/dashboard';
import { UserMasterComponent } from './features/users/user-master';
import { UserFormComponent } from './features/users/user-form';
import { UserViewComponent } from './features/users/user-view';
import { RoleMasterComponent } from './features/roles/role-master';
import { RoleFormComponent } from './features/roles/role-form';
import { RoleViewComponent } from './features/roles/role-view';
import { authGuard, loginGuard } from './guards/auth.guard';
import { UserSignal } from './services/signals/user.signal';
import { MainLayoutComponent } from './layout/main-layout';
import { DepartmentMasterComponent } from './features/departments/department-master';
import { DepartmentFormComponent } from './features/departments/department-form';
import { DepartmentViewComponent } from './features/departments/department-view';
import { SpecializationMasterComponent } from './features/specialization/specialization-master';
import { SpecializationFormComponent } from './features/specialization/specialization-form';
import { SpecializationViewComponent } from './features/specialization/specialization-view';

export const routes: Routes = [
  {
    path: '',
    redirectTo: () => (inject(UserSignal).accessToken() ? '/dashboard' : '/login'),
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UserMasterComponent },
      { path: 'users/add', component: UserFormComponent },
      { path: 'users/:userId/edit', component: UserFormComponent },
      { path: 'users/:userId/view', component: UserViewComponent },
      { path: 'roles', component: RoleMasterComponent },
      { path: 'roles/add', component: RoleFormComponent },
      { path: 'roles/:roleId/edit', component: RoleFormComponent },
      { path: 'roles/:roleId/view', component: RoleViewComponent },
      { path: 'departments', component: DepartmentMasterComponent },
      { path: 'departments/add', component: DepartmentFormComponent },
      { path: 'departments/:departmentId/edit', component: DepartmentFormComponent },
      { path: 'departments/:departmentId/view', component: DepartmentViewComponent },
      { path: 'specializations', component: SpecializationMasterComponent },
      { path: 'specializations/add', component: SpecializationFormComponent },
      { path: 'specializations/:specializationId/edit', component: SpecializationFormComponent },
      { path: 'specializations/:specializationId/view', component: SpecializationViewComponent },
    ],
  },
  { path: '**', redirectTo: '/login' },
];

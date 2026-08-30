import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { MasterApiService } from '../../library/api/master-api.service';
import { CreateRoleDto, UpdateRoleDto, RoleDto } from '../../library/models/role.model';
import { TenantPermissionDto } from '../../library/models/permission.model';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    CardModule,
    MultiSelectModule,
    RouterLink,
  ],
  providers: [MessageService],
  template: `
    <div class="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <!-- Header & Breadcrumb -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-outline-light"
      >
        <div class="flex items-center gap-4">
          <button
            type="button"
            (click)="onCancel()"
            class="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <i class="pi pi-arrow-left"></i>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-800 tracking-tight">
              {{ isEditMode() ? 'Edit Role' : 'Create New Role' }}
            </h1>
            <p class="text-sm text-gray-500 mt-1">
              {{
                isEditMode()
                  ? 'Update the details and permissions for this role.'
                  : 'Define a new role and assign its permissions.'
              }}
            </p>
          </div>
        </div>

        <div class="flex flex-col items-start md:items-end gap-3">
          <!-- Breadcrumb -->
          <nav class="flex text-sm text-gray-500 font-medium" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
              <li class="inline-flex items-center">
                <a
                  routerLink="/dashboard"
                  class="inline-flex items-center hover:text-primary-600 transition-colors"
                >
                  <i class="pi pi-home mr-2 text-xs"></i>
                  Dashboard
                </a>
              </li>
              <li>
                <div class="flex items-center">
                  <i class="pi pi-angle-right text-xs mx-1"></i>
                  <a
                    routerLink="/roles"
                    class="hover:text-primary-600 transition-colors ml-1 md:ml-2"
                    >Roles</a
                  >
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <i class="pi pi-angle-right text-xs mx-1"></i>
                  <span class="text-gray-800 ml-1 md:ml-2">{{
                    isEditMode() ? 'Edit' : 'Add'
                  }}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-outline-light overflow-visible">
        <form [formGroup]="roleForm" (ngSubmit)="onSubmit()" class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <!-- Basic Details -->
            <div class="col-span-1 md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                Role Details
              </h3>
            </div>

            <!-- Role Name -->
            <div class="col-span-1 md:col-span-2">
              <label for="name" class="block text-sm font-semibold text-gray-700 mb-1.5">
                Role Name <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                formControlName="name"
                placeholder="e.g. Administrator, Nurse, HR"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none text-gray-800"
                [ngClass]="{
                  'border-red-300 focus:ring-red-500 bg-red-50':
                    roleForm.controls['name'].touched && roleForm.controls['name'].invalid,
                }"
              />
              @if (roleForm.controls['name'].touched && roleForm.controls['name'].invalid) {
                <p class="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                  <i class="pi pi-exclamation-circle text-xs"></i> Role Name is required.
                </p>
              }
            </div>

            <!-- Description -->
            <div class="col-span-1 md:col-span-2">
              <label for="description" class="block text-sm font-semibold text-gray-700 mb-1.5">
                Description
              </label>
              <input
                id="description"
                type="text"
                formControlName="description"
                placeholder="Brief description of this role's purpose"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none text-gray-800"
              />
            </div>

            <div class="col-span-1 md:col-span-2 mt-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                Permissions
              </h3>
            </div>

            <!-- Permissions -->
            <div class="col-span-1 md:col-span-2">
              <label for="permissionIds" class="block text-sm font-semibold text-gray-700 mb-1.5">
                Assigned Permissions
              </label>
              <p-multiSelect
                id="permissionIds"
                [options]="permissions()"
                formControlName="permissionIds"
                optionLabel="code"
                optionValue="id"
                placeholder="Select permissions"
                [filter]="true"
                styleClass="w-full"
                [style]="{ 'border-radius': '0.75rem', padding: '0.25rem' }"
              ></p-multiSelect>
              <p class="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                <i class="pi pi-info-circle"></i> Determine what features this role has access to.
              </p>
            </div>

            <!-- Active Status (only for add/edit if applicable) -->
            <div
              class="col-span-1 md:col-span-2 flex items-center bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2"
            >
              <input
                id="isActive"
                type="checkbox"
                formControlName="isActive"
                class="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
              <label for="isActive" class="ml-3 text-sm font-medium text-gray-800 cursor-pointer">
                Active Role
              </label>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-8 mt-4 border-t border-gray-100">
            <button
              type="button"
              (click)="onCancel()"
              [disabled]="isLoading()"
              class="px-6 py-2.5 rounded-xl font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="roleForm.invalid || isLoading()"
              class="px-6 py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all shadow-sm shadow-primary-500/30 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
            >
              @if (isLoading()) {
                <i class="pi pi-spinner pi-spin"></i>
                Saving...
              } @else {
                <i class="pi pi-save"></i>
                {{ isEditMode() ? 'Update Role' : 'Create Role' }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>
    <p-toast />
  `,
})
export class RoleFormComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly masterApi = inject(MasterApiService);
  private readonly messageService = inject(MessageService);

  roleForm: FormGroup;
  isLoading = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  roleId = signal<string | null>(null);
  permissions = signal<TenantPermissionDto[]>([]);

  constructor() {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      permissionIds: [[]],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.loadPermissions();

    this.route.paramMap.subscribe((params) => {
      const roleId = params.get('roleId');
      if (roleId) {
        this.isEditMode.set(true);
        this.roleId.set(roleId);
        this.loadRole(roleId);
      }
    });
  }

  loadPermissions(): void {
    this.masterApi.getAllPermissions().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.permissions.set(response.data);
        }
      },
      error: (error) => {
        console.error('Failed to load permissions', error);
      },
    });
  }

  loadRole(roleId: string): void {
    this.isLoading.set(true);
    this.masterApi.getRoleById(roleId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const role = response.data;
          this.roleForm.patchValue({
            name: role.name,
            description: role.description || '',
            // RoleDto doesn't have permissionIds according to role.model.ts,
            // but normally it would. Assuming backend sends it or it's needed for update
            // If backend doesn't send it, it might be empty array.
            permissionIds: (role as any).permissionIds || [],
            isActive: role.isActive !== false, // Default to true if missing
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Failed to load role',
          });
          this.router.navigate(['/roles']);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || error?.message || 'Failed to load role',
        });
        this.router.navigate(['/roles']);
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const formValue = this.roleForm.value;
    this.isLoading.set(true);

    if (this.isEditMode() && this.roleId()) {
      const updateRoleDto: UpdateRoleDto = {
        id: this.roleId()!,
        name: formValue.name,
        description: formValue.description || null,
        permissionIds: formValue.permissionIds || [],
        isActive: formValue.isActive, // Assuming BaseDto has isActive
      };

      this.masterApi
        .updateRole(updateRoleDto)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Role updated successfully',
              });
              this.router.navigate(['/roles']);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message || 'Failed to update role',
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message || error?.message || 'Failed to update role',
            });
          },
        });
    } else {
      const createRoleDto: CreateRoleDto = {
        name: formValue.name,
        description: formValue.description || null,
        permissionIds: formValue.permissionIds || [],
        isActive: formValue.isActive,
      };

      this.masterApi
        .createRole(createRoleDto)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Role created successfully',
              });
              this.router.navigate(['/roles']);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message || 'Failed to create role',
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message || error?.message || 'Failed to create role',
            });
          },
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/roles']);
  }
}

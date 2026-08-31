import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { MasterApiService } from '../../library/api/master-api.service';
import { CreateUserDto, UpdateUserDto, UserDto } from '../../library/models/user.model';
import { RoleDto } from '../../library/models/role.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    CardModule,
    MultiSelectModule,
    RouterLink
  ],
  providers: [MessageService],
  template: `
    <div class="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <!-- Header & Breadcrumb -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-outline-light">
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
              {{ isEditMode() ? 'Edit User' : 'Create New User' }}
            </h1>
            <p class="text-sm text-gray-500 mt-1">
              {{ isEditMode() ? 'Update the details for this account.' : 'Fill in the details to add a new user to the system.' }}
            </p>
          </div>
        </div>
        
        <div class="flex flex-col items-start md:items-end gap-3">
          <!-- Breadcrumb -->
          <nav class="flex text-sm text-gray-500 font-medium" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
              <li class="inline-flex items-center">
                <a routerLink="/dashboard" class="inline-flex items-center hover:text-primary-600 transition-colors">
                  <i class="pi pi-home mr-2 text-xs"></i>
                  Dashboard
                </a>
              </li>
              <li>
                <div class="flex items-center">
                  <i class="pi pi-angle-right text-xs mx-1"></i>
                  <a routerLink="/users" class="hover:text-primary-600 transition-colors ml-1 md:ml-2">Users</a>
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <i class="pi pi-angle-right text-xs mx-1"></i>
                  <span class="text-gray-800 ml-1 md:ml-2">{{ isEditMode() ? 'Edit' : 'Add' }}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-outline-light overflow-visible">
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="p-8">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            <!-- Username -->
            <div class="col-span-1 md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">Basic Information</h3>
            </div>

            <div>
              <label for="username" class="block text-sm font-semibold text-gray-700 mb-1.5">
                Username <span class="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                formControlName="username"
                placeholder="e.g. jdoe123"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none text-gray-800"
                [ngClass]="{'border-red-300 focus:ring-red-500 bg-red-50': userForm.controls['username'].touched && userForm.controls['username'].invalid}"
              />
              @if (userForm.controls['username'].touched && userForm.controls['username'].invalid) {
                <p class="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                  <i class="pi pi-exclamation-circle text-xs"></i> Username is required.
                </p>
              }
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="e.g. john@example.com"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none text-gray-800"
                [ngClass]="{'border-red-300 focus:ring-red-500 bg-red-50': userForm.controls['email'].touched && userForm.controls['email'].invalid}"
              />
              @if (userForm.controls['email'].touched && userForm.controls['email'].invalid) {
                <p class="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                  <i class="pi pi-exclamation-circle text-xs"></i>
                  @if (userForm.controls['email'].errors?.['required']) {
                    Email is required.
                  } @else if (userForm.controls['email'].errors?.['email']) {
                    Please enter a valid email format.
                  }
                </p>
              }
            </div>

            <!-- Password (only for add mode) -->
            @if (!isEditMode()) {
              <div>
                <label for="password" class="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password <span class="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  formControlName="password"
                  placeholder="Create a secure password"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none text-gray-800"
                  [ngClass]="{'border-red-300 focus:ring-red-500 bg-red-50': userForm.controls['password'].touched && userForm.controls['password'].invalid}"
                />
                @if (userForm.controls['password'].touched && userForm.controls['password'].invalid) {
                  <p class="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                    <i class="pi pi-exclamation-circle text-xs"></i> Password is required.
                  </p>
                }
              </div>
            }

            <!-- Employee ID -->
            <div [ngClass]="{'md:col-start-2': !isEditMode()}">
              <label for="employeeId" class="block text-sm font-semibold text-gray-700 mb-1.5">
                Employee ID <span class="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                id="employeeId"
                type="text"
                formControlName="employeeId"
                placeholder="e.g. EMP-001"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none text-gray-800"
              />
            </div>

            <div class="col-span-1 md:col-span-2 mt-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">System Settings</h3>
            </div>

            <!-- Role IDs -->
            <div class="col-span-1 md:col-span-2">
              <label for="roleIds" class="block text-sm font-semibold text-gray-700 mb-1.5">
                Assigned Roles
              </label>
              <p-multiSelect
                id="roleIds"
                [options]="roles()"
                formControlName="roleIds"
                optionLabel="name"
                optionValue="id"
                placeholder="Select roles"
                [filter]="true"
                styleClass="w-full"
                [style]="{'border-radius': '0.75rem', 'padding': '0.25rem'}"
              ></p-multiSelect>
              <p class="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                <i class="pi pi-info-circle"></i> Select one or more roles for this user.
              </p>
            </div>

            <!-- Active Status (only for edit mode) -->
            @if (isEditMode()) {
              <div class="col-span-1 md:col-span-2 flex items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <input
                  id="isActive"
                  type="checkbox"
                  formControlName="isActive"
                  class="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <label for="isActive" class="ml-3 text-sm font-medium text-gray-800 cursor-pointer">
                  Active User Account
                </label>
              </div>
            } @else {
              <input type="hidden" formControlName="isActive" />
            }
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
              [disabled]="userForm.invalid || isLoading()"
              class="px-6 py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all shadow-sm shadow-primary-500/30 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
            >
              @if (isLoading()) {
                <i class="pi pi-spinner pi-spin"></i>
                Saving...
              } @else {
                <i class="pi pi-save"></i>
                {{ isEditMode() ? 'Update User' : 'Create User' }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>
    <p-toast />
  `,
})
export class UserFormComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly masterApi = inject(MasterApiService);
  private readonly messageService = inject(MessageService);

  userForm: FormGroup;
  isLoading = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  userId = signal<string | null>(null);
  roles = signal<RoleDto[]>([]);

  constructor() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      employeeId: [''],
      roleIds: [[]],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('userId');
      if (userId) {
        this.isEditMode.set(true);
        this.userId.set(userId);
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
        this.loadUser(userId);
      } else {
        this.userForm.get('password')?.setValidators([Validators.required]);
        this.userForm.get('password')?.updateValueAndValidity();
      }
    });
  }
  
  loadRoles(): void {
    this.masterApi.getAllRoles().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.roles.set(response.data);
        }
      },
      error: (error) => {
        console.error('Failed to load roles', error);
      }
    });
  }

  loadUser(userId: string): void {
    this.isLoading.set(true);
    this.masterApi.getUserById(userId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const user = response.data;
          this.userForm.patchValue({
            username: user.username,
            email: user.email,
            employeeId: user.employeeId || '',
            roleIds: user.roleIds || [],
            isActive: user.isActive,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Failed to load user',
          });
          this.router.navigate(['/users']);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || error?.message || 'Failed to load user',
        });
        this.router.navigate(['/users']);
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.value;
    const roleIdsArray = formValue.roleIds || [];

    this.isLoading.set(true);

    if (this.isEditMode() && this.userId()) {
      const updateUserDto: UpdateUserDto = {
        id: this.userId()!,
        username: formValue.username,
        email: formValue.email,
        employeeId: formValue.employeeId || null,
        roleIds: roleIdsArray,
        isActive: formValue.isActive,
      };

      this.masterApi
        .updateUser(updateUserDto)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User updated successfully',
              });
              this.router.navigate(['/users']);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message || 'Failed to update user',
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message || error?.message || 'Failed to update user',
            });
          },
        });
    } else {
      const createUserDto: CreateUserDto = {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
        employeeId: formValue.employeeId || null,
        roleIds: roleIdsArray,
      };

      this.masterApi
        .createUser(createUserDto)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User created successfully',
              });
              this.router.navigate(['/users']);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message || 'Failed to create user',
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message || error?.message || 'Failed to create user',
            });
          },
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}

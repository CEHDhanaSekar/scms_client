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
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { MasterApiService } from '../../library/api/master-api.service';
import { CreateSpecializationDto, UpdateSpecializationDto } from '../../library/models/specialization.model';
import { DepartmentDto } from '../../library/models/department.model';

@Component({
  selector: 'app-specialization-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    CardModule,
    SelectModule,
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
              {{ isEditMode() ? 'Edit Specialization' : 'Create New Specialization' }}
            </h1>
            <p class="text-sm text-gray-500 mt-1">
              {{
                isEditMode()
                  ? 'Update the details for this specialization.'
                  : 'Define a new specialization.'
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
                    routerLink="/specializations"
                    class="hover:text-primary-600 transition-colors ml-1 md:ml-2"
                    >Specializations</a
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
        <form [formGroup]="specializationForm" (ngSubmit)="onSubmit()" class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <!-- Basic Details -->
            <div class="col-span-1 md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                Specialization Details
              </h3>
            </div>

            <!-- Specialization Name -->
            <div class="col-span-1 md:col-span-2">
              <label for="name" class="block text-sm font-semibold text-gray-700 mb-1.5">
                Specialization Name <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                formControlName="name"
                placeholder="e.g. Cardiology, Software Engineering"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none text-gray-800"
                [ngClass]="{
                  'border-red-300 focus:ring-red-500 bg-red-50':
                    specializationForm.controls['name'].touched && specializationForm.controls['name'].invalid,
                }"
              />
              @if (specializationForm.controls['name'].touched && specializationForm.controls['name'].invalid) {
                <p class="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                  <i class="pi pi-exclamation-circle text-xs"></i> Specialization Name is required.
                </p>
              }
            </div>

            <!-- Department Dropdown -->
            <div class="col-span-1 md:col-span-2">
              <label for="departmentId" class="block text-sm font-semibold text-gray-700 mb-1.5">
                Department
              </label>
              <p-select
                id="departmentId"
                [options]="departments()"
                formControlName="departmentId"
                optionLabel="name"
                optionValue="id"
                placeholder="Select a Department"
                [showClear]="true"
                [filter]="true"
                styleClass="w-full"
              ></p-select>
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
                placeholder="Brief description of this specialization"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none text-gray-800"
              />
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
              [disabled]="specializationForm.invalid || isLoading()"
              class="px-6 py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all shadow-sm shadow-primary-500/30 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
            >
              @if (isLoading()) {
                <i class="pi pi-spinner pi-spin"></i>
                Saving...
              } @else {
                <i class="pi pi-save"></i>
                {{ isEditMode() ? 'Update Specialization' : 'Create Specialization' }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>
    <p-toast />
  `,
})
export class SpecializationFormComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly masterApi = inject(MasterApiService);
  private readonly messageService = inject(MessageService);

  specializationForm: FormGroup;
  isLoading = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  specializationId = signal<string | null>(null);
  departments = signal<DepartmentDto[]>([]);

  constructor() {
    this.specializationForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      departmentId: [null],
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    
    this.route.paramMap.subscribe((params) => {
      const specId = params.get('specializationId');
      if (specId) {
        this.isEditMode.set(true);
        this.specializationId.set(specId);
        this.loadSpecialization(specId);
      }
    });
  }

  loadDepartments(): void {
    this.masterApi.getAllDepartments().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.departments.set(response.data);
        }
      },
      error: (error) => {
        console.error('Failed to load departments', error);
      }
    });
  }

  loadSpecialization(specId: string): void {
    this.isLoading.set(true);
    this.masterApi.getSpecializationById(specId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const spec = response.data;
          this.specializationForm.patchValue({
            name: spec.name,
            description: spec.description || '',
            departmentId: spec.departmentId,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Failed to load specialization',
          });
          this.router.navigate(['/specializations']);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || error?.message || 'Failed to load specialization',
        });
        this.router.navigate(['/specializations']);
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.specializationForm.invalid) {
      this.specializationForm.markAllAsTouched();
      return;
    }

    const formValue = this.specializationForm.value;
    this.isLoading.set(true);

    if (this.isEditMode() && this.specializationId()) {
      const updateDto: UpdateSpecializationDto = {
        id: this.specializationId()!,
        name: formValue.name,
        description: formValue.description || null,
        departmentId: formValue.departmentId || null,
      };

      this.masterApi
        .updateSpecialization(updateDto)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Specialization updated successfully',
              });
              this.router.navigate(['/specializations']);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message || 'Failed to update specialization',
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message || error?.message || 'Failed to update specialization',
            });
          },
        });
    } else {
      const createDto: CreateSpecializationDto = {
        name: formValue.name,
        description: formValue.description || null,
        departmentId: formValue.departmentId || null,
      };

      this.masterApi
        .createSpecialization(createDto)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Specialization created successfully',
              });
              this.router.navigate(['/specializations']);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message || 'Failed to create specialization',
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message || error?.message || 'Failed to create specialization',
            });
          },
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/specializations']);
  }
}

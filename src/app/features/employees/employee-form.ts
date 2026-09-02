import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MasterApiService } from '../../library/api/master-api.service';
import { DepartmentDto } from '../../library/models/department.model';
import {
  CreateEmployeeDto,
  EmployeeType,
  UpdateEmployeeDto,
} from '../../library/models/employee.model';
import { SpecializationDto } from '../../library/models/specialization.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <div class="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div
        class="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-outline-light"
      >
        <button
          type="button"
          (click)="onCancel()"
          class="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
        >
          <i class="pi pi-arrow-left"></i>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-800">
            {{ isEditMode() ? 'Edit Employee' : 'Create New Employee' }}
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            {{ isEditMode() ? 'Update employee details.' : 'Add an employee to the organization.' }}
          </p>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow-sm border border-outline-light">
        <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()" class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div class="col-span-1 md:col-span-2">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
                Employee Details
              </h3>
            </div>
            <div>
              <label for="firstName" class="block text-sm font-semibold text-gray-700 mb-1.5"
                >First Name <span class="text-red-500">*</span></label
              ><input
                id="firstName"
                formControlName="firstName"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300"
              />
              @if (
                employeeForm.controls['firstName'].touched &&
                employeeForm.controls['firstName'].invalid
              ) {
                <p class="mt-1 text-xs text-red-600">First name is required.</p>
              }
            </div>
            <div>
              <label for="lastName" class="block text-sm font-semibold text-gray-700 mb-1.5"
                >Last Name <span class="text-red-500">*</span></label
              ><input
                id="lastName"
                formControlName="lastName"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300"
              />
              @if (
                employeeForm.controls['lastName'].touched &&
                employeeForm.controls['lastName'].invalid
              ) {
                <p class="mt-1 text-xs text-red-600">Last name is required.</p>
              }
            </div>
            <div>
              <label for="phoneNumber" class="block text-sm font-semibold text-gray-700 mb-1.5"
                >Phone Number</label
              ><input
                id="phoneNumber"
                formControlName="phoneNumber"
                type="tel"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-1.5"
                >Email</label
              ><input
                id="email"
                formControlName="email"
                type="email"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300"
              />
              @if (
                employeeForm.controls['email'].touched &&
                employeeForm.controls['email'].hasError('email')
              ) {
                <p class="mt-1 text-xs text-red-600">Enter a valid email address.</p>
              }
            </div>
            <div>
              <label for="type" class="block text-sm font-semibold text-gray-700 mb-1.5"
                >Employee Type <span class="text-red-500">*</span></label
              ><p-select
                id="type"
                [options]="employeeTypes"
                formControlName="type"
                optionLabel="label"
                optionValue="value"
                placeholder="Select type"
                styleClass="w-full"
              ></p-select>
            </div>
            <div>
              <label for="departmentId" class="block text-sm font-semibold text-gray-700 mb-1.5"
                >Department <span class="text-red-500">*</span></label
              ><p-select
                id="departmentId"
                [options]="departments()"
                formControlName="departmentId"
                optionLabel="name"
                optionValue="id"
                placeholder="Select department"
                [filter]="true"
                styleClass="w-full"
              ></p-select>
            </div>
            <div class="col-span-1 md:col-span-2">
              <label for="specializationId" class="block text-sm font-semibold text-gray-700 mb-1.5"
                >Specialization</label
              ><p-select
                id="specializationId"
                [options]="specializations()"
                formControlName="specializationId"
                optionLabel="name"
                optionValue="id"
                placeholder="Select specialization"
                [showClear]="true"
                [filter]="true"
                styleClass="w-full"
              ></p-select>
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-8 mt-6 border-t border-gray-100">
            <button
              type="button"
              (click)="onCancel()"
              [disabled]="isLoading()"
              class="px-6 py-2.5 rounded-xl border border-gray-300"
            >
              Cancel</button
            ><button
              type="submit"
              [disabled]="employeeForm.invalid || isLoading()"
              class="px-6 py-2.5 rounded-xl text-white bg-primary-600 disabled:opacity-50"
            >
              {{ isLoading() ? 'Saving...' : isEditMode() ? 'Update Employee' : 'Create Employee' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <p-toast />
  `,
})
export class EmployeeFormComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly masterApi = inject(MasterApiService);
  private readonly messageService = inject(MessageService);
  employeeForm: FormGroup;
  isLoading = signal(false);
  isEditMode = signal(false);
  employeeId = signal<string | null>(null);
  departments = signal<DepartmentDto[]>([]);
  specializations = signal<SpecializationDto[]>([]);
  readonly employeeTypes = Object.keys(EmployeeType)
    .filter((key) => Number.isNaN(Number(key)))
    .map((label) => ({ label, value: EmployeeType[label as keyof typeof EmployeeType] }));
  constructor() {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [''],
      email: ['', Validators.email],
      type: [null, Validators.required],
      departmentId: [null, Validators.required],
      specializationId: [null],
    });
  }
  ngOnInit(): void {
    this.loadLookups();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('employeeId');
      if (id) {
        this.isEditMode.set(true);
        this.employeeId.set(id);
        this.loadEmployee(id);
      }
    });
  }
  loadLookups(): void {
    this.masterApi.getAllDepartments().subscribe((response) => {
      if (response.success && response.data) this.departments.set(response.data);
    });
    this.masterApi.getAllSpecialization().subscribe((response) => {
      if (response.success && response.data) this.specializations.set(response.data);
    });
  }
  loadEmployee(id: string): void {
    this.isLoading.set(true);
    this.masterApi.getEmployeeById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) this.employeeForm.patchValue(response.data);
        else this.fail(response.message || 'Failed to load employee');
        this.isLoading.set(false);
      },
      error: (error) => {
        this.fail(error?.error?.message || error?.message || 'Failed to load employee');
        this.isLoading.set(false);
      },
    });
  }
  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    const value = this.employeeForm.value;
    this.isLoading.set(true);
    const request = this.isEditMode()
      ? this.masterApi.updateEmployee({ id: this.employeeId()!, ...value } as UpdateEmployeeDto)
      : this.masterApi.createEmployee({
          ...value,
          phoneNumber: value.phoneNumber || null,
          email: value.email || null,
          specializationId: value.specializationId || null,
        } as CreateEmployeeDto);
    request.pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: (response) => {
        if (response.success) this.router.navigate(['/employees']);
        else this.fail(response.message || 'Failed to save employee');
      },
      error: (error) =>
        this.fail(error?.error?.message || error?.message || 'Failed to save employee'),
    });
  }
  onCancel(): void {
    this.router.navigate(['/employees']);
  }
  private fail(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
  }
}

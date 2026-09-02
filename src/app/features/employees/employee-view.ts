import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MasterApiService } from '../../library/api/master-api.service';
import { DepartmentDto } from '../../library/models/department.model';
import { EmployeeDto, EmployeeType } from '../../library/models/employee.model';
import { SpecializationDto } from '../../library/models/specialization.model';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div
        class="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-outline-light"
      >
        <button
          (click)="goBack()"
          class="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
        >
          <i class="pi pi-arrow-left"></i>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Employee Details</h1>
          <p class="text-sm text-gray-500 mt-1">Viewing employee profile information.</p>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow-sm border border-outline-light p-8">
        @if (isLoading()) {
          <div class="text-center py-12">
            <i class="pi pi-spinner pi-spin text-3xl text-primary-600"></i>
            <p class="mt-4 text-gray-500">Loading employee data...</p>
          </div>
        } @else if (employee()) {
          <div class="flex flex-col md:flex-row gap-8">
            <div
              class="flex flex-col items-center space-y-4 md:w-1/3 md:border-r md:border-gray-100 md:pr-8"
            >
              <div
                class="h-32 w-32 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-5xl font-bold"
              >
                {{ employee()!.firstName.charAt(0).toUpperCase() }}
              </div>
              <div class="text-center">
                <h2 class="text-xl font-bold text-gray-900">
                  {{ employee()!.firstName }} {{ employee()!.lastName }}
                </h2>
                <p class="text-sm text-gray-500">{{ getEmployeeTypeName(employee()!.type) }}</p>
                <button
                  (click)="navigateToEditEmployee(employee()!.id)"
                  class="mt-4 bg-blue-50 text-blue-600 hover:bg-blue-100 px-5 py-2.5 rounded-xl font-medium border border-blue-200"
                >
                  <i class="pi pi-pencil mr-2"></i>Edit Employee
                </button>
              </div>
            </div>
            <div class="md:w-2/3 space-y-6">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
                Employee Information
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                @for (item of details(); track item.label) {
                  <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      {{ item.label }}
                    </p>
                    <p class="text-gray-900 font-medium">{{ item.value }}</p>
                  </div>
                }
              </div>
            </div>
          </div>
        } @else {
          <div class="text-center py-12">
            <i class="pi pi-user-minus text-5xl text-gray-300"></i>
            <p class="text-lg font-medium text-gray-900 mt-4">Employee not found</p>
          </div>
        }
      </div>
    </div>
    <p-toast />
  `,
})
export class EmployeeViewComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly masterApi = inject(MasterApiService);
  private readonly messageService = inject(MessageService);
  employee = signal<EmployeeDto | null>(null);
  departments = signal<DepartmentDto[]>([]);
  specializations = signal<SpecializationDto[]>([]);
  isLoading = signal(true);
  details = signal<{ label: string; value: string }[]>([]);
  ngOnInit(): void {
    this.masterApi.getAllDepartments().subscribe((response) => {
      if (response.success && response.data) this.departments.set(response.data);
      this.updateDetails();
    });
    this.masterApi.getAllSpecialization().subscribe((response) => {
      if (response.success && response.data) this.specializations.set(response.data);
      this.updateDetails();
    });
    this.route.paramMap.subscribe((params) => {
      const id = params.get('employeeId');
      if (id) this.loadEmployee(id);
      else this.goBack();
    });
  }
  loadEmployee(id: string): void {
    this.isLoading.set(true);
    this.masterApi.getEmployeeById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.employee.set(response.data);
          this.updateDetails();
        } else this.fail(response.message || 'Failed to load employee');
        this.isLoading.set(false);
      },
      error: (error) => {
        this.fail(error?.error?.message || error?.message || 'Failed to load employee');
        this.isLoading.set(false);
      },
    });
  }
  updateDetails(): void {
    const employee = this.employee();
    if (!employee) return;
    this.details.set([
      { label: 'Email', value: employee.email || 'Not provided' },
      { label: 'Phone Number', value: employee.phoneNumber || 'Not provided' },
      { label: 'Employee Type', value: this.getEmployeeTypeName(employee.type) },
      {
        label: 'Department',
        value:
          this.departments().find((item) => item.id === employee.departmentId)?.name ||
          'Unassigned',
      },
      {
        label: 'Specialization',
        value: employee.specializationId
          ? this.specializations().find((item) => item.id === employee.specializationId)?.name ||
            'Unknown'
          : 'None',
      },
    ]);
  }
  getEmployeeTypeName(type: EmployeeType): string {
    return EmployeeType[type] || 'Other';
  }
  navigateToEditEmployee(id: string): void {
    this.router.navigate(['/employees', id, 'edit']);
  }
  goBack(): void {
    this.router.navigate(['/employees']);
  }
  private fail(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
  }
}

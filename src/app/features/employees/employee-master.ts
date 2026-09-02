import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MasterApiService } from '../../library/api/master-api.service';
import { DepartmentDto } from '../../library/models/department.model';
import { EmployeeDto, EmployeeType } from '../../library/models/employee.model';
import { SpecializationDto } from '../../library/models/specialization.model';

@Component({
  selector: 'app-employee-master',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule, RouterLink],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-outline-light"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Employees Management</h1>
          <p class="text-sm text-gray-500 mt-1">
            Manage employees and their organizational assignments.
          </p>
        </div>
        <div class="flex flex-col items-start md:items-end gap-3">
          <nav class="flex text-sm text-gray-500 font-medium" aria-label="Breadcrumb">
            <a
              routerLink="/dashboard"
              class="inline-flex items-center hover:text-primary-600 transition-colors"
              ><i class="pi pi-home mr-2 text-xs"></i>Dashboard</a
            ><i class="pi pi-angle-right text-xs mx-2"></i
            ><span class="text-gray-800">Employees</span>
          </nav>
          <button
            (click)="navigateToAddEmployee()"
            class="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-primary-500/30 flex items-center gap-2"
          >
            <i class="pi pi-plus text-sm"></i>Add New Employee
          </button>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow-sm border border-outline-light overflow-visible">
        <p-table
          [value]="employees()"
          [loading]="isLoading()"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[10, 25, 50]"
          [globalFilterFields]="['firstName', 'lastName', 'email', 'phoneNumber']"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header"
            ><tr class="bg-gray-50 border-b border-gray-100">
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Employee
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Department
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Specialization
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr></ng-template
          >
          <ng-template pTemplate="body" let-employee
            ><tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold"
                  >
                    {{ employee.firstName.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-semibold text-gray-900">
                      {{ employee.firstName }} {{ employee.lastName }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ employee.email || employee.phoneNumber || 'No contact details' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                  >{{ getEmployeeTypeName(employee.type) }}</span
                >
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ getDepartmentName(employee.departmentId) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ getSpecializationName(employee.specializationId) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button
                    (click)="navigateToViewEmployee(employee.id)"
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <i class="pi pi-eye"></i></button
                  ><button
                    (click)="navigateToEditEmployee(employee.id)"
                    class="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Edit Employee"
                  >
                    <i class="pi pi-pencil"></i></button
                  ><button
                    (click)="deleteEmployee(employee)"
                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Employee"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td></tr
          ></ng-template>
          <ng-template pTemplate="emptymessage"
            ><tr>
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                <i class="pi pi-users text-4xl text-gray-300 mb-3"></i>
                <p class="text-base font-medium text-gray-900">No employees found</p>
                <p class="text-sm mt-1">Get started by creating a new employee.</p>
              </td>
            </tr></ng-template
          >
        </p-table>
      </div>
    </div>
    <p-confirmDialog
      header="Confirmation"
      icon="pi pi-exclamation-triangle"
      acceptButtonStyleClass="p-button-danger"
      rejectButtonStyleClass="p-button-text"
    ></p-confirmDialog
    ><p-toast />
  `,
})
export class EmployeeMasterComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly masterApi = inject(MasterApiService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  employees = signal<EmployeeDto[]>([]);
  departments = signal<DepartmentDto[]>([]);
  specializations = signal<SpecializationDto[]>([]);
  isLoading = signal(false);
  ngOnInit(): void {
    this.loadEmployees();
    this.masterApi.getAllDepartments().subscribe((response) => {
      if (response.success && response.data) this.departments.set(response.data);
    });
    this.masterApi.getAllSpecialization().subscribe((response) => {
      if (response.success && response.data) this.specializations.set(response.data);
    });
  }
  loadEmployees(): void {
    this.isLoading.set(true);
    this.masterApi.getAllEmployees().subscribe({
      next: (response) => {
        if (response.success && response.data) this.employees.set(response.data);
        else this.showError(response.message || 'Failed to load employees');
        this.isLoading.set(false);
      },
      error: (error) => {
        this.showError(error?.error?.message || error?.message || 'Failed to load employees');
        this.isLoading.set(false);
      },
    });
  }
  getDepartmentName(id: string): string {
    return this.departments().find((department) => department.id === id)?.name || 'Unassigned';
  }
  getSpecializationName(id: string | null): string {
    return id
      ? this.specializations().find((specialization) => specialization.id === id)?.name || 'Unknown'
      : 'None';
  }
  getEmployeeTypeName(type: EmployeeType): string {
    return EmployeeType[type] || 'Other';
  }
  navigateToAddEmployee(): void {
    this.router.navigate(['/employees/add']);
  }
  navigateToViewEmployee(id: string): void {
    this.router.navigate(['/employees', id, 'view']);
  }
  navigateToEditEmployee(id: string): void {
    this.router.navigate(['/employees', id, 'edit']);
  }
  deleteEmployee(employee: EmployeeDto): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`,
      accept: () =>
        this.masterApi.deleteEmployee(employee.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.employees.set(this.employees().filter((item) => item.id !== employee.id));
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Employee deleted successfully',
              });
            } else this.showError(response.message || 'Failed to delete employee');
          },
          error: (error) =>
            this.showError(error?.error?.message || error?.message || 'Failed to delete employee'),
        }),
    });
  }
  private showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
  }
}

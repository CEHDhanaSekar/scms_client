import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MasterApiService } from '../../library/api/master-api.service';
import { DepartmentDto } from '../../library/models/department.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-view',
  standalone: true,
  imports: [ButtonModule, CardModule, TagModule, ToastModule, RouterLink, CommonModule],
  providers: [MessageService],
  template: `
    <div class="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <!-- Header & Breadcrumb -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-outline-light"
      >
        <div class="flex items-center gap-4">
          <button
            (click)="goBack()"
            class="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <i class="pi pi-arrow-left"></i>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Department Details</h1>
            <p class="text-sm text-gray-500 mt-1">
              Viewing detailed department information.
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
                    routerLink="/departments"
                    class="hover:text-primary-600 transition-colors ml-1 md:ml-2"
                    >Departments</a
                  >
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <i class="pi pi-angle-right text-xs mx-1"></i>
                  <span class="text-gray-800 ml-1 md:ml-2">Details</span>
                </div>
              </li>
            </ol>
          </nav>

          @if (department()) {
            <button
              (click)="navigateToEditDepartment(department()!.id)"
              class="bg-blue-50 text-blue-600 hover:bg-blue-100 px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 border border-blue-200"
            >
              <i class="pi pi-pencil text-sm"></i>
              Edit Department
            </button>
          }
        </div>
      </div>

      <!-- Content Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-outline-light overflow-hidden p-8">
        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p class="mt-4 text-gray-500 font-medium">Loading department data...</p>
          </div>
        } @else if (department()) {
          <div class="flex flex-col md:flex-row gap-8">
            <!-- Icon Side -->
            <div
              class="flex flex-col items-center space-y-4 md:w-1/3 md:border-r md:border-gray-100 md:pr-8"
            >
              <div
                class="h-32 w-32 rounded-3xl bg-gradient-to-tr from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 text-5xl shadow-inner"
              >
                <i class="pi pi-building"></i>
              </div>
              <div class="text-center">
                <h2 class="text-xl font-bold text-gray-900">{{ department()!.name }}</h2>
                <span
                  class="mt-3 px-4 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full"
                  [ngClass]="
                    !department()!.isDeleted
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  "
                >
                  {{ !department()!.isDeleted ? 'Active Department' : 'Deleted Department' }}
                </span>
              </div>
            </div>

            <!-- Details Side -->
            <div class="md:w-2/3 space-y-6">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
                Department Information
              </h3>

              <div class="grid grid-cols-1 gap-6">
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Description
                  </p>
                  <p class="text-gray-900 font-medium">
                    {{ department()!.description || 'No description provided.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="text-center py-12">
            <i class="pi pi-building text-5xl text-gray-300 mb-4"></i>
            <p class="text-lg font-medium text-gray-900">Department not found</p>
            <p class="text-gray-500 mt-1">The requested department could not be loaded.</p>
          </div>
        }
      </div>
    </div>
    <p-toast />
  `,
})
export class DepartmentViewComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly masterApi = inject(MasterApiService);
  private readonly messageService = inject(MessageService);

  department = signal<DepartmentDto | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      // NOTE: Checking for both departmentId and roleId in case app.routes.ts isn't fixed yet
      const deptId = params.get('departmentId') || params.get('roleId');
      if (deptId) {
        this.loadDepartment(deptId);
      } else {
        this.router.navigate(['/departments']);
      }
    });
  }

  loadDepartment(deptId: string): void {
    this.isLoading.set(true);
    this.masterApi.getDepartmentById(deptId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.department.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Failed to load department',
          });
          this.router.navigate(['/departments']);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || error?.message || 'Failed to load department',
        });
        this.router.navigate(['/departments']);
        this.isLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/departments']);
  }

  navigateToEditDepartment(deptId: string): void {
    this.router.navigate(['/departments', deptId, 'edit']);
  }
}

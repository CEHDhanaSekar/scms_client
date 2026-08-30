import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MasterApiService } from '../../library/api/master-api.service';
import { RoleDto } from '../../library/models/role.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-master',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule, ConfirmDialogModule, RouterLink],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <!-- Header & Breadcrumb -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-outline-light">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Roles Management</h1>
          <p class="text-sm text-gray-500 mt-1">Manage system roles and their associated permissions.</p>
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
                  <span class="text-gray-800 ml-1 md:ml-2">Roles</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <button
            (click)="navigateToAddRole()"
            class="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-primary-500/30 flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <i class="pi pi-plus text-sm"></i>
            Add New Role
          </button>
        </div>
      </div>

      <!-- Roles List Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-outline-light overflow-visible">
        <!-- Table -->
        <p-table
          [value]="roles()"
          [loading]="isLoading()"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[10, 25, 50]"
          [globalFilterFields]="['name', 'description']"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tl-2xl">Role</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tr-2xl">Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-role>
            <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100">
                    <i class="pi pi-shield"></i>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-semibold text-gray-900">{{ role.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ role.description || 'No description provided.' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    (click)="navigateToViewRole(role.id)"
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <i class="pi pi-eye"></i>
                  </button>
                  <button 
                    (click)="navigateToEditRole(role.id)"
                    class="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Edit Role"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button 
                    (click)="deleteRole(role.id)"
                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Role"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="3" class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <i class="pi pi-shield text-4xl text-gray-300 mb-3"></i>
                  <p class="text-base font-medium text-gray-900">No roles found</p>
                  <p class="text-sm mt-1">Get started by creating a new role.</p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <p-confirmDialog 
      header="Confirmation" 
      icon="pi pi-exclamation-triangle"
      acceptButtonStyleClass="p-button-danger"
      rejectButtonStyleClass="p-button-text"
    ></p-confirmDialog>
    <p-toast />
  `,
})
export class RoleMasterComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly masterApi = inject(MasterApiService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  roles = signal<RoleDto[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading.set(true);
    this.masterApi.getAllRoles().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.roles.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Failed to load roles',
          });
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || error?.message || 'Failed to load roles',
        });
        this.isLoading.set(false);
      },
    });
  }

  navigateToAddRole(): void {
    this.router.navigate(['/roles/add']);
  }

  navigateToViewRole(roleId: string): void {
    this.router.navigate(['/roles', roleId, 'view']);
  }

  navigateToEditRole(roleId: string): void {
    this.router.navigate(['/roles', roleId, 'edit']);
  }

  deleteRole(roleId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this role?',
      accept: () => {
        this.masterApi.deleteRole(roleId).subscribe({
          next: (response) => {
            if (response.success) {
              this.roles.set(this.roles().filter(r => r.id !== roleId));
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Role deleted successfully',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message || 'Failed to delete role',
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message || error?.message || 'Failed to delete role',
            });
          },
        });
      }
    });
  }
}

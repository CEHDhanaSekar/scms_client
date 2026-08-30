import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MasterApiService } from '../../library/api/master-api.service';
import { UserDto } from '../../library/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-master',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule, RouterLink],
  providers: [MessageService],
  template: `
    <div class="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <!-- Header & Breadcrumb -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-outline-light">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Users Management</h1>
          <p class="text-sm text-gray-500 mt-1">Manage all user accounts, roles, and statuses in the system.</p>
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
                  <span class="text-gray-800 ml-1 md:ml-2">Users</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <button
            (click)="navigateToAddUser()"
            class="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-primary-500/30 flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <i class="pi pi-plus text-sm"></i>
            Add New User
          </button>
        </div>
      </div>

      <!-- Users List Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-outline-light overflow-visible">
        <!-- Table -->
        <p-table
          [value]="users()"
          [loading]="isLoading()"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[10, 25, 50]"
          [globalFilterFields]="['username', 'email']"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tl-2xl">User</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee ID</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tr-2xl">Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-user>
            <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                    {{ user.username.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-semibold text-gray-900">{{ user.username }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ user.employeeId || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  [ngClass]="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    (click)="navigateToViewUser(user.id)"
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <i class="pi pi-eye"></i>
                  </button>
                  <button 
                    (click)="navigateToEditUser(user.id)"
                    class="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Edit User"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button 
                    (click)="toggleUserStatus(user)"
                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    [title]="user.isActive ? 'Deactivate User' : 'Activate User'"
                  >
                    <i class="pi" [ngClass]="user.isActive ? 'pi-ban text-red-400 hover:text-red-600' : 'pi-check-circle text-green-400 hover:text-green-600'"></i>
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <i class="pi pi-users text-4xl text-gray-300 mb-3"></i>
                  <p class="text-base font-medium text-gray-900">No users found</p>
                  <p class="text-sm mt-1">Get started by creating a new user.</p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
    <p-toast />
  `,
})
export class UserMasterComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly masterApi = inject(MasterApiService);
  private readonly messageService = inject(MessageService);

  users = signal<UserDto[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.masterApi.getAllUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Failed to load users',
          });
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || error?.message || 'Failed to load users',
        });
        this.isLoading.set(false);
      },
    });
  }

  navigateToAddUser(): void {
    this.router.navigate(['/users/add']);
  }

  navigateToViewUser(userId: string): void {
    this.router.navigate(['/users', userId, 'view']);
  }

  navigateToEditUser(userId: string): void {
    this.router.navigate(['/users', userId, 'edit']);
  }

  toggleUserStatus(user: UserDto): void {
    const newStatus = !user.isActive;
    const action = newStatus ? 'activate' : 'deactivate';

    this.masterApi.deleteUser(user.id).subscribe({
      next: (response) => {
        if (response.success) {
          user.isActive = newStatus;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `User ${action}d successfully`,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || `Failed to ${action} user`,
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || error?.message || `Failed to ${action} user`,
        });
      },
    });
  }
}

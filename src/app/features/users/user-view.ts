import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MasterApiService } from '../../library/api/master-api.service';
import { UserDto } from '../../library/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [ButtonModule, CardModule, TagModule, ToastModule, RouterLink, CommonModule],
  providers: [MessageService],
  template: `
    <div class="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <!-- Header & Breadcrumb -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-outline-light">
        <div class="flex items-center gap-4">
          <button 
            (click)="goBack()"
            class="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <i class="pi pi-arrow-left"></i>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-800 tracking-tight">User Details</h1>
            <p class="text-sm text-gray-500 mt-1">Viewing detailed profile information.</p>
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
                  <span class="text-gray-800 ml-1 md:ml-2">Details</span>
                </div>
              </li>
            </ol>
          </nav>
          
          @if (user()) {
            <button
              (click)="navigateToEditUser(user()!.id)"
              class="bg-blue-50 text-blue-600 hover:bg-blue-100 px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 border border-blue-200"
            >
              <i class="pi pi-pencil text-sm"></i>
              Edit User
            </button>
          }
        </div>
      </div>

      <!-- Content Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-outline-light overflow-hidden p-8">
        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p class="mt-4 text-gray-500 font-medium">Loading profile data...</p>
          </div>
        } @else if (user()) {
          <div class="flex flex-col md:flex-row gap-8">
            <!-- Avatar/Profile Side -->
            <div class="flex flex-col items-center space-y-4 md:w-1/3 md:border-r md:border-gray-100 md:pr-8">
              <div class="h-32 w-32 rounded-full bg-gradient-to-tr from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 text-5xl font-bold shadow-inner">
                {{ user()!.username.charAt(0).toUpperCase() }}
              </div>
              <div class="text-center">
                <h2 class="text-xl font-bold text-gray-900">{{ user()!.username }}</h2>
                <p class="text-sm text-gray-500 mb-3">{{ user()!.email }}</p>
                <span 
                  class="px-4 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full"
                  [ngClass]="user()!.isActive ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'"
                >
                  {{ user()!.isActive ? 'Active Account' : 'Inactive Account' }}
                </span>
              </div>
            </div>

            <!-- Details Side -->
            <div class="md:w-2/3 space-y-6">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Account Information</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Employee ID</p>
                  <p class="text-gray-900 font-medium">{{ user()!.employeeId || 'Not assigned' }}</p>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">System ID</p>
                  <p class="text-gray-900 font-mono text-sm break-all">{{ user()!.id }}</p>
                </div>

                <div class="sm:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Assigned Roles</p>
                  <div class="flex flex-wrap gap-2">
                    @if (user()!.roleIds.length > 0) {
                      @for (role of user()!.roleIds; track role) {
                        <span class="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg shadow-sm">
                          {{ role }}
                        </span>
                      }
                    } @else {
                      <span class="text-gray-500 italic text-sm">No roles assigned</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="text-center py-12">
            <i class="pi pi-user-minus text-5xl text-gray-300 mb-4"></i>
            <p class="text-lg font-medium text-gray-900">User not found</p>
            <p class="text-gray-500 mt-1">The requested user profile could not be loaded.</p>
          </div>
        }
      </div>
    </div>
    <p-toast />
  `,
})
export class UserViewComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly masterApi = inject(MasterApiService);
  private readonly messageService = inject(MessageService);

  user = signal<UserDto | null>(null);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('userId');
      if (userId) {
        this.loadUser(userId);
      }
    });
  }

  loadUser(userId: string): void {
    this.isLoading.set(true);
    this.masterApi.getUserById(userId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.user.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Failed to load user',
          });
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || error?.message || 'Failed to load user',
        });
        this.isLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  navigateToEditUser(userId: string): void {
    this.router.navigate(['/users', userId, 'edit']);
  }
}

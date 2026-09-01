import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MasterApiService } from '../../library/api/master-api.service';
import { SpecializationDto } from '../../library/models/specialization.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-specialization-master',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule, ConfirmDialogModule, RouterLink],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <!-- Header & Breadcrumb -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-outline-light">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Specializations Management</h1>
          <p class="text-sm text-gray-500 mt-1">Manage specializations across departments.</p>
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
                  <span class="text-gray-800 ml-1 md:ml-2">Specializations</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <button
            (click)="navigateToAddSpecialization()"
            class="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-primary-500/30 flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <i class="pi pi-plus text-sm"></i>
            Add New Specialization
          </button>
        </div>
      </div>

      <!-- Specializations List Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-outline-light overflow-visible">
        <!-- Table -->
        <p-table
          [value]="specializations()"
          [loading]="isLoading()"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[10, 25, 50]"
          [globalFilterFields]="['name', 'description']"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tl-2xl">Specialization</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tr-2xl">Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-specialization>
            <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100">
                    <i class="pi pi-star"></i>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-semibold text-gray-900">{{ specialization.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ specialization.description || 'No description provided.' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    (click)="navigateToViewSpecialization(specialization.id)"
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <i class="pi pi-eye"></i>
                  </button>
                  <button 
                    (click)="navigateToEditSpecialization(specialization.id)"
                    class="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Edit Specialization"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button 
                    (click)="deleteSpecialization(specialization.id)"
                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Specialization"
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
                  <i class="pi pi-star text-4xl text-gray-300 mb-3"></i>
                  <p class="text-base font-medium text-gray-900">No specializations found</p>
                  <p class="text-sm mt-1">Get started by creating a new specialization.</p>
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
export class SpecializationMasterComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly masterApi = inject(MasterApiService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  specializations = signal<SpecializationDto[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadSpecializations();
  }

  loadSpecializations(): void {
    this.isLoading.set(true);
    this.masterApi.getAllSpecialization().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.specializations.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'Failed to load specializations',
          });
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || error?.message || 'Failed to load specializations',
        });
        this.isLoading.set(false);
      },
    });
  }

  navigateToAddSpecialization(): void {
    this.router.navigate(['/specializations/add']);
  }

  navigateToViewSpecialization(id: string): void {
    this.router.navigate(['/specializations', id, 'view']);
  }

  navigateToEditSpecialization(id: string): void {
    this.router.navigate(['/specializations', id, 'edit']);
  }

  deleteSpecialization(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this specialization?',
      accept: () => {
        this.masterApi.deleteSpecialization(id).subscribe({
          next: (response) => {
            if (response.success) {
              this.specializations.set(this.specializations().filter(r => r.id !== id));
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Specialization deleted successfully',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.message || 'Failed to delete specialization',
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message || error?.message || 'Failed to delete specialization',
            });
          },
        });
      }
    });
  }
}

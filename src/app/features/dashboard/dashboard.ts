import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/security/auth.service';
import { TenantContext } from '../../services/signals/tenant-context.signal';
import { UserSignal } from '../../services/signals/user.signal';
import { ButtonModule } from 'primeng/button';
import { MENU_CONFIG } from '../../library/constants/menu.constants';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonModule, DatePipe, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-surface">
      <!-- Sidebar -->
      <aside class="w-64 bg-primary-700 text-white flex flex-col">
        <div class="px-6 py-5 text-lg font-semibold border-b border-white/10">
          {{ tenantContext.tenant()?.name || 'Smart Clinic Management System' }}
        </div>
        <nav class="flex-1 overflow-y-auto py-4">
          @for (menuItem of menuConfig; track menuItem.label) {
            @if (menuItem.children?.length) {
              <p class="px-6 mt-6 text-xs uppercase tracking-wide text-primary-200 mb-2">
                {{ menuItem.label }}
              </p>
              @for (child of menuItem.children; track child.label) {
                @if (child.route && !child.comingSoon) {
                  <a
                    [routerLink]="child.route"
                    routerLinkActive="bg-white/10"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="flex items-center gap-3 px-6 py-2.5 hover:bg-white/10"
                  >
                    <i [class]="child.icon"></i>
                    {{ child.label }}
                  </a>
                } @else {
                  <div class="flex items-center gap-3 px-6 py-2.5 opacity-50 cursor-not-allowed">
                    <i [class]="child.icon"></i>
                    {{ child.label }}
                    @if (child.comingSoon) {
                      <span class="ml-auto text-[10px] bg-secondary-500 px-2 py-0.5 rounded-full"
                        >Soon</span
                      >
                    }
                  </div>
                }
              }
            } @else if (menuItem.route && !menuItem.comingSoon) {
              <a
                [routerLink]="menuItem.route"
                routerLinkActive="bg-white/10"
                [routerLinkActiveOptions]="{ exact: true }"
                class="flex items-center gap-3 px-6 py-2.5 hover:bg-white/10"
              >
                <i [class]="menuItem.icon"></i>
                {{ menuItem.label }}
              </a>
            }
          }
        </nav>
      </aside>

      <!-- Main -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Topbar -->
        <header
          class="h-16 flex items-center justify-between px-6 bg-white border-b border-outline-light"
        >
          <span class="text-content font-medium">Dashboard</span>
          <div class="flex items-center gap-4">
            <i class="pi pi-bell text-content-muted"></i>
            <span class="text-sm text-content-muted">{{
              userSignal.user()?.username || 'User'
            }}</span>
            <p-button
              type="button"
              label="Sign Out"
              size="small"
              severity="primary"
              icon="pi pi-sign-out"
              styleClass="sign-out-button"
              (click)="logout()"
            />
          </div>
        </header>

        <main class="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h1 class="text-xl font-semibold text-content">
              Good morning, {{ userSignal.user()?.username || 'User' }}
            </h1>
            <p class="text-sm text-content-subtle">{{ today | date: 'EEEE, MMMM d, y' }}</p>
          </div>

          <!-- Stat cards -->
          <div class="grid grid-cols-4 gap-4">
            <div class="bg-white rounded-lg border border-outline-light p-4 shadow-sm">
              <p class="text-xs text-content-subtle">Total Patients</p>
              <p class="text-2xl font-semibold text-primary-700 mt-1">0</p>
            </div>
            <div class="bg-white rounded-lg border border-outline-light p-4 shadow-sm">
              <p class="text-xs text-content-subtle">Total Employees</p>
              <p class="text-2xl font-semibold text-primary-700 mt-1">0</p>
            </div>
            <div class="bg-white rounded-lg border border-outline-light p-4 shadow-sm">
              <p class="text-xs text-content-subtle">Departments</p>
              <p class="text-2xl font-semibold text-primary-700 mt-1">0</p>
            </div>
            <div class="bg-white rounded-lg border border-outline-light p-4 shadow-sm">
              <p class="text-xs text-content-subtle">Active Users</p>
              <p class="text-2xl font-semibold text-primary-700 mt-1">0</p>
            </div>
          </div>

          <!-- Recent activity + quick actions -->
          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-2 bg-white rounded-lg border border-outline-light p-4 shadow-sm">
              <h2 class="text-sm font-medium text-content mb-3">Recently added patients</h2>
              <!-- p-table or simple list here -->
            </div>
            <div class="bg-white rounded-lg border border-outline-light p-4 shadow-sm">
              <h2 class="text-sm font-medium text-content mb-3">Quick actions</h2>
              <button
                class="w-full text-left px-3 py-2 rounded-md hover:bg-surface-container text-sm text-content mb-1"
              >
                + Add patient
              </button>
              <button
                class="w-full text-left px-3 py-2 rounded-md hover:bg-surface-container text-sm text-content"
              >
                + Add employee
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly tenantContext = inject(TenantContext);
  readonly userSignal = inject(UserSignal);
  readonly menuConfig = MENU_CONFIG;
  readonly today = new Date();

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}

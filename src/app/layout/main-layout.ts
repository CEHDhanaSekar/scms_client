import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/security/auth.service';
import { TenantContext } from '../services/signals/tenant-context.signal';
import { UserSignal } from '../services/signals/user.signal';
import { ButtonModule } from 'primeng/button';
import { AuthApiService } from '../library/api/auth-api.service';
import { MenuService } from '../services/security/menu.service';
import { PermissionService } from '../services/security/permission.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [ButtonModule, RouterLink, RouterLinkActive, RouterOutlet, NgClass],
  template: `
    <div class="flex h-screen bg-surface overflow-hidden">
      <!-- Sidebar -->
      <aside
        class="bg-primary-700 text-white flex flex-col transition-all duration-300 z-20 shrink-0"
        [ngClass]="{
          'w-64': !isCollapsed(),
          'w-20': isCollapsed(),
          'absolute md:relative h-full': true,
          '-translate-x-full md:translate-x-0': isMobileHidden() && !isCollapsed(),
        }"
      >
        <div class="h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
          @if (!isCollapsed()) {
            <span class="text-lg font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
              {{ tenantContext.tenant()?.name || 'SCMS' }}
            </span>
            <button
              (click)="toggleCollapse()"
              class="text-white hover:bg-white/10 p-1.5 rounded-md hidden md:block"
            >
              <i class="pi pi-angle-left"></i>
            </button>
          } @else {
            <span class="text-xl font-bold mx-auto">SC</span>
            <!-- Hidden button to keep spacing or just let it center -->
          }
        </div>
        <nav class="flex-1 overflow-y-auto py-4 custom-scrollbar">
          @for (menuItem of menuConfig(); track menuItem.label) {
            @if (menuItem.children?.length) {
              @if (!isCollapsed()) {
                <p class="px-6 mt-6 text-xs uppercase tracking-wide text-primary-200 mb-2 truncate">
                  {{ menuItem.label }}
                </p>
              } @else {
                <div class="mt-6 mb-2 border-t border-white/10 mx-4"></div>
              }

              @for (child of menuItem.children; track child.label) {
                @if (child.route && !child.comingSoon) {
                  <a
                    [routerLink]="child.route"
                    routerLinkActive="bg-white/10 border-l-4 border-white"
                    [routerLinkActiveOptions]="{ exact: false }"
                    class="flex items-center gap-3 px-6 py-2.5 hover:bg-white/10 transition-colors"
                    [title]="isCollapsed() ? child.label : ''"
                    [ngClass]="{ 'justify-center px-0': isCollapsed() }"
                  >
                    <i
                      [class]="child.icon"
                      class="text-lg"
                      [ngClass]="{ 'ml-[-4px]': !isCollapsed() }"
                    ></i>
                    @if (!isCollapsed()) {
                      <span class="whitespace-nowrap">{{ child.label }}</span>
                    }
                  </a>
                } @else {
                  <div
                    class="flex items-center gap-3 px-6 py-2.5 opacity-50 cursor-not-allowed"
                    [ngClass]="{ 'justify-center px-0': isCollapsed() }"
                    [title]="isCollapsed() ? child.label + ' (Soon)' : ''"
                  >
                    <i
                      [class]="child.icon"
                      class="text-lg"
                      [ngClass]="{ 'ml-[-4px]': !isCollapsed() }"
                    ></i>
                    @if (!isCollapsed()) {
                      <span class="whitespace-nowrap">{{ child.label }}</span>
                      @if (child.comingSoon) {
                        <span class="ml-auto text-[10px] bg-secondary-500 px-2 py-0.5 rounded-full"
                          >Soon</span
                        >
                      }
                    }
                  </div>
                }
              }
            } @else if (menuItem.route && !menuItem.comingSoon) {
              <a
                [routerLink]="menuItem.route"
                routerLinkActive="bg-white/10 border-l-4 border-white"
                [routerLinkActiveOptions]="{ exact: true }"
                class="flex items-center gap-3 px-6 py-2.5 hover:bg-white/10 transition-colors"
                [title]="isCollapsed() ? menuItem.label : ''"
                [ngClass]="{ 'justify-center px-0': isCollapsed() }"
              >
                <i
                  [class]="menuItem.icon"
                  class="text-lg"
                  [ngClass]="{ 'ml-[-4px]': !isCollapsed() }"
                ></i>
                @if (!isCollapsed()) {
                  <span class="whitespace-nowrap">{{ menuItem.label }}</span>
                }
              </a>
            }
          }
        </nav>

        <!-- Expand button at bottom if collapsed -->
        @if (isCollapsed()) {
          <div class="p-4 border-t border-white/10 hidden md:flex justify-center">
            <button (click)="toggleCollapse()" class="text-white hover:bg-white/10 p-2 rounded-md">
              <i class="pi pi-angle-right text-xl"></i>
            </button>
          </div>
        }
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <!-- Topbar -->
        <header
          class="h-16 flex items-center justify-between px-4 lg:px-6 bg-white border-b border-outline-light shrink-0 z-10 shadow-sm"
        >
          <div class="flex items-center gap-3">
            <button
              (click)="toggleMobileSidebar()"
              class="md:hidden text-content-muted hover:bg-surface-container p-2 rounded-md transition-colors"
            >
              <i class="pi pi-bars text-xl"></i>
            </button>
            <span class="text-content font-medium hidden sm:block">SCMS</span>
          </div>
          <div class="flex items-center gap-4">
            <button
              class="p-2 text-content-muted hover:bg-surface-container rounded-full transition-colors relative"
            >
              <i class="pi pi-bell text-xl"></i>
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div class="flex items-center gap-3 pl-2 border-l border-outline-light">
              <div
                class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold shadow-sm"
              >
                {{ (userSignal.user()?.username || 'U').charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm font-medium text-content hidden sm:block">{{
                userSignal.user()?.username || 'User'
              }}</span>
            </div>
            <p-button
              type="button"
              size="small"
              severity="secondary"
              [text]="true"
              icon="pi pi-sign-out"
              (click)="logout()"
              pTooltip="Sign Out"
            />
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto bg-surface relative">
          <!-- Mobile Sidebar Overlay -->
          @if (!isMobileHidden()) {
            <div
              class="fixed inset-0 bg-black/50 z-10 md:hidden backdrop-blur-sm transition-opacity"
              (click)="toggleMobileSidebar()"
            ></div>
          }
          <div class="p-4 md:p-6 h-full">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
      }
      .custom-scrollbar:hover::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
      }
    `,
  ],
})
export class MainLayoutComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly authApi = inject(AuthApiService);

  readonly tenantContext = inject(TenantContext);
  readonly userSignal = inject(UserSignal);
  readonly menuConfig = inject(MenuService).menu;

  private readonly permissionService = inject(PermissionService);

  isCollapsed = signal<boolean>(false);
  isMobileHidden = signal<boolean>(true);

  ngOnInit(): void {
    const userId = this.userSignal.user()?.id ?? '';
    if (!userId) {
      return;
    }

    this.authApi.getUserPermissions(userId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.permissionService.setPermissions(res.data);
        }
      },
    });

    // Auto collapse on smaller screens when loading
    if (window.innerWidth < 1024) {
      this.isCollapsed.set(true);
    }
  }

  toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }

  toggleMobileSidebar(): void {
    this.isMobileHidden.update((v) => !v);
    if (!this.isMobileHidden()) {
      this.isCollapsed.set(false); // Ensure expanded when showing on mobile
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}

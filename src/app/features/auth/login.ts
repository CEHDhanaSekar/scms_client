import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../services/security/auth.service';
import { TenantContext } from '../../services/signals/tenant-context.signal';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule],
  template: `
    <main class="min-h-screen bg-surface flex flex-col">
      <!-- Login Content -->
      <div class="flex-1 flex items-center justify-center p-4 md:p-6">
        <!-- Split Login Card -->
        <div
          class="w-full max-w-6xl mx-auto flex overflow-hidden rounded-xl login-card-shadow bg-white"
        >
          <!-- ============================================
           LEFT SIDE
      ============================================= -->
          <div class="hidden md:block md:w-1/2 relative bg-surface-container min-h-150">
            <!-- Background Image -->
            <div
              class="absolute inset-0 bg-cover bg-center"
              [style.background-image]="'url(' + clinicImageUrl + ')'"
            ></div>

            <!-- Blue Overlay -->
            <div class="absolute inset-0 login-image-overlay"></div>

            <!-- Logo + Content -->
            <div class="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
              <!-- Logo -->
              <img
                [src]="logoUrl"
                alt="SCMS Logo"
                class="w-32 h-32 mb-10 object-cover rounded-full"
              />

              <!-- Title -->
              <h2 class="text-3xl font-semibold text-center mb-3">
                Smart Clinic Management System
              </h2>

              <!-- Description -->
              <p class="text-lg leading-7 text-center text-primary-300 max-w-md">
                Streamlining healthcare management with clinical precision and efficiency.
              </p>
            </div>
          </div>

          <!-- ============================================
           RIGHT SIDE
      ============================================= -->
          <div class="w-full md:w-1/2 bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div class="w-full max-w-md mx-auto">
              <!-- Tenant identity -->
              <div class="flex items-center justify-center gap-3 mb-8">
                <img
                  [src]="tenantContext.tenant()?.logoUrl || logoUrl"
                  [alt]="(tenantContext.tenant()?.name || 'SCMS') + ' logo'"
                  class="w-12 h-12 lg:w-20 lg:h-20 object-cover rounded-full"
                />

                <p class="text-lg font-semibold text-content-muted">
                  <span class="text-content">{{ tenantContext.tenant()?.name || 'SCMS' }}</span>
                </p>
              </div>

              <!-- Mobile Logo -->
              <div class="md:hidden flex justify-center mb-8">
                <img
                  [src]="tenantContext.tenant()?.logoUrl || logoUrl"
                  [alt]="(tenantContext.tenant()?.name || 'SCMS') + ' logo'"
                  class="w-24 h-24 object-contain"
                />
              </div>

              <!-- Header -->
              <div class="mb-8">
                <h1 class="text-xl md:text-2xl font-semibold text-content mb-1">Welcome to SCMS</h1>

                <p class="text-base leading-6 text-content-muted">Sign in to manage your clinic</p>
              </div>

              <!-- ========================================
               LOGIN FORM
          ========================================= -->
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
                <!-- Username -->
                <div>
                  <label for="username" class="block text-sm font-medium text-content mb-2">
                    Username
                  </label>

                  <div class="relative">
                    <!-- Icon -->
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                      <fa-icon [icon]="userIcon" class="text-outline"></fa-icon>
                    </div>

                    <!-- Input -->
                    <input
                      id="username"
                      type="text"
                      formControlName="username"
                      autocomplete="username"
                      placeholder="Enter your username"
                      class="block w-full pl-10 pr-3 py-2.5 border border-outline-light rounded
                      bg-white text-content placeholder:text-content-subtle focus:outline-none
                      focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>

                  <!-- Validation -->
                  @if (
                    loginForm.controls['username'].touched && loginForm.controls['username'].invalid
                  ) {
                    <p class="mt-1 text-xs text-red-600">Username is required.</p>
                  }
                </div>

                <!-- Password -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <label for="password" class="block text-sm font-medium text-content">
                      Password
                    </label>

                    <button
                      type="button"
                      class="text-xs font-semibold text-primary hover:text-secondary underline transition-colors"
                      (click)="forgotPassword()"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div class="relative">
                    <!-- Icon -->
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                      <fa-icon [icon]="lockIcon" class="text-outline"></fa-icon>
                    </div>

                    <!-- Password -->
                    <input
                      id="password"
                      [type]="showPassword() ? 'text' : 'password'"
                      formControlName="password"
                      autocomplete="current-password"
                      placeholder="Enter your password"
                      class="block w-full pl-10 pr-10 py-2.5 border border-outline-light rounded
                      bg-white text-content placeholder:text-content-subtle focus:outline-none
                      focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />

                    <!-- Show / Hide Password -->
                    <button
                      type="button"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary"
                      (click)="togglePassword()"
                    >
                      <fa-icon [icon]="showPassword() ? eyeSlashIcon : eyeIcon"></fa-icon>
                    </button>
                  </div>

                  @if (
                    loginForm.controls['password'].touched && loginForm.controls['password'].invalid
                  ) {
                    <p class="mt-1 text-xs text-red-600">Password is required.</p>
                  }
                </div>

                <!-- Remember Me -->
                <div class="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    formControlName="rememberMe"
                    class="h-4 w-4 rounded border-outline-light text-primary focus:ring-primary"
                  />

                  <label for="remember-me" class="ml-2 text-sm text-content-muted">
                    Remember Me
                  </label>
                </div>

                <!-- Submit -->
                <div>
                  <button
                    type="submit"
                    [disabled]="loginForm.invalid || isLoading"
                    class="w-full flex justify-center items-center py-2.5 px-4 rounded font-medium
                    text-sm text-white bg-primary hover:bg-primary-600 active:bg-primary-800
                    disabled:opacity-60 disabled:cursor-not-allowed button-shadow focus:outline-none
                    focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                  >
                    @if (isLoading()) {
                      <span class="flex items-center gap-2">
                        <span
                          class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
                        ></span>

                        Signing In...
                      </span>
                    } @else {
                      Sign In
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================
       FOOTER
  ============================================= -->
      <footer
        class="bg-white w-full sticky bottom-0 py-4 px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-3"
      >
        <!-- Brand -->
        <div class="text-sm font-medium text-content">SCMS</div>

        <!-- Copyright -->
        <div class="text-sm text-secondary">
          © 2026 Smart Clinic Management System. All rights reserved.
        </div>

        <!-- Links -->
        <nav class="flex gap-5">
          <button
            type="button"
            class="text-sm text-content-muted hover:text-primary underline transition-all"
            (click)="privacyPolicy()"
          >
            Privacy Policy
          </button>

          <button
            type="button"
            class="text-sm text-content-muted hover:text-primary underline transition-all"
            (click)="termsOfService()"
          >
            Terms of Service
          </button>

          <button
            type="button"
            class="text-sm text-content-muted hover:text-primary underline transition-all"
            (click)="support()"
          >
            Support
          </button>
        </nav>
      </footer>
    </main>
  `,
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  readonly tenantContext = inject(TenantContext);

  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  lockIcon = faLock;
  userIcon = faUser;
  eyeIcon = faEye;
  eyeSlashIcon = faEyeSlash;

  logoUrl = '/assets/images/scms-logo.jpg';
  clinicImageUrl = '/assets/images/clinic-login.jpg';

  loginForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.loginForm = this.fb.nonNullable.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.getRawValue();
    this.isLoading.set(true);

    this.authService
      .login({ usernameOrEmail: credentials.username, password: credentials.password })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.router.navigate(['/home']);
            return;
          }
          alert(result.message);
        },
        error: (error) => {
          alert(error?.error?.message || error?.message || 'Login failed. Please try again.');
        },
      });
  }

  forgotPassword(): void {
    // Navigate to forgot password page
    console.log('Forgot password');
  }

  privacyPolicy(): void {
    console.log('Privacy policy');
  }

  termsOfService(): void {
    console.log('Terms of service');
  }

  support(): void {
    console.log('Support');
  }
}

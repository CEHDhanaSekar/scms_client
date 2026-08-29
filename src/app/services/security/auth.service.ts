import { inject, Injectable } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthApiService } from '../../library/api/auth-api.service';
import {
  TenantAuthResponseDto,
  TenantLoginRequestDto,
  TenantLogoutRequestDto,
  TenantRefreshTokenRequestDto,
} from '../../library/models/auth.model';
import { ApiResponse } from '../../library/models/common.model';
import { TenantResolveDto } from '../../library/models/tenant.model';
import { StorageService } from '../common/storage.service';
import { TenantContext } from '../signals/tenant-context.signal';
import { UserSignal } from '../signals/user.signal';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authApi = inject(AuthApiService);
  private readonly storage = inject(StorageService);
  private readonly tenantContext = inject(TenantContext);
  private readonly userSignal = inject(UserSignal);
  private readonly permissionService = inject(PermissionService);

  private readonly tenantStorageKey = 'scms.tenant';

  initialize(): Observable<ApiResponse<TenantResolveDto> | null> {
    this.restoreState();

    return this.authApi.tenantResolve().pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.tenantContext.setTenant(response.data);
          this.storage.setItem(this.tenantStorageKey, response.data, 'local');
          this.storage.setItem(this.tenantStorageKey, response.data, 'session');
        }
      }),
      catchError(() => of(null)),
    );
  }

  login(request: TenantLoginRequestDto): Observable<ApiResponse<TenantAuthResponseDto>> {
    return this.authApi.login(request).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.userSignal.setSession(response.data);
        }
      }),
    );
  }

  logout(): Observable<ApiResponse<null> | null> {
    return defer(() => {
      const session = this.userSignal.getSession();
      if (!session?.refreshToken) {
        this.clearAuthState();
        return of(null);
      }

      const request: TenantLogoutRequestDto = { refreshToken: session.refreshToken };
      return this.authApi.logout(request);
    }).pipe(
      tap(() => this.clearAuthState()),
      catchError((error) => {
        this.clearAuthState();
        throw error;
      }),
    );
  }

  refreshToken(): Observable<ApiResponse<TenantAuthResponseDto>> {
    return defer(() => {
      const session = this.userSignal.getSession();
      const request: TenantRefreshTokenRequestDto = {
        refreshToken: session?.refreshToken ?? '',
      };
      return this.authApi.refreshToken(request);
    }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.userSignal.setSession(response.data);
        }
      }),
    );
  }

  get accessToken(): string | null {
    return this.userSignal.accessToken();
  }

  private restoreState(): void {
    const tenant =
      this.storage.getItem<TenantResolveDto>(this.tenantStorageKey, 'local') ??
      this.storage.getItem<TenantResolveDto>(this.tenantStorageKey, 'session');
    if (tenant) {
      this.tenantContext.setTenant(tenant);
      this.storage.setItem(this.tenantStorageKey, tenant, 'session');
    }
  }

  private clearAuthState(): void {
    this.storage.clear();
    this.userSignal.clearSession();
    this.permissionService.clear();
  }
}

import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthApiService } from '../../library/api/auth-api.service';
import { TenantContext } from '../signals/tenant-context.signal';
import { UserSignal } from '../signals/user.signal';

const AUTH_FREE_ROUTES = ['/v1/auth/login', '/v1/auth/refresh-token'];
const TENANT_RESOLVE_ROUTE = '/resolve';

export const customHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const authApiService = inject(AuthApiService);
  const userSignal = inject(UserSignal);
  const tenantContext = inject(TenantContext);
  const router = inject(Router);

  const shouldSkipAuth = AUTH_FREE_ROUTES.some((route) => req.url.includes(route));
  const shouldSkipTenant = req.url.toLowerCase().includes(TENANT_RESOLVE_ROUTE);
  const session = userSignal.getSession();
  const accessToken = session?.accessToken;
  const tenantCode = tenantContext.tenant()?.tenantCode;

  const headers: Record<string, string> = {};
  if (!shouldSkipTenant && tenantCode) {
    headers['x-tenant-code'] = tenantCode;
  }

  if (shouldSkipAuth || !accessToken) {
    return next(req.clone({ setHeaders: headers }));
  }

  if (isAccessTokenExpired(session.accessExpiresAt)) {
    const refreshToken = session.refreshToken;

    if (!refreshToken) {
      userSignal.clearSession();
      router.navigate(['/login']);
      return throwError(
        () => new HttpErrorResponse({ status: 401, statusText: 'Session expired' }),
      );
    }

    return authApiService.refreshToken({ refreshToken }).pipe(
      switchMap((response) => {
        if (response?.success && response.data) {
          userSignal.setSession(response.data);

          const authReq = req.clone({
            setHeaders: {
              ...headers,
              Authorization: `Bearer ${response.data.accessToken}`,
            },
          });

          return next(authReq);
        }

        userSignal.clearSession();
        router.navigate(['/login']);
        return throwError(
          () =>
            new HttpErrorResponse({
              status: 401,
              statusText: response?.message || 'Session expired',
            }),
        );
      }),
      catchError(() => {
        userSignal.clearSession();
        router.navigate(['/login']);
        return throwError(
          () => new HttpErrorResponse({ status: 401, statusText: 'Session expired' }),
        );
      }),
    );
  }

  const authReq = req.clone({
    setHeaders: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return next(authReq);
};

function isAccessTokenExpired(expiredAt: string): boolean {
  if (!expiredAt) {
    return true;
  }

  const expiresAtTimestamp = new Date(expiredAt).getTime();

  if (Number.isNaN(expiresAtTimestamp)) {
    return true;
  }

  return expiresAtTimestamp <= Date.now();
}

import { inject, Injectable } from '@angular/core';
import { CommonHttpService } from '../../services/common/common-http.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TenantLoginRequestDto,
  TenantRefreshTokenRequestDto,
  TenantLogoutRequestDto,
  TenantAuthResponseDto,
  UserPermissionsResponseDto,
} from '../models/auth.model';
import { ApiResponse } from '../models/common.model';
import { TenantResolveDto } from '../models/tenant.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly httpService = inject(CommonHttpService);

  tenantResolve(): Observable<ApiResponse<TenantResolveDto>> {
    return this.httpService.getData(environment.serverUrlV1, 'Resolve');
  }

  login(req: TenantLoginRequestDto): Observable<ApiResponse<TenantAuthResponseDto>> {
    return this.httpService.postData(environment.serverUrlV1, 'auth/login', req);
  }

  logout(req: TenantLogoutRequestDto): Observable<ApiResponse<null>> {
    return this.httpService.postData(environment.serverUrlV1, 'auth/logout', req);
  }

  refreshToken(req: TenantRefreshTokenRequestDto): Observable<ApiResponse<TenantAuthResponseDto>> {
    return this.httpService.postData(environment.serverUrlV1, 'auth/refresh-token', req);
  }

  getUserPermissions(userId: string): Observable<ApiResponse<UserPermissionsResponseDto>> {
    return this.httpService.getData(environment.serverUrlV1, `User/${userId}/permissions`);
  }
}

import { UserDto } from './user.model';

export interface TenantLoginRequestDto {
  usernameOrEmail: string;
  password: string;
}

export interface TenantRefreshTokenRequestDto {
  refreshToken: string;
}

export interface TenantRevokeTokenRequestDto {
  refreshToken: string;
}

export interface TenantLogoutRequestDto {
  refreshToken: string;
}

export interface TenantAuthResponseDto {
  accessToken: string;
  accessExpiresAt: string; // DateTime
  refreshToken: string;
  user: UserDto;
}

export interface UserPermissionDto {
  id: string; // Guid
  code: string; // e.g. "patients.create"
  description: string | null;
  roleName: string; // role that granted this permission
}

export interface UserPermissionsResponseDto {
  userId: string; // Guid
  permissions: UserPermissionDto[];
}

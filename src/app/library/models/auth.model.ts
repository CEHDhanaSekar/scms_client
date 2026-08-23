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

import { computed, Injectable, signal } from '@angular/core';
import { UserPermissionDto, UserPermissionsResponseDto } from '../../library/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly permissionState = signal<UserPermissionDto[]>([]);

  readonly permissions = computed(() => this.permissionState());
  readonly permissionCodes = computed(
    () => new Set(this.permissionState().map((permission) => permission.code)),
  );

  setPermissions(response: UserPermissionsResponseDto): void {
    this.permissionState.set(response.permissions ?? []);
  }

  hasPermission(permissionCode: string | undefined): boolean {
    return !permissionCode || this.permissionCodes().has(permissionCode);
  }

  clear(): void {
    this.permissionState.set([]);
  }
}

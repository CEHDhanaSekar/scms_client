import { BaseDto } from './common.model';

export interface RoleDto extends BaseDto {
  name: string;
  description: string | null;
}

export interface CreateRoleDto {
  name: string;
  description: string | null;
  isActive?: boolean; // Defaults to true in the backend
  permissionIds: string[]; // List<Guid>
}

export interface UpdateRoleDto extends BaseDto {
  name: string;
  description: string | null;
  permissionIds: string[]; // List<Guid>
}

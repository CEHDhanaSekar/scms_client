import { BaseDto } from './common.model';

export interface UserRoleInfoDto {
  id: string; // Guid
  name: string;
}

export interface UserDto extends BaseDto {
  username: string;
  email: string;
  lastLoginAt: string | null; // DateTime?
  employeeId: string | null; // Guid?
  isDeleted: boolean;
  roleIds: string[]; // List<Guid>
  roles: UserRoleInfoDto[];
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  employeeId: string | null; // Guid?
  roleIds: string[]; // List<Guid>
}

export interface UpdateUserDto extends BaseDto {
  username: string;
  email: string;
  employeeId: string | null; // Guid?
  roleIds: string[]; // List<Guid>
  isActive: boolean;
}

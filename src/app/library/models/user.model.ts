export interface UserDto {
  id: string; // Guid
  username: string;
  email: string;
  isActive: boolean;
  lastLoginAt: string | null; // DateTime?
  employeeId: string | null; // Guid?
  isDeleted: boolean;
  roleIds: string[]; // List<Guid>
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  employeeId: string | null; // Guid?
  roleIds: string[]; // List<Guid>
}

export interface UpdateUserDto {
  id: string; // Guid
  username: string;
  email: string;
  isActive: boolean;
  employeeId: string | null; // Guid?
  roleIds: string[]; // List<Guid>
}

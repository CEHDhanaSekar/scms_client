export interface DepartmentDto {
  id: string; // Guid
  name: string;
  description: string | null;
  isDeleted: boolean;
}

export interface CreateDepartmentDto {
  name: string;
  description: string | null;
}

export interface UpdateDepartmentDto {
  id: string; // Guid
  name: string;
  description: string | null;
}

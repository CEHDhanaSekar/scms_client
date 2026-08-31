export interface SpecializationDto {
  id: string; // Guid
  name: string;
  description: string | null;
  departmentId: string | null; // Guid?
  isDeleted: boolean;
}

export interface CreateSpecializationDto {
  name: string;
  description: string | null;
  departmentId: string | null; // Guid?
}

export interface UpdateSpecializationDto {
  id: string; // Guid
  name: string;
  description: string | null;
  departmentId: string | null; // Guid?
}

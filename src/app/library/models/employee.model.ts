export interface EmployeeDto {
  id: string; // Guid
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  email: string | null;
  typeId: string; // Guid
  departmentId: string; // Guid
  specializationId: string | null; // Guid?
  isDeleted: boolean;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  email: string | null;
  typeId: string; // Guid
  departmentId: string; // Guid
  specializationId: string | null; // Guid?
}

export interface UpdateEmployeeDto {
  id: string; // Guid
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  email: string | null;
  typeId: string; // Guid
  departmentId: string; // Guid
  specializationId: string | null; // Guid?
}

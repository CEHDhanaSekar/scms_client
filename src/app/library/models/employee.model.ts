export interface EmployeeDto {
  id: string; // Guid
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  email: string | null;
  type: EmployeeType;
  departmentId: string; // Guid
  specializationId: string | null; // Guid?
  isDeleted: boolean;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  email: string | null;
  type: EmployeeType;
  departmentId: string; // Guid
  specializationId: string | null; // Guid?
}

export interface UpdateEmployeeDto {
  id: string; // Guid
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  email: string | null;
  type: EmployeeType;
  departmentId: string; // Guid
  specializationId: string | null; // Guid?
}

export enum EmployeeType {
  Doctor = 1,
  Nurse = 2,
  Receptionist = 3,
  Admin = 4,
  Other = 5,
}

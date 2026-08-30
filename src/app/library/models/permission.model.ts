import { BaseDto } from './common.model';

export interface TenantPermissionDto extends BaseDto {
  id: string; // Guid
  code: string;
  description: string | null;
  isActive: boolean;
}

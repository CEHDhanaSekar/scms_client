import { BaseDto } from './common.model';

export interface MasterValuesDto extends BaseDto {
  type: string;
  key: string;
  displayName: string;
  description: string | null;
}

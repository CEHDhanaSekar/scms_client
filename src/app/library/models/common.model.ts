export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export interface BaseModel {
  id: string;
  isActive: boolean;
}

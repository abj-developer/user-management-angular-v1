
export interface Department {
  departmentId: number;
  departmentName: string;
  departmentAddress: string;
  departmentCode: string;
}

export interface DepartmentRequest {
  departmentName: string;
  departmentAddress: string;
  departmentCode: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  departmentId: number;
}

export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  result: T;
}


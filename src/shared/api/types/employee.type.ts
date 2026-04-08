export interface CreateEmployeeRequestDto {
  id?: string;
  tenantId: string;
  divisionId: string;
  employeeCode: string;
  fullName: string;
  position: string;
  basicSalary: number;
  facePhotoUrl?: string;
  faceEmbedding?: string;
}

export interface UpdateEmployeeRequestDto {
  id?: string;
  tenantId: string;
  divisionId: string;
  employeeCode: string;
  fullName: string;
  position: string;
  basicSalary: number;
  facePhotoUrl?: string;
  faceEmbedding?: string;
}
export interface EmployeeResponseDto {
  id: string;
  tenantId: string;
  divisionId: string;
  employeeCode: string;
  fullName: string;
  position: string;
  basicSalary: number;
  facePhotoUrl?: string;
  faceEmbedding?: string;
}
export interface EmployeeCreateResponseDto {
  id: string;
  tenantId: string;
  tenant: null;
  divisionId: string;
  division: null;
  employeeCode: string;
  fullName: string;
  position: string;
  basicSalary: number;
  facePhotoUrl?: string;
  faceEmbedding?: string;
  attendances: null;
  leaveRequests: null;
  overtimes: null;
  createdAt: string;
  updatedAt: string;
}

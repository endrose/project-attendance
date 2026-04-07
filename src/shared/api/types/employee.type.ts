export interface CreateEmployeeRequestDto {
  id?: string;
  tenantId: string;
  divisionId: string;
  companyCode: string;
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
export interface CreateDivisionRequestDto {
  tenantId: string;
  name: string;
}
export interface DivisionResponsetDto {
  id: string;
  tenantId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

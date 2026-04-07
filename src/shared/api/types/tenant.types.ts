export interface CreateTenantRequestDto {
  name: string;
  companyCode: string;
  tenantId: string;
}

export interface UpdateTenantRequestDto {
  id: string;
  companyCode: string;
  name: string;
}

export interface TenantResponseDto {
  id: string;
  companyCode: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

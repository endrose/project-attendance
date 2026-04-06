export interface CreateTenantRequestDto {
  tenantId: string;
  name: string;
}

export interface UpdateTenantRequestDto {
  id: string;
  tenantId: string;
  name: string;
}

export interface TenantResponseDto {
  id: string;
  tenantId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
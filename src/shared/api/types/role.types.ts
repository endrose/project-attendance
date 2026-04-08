export interface CreateRoleRequestDto {
  tenantId: string;
  name: string;
  level: number;
}

export interface UpdateRoleRequestDto {
  tenantId: string;
  name: string;
  level: number;
}

export interface RoleResponseDto {
  id: string;
  tenantId: string;
  name: string;
  level: number;
  createdAt?: string;
  updatedAt?: string;
}

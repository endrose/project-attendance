export interface CreateUserRequestDto {
  tenantId: string;
  employeeId: string;
  roleId: string;
  email: string;
  password?: string;
}

export interface UpdateUserRequestDto {
  employeeId: string;
  roleId: string;
  email: string;
}

export interface UserResponseDto {
  id: string;
  tenantId: string;
  employeeId?: string;
  roleId: string;
  email: string;
  createdAt: string;
}

export interface ChangePasswordDto {
  currentPassword?: string;
  newPassword?: string;
}

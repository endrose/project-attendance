export interface LoginRequestBody {
  email: string;
  password: string;
}
export interface AuthUserDto {
  id: string;
  tenantId: string;
  email: string;
  roleId: string;
  employeeId: string;
  createdAt: string;
}

/** Login response (stateless JWT; no refresh token until DB table exists). */
export interface LoginResponseDto {
  message: string;
  data: {
    token: string;
    user: AuthUserDto
  };
}
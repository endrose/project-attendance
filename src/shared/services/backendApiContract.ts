import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type { LoginRequestBody, LoginResponseDto } from '../api/types/auth.types';
import type { CreateTenantRequestDto, TenantResponseDto } from '../api/types/tenant.types';
import type { UserResponseDto, UpdateUserRequestDto, ChangePasswordDto, CreateUserRequestDto } from '../api/types/user.types';
import { useAuthStore } from 'src/stores/auth';
import type { CreateEmployeeRequestDto, EmployeeResponseDto, UpdateEmployeeRequestDto } from '../api/types/employee.type';
import type { CreateDivisionRequestDto, DivisionResponsetDto } from '../api/types/division.type';
import type { RoleResponseDto, CreateRoleRequestDto, UpdateRoleRequestDto } from '../api/types/role.types';
import type { PublicHolidayResponseDto, CreatePublicHolidayDto, UpdatePublicHolidayDto } from '../api/types/publicHoliday.types';
import type { LeaveRequestResponseDto, ApproveLeaveRequestDto, RejectLeaveRequestDto } from '../api/types/leave.types';

const API_PREFIX = 'attendance/v1';

function resolveBackendBaseUrl(): string {
  const raw = import.meta.env.VITE_BACKEND_API_URL;
  const url = typeof raw === 'string' ? raw.trim().replace(/\/+$/, '') : '';
  if (url) return url;

  const hint =
    'Set VITE_BACKEND_API_URL in .env (salin dari .env.example). Nilai diisi saat dev/build oleh Vite.';
  if (import.meta.env.PROD) {
    throw new Error(`[env] ${hint}`);
  }
  console.warn(`[env] ${hint}`);
  return '';
}

export const BACKEND_BASE_URL = resolveBackendBaseUrl();

export const BackendEndpoints = {
  TENANTS: `${BACKEND_BASE_URL}${API_PREFIX}/Tenants`,
  USERS: `${BACKEND_BASE_URL}${API_PREFIX}/users`,
  AUTH_LOGIN: `${BACKEND_BASE_URL}${API_PREFIX}/Auth/Login`,
} as const;

export const backendClient: AxiosInstance = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 300_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ PASANG DI SINI
backendClient.interceptors.request.use(
  (config) => {
    let token: string | null = null;

    try {
      const authStore = useAuthStore();
      token = authStore.token;
    } catch {
      token =
        sessionStorage.getItem('attendance_token') || localStorage.getItem('attendance_token');
    }

    if (!token) {
      token =
        sessionStorage.getItem('attendance_token') || localStorage.getItem('attendance_token');
    }

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: unknown) => {
    // PERBAIKAN DI SINI:
    // Pastikan alasan rejection adalah sebuah objek Error
    const rejection = error instanceof Error ? error : new Error(String(error));
    return Promise.reject(rejection);
  },
);

const authPlainClient: AxiosInstance = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 300_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type { AuthUserDto } from '../api/types/auth.types';

export async function login(body: LoginRequestBody): Promise<LoginResponseDto> {
  const { data } = await authPlainClient.post<LoginResponseDto>(`${API_PREFIX}/Auth/Login`, body);
  return data;
}

export async function fetchAuthMe(): Promise<LoginResponseDto> {
  const { data } = await backendClient.post<LoginResponseDto>(`${API_PREFIX}/auth/me`);
  return data;
}

export async function getTenantById(tenantID: string) {
  const { data } = await backendClient.get<TenantResponseDto>(
    `${API_PREFIX}/GetTenantById/${tenantID}`,
  );
  return data;
}

export async function getUsers(tenantID: string) {
  const { data } = await backendClient.get<UserResponseDto[]>(
    `${API_PREFIX}/Users/GetAllUsersByTenant/${tenantID}`
  );
  return data;
}

export async function updateUser(userId: string, body: UpdateUserRequestDto) {
  const { data } = await backendClient.put(
    `${API_PREFIX}/Users/UpdateUser/${userId}`,
    body
  );
  return data;
}

export async function createUser(body: CreateUserRequestDto) {
  const { data } = await backendClient.post(
    `${API_PREFIX}/Users/CreateUser`,
    body
  );
  return data;
}

export async function deleteUser(userId: string) {
  const { data } = await backendClient.delete(
    `${API_PREFIX}/Users/DeleteUser/${userId}`
  );
  return data;
}

export async function changeUserPassword(userId: string, body: ChangePasswordDto) {
  const { data } = await backendClient.put(
    `${API_PREFIX}/Users/ChangePassword/${userId}`,
    body
  );
  return data;
}

export async function deleteTenantById(tenantID: string) {
  const { data } = await backendClient.delete<TenantResponseDto>(
    `${API_PREFIX}/Tenants/Delete/${tenantID}`,
  );
  return data;
}

export async function getTenants() {
  const { data } = await backendClient.get<TenantResponseDto[]>(`${API_PREFIX}/Tenants`);
  return data;
}

export async function createTenants(body: CreateTenantRequestDto) {
  const { data } = await backendClient.post<TenantResponseDto[]>(
    `${API_PREFIX}/Tenants/Create`,
    body,
  );
  return data;
}

export async function updateTenant(body: CreateTenantRequestDto, tenantID: string) {
  const { data } = await backendClient.put<TenantResponseDto[]>(
    `${API_PREFIX}/Tenants/Update/${tenantID}`,
    body,
  );
  return data;
}

// EMPLOYEE
export async function getEmployeeByTenandId(tenantId: string) {
  const { data } = await backendClient.get<EmployeeResponseDto[]>(
    `${API_PREFIX}/Employee/GetAllEmployeesByTenant/${tenantId}`,
  );
  return data;
}

export async function createEmployee(body: CreateEmployeeRequestDto) {
  const { data } = await backendClient.post<EmployeeResponseDto[]>(
    `${API_PREFIX}/Employee/CreateEmployee`,
    body,
  );
  return data;
}

export async function updateEmployee(body: UpdateEmployeeRequestDto, employeeId: string) {
  const { data } = await backendClient.put<EmployeeResponseDto>(`${API_PREFIX}/Employee/UpdateEmployee/${employeeId}`, body);
  return data;
}

export async function deleteEmployee(employeeId: string) {
  const { data } = await backendClient.delete<EmployeeResponseDto>(`${API_PREFIX}/Employee/DeleteEmployee/${employeeId}`,
  );
  return data;
}

export async function getEmployeeById(employeeId: string) {
  const { data } = await backendClient.get<EmployeeResponseDto>(`${API_PREFIX}/Employee/GetEmployeeById/${employeeId}`,);
  return data;
}


// DIVISION
export async function getDivisionByTenandId(tenantId: string) {
  const { data } = await backendClient.get<DivisionResponsetDto[]>(
    `${API_PREFIX}/Division/GetAllDivisionsByTenant/${tenantId}`,
  );
  return data;
}

export async function createDivision(body: CreateDivisionRequestDto) {
  const { data } = await backendClient.post<DivisionResponsetDto[]>(`${API_PREFIX}/Division/CreateDivision`, body);
  return data;
}

export async function deleteDivision(id: string) {
  const { data } = await backendClient.delete<DivisionResponsetDto>(`${API_PREFIX}/Division/DeleteDivision/${id}`,
  );
  return data;
}

export async function updateDivision(body: CreateDivisionRequestDto, id: string) {
  const { data } = await backendClient.put<DivisionResponsetDto>(`${API_PREFIX}/Division/UpdateDivision/${id}`, body);
  return data;
}

// ROLES
export async function getRoles() {
  const { data } = await backendClient.get<RoleResponseDto[]>(
    `${API_PREFIX}/Roles/GetAllRoles`
  );
  return data;
}

export async function createRole(body: CreateRoleRequestDto) {
  const { data } = await backendClient.post(
    `${API_PREFIX}/Roles/CreateRole`,
    body
  );
  return data;
}

export async function updateRole(roleId: string, body: UpdateRoleRequestDto) {
  const { data } = await backendClient.put(
    `${API_PREFIX}/Roles/UpdateRole/${roleId}`,
    body
  );
  return data;
}

export async function deleteRole(roleId: string) {
  const { data } = await backendClient.delete(
    `${API_PREFIX}/Roles/DeleteRole/${roleId}`
  );
  return data;
}
// PUBLIC HOLIDAY
export async function getHolidaysByTenantId(tenantId: string) {
  const { data } = await backendClient.get<PublicHolidayResponseDto[]>(
    `${API_PREFIX}/PublicHoliday/GetAllHolidaysByTenant/${tenantId}`
  );
  return data;
}

export async function createHoliday(body: CreatePublicHolidayDto) {
  const { data } = await backendClient.post(
    `${API_PREFIX}/PublicHoliday/CreateHoliday`,
    body
  );
  return data;
}

export async function updateHoliday(id: string, body: UpdatePublicHolidayDto) {
  const { data } = await backendClient.put(
    `${API_PREFIX}/PublicHoliday/UpdateHoliday/${id}`,
    body
  );
  return data;
}

export async function deleteHoliday(id: string) {
  const { data } = await backendClient.delete(
    `${API_PREFIX}/PublicHoliday/DeleteHoliday/${id}`
  );
  return data;
}

// LEAVE REGISTRATION
export async function getLeaveRequestsByTenant(tenantId: string) {
  const { data } = await backendClient.get<LeaveRequestResponseDto[]>(
    `${API_PREFIX}/Leave/GetAllLeaveRequestsByTenant/${tenantId}`
  );
  return data;
}

export async function approveLeaveRequest(body: ApproveLeaveRequestDto) {
  const { data } = await backendClient.post(
    `${API_PREFIX}/Leave/ApproveLeaveRequest`,
    body
  );
  return data;
}

export async function rejectLeaveRequest(body: RejectLeaveRequestDto) {
  const { data } = await backendClient.post(
    `${API_PREFIX}/Leave/RejectLeaveRequest`,
    body
  );
  return data;
}

export const BackendApiContract = {
  baseUrl: BACKEND_BASE_URL,
  endpoints: {
    authLogin: 'POST attendance/v1/Auth/Login',
    authMe: 'POST attendance/v1/Auth/Login',
    tenant: 'GET attendance/v1/Tenants/:tenantID',
    createTenant: 'POST attendance/v1/Tenants/create',
    tenantsById: 'GET attendance/v1/GetTenantById/:tenantID',
    deleteTenant: 'DELETE attendance/v1/Tenants/Delete/:tenantID',
    updateTenant: 'PUT attendance/v1/Tenants/Update/:tenantID',
    getEmployeeByTenandId: 'GET attendance/v1/Employee/GetAllEmployeesByTenant/:employeeId',
    createEmployee: 'POST attendance/v1/CreateEmployee',
    getDivisionByTenandId: 'GET attendance/v1/Division/GetAllDivisionsByTenant/:tenantId',
    getUsers: 'GET attendance/v1/users',
    updateUser: 'PUT attendance/v1/users/:userId',
    createUser: 'POST attendance/v1/users',
    deleteUser: 'DELETE attendance/v1/users/:userId',
    changeUserPassword: 'PUT attendance/v1/users/ChangePassword/:userId',
    getRoles: 'GET attendance/v1/Roles/GetAllRoles',
    createRole: 'POST attendance/v1/Roles/CreateRole',
    updateRole: 'PUT attendance/v1/Roles/UpdateRole/:roleId',
    deleteRole: 'DELETE attendance/v1/Roles/DeleteRole/:roleId',
    getHolidaysByTenantId: 'GET attendance/v1/PublicHoliday/GetAllHolidaysByTenant/:tenantId',
    createHoliday: 'POST attendance/v1/PublicHoliday/CreateHoliday',
    updateHoliday: 'PUT attendance/v1/PublicHoliday/UpdateHoliday/:holidayId',
    deleteHoliday: 'DELETE attendance/v1/PublicHoliday/DeleteHoliday/:holidayId',
    getLeaveRequestsByTenant: 'GET attendance/v1/Leave/GetAllLeaveRequestsByTenant/:tenantId',
    approveLeaveRequest: 'POST attendance/v1/Leave/ApproveLeaveRequest',
    rejectLeaveRequest: 'POST attendance/v1/Leave/RejectLeaveRequest',
    deleteEmployee: 'DELETE attendance/v1/Employee/DeleteEmployee/:employeeId',
    createDivision: 'POST attendance/v1/Division/CreateDivision',
    deleteDivision: 'DELETE attendance/v1/Division/DeleteDivision/:id',
    getEmployeeById: 'GET attendance/v1/Employee/GetEmployeeById/:employeeId',
    updateEmployee: 'PUT attendance/v1/Employee/UpdateEmployee/:employeeId',
    updateDivision: 'PUT attendance/v1/Division/UpdateDivision/:id'

  },
  login,
  fetchAuthMe,
  getTenants,
  getUsers,
  createTenants,
  getTenantById,
  deleteTenantById,
  updateTenant,
  getEmployeeByTenandId,
  createEmployee,
  getDivisionByTenandId,
  updateUser,
  createUser,
  deleteUser,
  changeUserPassword,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getHolidaysByTenantId,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  getLeaveRequestsByTenant,
  approveLeaveRequest,
  rejectLeaveRequest,
  deleteEmployee,
  createDivision,
  deleteDivision,
  getEmployeeById,
  updateEmployee,
  updateDivision


} as const;

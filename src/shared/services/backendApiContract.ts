import type { AxiosInstance } from "axios";
import axios from "axios";
import type { LoginRequestBody, LoginResponseDto } from "../api/types/auth.types";
import type { CreateTenantRequestDto, TenantResponseDto } from "../api/types/tenant.types";
import { useAuthStore } from 'src/stores/auth';
import type { CreateEmployeeRequestDto, EmployeeResponseDto } from "../api/types/employee.type";
import type { CreateDivisionRequestDto, DivisionResponsetDto } from "../api/types/division.type";

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
      token = sessionStorage.getItem('attendance_token') || localStorage.getItem('attendance_token');
    }

    if (!token) {
      token = sessionStorage.getItem('attendance_token') || localStorage.getItem('attendance_token');
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
  }
);

const authPlainClient: AxiosInstance = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 300_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type {
  AuthUserDto
} from '../api/types/auth.types';


export async function login(body: LoginRequestBody):
  Promise<LoginResponseDto> {
  const { data } = await authPlainClient.post<LoginResponseDto>(`${API_PREFIX}/Auth/Login`, body);
  return data;
}

export async function fetchAuthMe(): Promise<LoginResponseDto> {
  const { data } = await backendClient.post<LoginResponseDto>(`${API_PREFIX}/auth/me`);
  return data;
}

export async function getTenantById(tenantID: string) {
  const { data } = await backendClient.get<TenantResponseDto>(`${API_PREFIX}/GetTenantById/${tenantID}`,
  );
  return data;
}

export async function deleteTenantById(tenantID: string) {
  const { data } = await backendClient.delete<TenantResponseDto>(`${API_PREFIX}/Tenants/Delete/${tenantID}`,
  );
  return data;
}

export async function getTenants() {
  const { data } = await backendClient.get<TenantResponseDto[]>(`${API_PREFIX}/Tenants`);
  return data;
}

export async function createTenants(body: CreateTenantRequestDto) {
  const { data } = await backendClient.post<TenantResponseDto[]>(`${API_PREFIX}/Tenants/Create`, body);
  return data;
}

export async function updateTenant(body: CreateTenantRequestDto, tenantID: string) {
  const { data } = await backendClient.put<TenantResponseDto[]>(`${API_PREFIX}/Tenants/Update/${tenantID}`, body);
  return data;
}

// EMPLOYEE
export async function getEmployeeByTenandId(tenantId: string) {
  const { data } = await backendClient.get<EmployeeResponseDto[]>(`${API_PREFIX}/Employee/GetAllEmployeesByTenant/${tenantId}`);
  return data;
}

export async function createEmployee(body: CreateEmployeeRequestDto) {
  const { data } = await backendClient.post<EmployeeResponseDto[]>(`${API_PREFIX}/Employee/CreateEmployee`, body);
  return data;
}

export async function updateEmployee(body: CreateEmployeeRequestDto, employeeId: string) {
  const { data } = await backendClient.put<EmployeeResponseDto>(`${API_PREFIX}/Employee/UpdateEmployee/${employeeId}`, body);
  return data;
}

export async function getEmployeeById(employeeId: string) {
  const { data } = await backendClient.get<EmployeeResponseDto>(`${API_PREFIX}/Employee/GetEmployeeById/${employeeId}`,);
  return data;
}

// DIVISION
export async function getDivisionByTenandId(tenantId: string) {
  const { data } = await backendClient.get<DivisionResponsetDto[]>(`${API_PREFIX}/Division/GetAllDivisionsByTenant/${tenantId}`);
  return data;
}

export async function getDivisionById(id: string) {
  const { data } = await backendClient.get<DivisionResponsetDto>(`${API_PREFIX}/Division/GetDivisionById/${id}`);
  return data;
}

export async function createDivision(body: CreateDivisionRequestDto) {
  const { data } = await backendClient.post<DivisionResponsetDto[]>(`${API_PREFIX}/Division/CreateDivision`, body);
  return data;
}


export async function deleteEmployee(employeeId: string) {
  const { data } = await backendClient.delete<EmployeeResponseDto>(`${API_PREFIX}/Employee/DeleteEmployee/${employeeId}`,
  );
  return data;
}

export async function deleteDivision(id: string) {
  const { data } = await backendClient.delete<DivisionResponsetDto>(`${API_PREFIX}/Division/DeleteDivision/${id}`,
  );
  return data;
}

export async function updateDivision(body: CreateDivisionRequestDto, id: string) {
  const { data } = await backendClient.put<DivisionResponsetDto[]>(`${API_PREFIX}/Division/UpdateDivision/${id}`, body);
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
    getEmployeeById: 'GET attendance/v1/Employee/GetEmployeeById',
    updateEmployee: 'PUT attendance/v1/Employee/UpdateEmployee/:employeeId',
    getDivisionById: 'GET attendance/v1/Division/GetDivisionById/:id',
    deleteEmployee: 'DELETE attendance/v1/Employee/DeleteEmployee/:employeeId',
    createDivision: 'POST attendance/v1/Division/CreateDivision',
    deleteDivision: 'DELETE attendance/v1/Division/DeleteDivision/:id',


  },
  login,
  fetchAuthMe,
  getTenants,
  createTenants,
  getTenantById,
  deleteTenantById,
  updateTenant,
  getEmployeeByTenandId,
  createEmployee,
  getDivisionByTenandId,
  getEmployeeById,
  updateEmployee,
  getDivisionById,
  deleteEmployee,
  createDivision,
  deleteDivision
} as const;

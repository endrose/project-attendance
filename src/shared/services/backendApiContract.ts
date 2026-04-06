import type { AxiosInstance } from "axios";
import axios from "axios";
import type { LoginRequestBody, LoginResponseDto } from "../api/types/auth.types";
import type { TenantResponseDto } from "../api/types/tenant.types";

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
backendClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('attendance_token');
  console.log({
    'config': 'Bearer ' + token,
  });

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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

export async function getTenants(tenantID: string) {
  const { data } = await backendClient.get<TenantResponseDto[]>(`${API_PREFIX}/Division/GetAllDivisionsByTenant/${tenantID}`,
  );
  return data;
}

export const BackendApiContract = {
  baseUrl: BACKEND_BASE_URL,
  endpoints: {
    authLogin: 'POST attendance/v1/Auth/Login',
    authMe: 'POST attendance/v1/Auth/Login',
    tenant: 'GET attendance/v1/Tenants/:tenantID'
  },
  login,
  fetchAuthMe,
  getTenants
} as const;

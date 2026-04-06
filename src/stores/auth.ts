import { defineStore } from "pinia";
// import axios from 'axios'
import {
  // BACKEND_BASE_URL,
  login as apiLogin,
} from 'src/shared/services/backendApiContract'


const STORAGE_ACCESS = 'attendance_token';
const STORAGE_USER = 'attendance_user_json';

function sessionStore(): Storage | null {
  if (typeof sessionStorage === 'undefined') return null;
  return sessionStorage;
}

/**
 * Return the local storage object if it exists, null otherwise.
 * @returns {Storage | null} Local storage object or null.
 */
function localStore(): Storage | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage;
}

/** Storage yang memegang token aktif (session diutamakan jika ada). */
function activeAuthStorage(): Storage | null {
  const ss = sessionStore();
  if (ss?.getItem(STORAGE_ACCESS)) return ss;
  const ls = localStore();
  if (ls?.getItem(STORAGE_ACCESS)) return ls;
  return null;
}

export interface AuthUserSummary {
  id: string;
  tenantId: string;
  employeeId?: string;
  email?: string;
  roleId?: string;
}

function readTokenFromAny(): string {
  return activeAuthStorage()?.getItem(STORAGE_ACCESS) ?? '';
}

export const useAuthStore = defineStore('auth', {

  state: () => ({
    token: typeof window != 'undefined' ? readTokenFromAny() : '',
    user: null as AuthUserSummary | null
  }),

  getters: {
    isAuthenticated: (s) => Boolean(s.token),
    isSuperAdmin: (s) => s.user?.roleId === 'a1290eff-45fe-4408-9290-ffc566afb1a5' || s.user?.email === 'superadmin@aksadigitex.co.id'
  },
  actions: {
    hydrateUserFromStorage() {
      const st = activeAuthStorage();
      if (!st) {
        this.token = '';
        this.user = null;
        return;
      }
      this.token = st.getItem(STORAGE_ACCESS) || '';
      const raw = st.getItem(STORAGE_USER);
      if (!raw) {
        this.user = null;
        return;
      }
      try {
        this.user = JSON.parse(raw) as AuthUserSummary;
      } catch {
        st.removeItem(STORAGE_USER);
        this.user = null;
      }
    },
    persistSession(access: string, user: AuthUserSummary, persistent: boolean) {
      this.token = access;
      this.user = user;


      const ls = localStore();
      const ss = sessionStore();
      if (!ls || !ss) return;
      const payload = JSON.stringify(user);
      if (persistent) {
        ls.setItem(STORAGE_ACCESS, access);
        ls.setItem(STORAGE_USER, payload);
        ss.removeItem(STORAGE_ACCESS);
        ss.removeItem(STORAGE_USER);
      } else {
        ss.setItem(STORAGE_ACCESS, access);
        ss.setItem(STORAGE_USER, payload);
        ls.removeItem(STORAGE_ACCESS);
        ls.removeItem(STORAGE_USER);
      }
    },
    clearSession() {
      this.token = '';
      this.user = null;
      const ls = localStore();
      const ss = sessionStore();
      ls?.removeItem(STORAGE_ACCESS);
      ls?.removeItem(STORAGE_USER);
      ss?.removeItem(STORAGE_ACCESS);
      ss?.removeItem(STORAGE_USER);
      ls?.removeItem('attendance_refresh_token');
    },
    async login(email: string, password: string, rememberMe = true) {
      const res = await apiLogin({ email, password });
      console.log({ "res": res });
      const user: AuthUserSummary = {
        id: res.data.user.id,
        tenantId: res.data.user.tenantId,
        employeeId: res.data.user.employeeId, // default
        email: email,   // ambil dari input
        roleId: res.data.user.roleId,       // default
      };
      this.persistSession(res.data.token, user, rememberMe);
    },
    logoutRemote() {
      const access = this.token;
      try {
        if (access) {
          this.clearSession();
        }
      } catch {
        /* ignore */
      }
      this.clearSession();
    },

    // async restoreSession() {
    //   this.hydrateUserFromStorage();
    //   if (!this.token) return;
    //   if (this.user) return;
    //   try {
    //     const me = await fetchAuthMe();
    //     this.user = {
    //       id: me.user.id,
    //       email: me.user.email,
    //       role: me.user.roleId,
    //       tenantId: me.user.tenantId,
    //       employeeId: me.user.employeeId
    //     };

    //     const st = activeAuthStorage();
    //     if (st && this.user) {
    //       st.setItem(STORAGE_USER, JSON.stringify(this.user));
    //     }
    //   } catch {
    //     this.clearSession();
    //   }
    // },
  }


});

/// <reference types="vite/client" />

import 'vue-router';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

/** Variabel `VITE_*` yang dibaca Vite dari file `.env` */
interface ImportMetaEnv {
  /** Origin API backend, contoh: https://localhost:55585 (tanpa trailing slash) */
  readonly VITE_BACKEND_API_URL?: string;
  /** Opsional: path health Accurate (default relatif di MainLayout) */
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresSuperAdmin?: boolean;
    title?: string;
    breadcrumb?: { label: string; to?: string }[];
  }
}

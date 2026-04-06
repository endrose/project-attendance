/** Extract user-friendly error message from axios/unknown error. */
export function extractErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (
      err as {
        response?: { data?: unknown; status?: number };
        message?: string;
      }
    ).response;
    const status = res?.status;

    if (status === 401) {
      return 'Sesi Anda sudah berakhir (expired). Silakan login kembali.';
    }

    if (res?.data && typeof res.data === 'object' && 'error' in res.data) {
      const e = (res.data as { error?: string }).error;
      if (typeof e === 'string') return e;
    }
    if (res?.data && typeof res.data === 'object' && 'detail' in res.data) {
      const d = (res.data as { detail?: string }).detail;
      if (typeof d === 'string') return d;
    }
    if (res?.data && typeof res.data === 'object' && 'd' in res.data) {
      const d = (res.data as { d?: string }).d;
      if (typeof d === 'string' && d.trim().length > 0) return d;
    }
    if (res?.status === 404) return 'Endpoint tidak ditemukan. Periksa konfigurasi API.';
    if (res?.status === 500) return 'Server error. Silakan coba lagi nanti.';
    if (res?.status && res.status >= 400) return `Error ${res.status}. ${fallback}`;
  }

  if (err instanceof Error) {
    if (err.message === 'Request failed with status code 401') {
      return 'Sesi Anda sudah berakhir (expired). Silakan login kembali.';
    }
    return err.message;
  }

  return fallback;
}

export function getApiErrorDetail(err: unknown): string | null {
  if (err && typeof err === 'object' && 'response' in err) {
    const response = (
      err as {
        response?: { status?: number; data?: { error?: string; detail?: string; d?: string } };
      }
    ).response;
    if (response?.status === 401) {
      return 'Sesi Anda sudah berakhir (expired). Silakan login kembali.';
    }
    const data = response?.data;
    if (data && typeof data.error === 'string' && data.error.trim().length > 0) return data.error;
    if (data && typeof data.detail === 'string' && data.detail.trim().length > 0)
      return data.detail;
    if (data && typeof data.d === 'string' && data.d.trim().length > 0) return data.d;
  }
  if (err instanceof Error && err.message === 'Request failed with status code 401') {
    return 'Sesi Anda sudah berakhir (expired). Silakan login kembali.';
  }
  return null;
}

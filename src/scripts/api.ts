const API_BASE = 'https://api.nsir.uk';

const TOKEN_KEY = 'sheep_portal_token';
const USER_KEY = 'sheep_portal_user';

export type AuthUser = {
  id: number;
  email: string;
  role: 'admin' | 'member';
  displayName: string;
};

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as AuthUser;
    if (typeof parsed?.id === 'number' && typeof parsed.email === 'string') return parsed;
    return null;
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;

  constructor(status: number, code: string | null, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  formData?: FormData;
};

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers();
  if (options.auth) {
    const token = getToken();
    if (token === null) throw new ApiError(401, 'unauthorized', '請先登入');
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.formData ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined),
    });
  } catch {
    throw new ApiError(0, 'network_error', '無法連線到伺服器，請檢查網路');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  let data: unknown = null;
  if (text.length > 0) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const code =
      data !== null && typeof data === 'object' && 'error' in data
        ? String((data as { error: unknown }).error)
        : null;
    throw new ApiError(response.status, code, code ?? `請求失敗 (${response.status})`);
  }

  return data as T;
}

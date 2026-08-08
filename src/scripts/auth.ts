import { api, clearSession, getStoredUser, setSession, type AuthUser } from './api';

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export async function login(email: string, password: string): Promise<AuthUser> {
  const data = await api<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  setSession(data.token, data.user);
  return data.user;
}

export async function logout(): Promise<void> {
  try {
    await api<void>('/auth/logout', { method: 'POST', auth: true });
  } catch {
    // 即使伺服器失敗也要清除本機 session
  }
  clearSession();
}

export async function fetchMe(): Promise<AuthUser | null> {
  try {
    const data = await api<{ user: AuthUser }>('/auth/me', { auth: true });
    setSession(getToken() ?? '', data.user);
    return data.user;
  } catch {
    clearSession();
    return null;
  }
}

export function currentUser(): AuthUser | null {
  return getStoredUser();
}

export function isLoggedIn(): boolean {
  return getStoredUser() !== null;
}

export function isAdmin(): boolean {
  return getStoredUser()?.role === 'admin';
}

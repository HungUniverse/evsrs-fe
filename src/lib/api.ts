const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(API_BASE_URL + path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

// Tự gắn Authorization nếu có token
export function apiAuth<T>(
  path: string,
  token: string,
  options: RequestInit = {}
) {
  return api<T>(path, {
    ...options,
    headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
  });
}

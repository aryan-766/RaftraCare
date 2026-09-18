/**
 * RaftraCare HospitalOS — Production HTTP API Client
 * Enterprise-grade client wired directly to FastAPI backend (/api/v1).
 * Features automatic Bearer JWT injection, X-Hospital-ID multi-tenancy header,
 * typed ApiError wrapping, and token refresh handling.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }
}

// Token helper accessors
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("raftracare_access_token");
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("raftracare_refresh_token");
}

export function getStoredHospitalId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("raftracare_hospital_id");
}

export function setStoredTokens(accessToken: string, refreshToken?: string, hospitalId?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("raftracare_access_token", accessToken);
  if (refreshToken) {
    localStorage.setItem("raftracare_refresh_token", refreshToken);
  }
  if (hospitalId) {
    localStorage.setItem("raftracare_hospital_id", hospitalId);
  }
}

export function clearStoredAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("raftracare_access_token");
  localStorage.removeItem("raftracare_refresh_token");
  localStorage.removeItem("raftracare_user");
  localStorage.removeItem("raftracare_hospital_id");
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function tryRefreshToken(): Promise<string | null> {
  const refresh = getStoredRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (!res.ok) {
      clearStoredAuth();
      return null;
    }

    const data = await res.json();
    const newAccessToken = data.data?.access_token || data.access_token;
    const newRefreshToken = data.data?.refresh_token || data.refresh_token;

    if (newAccessToken) {
      setStoredTokens(newAccessToken, newRefreshToken);
      return newAccessToken;
    }
    return null;
  } catch {
    clearStoredAuth();
    return null;
  }
}

/**
 * Universal fetch wrapper with authentication, hospital tenancy, and error mapping
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token = getStoredToken();
  const hospitalId = getStoredHospitalId();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (hospitalId) {
    headers["X-Hospital-ID"] = hospitalId;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized with token refresh
    if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh")) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await tryRefreshToken();
        isRefreshing = false;

        if (newToken) {
          onRefreshed(newToken);
          headers["Authorization"] = `Bearer ${newToken}`;
          const retryRes = await fetch(url, { ...options, headers });
          if (!retryRes.ok) {
            const errData = await retryRes.json().catch(() => ({}));
            throw new ApiError(
              errData.error?.message || errData.message || "Request failed after authentication refresh",
              retryRes.status,
              errData.error?.code,
              errData
            );
          }
          const retryJson = await retryRes.json();
          return retryJson.data !== undefined ? retryJson.data : retryJson;
        } else {
          // Token refresh failed, force logout
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("raftracare:unauthorized"));
          }
          throw new ApiError("Session expired. Please log in again.", 401, "SESSION_EXPIRED");
        }
      } else {
        // Wait for active refresh
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(async (newToken) => {
            headers["Authorization"] = `Bearer ${newToken}`;
            try {
              const retryRes = await fetch(url, { ...options, headers });
              const retryJson = await retryRes.json();
              resolve(retryJson.data !== undefined ? retryJson.data : retryJson);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    }

    if (!response.ok) {
      let errorBody: any = {};
      try {
        errorBody = await response.json();
      } catch {
        // Not JSON
      }

      const message =
        errorBody.error?.message ||
        errorBody.message ||
        errorBody.detail ||
        `Hospital server returned error ${response.status} (${response.statusText})`;

      const code = errorBody.error?.code || errorBody.code || `HTTP_${response.status}`;
      throw new ApiError(message, response.status, code, errorBody);
    }

    // 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const json = await response.json();
    // Support standard FastAPI envelope { success: true, data: ..., meta: ... }
    return json.data !== undefined ? json.data : json;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network failure (server down, connection refused, CORS error)
    throw new ApiError(
      err.message === "Failed to fetch"
        ? "Unable to connect to hospital server. Please ensure the backend service is running."
        : err.message || "An unexpected network error occurred",
      0,
      "NETWORK_ERROR",
      err
    );
  }
}

export const http = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};

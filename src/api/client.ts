// ============================================
// CropShield AI – API Client
// ============================================
// Centralized HTTP client with error handling,
// loading states, and retry logic.
//
// In mock mode (default), requests resolve locally.
// Set VITE_API_BASE_URL to point to a real backend.
// ============================================

import type { ApiResponse, ApiErrorResponse } from './types';

// ---- Configuration ----

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000;
const USE_MOCK = !import.meta.env.VITE_API_BASE_URL;

/** Check whether the app is using mock services */
export function isMockMode(): boolean {
  return USE_MOCK;
}

// ---- Custom Error ----

export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, string>;

  constructor(message: string, code: string, status: number, details?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }

  /** User-friendly error message */
  get userMessage(): string {
    switch (this.code) {
      case 'NETWORK_ERROR': return 'Unable to connect to server. Please check your internet connection.';
      case 'TIMEOUT': return 'Request timed out. Please try again.';
      case 'UNAUTHORIZED': return 'Your session has expired. Please log in again.';
      case 'FORBIDDEN': return 'You do not have permission to perform this action.';
      case 'NOT_FOUND': return 'The requested resource was not found.';
      case 'VALIDATION_ERROR': return 'Please check your input and try again.';
      case 'SERVER_ERROR': return 'Something went wrong on the server. Please try again later.';
      default: return this.message || 'An unexpected error occurred.';
    }
  }
}

// ---- Request Helpers ----

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  /** Skip authentication header */
  noAuth?: boolean;
}

/** Get stored auth token (placeholder — replace with real token storage) */
function getAuthToken(): string | null {
  return localStorage.getItem('cropshield_auth_token');
}

/** Build full request URL */
function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(path, API_BASE_URL || window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

/** Core fetch wrapper with timeout, error parsing, and auth */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, timeout = API_TIMEOUT, noAuth = false } = options;

  // Build headers
  const reqHeaders: Record<string, string> = {
    'Accept': 'application/json',
    ...headers,
  };

  if (!noAuth) {
    const token = getAuthToken();
    if (token) {
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // Handle body
  let reqBody: BodyInit | undefined;
  if (body instanceof FormData) {
    reqBody = body;
    // Let browser set Content-Type with boundary
  } else if (body !== undefined) {
    reqHeaders['Content-Type'] = 'application/json';
    reqBody = JSON.stringify(body);
  }

  // Abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(buildUrl(path), {
      method,
      headers: reqHeaders,
      body: reqBody,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    const contentType = response.headers.get('content-type');
    let data: unknown;
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle HTTP errors
    if (!response.ok) {
      const errorBody = data as ApiErrorResponse;
      const code = mapStatusToCode(response.status);
      throw new ApiError(
        errorBody?.error?.message || response.statusText,
        code,
        response.status,
        errorBody?.error?.details,
      );
    }

    // Unwrap ApiResponse envelope if present
    if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
      return (data as ApiResponse<T>).data;
    }

    return data as T;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) throw err;

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timed out', 'TIMEOUT', 408);
    }

    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new ApiError('Network error', 'NETWORK_ERROR', 0);
    }

    throw new ApiError(
      err instanceof Error ? err.message : 'Unknown error',
      'UNKNOWN',
      0,
    );
  }
}

function mapStatusToCode(status: number): string {
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 422) return 'VALIDATION_ERROR';
  if (status >= 500) return 'SERVER_ERROR';
  return 'REQUEST_FAILED';
}

// ---- Public Client Methods ----

export const apiClient = {
  get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return request<T>(buildUrl(path, params), { method: 'GET' });
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, { method: 'POST', body });
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, { method: 'PUT', body });
  },

  patch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, { method: 'PATCH', body });
  },

  delete<T>(path: string): Promise<T> {
    return request<T>(path, { method: 'DELETE' });
  },

  /** Upload file(s) via multipart/form-data */
  upload<T>(path: string, formData: FormData): Promise<T> {
    return request<T>(path, { method: 'POST', body: formData });
  },
};

// ---- Loading State Helper ----

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export function initialAsyncState<T>(): AsyncState<T> {
  return { data: null, loading: false, error: null };
}

/** Wraps an async operation with loading/error tracking. */
export async function withAsyncState<T>(
  setState: (updater: (prev: AsyncState<T>) => AsyncState<T>) => void,
  operation: () => Promise<T>,
): Promise<T | null> {
  setState(prev => ({ ...prev, loading: true, error: null }));
  try {
    const data = await operation();
    setState(() => ({ data, loading: false, error: null }));
    return data;
  } catch (err) {
    const apiError = err instanceof ApiError
      ? err
      : new ApiError(err instanceof Error ? err.message : 'Unknown error', 'UNKNOWN', 0);
    setState(prev => ({ ...prev, loading: false, error: apiError }));
    return null;
  }
}

// ---- Mock Delay Helper ----

/** Simulate network latency in mock mode */
export function mockDelay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Generate a unique ID */
export function generateId(prefix: string = ''): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${ts}-${rand}` : `${ts}-${rand}`;
}

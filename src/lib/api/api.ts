import { ErrorBody } from '@/types/error';
import { useAuth } from '@/store/auth';
import { getUrl } from '../utils';



// Raw fetch on purpose: it must not go through api() (no refresh loop)
async function refreshTokens() {
  const res = await fetch(getUrl('/auth/refresh'), {
    method: 'POST',
    credentials: 'include'
  });
  if (!res.ok) throw new ApiError(res.status, 'Session expired');
}

let refreshPromise: Promise<void> | null = null;

function refreshOnce() {
  refreshPromise ??= refreshTokens().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

// Shortcut for JSON POST requests
export const post = <T>(path: string, body?: unknown) =>
  api<T>(path, {
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body)
  });

const TIMEOUT_MS = 8000;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

// One network call: cookies, JSON header (only with a body), timeout
function send(path: string, init?: RequestInit) {
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(getUrl(path), {
    credentials: 'include',
    ...init,
    headers,
    // keep the caller's signal (TanStack cancel) and add our timeout
    signal: init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout
  });
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    let res = await send(path, init);

    // Expired access token: refresh once, retry once (never for /auth/ routes)
    if (res.status === 401 && !path.includes('/auth/')) {
      try {
        await refreshOnce();
      } catch {
        useAuth.getState().logout();
        throw new ApiError(401, 'Session expired. Please log in again.');
      }
      res = await send(path, init);
    }

    if (!res.ok) {
      const body: ErrorBody | null = await res.json().catch(() => null);
      const message = Array.isArray(body?.message)
        ? body.message.join(', ')
        : (body?.message ?? `API error ${res.status}`);
      throw new ApiError(res.status, message);
    }

    // 204 or empty body: nothing to parse
    const text = await res.text();
    return (text ? JSON.parse(text) : undefined) as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      throw new ApiError(504, 'Request timed out.');
    }
    throw err;
  }
}


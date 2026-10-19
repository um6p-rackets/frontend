import { ErrorBody } from "@/types/error";
import { useAuth } from "@/store/auth";
import { getUrl } from "../utils";
import { AuthApi } from "./auth";


export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// This methode called 
let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];
let errorSubscribers: Array<(error: Error) => void> = [];

const onTokenRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
  errorSubscribers = [];
}

const onRefreshFailed =(error: Error) => {
  errorSubscribers.forEach((callback) => callback(error));
  refreshSubscribers = [];
  errorSubscribers = [];
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  try {
    let res = await fetch(getUrl(path), {
      credentials: "include",
      signal: init?.signal ?? controller.signal,
      ...init,
      headers,
    });

    if (res.status === 401) {
      if (path.includes('/auth/')) {
        throw new ApiError(401, "Authentication failed.");
      }

      // Attempt to refresh the token
      if (!isRefreshing) {
        isRefreshing = true;

        try {
            await AuthApi.refreshToken();
            // Unlock and process the queue
            isRefreshing = false;
            onTokenRefreshed();

            res = await fetch(getUrl(path), { ...init, headers, credentials: "include" });
        } catch (refreshError) {
            isRefreshing = false;
            onRefreshFailed(refreshError as Error);
            useAuth.getState().logout();
            throw new ApiError(401, "Session expired. Please log in again.");
        }
        // If the token was refreshed successfully, retry the original request
      } else {
        // Wait for the token to be refreshed and then retry the request
        const retryWithNewToken = new Promise<Response>((resolve, reject) => {
          refreshSubscribers.push(async () => {
            resolve(await fetch(getUrl(path), { ...init, headers, credentials: "include" }));
          });
          errorSubscribers.push((err: Error) => reject(err));
        });
        res = await retryWithNewToken;
      }
    }

    if (!res.ok) {
      const body: ErrorBody | null = await res.json().catch(() => null);
      const message = Array.isArray(body?.message) 
        ? body.message.join(", ") 
        : body?.message ?? `API error ${res.status}`;
      throw new ApiError(res.status, message);
    }

    return res.json() as Promise<T>;

  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError(504, "Request timed out.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

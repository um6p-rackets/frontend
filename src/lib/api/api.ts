import { ErrorBody } from "@/types/error";
import { useAuth } from "@/store/auth"; // 1. جلب متجر Auth

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX ?? "/api/v1";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const token = useAuth.getState().token;

  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const res = await fetch(`${API_URL}${API_PREFIX}${path}`, {
      credentials: "include",
      signal: init?.signal ?? controller.signal,
      ...init,
      headers,
    });

    if (!res.ok) {
      if (res.status === 401) {
        useAuth.getState().logout();
      }

      const body: ErrorBody | null = await res.json().catch(() => null);
      const message = Array.isArray(body?.message)
        ? body.message.join(", ")
        : body?.message ?? `API error ${res.status}`;
      throw new ApiError(res.status, message);
    }

    return await res.json();
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError(504, "Request timed out. Please check if the backend service is running.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
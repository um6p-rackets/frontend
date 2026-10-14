import { ErrorBody } from "@/types/error";

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

  try {
    const res = await fetch(`${API_URL}${API_PREFIX}${path}`, {
      credentials: "include",
      signal: init?.signal ?? controller.signal,
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });

    if (!res.ok) {
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
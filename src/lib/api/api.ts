import { ErrorBody } from "@/types/error";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX ?? "/api/v1";



export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${API_PREFIX}${path}`, {
    credentials: "include",
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

  return res.json();
}
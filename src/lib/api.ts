const API = process.env.NEXT_PUBLIC_API_URL;

// for fetching data from the API, use this function DRY
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...init,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
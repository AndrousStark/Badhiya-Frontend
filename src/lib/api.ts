const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

type FetchOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

export async function api<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new Error("Server se connect nahi ho paya. Internet check karein.");
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Server error: ${res.status}`);
  }

  if (!res.ok) {
    const msg = (data as Record<string, any>)?.error?.message
      || (data as Record<string, any>)?.message
      || `API error: ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

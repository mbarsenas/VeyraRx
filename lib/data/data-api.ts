import { cookies } from "next/headers";

const DATA_API_URL = process.env.NEON_DATA_API_URL;
const AUTH_BASE_URL = process.env.NEON_AUTH_BASE_URL;

async function getAuthJwt(): Promise<string> {
  if (!AUTH_BASE_URL) throw new Error("NEON_AUTH_BASE_URL is required.");

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

  const response = await fetch(`${AUTH_BASE_URL}/get-session`, {
    headers: {
      cookie: cookieHeader,
      origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    },
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Unable to retrieve authenticated database token.");
  const jwt = response.headers.get("set-auth-jwt");
  if (!jwt) throw new Error("Authenticated database token was not returned.");
  return jwt;
}

function encodeFilter(value: string) {
  return encodeURIComponent(value);
}

export async function dataApiSelect<T>(
  table: string,
  select: string,
  filters: string[] = [],
  order?: string,
  limit?: number
): Promise<T[]> {
  if (!DATA_API_URL) throw new Error("NEON_DATA_API_URL is required.");
  const jwt = await getAuthJwt();
  const params = new URLSearchParams({ select });
  for (const filter of filters) {
    const [key, ...rest] = filter.split("=");
    params.append(key, rest.join("="));
  }
  if (order) params.set("order", order);
  if (limit) params.set("limit", String(limit));

  const response = await fetch(`${DATA_API_URL}/${table}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Data API SELECT failed for ${table}: ${await response.text()}`);
  return response.json() as Promise<T[]>;
}

export async function dataApiUpdate<T extends Record<string, unknown>>(
  table: string,
  values: T,
  filters: string[]
): Promise<void> {
  if (!DATA_API_URL) throw new Error("NEON_DATA_API_URL is required.");
  const jwt = await getAuthJwt();
  const params = new URLSearchParams();
  for (const filter of filters) {
    const [key, ...rest] = filter.split("=");
    params.append(key, rest.join("="));
  }

  const response = await fetch(`${DATA_API_URL}/${table}?${params.toString()}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(values),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Data API UPDATE failed for ${table}: ${await response.text()}`);
}

export function eq(value: string) {
  return `eq.${encodeFilter(value)}`;
}

import { z, type ZodType } from "zod";
import { getClientId } from "./client-id";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const errorBodySchema = z.object({ error: z.string() });

async function request<T>(method: "GET" | "POST", path: string, schema: ZodType<T>, body?: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method,
    headers: { "content-type": "application/json", "x-client-id": getClientId() },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const parsed = errorBodySchema.safeParse(json);
    throw new ApiError(res.status, parsed.success ? parsed.data.error : `Request failed (${res.status}).`);
  }
  return schema.parse(json);
}

export const api = {
  get: <T>(path: string, schema: ZodType<T>) => request("GET", path, schema),
  post: <T>(path: string, schema: ZodType<T>, body: unknown) => request("POST", path, schema, body),
};

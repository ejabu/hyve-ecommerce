import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required (Neon connection string)"),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.string().default("development"),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n"));
  console.error("Copy .env.example to .env and fill it in.");
  process.exit(1);
}

export const env = parsed.data;

import express, { type ErrorRequestHandler } from "express";
import path from "node:path";
import { ZodError } from "zod";
import { env } from "./env";
import { HttpError } from "./http-error";
import { migrate } from "./migrate";
import { orderRoutes } from "./order/order-routes";
import { productRoutes } from "./product/product-routes";

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "50kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found." });
});

if (env.NODE_ENV === "production") {
  // dist/server.js sits next to dist/client
  const clientDir = path.resolve(import.meta.dirname, "client");
  app.use(express.static(clientDir));
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    res.sendFile(path.join(clientDir, "index.html"));
  });
} else {
  // Dev: Vite runs inside this same process, so one command serves UI + API.
  const { createServer } = await import("vite");
  const vite = await createServer({ server: { middlewareMode: true }, appType: "spa" });
  app.use(vite.middlewares);
}

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
  } else if (err instanceof ZodError) {
    res.status(400).json({ error: err.issues[0]?.message ?? "Invalid request." });
  } else {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
};
app.use(errorHandler);

await migrate();
app.listen(env.PORT, () => {
  console.log(`Corner Shop running on http://localhost:${env.PORT}`);
});

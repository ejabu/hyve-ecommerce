import { Router, type Request } from "express";
import { z } from "zod";
import { HttpError } from "../http-error";
import { orderService } from "./order-service";

export const orderRoutes = Router();

// Anonymous per-browser id until real auth exists. Not a security boundary.
function clientIdOf(req: Request): string {
  const parsed = z.uuid().safeParse(req.header("x-client-id"));
  if (!parsed.success) throw new HttpError(400, "Missing or invalid x-client-id header.");
  return parsed.data;
}

orderRoutes.get("/", async (req, res) => {
  res.json(await orderService.list(clientIdOf(req)));
});

orderRoutes.post("/", async (req, res) => {
  res.status(201).json(await orderService.place(clientIdOf(req), req.body));
});

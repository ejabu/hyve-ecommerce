import { Router } from "express";
import { productService } from "./product-service";

export const productRoutes = Router();

productRoutes.get("/", async (_req, res) => {
  res.json(await productService.list());
});

productRoutes.get("/:id", async (req, res) => {
  res.json(await productService.get(req.params.id));
});

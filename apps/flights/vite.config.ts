import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/flights/",
  plugins: [react()],
  build: { outDir: "../../dist/client/flights", emptyOutDir: true },
});

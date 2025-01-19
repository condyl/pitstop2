import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { gadget } from "gadget-server/vite";

export default defineConfig({
  plugins: [gadget(), react()],
  clearScreen: false
});

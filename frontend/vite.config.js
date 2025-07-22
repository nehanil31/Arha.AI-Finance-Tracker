import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "https://finance-tracker-backend-4eoh.onrender.com", // 👈 backend server
    },
  },
});

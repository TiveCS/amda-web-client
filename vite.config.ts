import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      "/api": {
        //target: "https://9abd-36-72-217-10.ngrok-free.app",
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  const API_URL = env.API_URL || "http://127.0.0.1:3000";

  console.log("API_URL", API_URL);

  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      port: env.PORT || 5173,
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: API_URL,
          changeOrigin: true,
        },
      },
    },
  };
});

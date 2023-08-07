import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      port: env.PORT || 4173,
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: JSON.stringify(env.API_URL) || "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
  };
});

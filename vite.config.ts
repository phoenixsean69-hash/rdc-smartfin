import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/dev": {
        target: "http://127.0.0.1:8300",
        changeOrigin: false
      }
    }
  },
  resolve: {
    alias: {
      "react-native-appwrite": "appwrite",
      "react-native-url-polyfill/auto": "/src/lib/empty.ts",
    },
  },
});

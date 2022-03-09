import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    host: "0.0.0.0",
    port: 3030,
  },
  resolve: {
    alias: {
      "@": "/src",
      "~": "/node_modules",
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "primary-color": "#2FAD32",
          "layout-body-background": "#ffffff",
        },
        javascriptEnabled: true,
      },
    },
  },
});

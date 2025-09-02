// https://nuxt.com/docs/api/configuration/nuxt-config  
import tailwindcss from "@tailwindcss/vite";
import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  components: true,
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME || "MiniJira",
      appBaseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:8000/api",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@primevue/nuxt-module",
    '@pinia/nuxt',
  ],
  primevue: {
    options: {
      ripple: true,
      inputVariant: "filled",
      theme: {
        preset: Aura,
        options: {
          prefix: "p",
          darkModeSelector: "system",
          cssLayer: false,
        },
      },
    },
  },
  // Thêm cấu hình cho plugins client-side
  plugins: [
    '~/plugins/apexcharts.client.ts',
    '~/plugins/vue-good-table.client.ts'
  ]
});
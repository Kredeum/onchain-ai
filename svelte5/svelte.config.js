import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

/** @type {import('@sveltejs/kit').Config} */
const config = defineConfig({
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "200.html",
      precompress: false,
      strict: true
    })
  },

  resolve: {
    alias: {
      "@routes": "/src/routes"
    }
  }
});

export default config;

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webmanifest}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },

      manifest: {
        name: 'Numpuz Premium Challenge',
        short_name: 'Numpuz',
        description: 'Logical puzzle',

        id: '/',

        categories: ['games', 'utilities'],

        theme_color: '#3498db',
        background_color: '#f8f9fa',
        display: 'standalone',
        orientation: 'portrait',

        screenshots: [
          {
            src: 'screenshot.png',
            sizes: '365x763',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Numpuz Gameplay',
          },
        ],

        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

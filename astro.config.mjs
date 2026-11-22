// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// SITE_URL and BASE_PATH are set by the GitHub Pages workflow from the Pages settings,
// so they follow the custom domain (gwadlas.co.za) once it is set there.
// Without them the site builds for https://gwadlas.co.za at the root.
export default defineConfig({
  site: process.env.SITE_URL || 'https://gwadlas.co.za',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()],
  },
});

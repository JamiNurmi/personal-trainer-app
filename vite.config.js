/**
 * Vite configuration file
 * Configures the build process and development server
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Configure React plugin
  base: '/personal-trainer-app/', // tärkeä osa GitHub Pages -julkaisua varten
  plugins: [react()],

});

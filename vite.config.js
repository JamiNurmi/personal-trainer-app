/**
 * Vite configuration file
 * Configures the build process and development server
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Configure React plugin
  plugins: [react()],

  // Base URL path
  // In production, sets the base to GitHub Pages subpath
  // In development, uses root path (/)
  base: process.env.NODE_ENV === 'production'
    ? '/personalTrainerApp/' // GitHub Pages path - must match repo name
    : '/',
});

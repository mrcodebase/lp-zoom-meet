import { defineConfig } from 'vite';

export default defineConfig({
  // Vite configuration options
  base: './', // Ensures assets are relative if needed, but Vite handles this well
  build: {
    outDir: 'dist',
  },
});

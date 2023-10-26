import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  root: 'src/solid',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
  plugins: [solid()],
});

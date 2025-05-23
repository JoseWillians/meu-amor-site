import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/meu-amor-site/', 
  plugins: [react()],
});

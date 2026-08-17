import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/*
 * Everything used to land in one ~1.9 MB chunk, so the landing page paid to
 * download Firebase, Supabase, Gemini, Recharts and pdf.js before it could
 * render. Splitting the big dependencies out lets the browser cache them
 * separately from the app code, which changes far more often.
 */
export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth'],
          supabase: ['@supabase/supabase-js'],
          charts: ['recharts'],
          pdf: ['pdfjs-dist'],
          genai: ['@google/genai']
        }
      }
    }
  }
});

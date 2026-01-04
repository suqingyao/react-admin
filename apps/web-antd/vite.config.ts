import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const { VITE_VERSION, VITE_PORT, VITE_BASE_URL, VITE_API_URL, VITE_API_PROXY_URL } = env;
  console.log(`🚀 API_URL = ${VITE_API_URL}`);
  console.log(`🚀 VERSION = ${VITE_VERSION}`);

  return defineConfig({
    define: {
      __APP_VERSION__: JSON.stringify(VITE_VERSION),
    },
    base: VITE_BASE_URL,
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      tailwindcss(),
    ],

    server: {
      port: Number(VITE_PORT),
      proxy: {
        '/api': {
          target: VITE_API_PROXY_URL,
          changeOrigin: true,
        },
      },
      host: true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: `@use '@/styles/variables.scss' as *;`,
        },
      },
    },
  });
};

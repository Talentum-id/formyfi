import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import path from 'path';
import dfxJson from './dfx.json';
import fs from 'fs';

const isDev = process.env['DFX_NETWORK'] !== 'ic';

let canisterIds;
try {
  canisterIds = JSON.parse(
    fs.readFileSync(isDev ? '.dfx/local/canister_ids.json' : './canister_ids.json').toString(),
  );
} catch (e) {
  console.error('\n⚠️  Before starting the dev server run: dfx deploy\n\n');
}

const aliases = Object.entries(dfxJson.canisters).reduce((acc, [name, _value]) => {
  const networkName = process.env['DFX_NETWORK'] || 'local';
  const outputRoot = path.join(__dirname, '.dfx', networkName, 'canisters', name);

  return {
    ...acc,
    ['canisters/' + name]: path.join(outputRoot, 'index' + '.js'),
  };
}, {});

const canisterDefinitions = Object.entries(canisterIds).reduce(
  (acc, [key, val]) => ({
    ...acc,
    [`process.env.${key.toUpperCase()}_CANISTER_ID`]: isDev
      ? JSON.stringify(val.local)
      : JSON.stringify(val.ic),
  }),
  {},
);

const DFX_PORT = dfxJson.networks.local.bind.split(':')[1] || process.env['DFX_PORT'];
const internetIdentityUri = isDev
  ? `http://localhost:${DFX_PORT}/?canisterId=${JSON.parse(
      canisterDefinitions['process.env.INTERNET_IDENTITY_CANISTER_ID'],
    )}`
  : 'https://identity.ic0.app';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vue: path.resolve('./node_modules/vue'),
      '@': fileURLToPath(new URL('./frontend', import.meta.url)),
      '~': fileURLToPath(new URL('./src/declarations', import.meta.url)),
      ...aliases,
    },
  },
  css: {
    minify: true,
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/scss/main.scss";',
      },
    },
  },
  server: {
    fs: {
      allow: ['.'],
    },
    proxy: {
      '/api': {
        target: `http://0.0.0.0:${DFX_PORT}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  define: {
    ...canisterDefinitions,
    'process.env.II_URI': JSON.stringify(internetIdentityUri),
    'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
  },
});

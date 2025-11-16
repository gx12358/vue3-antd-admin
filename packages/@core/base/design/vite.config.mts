import { defineConfig } from '@gx/vite-config';

export default defineConfig(async () => {
  return {
    vite: {
      publicDir: 'src/less-config',
    },
  };
});

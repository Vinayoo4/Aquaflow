import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  devOptions:{
    devToolbar: false,
  },
  integrations: [tailwind()],
  site: 'https://github.com/Vinayoo4/Aquaflow'
});
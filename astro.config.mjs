import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nimbusit.hr',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});

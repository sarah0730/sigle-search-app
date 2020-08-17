import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  favicon: '@/assets/fav.png',
  history: { type: 'hash' },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/search', component: '@/pages/search/index' },
  ],
});

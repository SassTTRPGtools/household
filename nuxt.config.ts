// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },

  pinia: {
    storesDirs: ['./stores/**']
  },

  // GitHub Pages 部署配置
  ssr: false,
  app: {
    baseURL: '/household/',
    buildAssetsDir: '/_nuxt/',
    cdnURL: '/household/'
  },

  // 確保靜態生成
  nitro: {
    preset: 'static'
  }
})
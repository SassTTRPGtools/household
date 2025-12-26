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
    baseURL: '/',
    buildAssetsDir: '/_nuxt/'
  },

  router: {
    options: {
      hashMode: true
    }
  },

  // 靜態生成設定
  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      failOnError: false
    }
  },
  
})
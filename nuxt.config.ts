// https://nuxt.com/docs/api/configuration/nuxt-config
  
  export default defineNuxtConfig({
    typescript: {
      shim: false, // Désactive TypeScript
      strict: false
    },
    compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['@/assets/styles.css'],

  })
  


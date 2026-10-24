// https://nuxt.com/docs/api/configuration/nuxt-config

// 部署到 GitHub Pages 的项目页时站点挂在 /<repo>/ 下，
// 由 CI 通过 NUXT_APP_BASE_URL 注入；本地开发默认根路径。
const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const withBase = (p: string) => `${baseURL.replace(/\/+$/, '')}/${p.replace(/^\/+/, '')}`

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: true,
  css: ['~/assets/css/main.css'],

  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'zh-CN', 'data-theme': 'light' },
      title: 'Vibrantbit Launcher — 跨平台 Minecraft 启动器',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Vibrantbit Launcher：基于 Avalonia 与 .NET 10 的跨平台 Minecraft 启动器。Fluent 主题、全加载器支持、Modrinth 模组中心、内置联机与崩溃修复，29 MB 自包含单文件。'
        },
        { name: 'theme-color', content: '#f3f3f3' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Vibrantbit Launcher — 跨平台 Minecraft 启动器' },
        {
          property: 'og:description',
          content: 'Fluent 主题的跨平台 Minecraft 启动器，29 MB 单文件，七平台可用。'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: withBase('favicon.svg') },
        { rel: 'apple-touch-icon', href: withBase('favicon.svg') },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: withBase('fonts/inter-latin-700.woff2'),
          crossorigin: 'anonymous'
        }
      ],
      // 页脚字标用的 Inter 700（latin 子集，放在 public/fonts，不走 Google Fonts）
      style: [
        {
          key: 'font-mark',
          innerHTML: `@font-face{font-family:"Inter";src:url("${withBase(
            'fonts/inter-latin-700.woff2'
          )}") format("woff2");font-weight:700;font-style:normal;font-display:swap;}`
        }
      ],
      // 首屏前同步应用主题，避免闪白 / 闪黑
      script: [
        {
          key: 'theme-init',
          innerHTML: `(function(){try{var t=localStorage.getItem('vbl-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);
var l=localStorage.getItem('vbl-locale');if(l){document.documentElement.setAttribute('lang',l==='en'?'en':'zh-CN');}}catch(e){}})();`
        }
      ]
    }
  },

  nitro: {
    // 预渲染入口要跟着 baseURL 走，否则只会生成一条 / → baseURL 的跳转页
    prerender: { routes: [baseURL], crawlLinks: true }
  }
})

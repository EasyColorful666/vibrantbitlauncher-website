// https://nuxt.com/docs/api/configuration/nuxt-config

// 部署到 GitHub Pages 的项目页时站点挂在 /<repo>/ 下，
// 由 CI 通过 NUXT_APP_BASE_URL 注入；本地开发默认根路径。
const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const withBase = (p: string) => `${baseURL.replace(/\/+$/, '')}/${p.replace(/^\/+/, '')}`

// 离线模式：多文件版直接双击 index.html 用 file:// 打开时，
// 运行时拼出来的 "/screens/x.png" 会被解析到磁盘根目录，
// 必须改成 "./screens/x.png" 这种相对当前 html 的路径。
const offline = process.env.VBL_OFFLINE === '1'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: true,
  css: ['~/assets/css/main.css'],

  experimental: {
    // 关闭 app manifest：它会在运行时去请求 /_nuxt/builds/meta/*.json，
    // 静态部署（含 file:// 单文件离线版）下必然 404
    appManifest: false
  },

  router: {
    options: {}
  },

  runtimeConfig: {
    public: {
      offline
    }
  },

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
        { name: 'theme-color', content: '#08090d' },
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
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap'
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

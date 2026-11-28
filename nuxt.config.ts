// https://nuxt.com/docs/api/configuration/nuxt-config
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// 部署到 GitHub Pages 的项目页时站点挂在 /<repo>/ 下，
// 由 CI 通过 NUXT_APP_BASE_URL 注入；本地开发默认根路径。
const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const withBase = (p: string) => `${baseURL.replace(/\/+$/, '')}/${p.replace(/^\/+/, '')}`

// 离线模式：多文件版直接双击 index.html 用 file:// 打开时，
// 运行时拼出来的 "/screens/x.png" 会被解析到磁盘根目录，
// 必须改成 "./screens/x.png" 这种相对当前 html 的路径。
const offline = process.env.VBL_OFFLINE === '1'

/* ---------------------------------------------------------------- SEO 基础 */

// 站点对外唯一地址。canonical / og:url / sitemap / JSON-LD 全用绝对地址，
// 否则爬虫拿不到「哪个 URL 是正版」，容易被 github.io 与自定义域名当成两份内容。
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://vbl.easycolorful.cn').replace(/\/+$/, '')
const siteName = 'Vibrantbit Launcher'
const siteTitle = 'Vibrantbit Launcher — 跨平台 Minecraft 启动器'
const siteDesc =
  'Vibrantbit Launcher 是基于 Avalonia 与 .NET 10 的跨平台 Minecraft 启动器：Fluent 主题、Forge/Fabric/NeoForge/Quilt 四种加载器、Modrinth 模组中心、内置联机与崩溃修复，Windows / macOS / Linux 七种架构都有发布包。'
const ogImage = `${siteUrl}/screens/launch.png`
const repoUrl = 'https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia'

// 版本号取自构建时生成的 releases.json，读不到就退回占位值（不影响构建）
let softwareVersion = '1.0.37.0'
try {
  softwareVersion =
    JSON.parse(readFileSync(resolve(process.cwd(), 'assets/data/releases.json'), 'utf8')).version ||
    softwareVersion
} catch {
  /* 数据文件缺失时忽略 */
}

// SoftwareApplication 是「软件产品」的官方类型，搜索引擎拿它来做富结果
// （价格、平台、版本）。WebSite + Organization 用来确定站点归属，避免同名站点混淆。
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: siteName,
      description: siteDesc,
      inLanguage: 'zh-CN',
      publisher: { '@id': `${siteUrl}/#org` }
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#org`,
      name: 'Vibrantbit',
      url: `${siteUrl}/`,
      logo: `${siteUrl}/favicon.svg`,
      sameAs: [repoUrl]
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${siteUrl}/#app`,
      name: siteName,
      alternateName: ['VibrantbitLauncher', 'Vibrantbit 启动器', 'Minecraft 启动器 Vibrantbit'],
      description: siteDesc,
      applicationCategory: 'GameApplication',
      applicationSubCategory: 'Minecraft launcher',
      operatingSystem: 'Windows, macOS, Linux',
      softwareVersion,
      inLanguage: 'zh-CN',
      url: `${siteUrl}/`,
      installUrl: `${siteUrl}/#download`,
      downloadUrl: `${siteUrl}/#download`,
      license: 'https://www.gnu.org/licenses/agpl-3.0.html',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
      sameAs: [repoUrl]
    }
  ]
}

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
      title: siteTitle,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: siteDesc },
        // Google 已不看 keywords，但百度仍然读，留着成本为零
        {
          name: 'keywords',
          content:
            'Minecraft 启动器, 我的世界启动器, Minecraft launcher, Avalonia, 跨平台启动器, Modrinth, Forge, Fabric, NeoForge, Quilt, 联机'
        },
        { name: 'author', content: 'Vibrantbit' },
        {
          name: 'robots',
          content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        },
        { name: 'googlebot', content: 'index, follow, max-image-preview:large' },
        { name: 'theme-color', content: '#08090d' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: siteName },
        { property: 'og:url', content: `${siteUrl}/` },
        { property: 'og:locale', content: 'zh_CN' },
        { property: 'og:locale:alternate', content: 'en_US' },
        { property: 'og:title', content: siteTitle },
        { property: 'og:description', content: siteDesc },
        { property: 'og:image', content: ogImage },
        { property: 'og:image:width', content: '1477' },
        { property: 'og:image:height', content: '927' },
        { property: 'og:image:alt', content: 'Vibrantbit Launcher 启动器界面截图' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: siteTitle },
        { name: 'twitter:description', content: siteDesc },
        { name: 'twitter:image', content: ogImage }
      ],
      link: [
        { rel: 'canonical', href: `${siteUrl}/` },
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
        },
        {
          key: 'json-ld',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(jsonLd)
        }
      ]
    }
  },

  nitro: {
    // 预渲染入口要跟着 baseURL 走，否则只会生成一条 / → baseURL 的跳转页
    prerender: { routes: [baseURL], crawlLinks: true }
  }
})

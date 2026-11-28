<script setup lang="ts">
const { c, isEn } = useSite()

// 描述里不要再写体积：发布包已经从「自带运行时」改成「不含运行时」，
// 写死的 MB 数只会越来越不准，还会和下载板块自相矛盾。
const ZH_DESC =
  'Vibrantbit Launcher 是基于 Avalonia 与 .NET 10 的跨平台 Minecraft 启动器：Fluent 主题、Forge/Fabric/NeoForge/Quilt 四种加载器、Modrinth 模组中心、内置联机与崩溃修复，Windows / macOS / Linux 七种架构都有发布包。'
const EN_DESC =
  'Vibrantbit Launcher is a Fluent-themed cross-platform Minecraft launcher built with Avalonia and .NET 10: Forge, Fabric, NeoForge and Quilt, a Modrinth browser, built-in multiplayer and crash fixes, with builds for seven architectures on Windows, macOS and Linux.'

const ZH_TITLE = 'Vibrantbit Launcher — 跨平台 Minecraft 启动器'
const EN_TITLE = 'Vibrantbit Launcher — Cross-platform Minecraft launcher'

useSeoMeta({
  title: () => (isEn.value ? EN_TITLE : ZH_TITLE),
  description: () => (isEn.value ? EN_DESC : ZH_DESC),
  // og:title 必须是完整标题。之前拼的是 hero.title + hero.titleAccent，
  // 也就是「Minecraft」+「启动器。」，分享卡片上只剩一句「Minecraft启动器。」，
  // 品牌名和用途都丢了，搜索结果的标题也不该这么拼。
  ogTitle: () => (isEn.value ? EN_TITLE : ZH_TITLE),
  ogDescription: () => (isEn.value ? EN_DESC : ZH_DESC),
  ogLocale: () => (isEn.value ? 'en_US' : 'zh_CN'),
  twitterTitle: () => (isEn.value ? EN_TITLE : ZH_TITLE),
  twitterDescription: () => (isEn.value ? EN_DESC : ZH_DESC)
})

// 页面里有更新日志、特性列表这些可被抓取的结构化文本，
// 给爬虫一个明确的摘要（h1 已在 HeroSection 里，这里补语义化描述）。
useHead({
  meta: [{ name: 'application-name', content: 'Vibrantbit Launcher' }]
})
</script>

<template>
  <div class="page">
    <HeroSection />
    <FeaturesSection />
    <WhySection />
    <DownloadSection />
    <ChangelogSection />
    <FaqSection />
    <CreditsSection />
  </div>
</template>

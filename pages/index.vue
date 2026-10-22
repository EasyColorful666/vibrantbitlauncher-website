<script setup lang="ts">
const { c, isEn } = useSite()

useSeoMeta({
  title: () => (isEn.value ? 'Vibrantbit Launcher — Cross-platform Minecraft launcher' : 'Vibrantbit Launcher — 跨平台 Minecraft 启动器'),
  description: () =>
    isEn.value
      ? 'A Fluent-themed cross-platform Minecraft launcher built with Avalonia and .NET 10: four mod loaders, 920 versions, Modrinth mods, built-in multiplayer, 29 MB self-contained file.'
      : '基于 Avalonia 与 .NET 10 的跨平台 Minecraft 启动器：Fluent 主题、四种加载器、920 个可下载版本、Modrinth 模组中心、内置联机，29 MB 自包含单文件。',
  ogTitle: () => c.value.hero.title + c.value.hero.titleAccent,
  ogDescription: () => c.value.hero.desc
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
  </div>
</template>

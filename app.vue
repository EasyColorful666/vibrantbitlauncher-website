<script setup lang="ts">
const { initTheme } = useTheme()
const { initLocale } = useSite()

// 首屏脚本已经把主题写进 <html>，这里只是把状态同步到 Vue，避免按钮图标对不上
onMounted(() => {
  initTheme()
  initLocale()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

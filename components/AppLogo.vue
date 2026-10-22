<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 30 })
// 所有 logo 完全一致，固定 id 即可；重复 id 在 SVG 里只会命中同一份定义
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="logo-mark"
    role="img"
    aria-label="Vibrantbit Launcher"
  >
    <defs>
      <linearGradient id="vbl-logo-grad" x1="2" y1="1" x2="38" y2="39" gradientUnits="userSpaceOnUse">
        <stop stop-color="#2B9BF0" />
        <stop offset="0.55" stop-color="#0078D4" />
        <stop offset="1" stop-color="#7155D9" />
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="11" fill="url(#vbl-logo-grad)" />
    <path d="M20 8.4 30.2 14.1 20 19.8 9.8 14.1Z" fill="#fff" fill-opacity=".96" />
    <path d="M9.8 14.1 20 19.8v10.6L9.8 24.7Z" fill="#fff" fill-opacity=".74" />
    <path d="M30.2 14.1 20 19.8v10.6l10.2-5.7Z" fill="#fff" fill-opacity=".52" />
  </svg>
</template>

<style scoped>
.logo-mark {
  flex: none;
  border-radius: 11px;
  box-shadow: 0 2px 8px rgba(0, 120, 212, 0.24);
}
</style>

<script setup lang="ts">
const { isEn } = useSite()
</script>

<template>
  <a class="skip" href="#main">{{ isEn ? 'Skip to content' : '跳到主要内容' }}</a>
  <AppHeader />
  <main id="main">
    <slot />
  </main>
  <AppFooter />
</template>

<style>
.skip {
  position: fixed;
  top: -60px;
  left: 16px;
  z-index: 100;
  padding: 10px 16px;
  border-radius: 0 0 8px 8px;
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  transition: top 0.2s ease;
}
.skip:focus-visible {
  top: 0;
  color: #fff;
}
</style>

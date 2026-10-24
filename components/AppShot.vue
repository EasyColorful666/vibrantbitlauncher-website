<script setup lang="ts">
const props = defineProps<{ view: 'home' | 'account' | 'download' }>()

const asset = useAsset()

// w / h 是 PNG 的原始像素，写进 img 的 width/height 让浏览器先按比例占好位置，
// 切换标签时不会因为三张图高度不同（1002 与 856）跳一下。
const SHOTS: Record<string, { src: string; alt: string; w: number; h: number }> = {
  home: { src: '/screens/launch.png', alt: '启动页：版本列表与快捷设置', w: 1602, h: 1002 },
  account: { src: '/screens/account.png', alt: '账户页：微软、外置、离线三种登录方式', w: 1602, h: 856 },
  download: { src: '/screens/download.png', alt: '下载中心：游戏版本与筛选', w: 1602, h: 856 }
}

const current = computed(() => {
  const shot = SHOTS[props.view] ?? SHOTS.home!
  return { ...shot, src: asset(shot.src) }
})
</script>

<template>
  <div class="shot">
    <Transition name="fade" mode="out-in">
      <img
        :key="current.src"
        :src="current.src"
        :alt="current.alt"
        :width="current.w"
        :height="current.h"
        loading="eager"
        decoding="async"
      />
    </Transition>
  </div>
</template>

<style scoped>
.shot {
  display: block;
  width: 100%;
  max-width: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: #10161b;
  box-shadow: var(--shadow-8);
}

img {
  display: block;
  width: 100%;
  height: auto;
  max-width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.22s var(--ease);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

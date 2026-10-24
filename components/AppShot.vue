<script setup lang="ts">
const props = defineProps<{ view: 'home' | 'account' | 'download' }>()

const asset = useAsset()

const SHOTS: Record<string, { src: string; alt: string }> = {
  home: { src: '/screens/launch.png', alt: '启动页：版本列表与快捷设置' },
  account: { src: '/screens/account.png', alt: '账户页：微软、外置、离线三种登录方式' },
  download: { src: '/screens/download.png', alt: '下载中心：游戏版本与筛选' }
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
        width="1602"
        height="1002"
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
  border-radius: 0;
  overflow: hidden;
  background: #10161b;
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

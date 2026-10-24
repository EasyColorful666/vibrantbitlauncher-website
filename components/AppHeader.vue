<script setup lang="ts">
const { c, toggleLocale } = useSite()
const { theme, toggleTheme } = useTheme()

const scrolled = ref(false)
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const progress = ref(0)
const activeId = ref('')

const links = computed(() => [
  { href: '#features', label: c.value.nav.features },
  { href: '#why', label: c.value.nav.why },
  { href: '#download', label: c.value.nav.download },
  { href: '#changelog', label: c.value.nav.changelog },
  { href: '#faq', label: c.value.nav.faq },
  { href: '#credits', label: c.value.nav.credits }
])

function onScroll() {
  scrolled.value = window.scrollY > 8

  // 阅读进度
  const h = document.documentElement.scrollHeight - window.innerHeight
  progress.value = h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0

  // 当前区块高亮
  let current = ''
  for (const l of links.value) {
    const el = document.querySelector(l.href) as HTMLElement | null
    if (!el) continue
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.32) current = l.href
  }
  activeId.value = current
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})

watch(open, (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <header ref="root" class="hdr" :class="{ 'is-scrolled': scrolled }">
    <div class="progress" aria-hidden="true">
      <span :style="{ width: progress + '%' }" />
    </div>

    <div class="container inner">
      <a class="brand" href="#top" :aria-label="`${c.footer.mark} Launcher`">
        <AppLogo :size="32" />
        <span class="wordmark">
          Vibrantbit<span class="wordmark-dim"> Launcher</span>
        </span>
      </a>

      <nav class="nav" aria-label="Primary">
        <a
          v-for="l in links"
          :key="l.href"
          class="nav-link"
          :class="{ active: activeId === l.href }"
          :href="l.href"
        >
          {{ l.label }}
        </a>
      </nav>

      <div class="tools">
        <button
          class="icon-btn lang-btn"
          type="button"
          :aria-label="c.langLabel"
          :title="c.langLabel"
          @click="toggleLocale"
        >
          {{ c.langLabel }}
        </button>

        <!-- 主题切换：单个图标按钮，太阳与月亮交叉淡入淡出 -->
        <button
          class="icon-btn theme-btn"
          type="button"
          :class="{ dark: theme === 'dark' }"
          :aria-label="theme === 'dark' ? 'Light mode' : 'Dark mode'"
          :title="theme === 'dark' ? 'Light mode' : 'Dark mode'"
          :aria-pressed="theme === 'dark'"
          @click="toggleTheme"
        >
          <span class="tb-icon tb-sun" aria-hidden="true">
            <AppIcon name="sun" :size="17" />
          </span>
          <span class="tb-icon tb-moon" aria-hidden="true">
            <AppIcon name="moon" :size="16" />
          </span>
        </button>

        <a
          class="icon-btn hide-sm"
          href="https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia"
          target="_blank"
          rel="noopener"
          aria-label="GitHub"
          title="GitHub"
        >
          <AppIcon name="github" :size="18" />
        </a>

        <a class="btn btn--primary hide-sm" href="#download">
          <AppIcon name="download" :size="16" class="btn__icon" />
          {{ c.actions.download }}
        </a>

        <button
          class="icon-btn burger"
          type="button"
          :aria-expanded="open"
          aria-label="Menu"
          @click="open = !open"
        >
          <AppIcon :name="open ? 'close' : 'menu'" :size="20" />
        </button>
      </div>
    </div>

    <div class="panel" :class="{ 'is-open': open }">
      <a v-for="l in links" :key="l.href" class="panel-link" :href="l.href" @click="open = false">
        {{ l.label }}
      </a>
      <a
        class="panel-link panel-link--ghost"
        href="https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia"
        target="_blank"
        rel="noopener"
        @click="open = false"
      >
        <AppIcon name="github" :size="16" />
        GitHub
      </a>
      <a class="btn btn--primary panel-cta" href="#download" @click="open = false">
        <AppIcon name="download" :size="16" class="btn__icon" />
        {{ c.actions.download }}
      </a>
    </div>
  </header>
</template>

<style scoped>
.hdr {
  position: fixed;
  inset: 0 0 auto;
  z-index: 60;
  transition: background-color 0.3s var(--ease), box-shadow 0.3s var(--ease),
    border-color 0.3s var(--ease);
  border-bottom: 1px solid transparent;
}

.hdr.is-scrolled {
  background: var(--acrylic);
  -webkit-backdrop-filter: var(--bg-blur);
  backdrop-filter: var(--bg-blur);
  border-bottom-color: var(--border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 10px 30px rgba(0, 0, 0, 0.06);
}

/* 阅读进度条 */
.progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: transparent;
  overflow: hidden;
}
.progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--violet) 60%, #a855f7);
  box-shadow: 0 0 12px color-mix(in srgb, var(--accent) 70%, transparent);
  transition: width 0.1s linear;
}

.inner {
  display: flex;
  align-items: center;
  gap: 18px;
  height: var(--nav-h);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--fg);
  flex: none;
  transition: transform 0.3s var(--ease);
}
.brand:hover {
  color: var(--fg);
  transform: translateY(-1px);
}

.wordmark {
  font-family: var(--font-display);
  font-size: 1.06rem;
  font-weight: 680;
  letter-spacing: -0.022em;
}

.wordmark-dim {
  color: var(--fg-muted);
  font-weight: 500;
}

.nav {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
}

.nav-link {
  position: relative;
  padding: 7px 13px;
  border-radius: var(--radius-pill);
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  font-weight: 520;
  transition: background-color 0.2s var(--ease), color 0.2s var(--ease);
}
.nav-link:hover {
  background: var(--surface);
  color: var(--fg);
}
.nav-link.active {
  color: var(--fg);
}
.nav-link.active::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 1px;
  translate: -50% 0;
  width: 15px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--accent), var(--violet));
}

.tools {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-left: auto;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  color: var(--fg-muted);
  border: 1px solid transparent;
  transition: background-color 0.2s var(--ease), color 0.2s var(--ease),
    border-color 0.2s var(--ease), transform 0.2s var(--ease);
}
.icon-btn:hover {
  background: var(--surface);
  color: var(--fg);
  border-color: var(--border);
  transform: translateY(-1px);
}

.lang-btn {
  width: auto;
  min-width: 42px;
  padding-inline: 9px;
  font-size: var(--fs-xs);
  font-weight: 700;
  letter-spacing: 0.04em;
}

/* ---------------------- 主题切换（单图标） ---------------------- */
.theme-btn {
  position: relative;
  overflow: hidden;
  border-color: var(--border);
  background: var(--surface);
  transition: color 0.4s var(--ease), border-color 0.4s var(--ease),
    background 0.4s var(--ease), box-shadow 0.4s var(--ease);
}
.theme-btn:hover {
  color: var(--accent-text);
  border-color: var(--border-strong);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 10%, transparent);
}

/* 太阳 / 月亮叠在一起，交叉淡入淡出 */
.tb-icon {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  transition: opacity 0.42s var(--ease), transform 0.55s var(--ease-spring);
}

.tb-sun {
  color: var(--caution);
  opacity: 1;
  transform: rotate(0deg) scale(1);
}
.tb-sun :deep(svg) {
  animation: spin 18s linear infinite;
}

.tb-moon {
  color: var(--violet-text);
  opacity: 0;
  transform: rotate(-70deg) scale(0.55);
}

/* 切到暗色：太阳淡出缩小，月亮落位放大 */
.theme-btn.dark .tb-sun {
  opacity: 0;
  transform: rotate(70deg) scale(0.55);
}
.theme-btn.dark .tb-sun :deep(svg) {
  animation: none;
}
.theme-btn.dark .tb-moon {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

@keyframes spin {
  to {
    rotate: 360deg;
  }
}

.burger {
  display: none;
}

.panel {
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
}

@media (max-width: 900px) {
  .nav {
    display: none;
  }
  .burger {
    display: inline-flex;
  }
  .panel {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 14px 20px 22px;
    background: var(--acrylic-strong);
    -webkit-backdrop-filter: var(--bg-blur);
    backdrop-filter: var(--bg-blur);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-4);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: opacity 0.24s var(--ease), transform 0.24s var(--ease),
      visibility 0.24s var(--ease);
  }
  .panel.is-open {
    opacity: 1;
    visibility: visible;
    transform: none;
  }
  .panel-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 12px;
    border-radius: var(--radius);
    color: var(--fg);
    font-size: var(--fs-body);
    font-weight: 550;
  }
  .panel-link:hover {
    background: var(--surface);
    color: var(--fg);
  }
  .panel-link--ghost {
    color: var(--fg-muted);
    font-size: var(--fs-sm);
  }
  .panel-cta {
    margin-top: 10px;
  }
}

@media (max-width: 620px) {
  .hide-sm {
    display: none;
  }
  .wordmark-dim {
    display: none;
  }
}
</style>

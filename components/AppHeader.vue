<script setup lang="ts">
const { c, toggleLocale } = useSite()
const { theme, toggleTheme } = useTheme()

const scrolled = ref(false)
const open = ref(false)
const root = ref<HTMLElement | null>(null)

const links = computed(() => [
  { href: '#features', label: c.value.nav.features },
  { href: '#why', label: c.value.nav.why },
  { href: '#download', label: c.value.nav.download },
  { href: '#changelog', label: c.value.nav.changelog },
  { href: '#faq', label: c.value.nav.faq }
])

function onScroll() {
  scrolled.value = window.scrollY > 8
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
    <div class="container inner">
      <a class="brand" href="#top" :aria-label="`${c.footer.mark} Launcher`">
        <AppLogo :size="30" />
        <span class="wordmark">
          Vibrantbit<span class="wordmark-dim"> Launcher</span>
        </span>
      </a>

      <nav class="nav" aria-label="Primary">
        <a v-for="l in links" :key="l.href" class="nav-link" :href="l.href">{{ l.label }}</a>
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

        <button
          class="icon-btn"
          type="button"
          :aria-label="theme === 'dark' ? 'Light mode' : 'Dark mode'"
          :title="theme === 'dark' ? 'Light mode' : 'Dark mode'"
          @click="toggleTheme"
        >
          <AppIcon :name="theme === 'dark' ? 'sun' : 'moon'" :size="18" />
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
  transition: background-color 0.28s var(--ease), box-shadow 0.28s var(--ease),
    border-color 0.28s var(--ease);
  border-bottom: 1px solid transparent;
}

.hdr.is-scrolled {
  background: var(--acrylic);
  -webkit-backdrop-filter: var(--bg-blur);
  backdrop-filter: var(--bg-blur);
  border-bottom-color: var(--border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.05);
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
}
.brand:hover {
  color: var(--fg);
}

.wordmark {
  font-family: var(--font-display);
  font-size: 1.06rem;
  font-weight: 650;
  letter-spacing: -0.02em;
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
  padding: 7px 12px;
  border-radius: var(--radius-sm);
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  font-weight: 500;
  transition: background-color 0.16s var(--ease), color 0.16s var(--ease);
}
.nav-link:hover {
  background: var(--surface);
  color: var(--fg);
}

.tools {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  color: var(--fg-muted);
  border: 1px solid transparent;
  transition: background-color 0.16s var(--ease), color 0.16s var(--ease),
    border-color 0.16s var(--ease);
}
.icon-btn:hover {
  background: var(--surface);
  color: var(--fg);
  border-color: var(--border);
}

.lang-btn {
  width: auto;
  min-width: 40px;
  padding-inline: 8px;
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: 0.03em;
}

.burger {
  display: none;
}

.panel {
  display: none;
}

@media (max-width: 900px) {
  .nav {
    display: none;
  }
  .burger {
    display: inline-flex;
  }
  .panel {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 20px 20px;
    background: var(--acrylic);
    -webkit-backdrop-filter: var(--bg-blur);
    backdrop-filter: var(--bg-blur);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-4);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: opacity 0.22s var(--ease), transform 0.22s var(--ease),
      visibility 0.22s var(--ease);
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
    padding: 11px 12px;
    border-radius: var(--radius-sm);
    color: var(--fg);
    font-size: var(--fs-body);
    font-weight: 500;
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
    margin-top: 8px;
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

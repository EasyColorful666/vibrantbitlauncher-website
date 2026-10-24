<script setup lang="ts">
const { c } = useSite()
const active = ref<'home' | 'account' | 'download'>('home')

const ghost = computed(() => c.value.hero.facts)
</script>

<template>
  <section id="top" class="hero">
    <div class="container">
      <div class="board" v-reveal>
        <div class="panel">
          <span class="eyebrow">
            <span class="eyebrow-dot" />
            {{ c.hero.eyebrow }}
          </span>

          <h1 class="title">
            <span>{{ c.hero.title }}</span>
            <span class="title-accent">{{ c.hero.titleAccent }}</span>
          </h1>

          <p class="desc">{{ c.hero.desc }}</p>

          <div class="actions">
            <a class="btn btn--primary btn--lg" href="#download">
              <AppIcon name="download" :size="17" class="btn__icon" />
              {{ c.hero.primary }}
            </a>
            <a
              class="btn btn--secondary btn--lg"
              href="https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia"
              target="_blank"
              rel="noopener"
            >
              <AppIcon name="arrowUp" :size="16" class="btn__icon" />
              {{ c.hero.secondary }}
            </a>
          </div>

          <ul class="ghost">
            <li v-for="g in ghost" :key="g">
              <AppIcon name="check" :size="14" />
              {{ g }}
            </li>
          </ul>
        </div>

        <div class="shot">
          <div class="shot-glow" />
          <div class="shot-frame">
            <AppShot :view="active" />
          </div>

          <div class="switcher" role="tablist" :aria-label="c.hero.caption">
            <button
              v-for="tab in c.hero.tabs"
              :key="tab.id"
              class="seg"
              :class="{ on: active === tab.id }"
              type="button"
              role="tab"
              :aria-selected="active === tab.id"
              @click="active = tab.id as any"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </div>

      <p class="caption">{{ c.hero.caption }}</p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-top: calc(var(--nav-h) + 52px);
  padding-bottom: 56px;
}

.board {
  display: grid;
  grid-template-columns: 5fr 7fr;
  align-items: stretch;
  background: var(--tile);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-4), var(--inset-hi);
  overflow: hidden;
}

.panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  gap: 22px;
  padding: 44px 38px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 5px 11px 5px 9px;
  border-radius: var(--radius-pill);
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--fg-muted);
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.eyebrow-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-tint);
}

.title {
  font-size: var(--fs-hero);
  line-height: 1.05;
  letter-spacing: -0.035em;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title-accent {
  background: linear-gradient(100deg, var(--accent) 8%, #6b4fd8 92%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.desc {
  color: var(--fg-muted);
  line-height: 1.7;
  max-width: 34em;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 2px;
}

.btn--lg {
  --btn-h: 42px;
  padding-inline: 20px;
}

.ghost {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin-top: 2px;
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
}
.ghost li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.ghost li :deep(svg) {
  color: var(--accent);
}

/* 预览区 */
.shot {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  gap: 14px;
  padding: 30px;
  background: linear-gradient(150deg, var(--accent-tint), transparent 55%),
    linear-gradient(0deg, var(--surface), var(--layer));
  border-left: 1px solid var(--border);
}

.shot-glow {
  position: absolute;
  inset: -20% -10% auto auto;
  width: 60%;
  height: 70%;
  background: radial-gradient(closest-side, var(--mica-2), transparent);
  filter: blur(10px);
  pointer-events: none;
}

.shot-frame {
  position: relative;
  flex: none;
  min-width: 0;
  border-radius: 10px;
}

.switcher {
  position: relative;
  display: flex;
  gap: 2px;
  padding: 3px;
  border-radius: var(--radius-pill);
  background: var(--surface);
  border: 1px solid var(--border);
}

.seg {
  flex: 1;
  height: 30px;
  border-radius: var(--radius-pill);
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--fg-muted);
  transition: background-color 0.18s var(--ease), color 0.18s var(--ease),
    box-shadow 0.18s var(--ease);
}
.seg:hover {
  color: var(--fg);
}
.seg.on {
  background: var(--tile);
  color: var(--fg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), var(--inset-hi);
}

.caption {
  margin-top: 14px;
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
  text-align: right;
}

@media (max-width: 980px) {
  .board {
    grid-template-columns: 1fr;
  }
  .panel {
    padding: 40px 30px;
  }
  .shot {
    border-left: none;
    border-top: 1px solid var(--border);
    padding: 20px;
  }
  .caption {
    text-align: left;
  }
}

@media (max-width: 640px) {
  .hero {
    padding-top: calc(var(--nav-h) + 28px);
    padding-bottom: 48px;
  }
  .panel {
    padding: 30px 22px 26px;
    gap: 18px;
  }
  .title {
    font-size: 2.15rem;
  }
  .shot {
    padding: 14px;
  }
}
</style>

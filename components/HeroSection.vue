<script setup lang="ts">
const { c } = useSite()
const active = ref<'home' | 'account' | 'download'>('home')

const ghost = computed(() => c.value.hero.facts)
</script>

<template>
  <section id="top" class="hero">
    <div class="halo" aria-hidden="true" />
    <div class="container">
      <div class="board">
        <div class="panel">
          <span class="eyebrow">
            <span class="eyebrow-dot" />
            {{ c.hero.eyebrow }}
          </span>

          <h1 class="title">
            <span class="line">{{ c.hero.title }}</span>
            <span class="line title-accent">{{ c.hero.titleAccent }}</span>
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
              <span class="tick"><AppIcon name="check" :size="13" /></span>
              {{ g }}
            </li>
          </ul>
        </div>

        <div class="shot">
          <div class="shot-glow" aria-hidden="true" />
          <div class="shot-frame">
            <div class="shot-bar" aria-hidden="true">
              <span class="tl"><i /><i /><i /></span>
              <span class="taddr" />
            </div>
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
  position: relative;
  padding-top: calc(var(--nav-h) + 64px);
  padding-bottom: 68px;
}

/* 顶部聚光 */
.halo {
  position: absolute;
  left: 50%;
  top: -180px;
  width: 900px;
  height: 520px;
  translate: -50% 0;
  pointer-events: none;
  background: radial-gradient(
    closest-side,
    color-mix(in srgb, var(--accent) 26%, transparent),
    transparent 72%
  );
  filter: blur(30px);
  opacity: 0.55;
}

.board {
  display: grid;
  grid-template-columns: 5fr 7fr;
  align-items: stretch;
  gap: 0;
  background: var(--tile);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-12), var(--inset-hi);
  overflow: hidden;
}

.panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  gap: 24px;
  padding: 52px 44px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  align-self: flex-start;
  padding: 6px 14px 6px 11px;
  border-radius: var(--radius-pill);
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--fg-muted);
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  backdrop-filter: blur(10px);
}

.eyebrow-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: linear-gradient(120deg, var(--accent), var(--violet));
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 16%, transparent);
  animation: pulse-dot 2.8s var(--ease-out) infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 14%, transparent);
  }
  50% {
    box-shadow: 0 0 0 7px color-mix(in srgb, var(--accent) 4%, transparent);
  }
}

.title {
  font-size: var(--fs-hero);
  line-height: 1.02;
  letter-spacing: -0.045em;
  font-weight: 700;
  display: flex;
  flex-direction: column;
}
.title .line {
  display: block;
}

.title-accent {
  background: linear-gradient(100deg, var(--accent) 0%, #6b4fd8 55%, #a855f7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 6px 24px color-mix(in srgb, var(--accent) 24%, transparent));
}

.desc {
  color: var(--fg-muted);
  line-height: 1.75;
  max-width: 34em;
  font-size: 1.02rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 2px;
}

.btn--lg {
  --btn-h: 48px;
  padding-inline: 24px;
  font-size: 0.97rem;
}

.ghost {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 4px;
}
.ghost li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: var(--fs-xs);
  color: var(--fg-muted);
  padding: 6px 13px 6px 8px;
  border-radius: var(--radius-pill);
  background: var(--surface);
  border: 1px solid var(--border);
}
.tick {
  display: grid;
  place-items: center;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--success) 16%, transparent);
  color: var(--success);
  flex: none;
}

/* 预览区 */
.shot {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  gap: 16px;
  padding: 40px 32px;
  background:
    radial-gradient(600px 300px at 80% 0%, color-mix(in srgb, var(--violet) 12%, transparent), transparent 70%),
    linear-gradient(160deg, var(--accent-tint), transparent 45%),
    linear-gradient(0deg, var(--surface), var(--layer));
  border-left: 1px solid var(--border);
}

.shot-glow {
  position: absolute;
  inset: -20% -14% auto auto;
  width: 62%;
  height: 74%;
  background: radial-gradient(closest-side, var(--mica-2), transparent);
  filter: blur(28px);
  pointer-events: none;
}

.shot-frame {
  position: relative;
  flex: none;
  min-width: 0;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--border-strong);
  background: var(--surface);
  box-shadow: var(--shadow-8);
  transform: perspective(1400px) rotateY(-5deg) rotateX(1.5deg);
  transform-origin: left center;
  transition: transform 0.8s var(--ease);
}
.shot-frame:hover {
  transform: perspective(1400px) rotateY(-1.5deg) rotateX(0.5deg) translateY(-4px);
}

/* 仿窗口标题栏 */
.shot-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 30px;
  padding-inline: 12px;
  background: color-mix(in srgb, var(--fg) 6%, transparent);
  border-bottom: 1px solid var(--border);
}
.tl {
  display: flex;
  gap: 6px;
}
.tl i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--fg-subtle) 55%, transparent);
}
.tl i:first-child {
  background: color-mix(in srgb, var(--critical) 70%, transparent);
}
.tl i:nth-child(2) {
  background: color-mix(in srgb, var(--caution) 70%, transparent);
}
.tl i:nth-child(3) {
  background: color-mix(in srgb, var(--success) 70%, transparent);
}
.taddr {
  flex: 1;
  height: 16px;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--fg) 5%, transparent);
  max-width: 220px;
  margin-inline: auto;
}

.switcher {
  position: relative;
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--surface) 80%, transparent);
  border: 1px solid var(--border);
  backdrop-filter: blur(14px);
  width: fit-content;
  margin-inline: auto;
}

.seg {
  flex: 1;
  height: 32px;
  padding-inline: 18px;
  border-radius: var(--radius-pill);
  font-size: var(--fs-xs);
  font-weight: 620;
  white-space: nowrap;
  color: var(--fg-muted);
  transition: color 0.22s var(--ease), background 0.22s var(--ease), box-shadow 0.22s var(--ease);
}
.seg:hover {
  color: var(--fg);
}
.seg.on {
  background: linear-gradient(120deg, var(--accent), var(--violet));
  color: #fff;
  box-shadow: 0 6px 18px -8px color-mix(in srgb, var(--accent) 80%, transparent);
}

.caption {
  margin-top: 16px;
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
  text-align: right;
}

@media (max-width: 980px) {
  .board {
    grid-template-columns: 1fr;
  }
  .panel {
    padding: 44px 32px;
  }
  .shot {
    border-left: none;
    border-top: 1px solid var(--border);
    padding: 24px 20px;
  }
  .shot-frame {
    transform: none;
  }
  .caption {
    text-align: left;
  }
}

@media (max-width: 640px) {
  .hero {
    padding-top: calc(var(--nav-h) + 34px);
    padding-bottom: 52px;
  }
  .panel {
    padding: 32px 22px 26px;
    gap: 20px;
  }
  .title {
    font-size: 2.35rem;
  }
  .shot {
    padding: 16px 14px;
  }
  .btn--lg {
    --btn-h: 44px;
    padding-inline: 20px;
  }
  .actions .btn {
    flex: 1 1 auto;
  }
}
</style>

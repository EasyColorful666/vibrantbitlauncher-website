<script setup lang="ts">
import changelog from '~/assets/data/changelog.json'
import { PLATFORMS, SITE } from '~/assets/data/site'

const { c, L } = useSite()
const active = ref(PLATFORMS[0]!.id)

// 版本号与日期直接取更新日志最新一条，避免两处各写一份
const latest = computed(
  () => (changelog.releases as any[])[0] ?? { version: SITE.version, date: SITE.releasedAt }
)

const current = computed(() => PLATFORMS.find((p) => p.id === active.value) ?? PLATFORMS[0]!)

/** 切换平台时让内容重新入场 */
const swapKey = ref(0)
watch(active, () => {
  swapKey.value++
})
</script>

<template>
  <section id="download" class="section">
    <div class="container">
      <div class="section-head" v-reveal>
        <span class="kicker">{{ c.download.kicker }}</span>
        <h2>{{ c.download.title }}</h2>
        <p class="section-sub">{{ c.download.sub }}</p>
      </div>

      <div class="tile card" v-reveal>
        <div class="card-glow" aria-hidden="true" />

        <div class="platforms" role="tablist">
          <button
            v-for="p in PLATFORMS"
            :key="p.id"
            class="platform"
            :class="{ on: active === p.id }"
            type="button"
            role="tab"
            :aria-selected="active === p.id"
            @click="active = p.id"
          >
            <AppIcon :name="p.icon" :size="17" />
            <span>{{ L(p.name) }}</span>
          </button>
        </div>

        <div class="meta">
          <div class="meta-main">
            <span class="ver">
              {{ c.download.latest }} <b>v{{ latest.version }}</b>
            </span>
            <span class="sep">·</span>
            <span class="muted">{{ c.download.published }} {{ latest.date }}</span>
            <span class="chip chip--accent">{{ c.download.form }}</span>
          </div>
          <span class="muted os">{{ L(current.arch) }}</span>
        </div>

        <div class="assets" :key="swapKey">
          <div class="asset-head">
            <span>{{ c.download.rid }}</span>
            <span>{{ c.download.file }}</span>
            <span class="t-right">{{ c.download.format }}</span>
          </div>

          <div v-for="a in current.assets" :key="a.rid" class="asset">
            <span class="arch">{{ a.arch }}</span>
            <span class="file">
              <code>{{ a.file }}</code>
              <span class="note">{{ L(a.note) }}</span>
            </span>
            <span class="fmt">{{ a.fmt }}</span>
            <a class="btn btn--primary btn--sm dl" :href="SITE.releases" target="_blank" rel="noopener">
              {{ c.download.action }}
              <AppIcon name="arrowUp" :size="13" class="btn__icon" />
            </a>
          </div>
        </div>

        <div class="foot">
          <span class="muted">{{ c.download.note }}</span>
          <a class="link" :href="SITE.releases" target="_blank" rel="noopener">
            {{ c.download.all }}
            <AppIcon name="arrowRight" :size="15" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card {
  padding: 32px;
  overflow: hidden;
  isolation: isolate;
}

.card-glow {
  position: absolute;
  inset: -50% 30% auto -20%;
  height: 120%;
  pointer-events: none;
  background: radial-gradient(
    closest-side,
    color-mix(in srgb, var(--accent) 12%, transparent),
    transparent 72%
  );
}

.platforms {
  position: relative;
  display: flex;
  gap: 5px;
  padding: 5px;
  border-radius: var(--radius-pill);
  background: var(--surface);
  border: 1px solid var(--border);
  width: fit-content;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
}
.platforms::-webkit-scrollbar {
  display: none;
}

.platform {
  display: inline-flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding-inline: 22px;
  border-radius: var(--radius-pill);
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  font-weight: 620;
  white-space: nowrap;
  transition: color 0.24s var(--ease), background 0.24s var(--ease), box-shadow 0.24s var(--ease);
}
.platform:hover {
  color: var(--fg);
}
.platform.on {
  background: linear-gradient(120deg, var(--accent), var(--violet));
  color: #fff;
  box-shadow: 0 8px 20px -10px color-mix(in srgb, var(--accent) 85%, transparent);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  margin-top: 26px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.meta-main {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
  font-size: var(--fs-sm);
}

.ver b {
  font-family: var(--font-mono);
  font-size: 1.04em;
  letter-spacing: -0.015em;
  background: linear-gradient(120deg, var(--accent), var(--violet));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.muted {
  color: var(--fg-muted);
  font-size: var(--fs-sm);
}

.sep {
  color: var(--fg-subtle);
}

.assets {
  margin-top: 8px;
  animation: swap 0.45s var(--ease);
}

@keyframes swap {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.asset-head,
.asset {
  display: grid;
  grid-template-columns: 108px 1fr 96px 96px;
  align-items: center;
  gap: 14px;
}

.asset-head {
  padding: 12px 14px;
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.t-right {
  text-align: right;
}

.asset {
  padding: 14px;
  border-radius: var(--radius);
  transition: background-color 0.22s var(--ease), transform 0.22s var(--ease);
}
.asset + .asset {
  box-shadow: inset 0 1px 0 var(--border);
}
.asset:hover {
  background: var(--surface);
  box-shadow: none;
  transform: translateX(3px);
}

.arch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: start;
  height: 26px;
  padding-inline: 10px;
  border-radius: var(--radius-pill);
  background: linear-gradient(
    120deg,
    color-mix(in srgb, var(--accent) 16%, transparent),
    color-mix(in srgb, var(--violet) 12%, transparent)
  );
  color: var(--accent-text);
  border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
  font-size: var(--fs-xs);
  font-weight: 650;
  font-family: var(--font-mono);
}

.file {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.file code {
  background: none;
  border: none;
  padding: 0;
  color: var(--fg);
  font-size: var(--fs-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note {
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
}

.fmt {
  color: var(--fg-muted);
  font-size: var(--fs-xs);
  text-align: right;
}

.dl {
  justify-self: end;
}

.foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 20px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
}

.link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: var(--fs-sm);
  font-weight: 620;
}
.link :deep(svg) {
  transition: transform 0.3s var(--ease);
}
.link:hover :deep(svg) {
  transform: translateX(3px);
}

@media (max-width: 780px) {
  .card {
    padding: 18px;
  }
  .platforms {
    width: 100%;
  }
  .platform {
    flex: 1;
    padding-inline: 12px;
  }
  .asset-head {
    display: none;
  }
  .asset {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'arch dl'
      'file file'
      'fmt fmt';
    gap: 8px;
    padding: 16px 8px;
  }
  .arch {
    grid-area: arch;
  }
  .file {
    grid-area: file;
  }
  .fmt {
    grid-area: fmt;
    text-align: left;
  }
  .dl {
    grid-area: dl;
  }
  .file code {
    white-space: normal;
    word-break: break-all;
  }
}
</style>

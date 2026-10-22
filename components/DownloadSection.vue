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

        <div class="assets">
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
  padding: 28px;
}

.platforms {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
}

.platform {
  display: inline-flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 38px;
  border-radius: 6px;
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  font-weight: 600;
  transition: background-color 0.18s var(--ease), color 0.18s var(--ease),
    box-shadow 0.18s var(--ease);
}
.platform:hover {
  color: var(--fg);
}
.platform.on {
  background: var(--tile);
  color: var(--fg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.09), var(--inset-hi);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  margin-top: 22px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}

.meta-main {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: var(--fs-sm);
}

.ver b {
  font-family: var(--font-mono);
  font-size: 1.02em;
  letter-spacing: -0.01em;
}

.muted {
  color: var(--fg-muted);
  font-size: var(--fs-sm);
}

.sep {
  color: var(--fg-subtle);
}

.assets {
  margin-top: 6px;
}

.asset-head,
.asset {
  display: grid;
  grid-template-columns: 108px 1fr 96px 92px;
  align-items: center;
  gap: 14px;
}

.asset-head {
  padding: 10px 12px;
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.t-right {
  text-align: right;
}

.asset {
  padding: 12px;
  border-radius: var(--radius);
  transition: background-color 0.16s var(--ease);
}
.asset + .asset {
  box-shadow: inset 0 1px 0 var(--border);
}
.asset:hover {
  background: var(--surface);
  box-shadow: none;
}

.arch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: start;
  height: 24px;
  padding-inline: 9px;
  border-radius: var(--radius-sm);
  background: var(--accent-soft);
  color: var(--accent-text);
  font-size: var(--fs-xs);
  font-weight: 600;
}

.file {
  display: flex;
  flex-direction: column;
  gap: 3px;
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
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-sm);
  font-weight: 600;
}

@media (max-width: 780px) {
  .card {
    padding: 16px;
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
    padding: 14px 8px;
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

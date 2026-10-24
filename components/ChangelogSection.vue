<script setup lang="ts">
import changelog from '~/assets/data/changelog.json'
import { SECTION_KIND, SITE } from '~/assets/data/site'

const { c, isEn } = useSite()

const PAGE = 4
const shown = ref(PAGE)
const expanded = ref<Record<string, boolean>>({})

const releases = computed(() => changelog.releases as any[])
const visible = computed(() => releases.value.slice(0, shown.value))
const hasMore = computed(() => shown.value < releases.value.length)

const LIMIT = 6

function kindMeta(kind: string) {
  const meta = (SECTION_KIND as any)[kind] ?? { key: 'change', zh: kind, en: kind }
  return { key: meta.key, label: isEn.value ? meta.en : meta.zh }
}

function itemsOf(section: any, version: string) {
  const open = expanded.value[version]
  return open ? section.items : section.items.slice(0, LIMIT)
}

function hiddenCount(section: any, version: string) {
  if (expanded.value[version]) return 0
  return Math.max(0, section.items.length - LIMIT)
}

function toggle(version: string) {
  expanded.value = { ...expanded.value, [version]: !expanded.value[version] }
}
</script>

<template>
  <section id="changelog" class="section section--alt">
    <div class="container">
      <div class="section-head section-head--split" v-reveal>
        <div class="head-left">
          <span class="kicker">{{ c.changelog.kicker }}</span>
          <h2>{{ c.changelog.title }}</h2>
          <p class="section-sub">{{ c.changelog.sub }}</p>
        </div>
        <div class="head-right">
          <span class="chip">{{ c.changelog.total.replace('{n}', String(changelog.count)) }}</span>
          <a class="head-link" :href="SITE.releases" target="_blank" rel="noopener">
            {{ c.actions.readChangelog }}
            <AppIcon name="arrowRight" :size="15" />
          </a>
        </div>
      </div>

      <div class="timeline">
        <article
          v-for="(r, idx) in visible"
          :key="r.version"
          class="release"
          :class="{ newest: idx === 0 }"
          v-reveal
        >
          <div class="side">
            <div class="ver-row">
              <span class="ver">v{{ r.version }}</span>
              <span v-if="idx === 0" class="chip chip--accent latest">{{ c.changelog.latest }}</span>
            </div>
            <span class="date">{{ r.date }}</span>
            <span class="count">{{ r.changes }} {{ c.changelog.count }}</span>
          </div>

          <div class="body">
            <div v-for="s in r.sections" :key="s.kind" class="group">
              <div class="group-head">
                <span class="kind" :class="`kind--${kindMeta(s.kind).key}`">
                  {{ kindMeta(s.kind).label }}
                </span>
                <span class="group-n">{{ s.items.length }}</span>
              </div>
              <ul class="items">
                <li v-for="(it, i) in itemsOf(s, r.version)" :key="i" class="item">
                  <span class="bullet" />
                  <span class="text" v-html="it.html" />
                </li>
              </ul>
              <button
                v-if="hiddenCount(s, r.version) > 0"
                class="more"
                type="button"
                @click="toggle(r.version)"
              >
                {{ c.actions.expand }} +{{ hiddenCount(s, r.version) }}
              </button>
            </div>

            <button v-if="expanded[r.version]" class="more more--collapse" type="button" @click="toggle(r.version)">
              {{ c.actions.collapse }}
            </button>
          </div>
        </article>
      </div>

      <div class="tail">
        <button v-if="hasMore" class="btn btn--secondary" type="button" @click="shown += PAGE">
          {{ c.changelog.more }}
          <AppIcon name="chevron" :size="15" class="btn__icon" />
        </button>
        <p class="src">{{ c.changelog.source }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.head-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.head-right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding-bottom: 4px;
}

.head-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: var(--fs-sm);
  font-weight: 620;
}
.head-link :deep(svg) {
  transition: transform 0.3s var(--ease);
}
.head-link:hover :deep(svg) {
  transform: translateX(3px);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
}
/* 时间轴竖线 */
.timeline::before {
  content: "";
  position: absolute;
  left: 84px;
  top: 20px;
  bottom: 20px;
  width: 1px;
  background: linear-gradient(180deg, var(--accent), var(--violet) 40%, transparent 92%);
  opacity: 0.45;
}

.release {
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 16px;
  align-items: start;
  position: relative;
}

.side {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 18px;
  border-radius: var(--radius-lg);
  background: var(--tile);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-2), var(--inset-hi);
  position: relative;
}
/* 轴上的节点 */
.side::after {
  content: "";
  position: absolute;
  right: -13px;
  top: 26px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 12%, transparent);
}
.release.newest .side::after {
  background: linear-gradient(120deg, var(--accent), var(--violet));
  border-color: transparent;
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--accent) 18%, transparent);
}
.section--alt .side::after {
  background: var(--layer);
}

.ver-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ver {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.015em;
}

.latest {
  height: 21px;
  font-size: 0.6875rem;
}

.date {
  color: var(--fg-muted);
  font-size: var(--fs-xs);
  font-variant-numeric: tabular-nums;
}

.count {
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
}

.body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 24px;
  border-radius: var(--radius-lg);
  background: var(--tile);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-2), var(--inset-hi);
  transition: border-color 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.body:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-4), var(--inset-hi);
}

.group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group-head {
  display: flex;
  align-items: center;
  gap: 9px;
}

.kind {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding-inline: 9px;
  border-radius: var(--radius-pill);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--fg-muted);
  background: var(--surface);
  border: 1px solid var(--border);
}

.kind--new {
  color: var(--success);
  background: color-mix(in srgb, var(--success) 11%, transparent);
  border-color: color-mix(in srgb, var(--success) 26%, transparent);
}
.kind--fix {
  color: var(--critical);
  background: color-mix(in srgb, var(--critical) 11%, transparent);
  border-color: color-mix(in srgb, var(--critical) 26%, transparent);
}
.kind--change,
.kind--improve {
  color: var(--caution);
  background: color-mix(in srgb, var(--caution) 11%, transparent);
  border-color: color-mix(in srgb, var(--caution) 26%, transparent);
}
.kind--ui {
  color: var(--violet-text);
  background: color-mix(in srgb, var(--violet) 13%, transparent);
  border-color: color-mix(in srgb, var(--violet) 28%, transparent);
}

.group-n {
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
  font-variant-numeric: tabular-nums;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.item {
  display: flex;
  gap: 11px;
  align-items: flex-start;
  font-size: var(--fs-sm);
  line-height: 1.7;
}

.bullet {
  flex: none;
  width: 5px;
  height: 5px;
  margin-top: 0.66em;
  border-radius: 50%;
  background: linear-gradient(120deg, var(--accent), var(--violet));
  opacity: 0.65;
}

.text {
  color: var(--fg-muted);
  min-width: 0;
  overflow-wrap: anywhere;
}

.text :deep(strong) {
  color: var(--fg);
  font-weight: 620;
}

.text :deep(code) {
  font-size: 0.86em;
}

.more {
  align-self: flex-start;
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  border: 1px dashed var(--border-strong);
  color: var(--fg-muted);
  font-size: var(--fs-xs);
  font-weight: 620;
  transition: color 0.2s var(--ease), border-color 0.2s var(--ease), background 0.2s var(--ease);
}
.more:hover {
  color: var(--accent-text);
  border-color: var(--accent);
  background: var(--accent-tint);
}

.more--collapse {
  border-style: solid;
}

.tail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-top: 30px;
}

.tail .btn :deep(svg) {
  transform: rotate(180deg);
  opacity: 0.85;
}

.src {
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
}

@media (max-width: 820px) {
  .timeline::before {
    display: none;
  }
  .release {
    grid-template-columns: 1fr;
  }
  .side {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    padding: 12px 14px;
  }
  .side::after {
    display: none;
  }
  .body {
    padding: 16px 16px;
  }
}

@media (max-width: 640px) {
  .item {
    font-size: var(--fs-xs);
  }
}
</style>

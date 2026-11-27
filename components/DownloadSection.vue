<script setup lang="ts">
import changelog from '~/assets/data/changelog.json'
import releases from '~/assets/data/releases.json'
import { PLATFORMS, SITE } from '~/assets/data/site'

const { c, L } = useSite()
const active = ref(PLATFORMS[0]!.id)

type Platform = (typeof PLATFORMS)[number]

type RelEntry = {
  tag: string
  version: string
  publishedAt: string
  htmlUrl: string
  assets: Record<string, { url: string; size: number }>
}

// releases.json 的顶层就是最新版（tag / assets 直接铺在根上），history 是旧版列表
const REL = releases as RelEntry & { history?: RelEntry[] }
const HISTORY = (REL.history ?? []) as RelEntry[]

/** 历史版本默认只露 5 条，其余靠「展开全部」 */
const HISTORY_PREVIEW = 5
const showAllHistory = ref(false)
const visibleHistory = computed(() =>
  showAllHistory.value ? HISTORY : HISTORY.slice(0, HISTORY_PREVIEW)
)

// 版本号优先取真实 Release 的 tag：更新日志可能已经写了下一版，但那版还没发出来，
// 列表头写着新版本、点下载却 404 会很怪。
const latest = computed(() => {
  const fallback = (changelog.releases as any[])[0]
  return {
    version: REL.version || fallback?.version || SITE.version,
    date: REL.publishedAt || fallback?.date || SITE.releasedAt
  }
})

const current = computed(() => PLATFORMS.find((p) => p.id === active.value) ?? PLATFORMS[0]!)

/** 切换平台时让内容重新入场 */
const swapKey = ref(0)
watch(active, () => {
  swapKey.value++
})

/* ---------------------------------------------------------------- 下载弹窗 */

// gh-proxy 是路径式代理：前缀 + 完整的 GitHub 地址
const MIRROR_V4 = 'https://gh-proxy.com/'
const MIRROR_V6 = 'https://v6.gh-proxy.com/'

/** 选中的文件 + 它属于哪个版本（历史版本按钮也要复用同一个弹窗） */
const picked = ref<{ file: string; rel: RelEntry } | null>(null)

/** 官方直链；静态数据里查不到就退回那个版本的 Release 页，不拼一个可能 404 的地址 */
function officialUrl(file: string, rel: RelEntry = REL) {
  return rel.assets[file]?.url ?? rel.htmlUrl ?? SITE.releases
}

/** 体积，数据来自 Release API，拿不到就返回空串（不显示） */
function sizeOf(file: string, rel: RelEntry = REL) {
  const bytes = rel.assets[file]?.size ?? 0
  if (!bytes) return ''
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const routes = computed(() => {
  if (!picked.value) return []
  const { file, rel } = picked.value
  const base = officialUrl(file, rel)
  const d = c.value.download.dialog
  return [
    { id: 'direct', icon: 'github', label: d.direct, note: d.directNote, url: base },
    { id: 'v4', icon: 'sparkles', label: d.v4, note: d.v4Note, url: MIRROR_V4 + base },
    { id: 'v6', icon: 'sparkles', label: d.v6, note: d.v6Note, url: MIRROR_V6 + base }
  ]
})

/** 弹窗里显示的文件体积 */
const pickedSize = computed(() =>
  picked.value ? sizeOf(picked.value.file, picked.value.rel) : ''
)

function openPicker(file: string, rel: RelEntry = REL) {
  picked.value = { file, rel }
}

function closePicker() {
  picked.value = null
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') closePicker()
}

// 弹窗打开时锁住页面滚动，并把 ESC 接过来
watch(picked, (open) => {
  if (!import.meta.client) return
  document.documentElement.style.overflow = open ? 'hidden' : ''
  if (open) window.addEventListener('keydown', onEsc)
  else window.removeEventListener('keydown', onEsc)
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onEsc)
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
            <button
              class="btn btn--primary btn--sm dl"
              type="button"
              @click="openPicker(a.file)"
            >
              {{ c.download.action }}
              <AppIcon name="download" :size="13" class="btn__icon" />
            </button>
          </div>
        </div>

        <!-- 历史版本：每个版本按当前选中的平台列出对应架构，点开还是同一个下载弹窗 -->
        <div v-if="HISTORY.length" class="hist">
          <div class="hist-head">
            <span class="hist-title">{{ c.download.history }}</span>
            <span class="hist-note">{{ c.download.historyNote }}</span>
          </div>

          <div class="hist-list">
            <div v-for="h in visibleHistory" :key="h.tag" class="hist-row">
              <span class="hist-ver">v{{ h.version }}</span>
              <span class="hist-date">{{ h.publishedAt }}</span>
              <span class="hist-archs">
                <button
                  v-for="a in current.assets"
                  :key="a.rid"
                  class="hist-btn"
                  type="button"
                  :disabled="!h.assets[a.file]"
                  :title="
                    h.assets[a.file]
                      ? `${a.file} · ${sizeOf(a.file, h)}`
                      : c.download.missing
                  "
                  @click="openPicker(a.file, h)"
                >
                  {{ a.arch }}
                </button>
              </span>
            </div>
          </div>

          <button
            v-if="HISTORY.length > HISTORY_PREVIEW"
            class="hist-toggle"
            type="button"
            :aria-expanded="showAllHistory"
            @click="showAllHistory = !showAllHistory"
          >
            {{ showAllHistory ? c.download.historyLess : c.download.historyMore }}
            <span class="hist-count">{{ HISTORY.length }}</span>
            <AppIcon
              name="chevron"
              :size="14"
              class="hist-chev"
              :class="{ up: showAllHistory }"
            />
          </button>
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

    <Teleport to="body">
      <Transition name="picker">
        <div
          v-if="picked"
          class="picker"
          role="dialog"
          aria-modal="true"
          :aria-label="c.download.dialog.title"
          @click.self="closePicker"
        >
          <div class="picker__panel">
            <button
              class="picker__x"
              type="button"
              :aria-label="c.download.dialog.close"
              @click="closePicker"
            >
              <AppIcon name="close" :size="16" />
            </button>

            <span class="picker__kicker">{{ c.download.dialog.title }}</span>

            <div class="picker__head">
              <b class="picker__ver">v{{ picked.rel.version }}</b>
              <span v-if="pickedSize" class="picker__size">{{ pickedSize }}</span>
              <span v-if="pickedSize" class="sep">·</span>
              <span class="picker__date">{{ picked.rel.publishedAt }}</span>
            </div>

            <code class="picker__file">{{ picked.file }}</code>

            <div class="picker__routes">
              <a
                v-for="r in routes"
                :key="r.id"
                class="route"
                :href="r.url"
                rel="noopener noreferrer"
              >
                <span class="route__icon" :class="`route__icon--${r.id}`">
                  <AppIcon :name="r.icon" :size="17" />
                </span>
                <span class="route__text">
                  <strong>{{ r.label }}</strong>
                  <span>{{ r.note }}</span>
                </span>
                <AppIcon name="arrowRight" :size="15" class="route__go" />
              </a>
            </div>

            <p class="picker__hint">{{ c.download.dialog.hint }}</p>
            <p class="picker__warn">{{ c.download.dialog.runtime }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
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

/* ------------------------------------------------------------- 历史版本 */

.hist {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
}

.hist-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
}

.hist-title {
  color: var(--fg);
  font-size: var(--fs-sm);
  font-weight: 650;
}

.hist-note {
  flex: 1;
  min-width: 200px;
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
  line-height: 1.6;
}

.hist-list {
  margin-top: 10px;
}

.hist-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 9px 6px;
  border-radius: var(--radius);
  transition: background-color 0.2s var(--ease);
}
.hist-row + .hist-row {
  box-shadow: inset 0 1px 0 var(--border);
}
.hist-row:hover {
  background: var(--surface);
  box-shadow: none;
}

.hist-ver {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  letter-spacing: -0.01em;
  color: var(--fg);
}

.hist-date {
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
  font-variant-numeric: tabular-nums;
}

.hist-archs {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
}

.hist-btn {
  height: 27px;
  padding-inline: 11px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border);
  background: var(--layer);
  color: var(--fg-muted);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: 620;
  transition: color 0.2s var(--ease), border-color 0.2s var(--ease),
    background-color 0.2s var(--ease), transform 0.2s var(--ease);
}
.hist-btn:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--accent) 55%, transparent);
  background: var(--surface);
  color: var(--accent-text);
  transform: translateY(-1px);
}
.hist-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.hist-toggle {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 8px;
  padding: 6px 2px;
  color: var(--fg-muted);
  font-size: var(--fs-xs);
  font-weight: 620;
  transition: color 0.2s var(--ease);
}
.hist-toggle:hover {
  color: var(--accent-text);
}

.hist-count {
  font-family: var(--font-mono);
  color: var(--fg-subtle);
}

.hist-chev {
  transition: transform 0.24s var(--ease);
}
.hist-chev.up {
  transform: rotate(180deg);
}

.picker__date {
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
  font-variant-numeric: tabular-nums;
}

/* ------------------------------------------------------------- 下载方式弹窗 */

.picker {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: grid;
  place-items: center;
  padding: 20px;
  background: color-mix(in srgb, var(--bg) 58%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.picker-enter-active,
.picker-leave-active {
  transition: opacity 0.22s var(--ease);
}
.picker-enter-from,
.picker-leave-to {
  opacity: 0;
}

.picker__panel {
  position: relative;
  width: min(520px, 100%);
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  padding: 26px 24px 22px;
  border-radius: var(--radius-xl);
  background: var(--surface);
  border: 1px solid var(--border-strong);
  box-shadow: var(--shadow-12), var(--inset-hi);
  animation: picker-rise 0.34s var(--ease-spring);
}

@keyframes picker-rise {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.picker__x {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-sm);
  color: var(--fg-muted);
  transition: color 0.2s var(--ease), background-color 0.2s var(--ease);
}
.picker__x:hover {
  color: var(--fg);
  background: var(--layer);
}

.picker__kicker {
  display: block;
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.picker__head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

.picker__ver {
  font-family: var(--font-mono);
  font-size: 1.34rem;
  letter-spacing: -0.02em;
  background: linear-gradient(120deg, var(--accent), var(--violet));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.picker__size {
  color: var(--fg-muted);
  font-size: var(--fs-sm);
}

.picker__file {
  display: block;
  margin-top: 4px;
  background: none;
  border: none;
  padding: 0;
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  word-break: break-all;
}

.picker__routes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
}

.route {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 13px 15px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--layer);
  transition: border-color 0.22s var(--ease), background-color 0.22s var(--ease),
    transform 0.22s var(--ease);
}
.route:hover {
  border-color: color-mix(in srgb, var(--accent) 45%, transparent);
  background: var(--surface);
  transform: translateX(3px);
}
.route:hover .route__go {
  transform: translateX(3px);
}

.route__icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: 10px;
}
.route__icon--direct {
  background: color-mix(in srgb, var(--fg) 9%, transparent);
  color: var(--fg);
}
.route__icon--v4 {
  background: linear-gradient(120deg, var(--accent), var(--violet));
  color: #fff;
}
.route__icon--v6 {
  background: linear-gradient(120deg, var(--cyan), var(--accent));
  color: #fff;
}

.route__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}
.route__text strong {
  color: var(--fg);
  font-size: var(--fs-sm);
  font-weight: 650;
}
.route__text span {
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
}

.route__go {
  flex: none;
  color: var(--fg-subtle);
  transition: transform 0.22s var(--ease);
}

.picker__hint {
  margin-top: 16px;
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
  line-height: 1.6;
}

.picker__warn {
  margin-top: 8px;
  padding: 9px 12px;
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--caution) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--caution) 26%, transparent);
  color: var(--fg-muted);
  font-size: var(--fs-xs);
  line-height: 1.6;
}

@media (max-width: 780px) {
  .picker {
    padding: 14px;
  }
  .picker__panel {
    padding: 22px 18px 18px;
  }
  .route {
    padding: 12px 13px;
  }
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

  /* 历史版本：版本号 + 日期一行，架构按钮换行到下面一行 */
  .hist-row {
    grid-template-columns: auto 1fr;
    grid-template-areas:
      'ver date'
      'archs archs';
    gap: 8px 12px;
    padding: 12px 6px;
  }
  .hist-ver {
    grid-area: ver;
  }
  .hist-date {
    grid-area: date;
    justify-self: end;
  }
  .hist-archs {
    grid-area: archs;
    justify-content: flex-start;
  }
  .hist-btn {
    height: 30px;
    padding-inline: 14px;
  }
}
</style>

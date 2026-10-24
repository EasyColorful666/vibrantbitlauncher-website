<script setup lang="ts">
const { c } = useSite()

const items = computed(() => c.value.features.items)

// 无缝循环：内容渲染两份，位移到 -50% 时刚好接上
const loop = computed(() => [...items.value, ...items.value])

const track = ref<HTMLElement | null>(null)
const paused = ref(false)
const reduced = ref(false)

// 指针位置（相对视口），每帧判断是否压在卡片上
let pointerX = -9999
let pointerY = -9999
let pointerInside = false
let hovering = false

let raf = 0
let offset = 0
let last = 0

/** 一份内容（含间距）的宽度，用作循环周期 */
function unitWidth(): number {
  const el = track.value
  if (!el) return 1
  const half = Math.floor(items.value.length)
  let w = 0
  for (let i = 0; i < half; i++) {
    const child = el.children[i] as HTMLElement | undefined
    if (!child) break
    w += child.offsetWidth + 20 // 20 = gap
  }
  return w || el.scrollWidth / 2 || 1
}

/**
 * 指针是否正压在某张卡片上。
 * 用卡片自身的矩形判断，而不是 elementFromPoint —— 卡片本身在移动，
 * elementFromPoint 会因为卡片跑掉而误判成「没悬停」。
 */
function pointerOnCard(): boolean {
  if (!pointerInside) return false
  const el = track.value
  if (!el) return false
  const cards = el.children
  for (let i = 0; i < cards.length; i++) {
    const r = (cards[i] as HTMLElement).getBoundingClientRect()
    if (
      pointerX >= r.left &&
      pointerX <= r.right &&
      pointerY >= r.top &&
      pointerY <= r.bottom
    ) {
      return true
    }
  }
  return false
}

function tick(now: number) {
  const el = track.value
  if (!el) {
    raf = requestAnimationFrame(tick)
    return
  }

  const dt = last ? Math.min(64, now - last) : 16
  last = now

  // 只有指针在卡片上时才暂停；鼠标移出整行后自动续跑
  const shouldPause = pointerOnCard()
  if (shouldPause !== hovering) {
    hovering = shouldPause
    paused.value = shouldPause
  }

  if (!paused.value && !reduced.value) {
    offset += (dt / 1000) * 46 // 46 px/s，从右向左匀速
    const unit = unitWidth()
    if (offset >= unit) offset -= unit
    el.style.transform = `translate3d(${-offset}px, 0, 0)`
  }

  raf = requestAnimationFrame(tick)
}

function onMove(e: MouseEvent) {
  pointerX = e.clientX
  pointerY = e.clientY
  pointerInside = true
}

/** 指针离开整行 → 恢复滚动 */
function onLeave() {
  pointerInside = false
  hovering = false
  paused.value = false
}

/** 点击卡片：把它平滑移到轨道最左，停下来细看 */
function focusCard(index: number) {
  const el = track.value
  if (!el) return
  const child = el.children[index] as HTMLElement | undefined
  if (!child) return
  const unit = unitWidth()
  // 目标位置换算到当前循环周期内
  let target = child.offsetLeft
  const cur = offset % unit
  target -= Math.floor(cur / unit) * unit
  if (target < 0) target += unit
  offset = target
  el.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)'
  el.style.transform = `translate3d(${-offset}px, 0, 0)`
  window.setTimeout(() => {
    if (el) el.style.transition = ''
  }, 720)
}

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduced.value) raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <section id="features" class="section">
    <div class="container">
      <div class="section-head" v-reveal>
        <span class="kicker">{{ c.features.kicker }}</span>
        <h2>{{ c.features.title }}</h2>
        <p class="section-sub">{{ c.features.sub }}</p>
      </div>
    </div>

    <!-- 滚动轨道 -->
    <div class="marquee" v-reveal @mousemove="onMove" @mouseleave="onLeave">
      <div class="row">
        <div class="rail" :class="{ paused }">
          <div ref="track" class="track">
            <article
              v-for="(f, i) in loop"
              :key="f.title + i"
              class="tile tile--reveal card"
              @click="focusCard(i % items.length)"
            >
              <span class="ico">
                <AppIcon :name="f.icon" :size="20" />
              </span>
              <h3>{{ f.title }}</h3>
              <p>{{ f.desc }}</p>
              <span class="idx" aria-hidden="true">
                {{ String((i % items.length) + 1).padStart(2, '0') }}
              </span>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.head-left {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ---------------- 滚动轨道 ---------------- */
.marquee {
  position: relative;
  overflow: hidden;
  padding-block: 12px;
  /* 两侧渐隐，进出画面不突兀 */
  mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
}

.row {
  position: relative;
}

.rail {
  overflow: visible;
}

.track {
  display: flex;
  gap: 20px;
  width: max-content;
  padding-inline: 20px;
  will-change: transform;
  cursor: grab;
}
.track:active {
  cursor: grabbing;
}

.card {
  position: relative;
  flex: none;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 11px;
  padding: 28px 26px 30px;
  overflow: hidden;
  isolation: isolate;
  cursor: pointer;
  background:
    radial-gradient(400px 220px at 100% 0%, color-mix(in srgb, var(--violet) 9%, transparent), transparent 70%),
    var(--tile);
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease),
    border-color 0.4s var(--ease);
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-12), var(--inset-hi);
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
  z-index: 2;
}

.ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: linear-gradient(
    140deg,
    color-mix(in srgb, var(--accent) 18%, transparent),
    color-mix(in srgb, var(--violet) 13%, transparent)
  );
  color: var(--accent-text);
  border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.09);
  transition: transform 0.45s var(--ease-spring), border-color 0.3s;
}
.card:hover .ico {
  transform: translateY(-2px) scale(1.07) rotate(-4deg);
  border-color: color-mix(in srgb, var(--accent) 46%, transparent);
}

.card h3 {
  font-size: 1.08rem;
  letter-spacing: -0.015em;
  padding-right: 34px;
}

.card p {
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  line-height: 1.72;
}

/* 右上角序号 */
.idx {
  position: absolute;
  top: 26px;
  right: 24px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--fg-subtle);
  opacity: 0.55;
  transition: opacity 0.3s var(--ease), color 0.3s var(--ease);
}
.card:hover .idx {
  opacity: 1;
  color: var(--accent-text);
}

@media (max-width: 640px) {
  .card {
    width: 268px;
    padding: 22px 20px 24px;
  }
  .hint {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee {
    overflow-x: auto;
    mask-image: none;
    -webkit-mask-image: none;
  }
  .track {
    transform: none !important;
  }
}
</style>

<script setup lang="ts">
const { c } = useSite()

const markRef = ref<HTMLElement | null>(null)

/* 巨型字标拆成单字，才能做逐字的流光与鼠标响应 */
const WORD_A = 'Vibrantbit'
const WORD_B = 'Launcher'
const lettersA = WORD_A.split('')
const lettersB = WORD_B.split('')

const reduced = ref(false)
let raf = 0

/** 鼠标附近的字被「点亮」：离指针越近越亮、越上浮 */
function paint(x: number, y: number) {
  const root = markRef.value
  if (!root) return
  const chars = root.querySelectorAll<HTMLElement>('.mark-ch')
  for (const el of chars) {
    const r = el.getBoundingClientRect()
    const dx = x - (r.left + r.width / 2)
    const dy = y - (r.top + r.height / 2)
    const d = Math.hypot(dx, dy)
    const lit = Math.max(0, 1 - d / 260)
    el.style.setProperty('--lit', lit.toFixed(3))
  }
}

function onMove(e: MouseEvent) {
  if (reduced.value) return
  const x = e.clientX
  const y = e.clientY
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    paint(x, y)
  })
}

function onLeave() {
  if (raf) {
    cancelAnimationFrame(raf)
    raf = 0
  }
  const root = markRef.value
  if (!root) return
  root.querySelectorAll<HTMLElement>('.mark-ch').forEach((el) => {
    el.style.setProperty('--lit', '0')
  })
}

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div
        ref="markRef"
        class="mark"
        aria-hidden="true"
        v-reveal
        @mousemove="onMove"
        @mouseleave="onLeave"
      >
        <span class="mark-word">
          <span
            v-for="(ch, i) in lettersA"
            :key="`a${i}`"
            class="mark-ch"
            :style="{ '--i': i }"
            >{{ ch }}</span
          >
        </span>
        <span class="mark-word mark-dim">
          <span
            v-for="(ch, i) in lettersB"
            :key="`b${i}`"
            class="mark-ch"
            :style="{ '--i': i + lettersA.length }"
            >{{ ch }}</span
          >
        </span>
      </div>

      <div class="inner">
        <div class="brand">
          <AppLogo :size="34" />
          <p class="tagline">{{ c.footer.tagline }}</p>
          <div class="badges">
            <span class="badge"><i class="dot" style="color: var(--success)" />AGPL-3.0</span>
            <span class="badge"><i class="dot" style="color: var(--accent)" />.NET 10</span>
            <span class="badge"><i class="dot" style="color: var(--violet-text)" />Avalonia</span>
          </div>
        </div>

        <div class="cols">
          <div v-for="col in c.footer.cols" :key="col.title" class="col">
            <h4>{{ col.title }}</h4>
            <a
              v-for="l in col.links"
              :key="l.label"
              :href="l.href"
              :target="(l as any).external ? '_blank' : undefined"
              :rel="(l as any).external ? 'noopener' : undefined"
            >
              <AppIcon
                v-if="(l as any).external"
                name="arrowUp"
                :size="12"
                class="ext"
              />
              {{ l.label }}
            </a>
          </div>
        </div>
      </div>

      <div class="bottom">
        <span>{{ c.footer.meta }}</span>
        <span>{{ c.footer.built }}</span>
      </div>

      <p class="disclaimer">{{ c.footer.disclaimer }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  padding-block: 84px 40px;
  border-top: 1px solid var(--border);
  background: var(--layer);
  overflow: hidden;
}

/* 底部光晕 */
.footer::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -40%;
  width: 900px;
  height: 500px;
  translate: -50% 0;
  pointer-events: none;
  background: radial-gradient(
    closest-side,
    color-mix(in srgb, var(--accent) 12%, transparent),
    transparent 72%
  );
}

.mark {
  position: relative;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 8vw, 5.6rem);
  font-weight: 750;
  letter-spacing: -0.05em;
  line-height: 1;
  margin-bottom: 48px;
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.3em;
  /* 字标本身不是链接，别继承链接的手型光标 */
  cursor: default;
}

.mark-word {
  display: inline-flex;
}

/* 单个字：渐变横向流动 + 被鼠标点亮 */
.mark-ch {
  display: inline-block;
  background-image: linear-gradient(
    100deg,
    var(--fg) 18%,
    var(--accent) 52%,
    #a855f7 100%
  );
  background-size: 260% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  opacity: 0;
  translate: 0 0.34em;
  transform: translateY(calc(var(--lit, 0) * -6px));
  filter: brightness(calc(1 + var(--lit, 0) * 0.55))
    saturate(calc(1 + var(--lit, 0) * 0.4));
  transition: transform 0.45s var(--ease), filter 0.45s var(--ease);
}

/* 进入视口后逐字上浮，同时开始流光 */
.mark.is-visible .mark-ch {
  animation:
    mark-in 0.75s var(--ease) forwards,
    mark-wave 7s linear infinite;
  /* 第二个负延迟让每个字错开相位，整行看起来是一道横向扫过的光 */
  animation-delay: calc(var(--i) * 38ms), calc(var(--i) * -0.28s);
}

@keyframes mark-in {
  from {
    opacity: 0;
    translate: 0 0.34em;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

/* 渐变本身在横向缓慢流动 */
@keyframes mark-wave {
  from {
    background-position: 0% 50%;
  }
  to {
    background-position: 260% 50%;
  }
}

.mark-dim {
  opacity: 0.45;
}

.inner {
  display: grid;
  grid-template-columns: 1.3fr 2fr;
  gap: 52px;
  padding-bottom: 36px;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-start;
}

.tagline {
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  line-height: 1.72;
  max-width: 42ch;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 2px;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 26px;
  padding-inline: 11px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--fg-muted);
  font-size: var(--fs-xs);
  font-weight: 600;
  font-family: var(--font-mono);
}

.cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.col h4 {
  font-size: var(--fs-xs);
  font-weight: 700;
  color: var(--fg-subtle);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 4px;
  font-family: var(--font-ui);
}

.col a {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: var(--fs-sm);
  color: var(--fg-muted);
  width: fit-content;
  transition: color 0.2s var(--ease), transform 0.2s var(--ease);
}
.col a:hover {
  color: var(--accent-text);
  transform: translateX(2px);
}
.ext {
  opacity: 0.5;
  flex: none;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
}

.disclaimer {
  margin-top: 16px;
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
  line-height: 1.7;
  max-width: 78ch;
}

/* 尊重系统的「减少动态效果」设置 */
@media (prefers-reduced-motion: reduce) {
  .mark.is-visible .mark-ch {
    animation: mark-in 0.4s var(--ease) forwards;
    animation-delay: calc(var(--i) * 20ms);
  }
  .mark-ch {
    transform: none;
    filter: none;
  }
}

@media (max-width: 860px) {
  .inner {
    grid-template-columns: 1fr;
    gap: 34px;
  }
  .mark {
    margin-bottom: 30px;
  }
}

@media (max-width: 560px) {
  .cols {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px 16px;
  }
  .bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .footer {
    padding-block: 54px 30px;
  }
}
</style>

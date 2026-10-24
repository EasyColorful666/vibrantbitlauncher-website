<script setup lang="ts">
const { c } = useSite()
const open = ref(0)

function toggle(i: number) {
  open.value = open.value === i ? -1 : i
}
</script>

<template>
  <section id="faq" class="section">
    <div class="container board">
      <div class="head" v-reveal>
        <span class="kicker">{{ c.faq.kicker }}</span>
        <h2>{{ c.faq.title }}</h2>
        <p class="section-sub">{{ c.faq.sub }}</p>
        <a
          class="ask"
          href="https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia/issues"
          target="_blank"
          rel="noopener"
        >
          <AppIcon name="github" :size="15" />
          GitHub Issues
          <AppIcon name="arrowUp" :size="13" />
        </a>
      </div>

      <div class="accordion">
        <div
          v-for="(item, i) in c.faq.items"
          :key="item.q"
          class="tile qa"
          :class="{ open: open === i }"
          v-reveal="i * 45"
        >
          <button class="q" type="button" :aria-expanded="open === i" @click="toggle(i)">
            <span class="q-text">{{ item.q }}</span>
            <span class="q-icon"><AppIcon name="plus" :size="16" /></span>
          </button>
          <div class="a-wrap">
            <div class="a-inner">
              <p class="a">{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: 4fr 8fr;
  gap: 52px;
  align-items: start;
}

.head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: calc(var(--nav-h) + 32px);
}

.ask {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  align-self: flex-start;
  margin-top: 10px;
  padding: 8px 14px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border-strong);
  background: var(--tile);
  color: var(--fg-muted);
  font-size: var(--fs-xs);
  font-weight: 620;
  transition: color 0.2s var(--ease), border-color 0.2s var(--ease), background 0.2s var(--ease),
    transform 0.2s var(--ease);
}
.ask:hover {
  color: var(--fg);
  border-color: var(--accent);
  background: var(--tile-hover);
  transform: translateY(-2px);
}

.accordion {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.qa {
  overflow: hidden;
  transition: border-color 0.24s var(--ease), box-shadow 0.24s var(--ease),
    background-color 0.24s var(--ease), transform 0.24s var(--ease);
}

.qa:hover {
  border-color: var(--border-strong);
}

.qa.open {
  border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
  box-shadow: var(--shadow-4), var(--inset-hi);
  background: var(--tile-hover);
}

.q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 19px 22px;
  font-size: var(--fs-body);
  font-weight: 620;
  text-align: left;
  color: var(--fg);
}

.q-text {
  flex: 1;
  transition: color 0.2s var(--ease);
}
.qa.open .q-text {
  color: var(--accent-text);
}

.q-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--accent-text);
  transition: transform 0.3s var(--ease), background 0.24s var(--ease), color 0.24s var(--ease),
    border-color 0.24s var(--ease);
}

.qa:hover .q-icon {
  border-color: var(--border-strong);
}

.qa.open .q-icon {
  background: linear-gradient(120deg, var(--accent), var(--violet));
  border-color: transparent;
  color: #fff;
}

/* 只转加号，别把圆圈也转成菱形 */
.qa.open .q-icon :deep(svg) {
  transform: rotate(45deg);
  transition: transform 0.3s var(--ease);
}

.a-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.36s var(--ease);
}

.qa.open .a-wrap {
  grid-template-rows: 1fr;
}

.a-inner {
  overflow: hidden;
}

.a {
  padding: 0 22px 20px;
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  line-height: 1.78;
  max-width: 66ch;
}

@media (max-width: 980px) {
  .board {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  .head {
    position: static;
  }
}

@media (max-width: 640px) {
  .q {
    padding: 16px 18px;
    font-size: var(--fs-sm);
  }
  .a {
    padding: 0 18px 18px;
    font-size: var(--fs-xs);
  }
}
</style>

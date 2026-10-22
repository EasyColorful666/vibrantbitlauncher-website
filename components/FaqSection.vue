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
          v-reveal="i * 40"
        >
          <button class="q" type="button" :aria-expanded="open === i" @click="toggle(i)">
            <span>{{ item.q }}</span>
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
  gap: 48px;
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
  gap: 6px;
  align-self: flex-start;
  margin-top: 8px;
  padding: 7px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-strong);
  background: var(--tile);
  color: var(--fg-muted);
  font-size: var(--fs-xs);
  font-weight: 600;
  transition: color 0.16s var(--ease), border-color 0.16s var(--ease), background-color 0.16s var(--ease);
}
.ask:hover {
  color: var(--fg);
  border-color: var(--fg-subtle);
  background: var(--surface);
}

.accordion {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.qa {
  overflow: hidden;
  transition: border-color 0.18s var(--ease), box-shadow 0.18s var(--ease),
    background-color 0.18s var(--ease);
}

.qa:hover {
  border-color: var(--border-strong);
}

.qa.open {
  border-color: color-mix(in srgb, var(--accent) 34%, var(--border));
  box-shadow: var(--shadow-4), var(--inset-hi);
}

.q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 17px 20px;
  font-size: var(--fs-body);
  font-weight: 600;
  text-align: left;
  color: var(--fg);
}

.q-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--accent-text);
  transition: transform 0.26s var(--ease), background-color 0.2s var(--ease),
    color 0.2s var(--ease), border-color 0.2s var(--ease);
}

.qa.open .q-icon {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

/* 只转加号，别把圆角方块也转成菱形 */
.qa.open .q-icon :deep(svg) {
  transform: rotate(45deg);
  transition: transform 0.26s var(--ease);
}

.a-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s var(--ease);
}

.qa.open .a-wrap {
  grid-template-rows: 1fr;
}

.a-inner {
  overflow: hidden;
}

.a {
  padding: 0 20px 18px;
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  line-height: 1.75;
  max-width: 66ch;
}

@media (max-width: 980px) {
  .board {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .head {
    position: static;
  }
}

@media (max-width: 640px) {
  .q {
    padding: 15px 16px;
    font-size: var(--fs-sm);
  }
  .a {
    padding: 0 16px 16px;
    font-size: var(--fs-xs);
  }
}
</style>

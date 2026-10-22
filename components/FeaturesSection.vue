<script setup lang="ts">
const { c } = useSite()
const spans = ['w7', 'w5', 'w4', 'w4', 'w4', 'w6', 'w6', 'w12']
</script>

<template>
  <section id="features" class="section">
    <div class="container">
      <div class="section-head" v-reveal>
        <span class="kicker">{{ c.features.kicker }}</span>
        <h2>{{ c.features.title }}</h2>
        <p class="section-sub">{{ c.features.sub }}</p>
      </div>

      <div class="board">
        <article
          v-for="(f, i) in c.features.items"
          :key="f.title"
          class="tile tile--reveal card"
          :class="spans[i]"
          v-reveal="(i % 4) * 60"
        >
          <span class="ico">
            <AppIcon :name="f.icon" :size="19" />
          </span>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 12px;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 26px 24px;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-4), var(--inset-hi);
  border-color: var(--border-strong);
}

.ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  background: var(--accent-soft);
  color: var(--accent-text);
  border: 1px solid color-mix(in srgb, var(--accent) 14%, transparent);
  margin-bottom: 2px;
}

.card h3 {
  font-size: 1.06rem;
  letter-spacing: -0.01em;
}

.card p {
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  line-height: 1.65;
  max-width: 46ch;
}

.w4 {
  grid-column: span 4;
}
.w5 {
  grid-column: span 5;
}
.w6 {
  grid-column: span 6;
}
.w7 {
  grid-column: span 7;
}
.w12 {
  grid-column: span 12;
}

@media (max-width: 980px) {
  .w7,
  .w5,
  .w6 {
    grid-column: span 6;
  }
  .w4 {
    grid-column: span 6;
  }
}

@media (max-width: 640px) {
  .board {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .w4,
  .w5,
  .w6,
  .w7,
  .w12 {
    grid-column: span 1;
  }
  .card {
    padding: 20px;
  }
}
</style>

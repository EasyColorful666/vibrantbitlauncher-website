<script setup lang="ts">
const { c } = useSite()
</script>

<template>
  <section id="why" class="section section--alt">
    <div class="container">
      <div class="section-head" v-reveal>
        <span class="kicker">{{ c.why.kicker }}</span>
        <h2>{{ c.why.title }}</h2>
        <p class="section-sub">{{ c.why.sub }}</p>
      </div>

      <div class="board">
        <div class="tile spec" v-reveal>
          <div class="row head">
            <span>{{ c.why.cols[0] }}</span>
            <span>{{ c.why.cols[1] }}</span>
          </div>
          <div v-for="r in c.why.rows" :key="r.label" class="row">
            <span class="label">{{ r.label }}</span>
            <span class="value">{{ r.ours }}</span>
          </div>
        </div>

        <div class="stats">
          <div v-for="(s, i) in c.why.stats" :key="s.label" class="tile stat" v-reveal="i * 70">
            <span class="value-num">{{ s.value }}</span>
            <span class="label">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: 12px;
  align-items: start;
}

.spec {
  padding: 12px 20px 20px;
}

.row {
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: baseline;
  gap: 16px;
  padding: 13px 12px;
  font-size: var(--fs-sm);
  border-radius: var(--radius);
}

.row:not(.head) + .row {
  box-shadow: inset 0 1px 0 var(--border);
}

.row:nth-child(even):not(.head) {
  background: var(--surface);
  box-shadow: none;
}

.head {
  padding-top: 10px;
  padding-bottom: 10px;
  color: var(--fg-subtle);
  font-weight: 600;
  font-size: var(--fs-xs);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.label {
  color: var(--fg-muted);
  font-weight: 500;
}

.value {
  color: var(--fg);
  line-height: 1.6;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  padding: 26px 22px;
  min-height: 110px;
}

.value-num {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 3vw, 2.2rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--accent-text);
}

.stat .label {
  color: var(--fg-muted);
  font-size: var(--fs-sm);
}

@media (max-width: 980px) {
  .board {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .spec {
    padding: 8px 12px 12px;
  }
  .row {
    grid-template-columns: 1fr;
    gap: 4px;
    padding: 12px 10px;
    font-size: var(--fs-xs);
  }
  .row:nth-child(even):not(.head) {
    background: var(--surface);
  }
  .head {
    display: none;
  }
  .stat {
    padding: 20px 18px;
    min-height: 96px;
  }
}
</style>

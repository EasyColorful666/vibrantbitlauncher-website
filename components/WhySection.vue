<script setup lang="ts">
const { c, L } = useSite()

/** 规格表逐行入场 */
const rowEls = ref<HTMLElement[]>([])
function setRowEl(el: Element | null, i: number) {
  if (el) rowEls.value[i] = el as HTMLElement
}
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
        <!-- 规格表 -->
        <div class="tile spec" v-reveal>
          <div class="row head">
            <span>{{ c.why.cols[0] }}</span>
            <span>{{ c.why.cols[1] }}</span>
          </div>
          <div
            v-for="(r, i) in c.why.rows"
            :key="r.label"
            :ref="(el) => setRowEl(el as any, i)"
            class="row"
          >
            <span class="label">{{ r.label }}</span>
            <span class="value">{{ r.ours }}</span>
          </div>
        </div>

        <!-- 平台与架构矩阵 -->
        <div class="tile matrix" v-reveal>
          <div class="mx-head">
            <h3>{{ L(c.why.matrix.title) }}</h3>
            <p>{{ L(c.why.matrix.sub) }}</p>
          </div>

          <div class="mx-groups">
            <div
              v-for="g in c.why.matrix.groups"
              :key="g.os"
              class="mx-group"
            >
              <div class="mx-os">
                <span class="mx-name">{{ g.os }}</span>
                <span class="mx-note">{{ L(g.note) }}</span>
              </div>
              <div class="mx-archs">
                <span v-for="a in g.archs" :key="a" class="mx-chip">{{ a }}</span>
              </div>
            </div>
          </div>

          <div class="mx-foot">
            <span class="mx-total">
              <b>{{ c.why.matrix.groups.reduce((n, g) => n + g.archs.length, 0) }}</b>
              <span>{{ L(c.why.matrix.foot) }}</span>
            </span>
            <span class="mx-lic">AGPL-3.0</span>
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
  gap: 18px;
  align-items: start;
}

/* ---------------- 规格表 ---------------- */
.spec {
  padding: 10px 18px 18px;
  overflow: hidden;
}

.row {
  display: grid;
  grid-template-columns: 118px 1fr;
  align-items: baseline;
  gap: 16px;
  padding: 16px 14px;
  font-size: var(--fs-sm);
  border-radius: var(--radius);
  transition: background-color 0.28s var(--ease), transform 0.28s var(--ease);
}
.row:not(.head):hover {
  background: var(--surface);
  transform: translateX(4px);
}

.row:not(.head) + .row {
  box-shadow: inset 0 1px 0 var(--border);
}

.row:nth-child(even):not(.head) {
  background: color-mix(in srgb, var(--surface) 55%, transparent);
  box-shadow: none;
}

.head {
  padding-top: 12px;
  padding-bottom: 12px;
  color: var(--fg-subtle);
  font-weight: 650;
  font-size: var(--fs-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.label {
  color: var(--fg-muted);
  font-weight: 500;
}

.value {
  color: var(--fg);
  line-height: 1.65;
}

/* ---------------- 平台矩阵 ---------------- */
.matrix {
  padding: 28px 26px 24px;
  overflow: hidden;
  background:
    radial-gradient(420px 240px at 100% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%),
    var(--tile);
}

.mx-head h3 {
  font-size: 1.1rem;
  letter-spacing: -0.015em;
  margin-bottom: 6px;
}
.mx-head p {
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  line-height: 1.65;
}

.mx-groups {
  display: flex;
  flex-direction: column;
  margin-top: 22px;
}

.mx-group {
  padding: 16px 0;
}
.mx-group + .mx-group {
  box-shadow: inset 0 1px 0 var(--border);
}

.mx-os {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.mx-name {
  font-family: var(--font-display);
  font-size: 1.02rem;
  font-weight: 680;
  letter-spacing: -0.015em;
}

.mx-note {
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
}

.mx-archs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mx-chip {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding-inline: 14px;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--accent-text);
  background: linear-gradient(
    120deg,
    color-mix(in srgb, var(--accent) 14%, transparent),
    color-mix(in srgb, var(--violet) 11%, transparent)
  );
  border: 1px solid color-mix(in srgb, var(--accent) 24%, transparent);
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.mx-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px -8px color-mix(in srgb, var(--accent) 70%, transparent);
}

.mx-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 20px;
  padding: 14px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background:
    linear-gradient(
      100deg,
      color-mix(in srgb, var(--accent) 9%, transparent),
      color-mix(in srgb, var(--violet) 7%, transparent)
    );
}

.mx-total {
  display: inline-flex;
  align-items: baseline;
  gap: 9px;
  font-size: var(--fs-xs);
  color: var(--fg-muted);
}
.mx-total b {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 730;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(120deg, var(--accent), var(--violet));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.mx-lic {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--fg-muted);
  padding: 5px 11px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border);
  background: var(--surface);
}

@media (max-width: 980px) {
  .board {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .spec {
    padding: 6px 12px 12px;
  }
  .row {
    grid-template-columns: 1fr;
    gap: 4px;
    padding: 13px 10px;
    font-size: var(--fs-xs);
  }
  .row:nth-child(even):not(.head) {
    background: color-mix(in srgb, var(--surface) 55%, transparent);
  }
  .head {
    display: none;
  }
  .matrix {
    padding: 22px 18px 20px;
  }
  .mx-chip {
    height: 28px;
    padding-inline: 12px;
  }
}
</style>

<script setup lang="ts">
const { c } = useSite()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="mark" aria-hidden="true">
        <span class="mark-a">{{ c.footer.mark }}</span>
        <span class="mark-b">{{ c.footer.markTail }}</span>
      </div>

      <div class="inner">
        <div class="brand">
          <AppLogo :size="32" />
          <p class="tagline">{{ c.footer.tagline }}</p>
          <ul class="badges">
            <li v-for="b in c.footer.badges" :key="b.label" class="badge">
              <i class="badge-dot" :class="`badge-dot--${b.tone}`" />
              {{ b.label }}
            </li>
          </ul>
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
              <AppIcon v-if="(l as any).external" name="arrowUp" :size="12" class="link-arrow" />
              <span>{{ l.label }}</span>
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
  padding-block: 72px 36px;
  border-top: 1px solid var(--border);
  background: var(--layer);
}

/* 字标：Vibrantbit 深色→蓝→紫，Launcher 灰→浅紫，两段各自成渐变 */
.mark {
  display: flex;
  align-items: baseline;
  gap: 0.317em;
  margin-bottom: 44px;
  font-family: var(--font-mark);
  font-size: clamp(2.5rem, 7.6vw, 5.1rem);
  font-weight: 700;
  letter-spacing: -0.038em;
  line-height: 1;
  user-select: none;
}

.mark-a,
.mark-b {
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.mark-a {
  font-weight: 700;
  background-image: linear-gradient(
    95deg,
    #16181d 0%,
    #16181d 22%,
    #174d7e 48%,
    #2472cf 70%,
    #4b6dde 84%,
    #8b5cf6 100%
  );
}

.mark-b {
  font-weight: 700;
  letter-spacing: -0.068em;
  background-image: linear-gradient(
    95deg,
    #93989f 0%,
    #93a3b0 30%,
    #96b7d5 58%,
    #9ac1e9 70%,
    #afbaf0 85%,
    #c9b4f5 100%
  );
}

/* 暗色下深色端会糊掉，换成浅色起笔。
   注意 :global() 要包住整条选择器，否则 scoped 编译只会留下 :root，规则会落到 <html> 上。 */
:global(:root[data-theme='dark'] .mark-a) {
  background-image: linear-gradient(
    95deg,
    #f4f5f8 0%,
    #f4f5f8 20%,
    #5b9be0 50%,
    #4b8ee0 70%,
    #6f7ce8 86%,
    #a78bfa 100%
  );
}
:global(:root[data-theme='dark'] .mark-b) {
  background-image: linear-gradient(
    95deg,
    #83888f 0%,
    #8f97a4 30%,
    #9fb0c6 58%,
    #a9b6d8 72%,
    #b9b8e8 86%,
    #ccb6f6 100%
  );
}

.inner {
  display: grid;
  grid-template-columns: 1.3fr 2fr;
  gap: 48px;
  padding-bottom: 32px;
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
  line-height: 1.7;
  max-width: 44ch;
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
  padding-inline: 12px;
  border-radius: var(--radius-pill);
  background: var(--surface);
  color: var(--fg);
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--fg-subtle);
}
.badge-dot--green {
  background: #17a34a;
}
.badge-dot--blue {
  background: var(--accent);
}
.badge-dot--violet {
  background: #7c3aed;
}

.cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.col h4 {
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--fg-subtle);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 3px;
  font-family: var(--font-ui);
}

.col a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-sm);
  color: var(--fg-muted);
  width: fit-content;
  transition: color 0.16s var(--ease);
}
.col a:hover {
  color: var(--accent-text);
}

.link-arrow {
  flex: none;
  color: var(--fg-subtle);
  opacity: 0.75;
  transform: translateY(-1px);
  transition: color 0.16s var(--ease), opacity 0.16s var(--ease);
}
.col a:hover .link-arrow {
  color: var(--accent-text);
  opacity: 1;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
}

.disclaimer {
  margin-top: 14px;
  color: var(--fg-subtle);
  font-size: var(--fs-xs);
  line-height: 1.65;
  max-width: 76ch;
}

@media (max-width: 860px) {
  .inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .mark {
    margin-bottom: 28px;
  }
}

@media (max-width: 560px) {
  .cols {
    grid-template-columns: repeat(2, 1fr);
    gap: 22px 16px;
  }
  /* 字标两段在窄屏放不下，允许折行 */
  .mark {
    flex-wrap: wrap;
    row-gap: 0.04em;
    font-size: clamp(2.1rem, 11.4vw, 3rem);
  }
  .bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .footer {
    padding-block: 48px 28px;
  }
}
</style>

<script setup lang="ts">
const { c } = useSite()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="mark" aria-hidden="true">Vibrantbit</div>

      <div class="inner">
        <div class="brand">
          <AppLogo :size="32" />
          <p class="tagline">{{ c.footer.tagline }}</p>
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
  padding-block: 72px 36px;
  border-top: 1px solid var(--border);
  background: var(--layer);
}

.mark {
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 8vw, 5.4rem);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 1;
  margin-bottom: 44px;
  background: linear-gradient(100deg, var(--fg) 30%, var(--accent) 78%, #6b4fd8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0.92;
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
  font-size: var(--fs-sm);
  color: var(--fg-muted);
  width: fit-content;
  transition: color 0.16s var(--ease);
}
.col a:hover {
  color: var(--accent-text);
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

<script setup lang="ts">
const { c } = useSite()
</script>

<template>
  <section class="cta-wrap">
    <div class="container">
      <div class="cta" v-reveal>
        <span class="cta-glow" aria-hidden="true" />
        <span class="kicker">{{ c.hero.eyebrow }}</span>
        <h2>{{ c.hero.title }}<span class="accent">{{ c.hero.titleAccent }}</span></h2>
        <p>{{ c.hero.desc }}</p>
        <div class="actions">
          <a class="btn btn--primary btn--lg" href="#download">
            <AppIcon name="download" :size="17" class="btn__icon" />
            {{ c.hero.primary }}
          </a>
          <a
            class="btn btn--secondary btn--lg"
            href="https://github.com/EasyColorful666/VibrantbitLauncher.Avalonia/releases"
            target="_blank"
            rel="noopener"
          >
            <AppIcon name="arrowUp" :size="16" class="btn__icon" />
            {{ c.actions.allVersions }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-wrap {
  padding-block: 20px 0;
}

.cta {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  text-align: center;
  padding: clamp(48px, 6.5vw, 80px) 28px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-strong);
  background:
    radial-gradient(640px 300px at 12% 0%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 68%),
    radial-gradient(560px 300px at 88% 100%, color-mix(in srgb, var(--violet) 16%, transparent), transparent 68%),
    var(--tile);
  box-shadow: var(--shadow-12), var(--inset-hi);
}

/* 网格纹理 */
.cta::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.6;
  background-image:
    linear-gradient(var(--hairline) 1px, transparent 1px),
    linear-gradient(90deg, var(--hairline) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: radial-gradient(620px 340px at 50% 50%, #000, transparent 76%);
  -webkit-mask-image: radial-gradient(620px 340px at 50% 50%, #000, transparent 76%);
}

/* 顶部高光描边 */
.cta::after {
  content: "";
  position: absolute;
  left: 12%;
  right: 12%;
  top: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--accent) 70%, transparent),
    color-mix(in srgb, var(--violet) 70%, transparent),
    transparent
  );
}

.cta-glow {
  position: absolute;
  left: 50%;
  top: -60%;
  width: 700px;
  height: 700px;
  translate: -50% 0;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(
    closest-side,
    color-mix(in srgb, var(--accent) 18%, transparent),
    transparent 70%
  );
  filter: blur(40px);
  animation: breathe 9s var(--ease-out) infinite alternate;
}

@keyframes breathe {
  from {
    opacity: 0.5;
    transform: translate(-50%, 0) scale(0.95);
  }
  to {
    opacity: 0.9;
    transform: translate(-50%, 0) scale(1.08);
  }
}

.kicker {
  margin-bottom: 16px;
}

h2 {
  font-size: clamp(1.9rem, 4vw, 3rem);
  letter-spacing: -0.035em;
  margin-bottom: 16px;
}

.accent {
  background: linear-gradient(100deg, var(--accent) 0%, #6b4fd8 55%, #a855f7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

p {
  color: var(--fg-muted);
  max-width: 54ch;
  margin: 0 auto 30px;
  font-size: var(--fs-lead, 1.05rem);
  line-height: 1.75;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.btn--lg {
  --btn-h: 48px;
  padding-inline: 24px;
  font-size: 0.97rem;
}

@media (max-width: 640px) {
  .actions .btn {
    flex: 1 1 auto;
  }
}
</style>

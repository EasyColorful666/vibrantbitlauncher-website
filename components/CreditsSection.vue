<script setup lang="ts">
const { c, L } = useSite()
const asset = useAsset()

/** 头像用名字首字，再配一个稳定的色相，两个人的颜色不会撞 */
const hueOf = (i: number) => [212, 268][i] ?? 212
</script>

<template>
  <section id="credits" class="section">
    <div class="container">
      <div class="section-head" v-reveal>
        <span class="kicker">{{ c.credits.kicker }}</span>
        <h2>{{ c.credits.title }}</h2>
        <p class="section-sub">{{ c.credits.sub }}</p>
      </div>

      <div class="grid">
        <article
          v-for="(p, i) in c.credits.people"
          :key="p.name"
          class="tile card person"
          :style="{ '--hue': hueOf(i) }"
          v-reveal="i * 90"
        >
          <span class="card-glow" aria-hidden="true" />

          <div class="who">
            <span class="avatar" aria-hidden="true">
              <img class="avatar-img" :src="asset(p.avatar)" alt="" />
              <span class="avatar-ring" />
            </span>

            <div class="body">
              <div class="id">
                <h3 class="name">{{ p.name }}</h3>
                <span class="role">{{ L(p.role) }}</span>
              </div>

              <p class="bio">{{ L(p.bio) }}</p>
            </div>
          </div>

          <span class="underline" aria-hidden="true" />
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  align-items: stretch;
}

/* ---------------- 贡献者卡片 ---------------- */
.person {
  position: relative;
  overflow: hidden;
  padding: 28px 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  transition:
    transform 0.4s var(--ease),
    border-color 0.4s var(--ease),
    box-shadow 0.4s var(--ease);
}

.person:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, hsl(var(--hue) 78% 52%) 40%, var(--border));
  box-shadow: var(--shadow-12), var(--inset-hi);
}

/* 卡片左上角一团属于这个人的色晕 */
.card-glow {
  position: absolute;
  left: -70px;
  top: -90px;
  width: 300px;
  height: 300px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.7;
  background: radial-gradient(
    closest-side,
    hsl(var(--hue) 82% 58% / 0.22),
    transparent 72%
  );
  transition: opacity 0.45s var(--ease), transform 0.6s var(--ease);
}
.person:hover .card-glow {
  opacity: 1;
  transform: translate(14px, 12px) scale(1.12);
}

/* 右上角的网格纹理，和 CTA 区呼应 */
.person::before {
  content: "";
  position: absolute;
  right: -30px;
  top: -30px;
  width: 190px;
  height: 190px;
  z-index: 0;
  pointer-events: none;
  opacity: 0.5;
  background-image:
    linear-gradient(var(--hairline) 1px, transparent 1px),
    linear-gradient(90deg, var(--hairline) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(closest-side, #000, transparent 72%);
  -webkit-mask-image: radial-gradient(closest-side, #000, transparent 72%);
}

/* ---------------- 头像 ---------------- */
.who {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  flex: 1;
}

/* 右侧内容列 */
.body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  flex: 1;
}

.avatar {
  position: relative;
  flex: none;
  width: 78px;
  height: 78px;
  display: grid;
  place-items: center;
}

/* 渐变描边环：在最底层，露在图片外面一圈 */
.avatar-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  /* 用遮罩把中间掏空，只留一圈细环（百分比，跟着头像尺寸自适应） */
  -webkit-mask: radial-gradient(circle, transparent 0 71%, #000 72%);
  mask: radial-gradient(circle, transparent 0 71%, #000 72%);
  background: conic-gradient(
    from 210deg,
    hsl(var(--hue) 78% 62%),
    hsl(calc(var(--hue) + 46) 70% 70%),
    hsl(var(--hue) 78% 62%)
  );
  opacity: 0.95;
  transition: transform 0.6s var(--ease);
}
.person:hover .avatar-ring {
  transform: rotate(120deg);
}

/* 头像图：盖在环上面，圆形裁切 */
.avatar-img {
  position: relative;
  z-index: 1;
  width: 66px;
  height: 66px;
  border-radius: 50%;
  object-fit: cover;
  /* 人物照大多在上半部，焦点稍微上移 */
  object-position: center 20%;
  background: var(--surface-2);
  /* 内圈压一道暗边，和外面的渐变环脱开 */
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 0 0 1px color-mix(in srgb, var(--bg) 60%, transparent);
}

/* ---------------- 名字与角色 ---------------- */
.id {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  min-width: 0;
}

.name {
  font-family: var(--font-display);
  font-size: 1.28rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.role {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  height: 23px;
  padding-inline: 10px;
  border-radius: var(--radius-pill);
  font-size: var(--fs-xs);
  font-weight: 650;
  letter-spacing: 0.02em;
  color: hsl(var(--hue) 72% 42%);
  background: hsl(var(--hue) 84% 52% / 0.11);
  border: 1px solid hsl(var(--hue) 78% 52% / 0.26);
}

/* 暗色下文字提亮 */
:global(html[data-theme='dark']) .role {
  color: hsl(var(--hue) 88% 74%);
}

/* ---------------- 简介 ---------------- */
.bio {
  position: relative;
  z-index: 1;
  margin: 0;
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  line-height: 1.82;
}

/* 底部一条随主题色变化的渐变细线 */
.underline {
  position: relative;
  z-index: 1;
  height: 2px;
  margin-top: auto;
  flex: none;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    hsl(var(--hue) 82% 56%),
    hsl(calc(var(--hue) + 52) 74% 60%) 48%,
    transparent
  );
  opacity: 0.45;
  transform-origin: left center;
  transform: scaleX(0.3);
  transition: transform 0.65s var(--ease), opacity 0.4s var(--ease);
}
.person:hover .underline {
  opacity: 1;
  transform: scaleX(1);
}

@media (max-width: 780px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .person {
    padding: 22px 18px 20px;
    gap: 16px;
  }
  /* 窄屏改成竖排：头像在上，名字和简介在下，避免文字被挤成一两字一行 */
  .who {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
  .avatar {
    width: 60px;
    height: 60px;
  }
  .avatar-img {
    width: 50px;
    height: 50px;
  }
  .body {
    gap: 10px;
  }
  .name {
    font-size: 1.12rem;
  }
  .bio {
    font-size: var(--fs-xs);
    line-height: 1.8;
  }
}
</style>

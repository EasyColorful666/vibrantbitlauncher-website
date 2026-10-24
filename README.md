# Vibrantbit Launcher 官网

VibrantbitLauncher.Avalonia 的官方网站。Nuxt 3 + Vue 3 单页静态站，样式是手写的 scoped CSS，
设计语言用 Fluent（圆角、Mica 底色、acrylic 顶栏、Fluent 动效曲线），配色跟启动器默认的
`#0078D4` 一致。

## 视觉升级（v2）

在原有 Fluent 骨架上做了一轮整体观感升级，内容与文案一字未动：

- **设计系统**：`assets/css/main.css` 重写为「Fluent 2 令牌 + Aurora 光晕 + 玻璃拟态」，
  暗色主题从纯灰 `#1c1c1c` 换成带层次的 `#08090d`，新增 `--radius-xl`、`--violet`、`--cyan`、
  `--mica-3`、`--shadow-12` 等令牌；全局加了缓慢漂移的极光底、顶部细网格、噪点层。
- **Hero**：3D 透视倾斜的截图框 + 仿 macOS 标题栏（红黄绿交通灯）+ 呼吸光晕；
  标题改用渐变文字 + drop-shadow；特性胶囊带圆形绿勾。
- **功能卡片**：鼠标位置驱动的柔光跟随（`--mx` / `--my`），图标悬停微放大。
- **技术参数**：统计数字进入视口后做 count-up 缓动滚动（`components/WhySection.vue`）。
- **下载区**：平台切换器改胶囊式 + 渐变选中态，切换平台时列表重新入场，版本号渐变文字。
- **更新日志**：加了竖向时间轴 + 节点圆点，节点位置跟随版本号列。
- **FAQ**：圆圈加号旋转，展开时标题变主色（原先的 `01`/`02` 序号已按反馈删掉）。
- **导航栏**：顶部 2px 阅读进度条（蓝→紫渐变），当前区块导航项高亮。
- **页脚**：巨型渐变字标拆成 `Vibrantbit` + `Launcher` 两段，附技术栈徽章。

新增 `components/CtaSection.vue`（FAQ 之后的收尾行动号召区），已挂进 `pages/index.vue`。

> 注：CTA 区后来按反馈整块删除了，见下方「CTA 区」条目。

中英双语、深浅主题切换、阅读进度、滚动入场等交互全部保留原实现逻辑。

### 主题切换：太阳 / 月亮图标

顶栏的主题键是一个圆形玻璃按钮，太阳与月亮叠在一起，切换时交叉淡入淡出
（太阳旋出缩小、月亮旋入放大）。之前那版「天体轨道胶囊」因为和旁边的 EN 按钮挤在一起、
占掉顶栏一整条，视觉上很局促，已经删掉。

### 页脚巨型字标：流光 + 鼠标点亮

页脚那个巨大的 `Vibrantbit Launcher` 拆成 18 个单字（`components/AppFooter.vue`）：

- **流光扫过**：渐变自身的 `background-position` 横向移动，每个字带**负延迟**
  （`calc(var(--i) * -0.28s)`）错开相位，整行看起来是一道光从左往右扫过去。
- **逐字入场**：进入视口时按 `--i` 递增 38ms 依次上浮淡入。
- **鼠标点亮**：指针附近的字按距离（260px 半径）衰减 `--lit`，越近越亮、越上浮。
  用 `requestAnimationFrame` 节流；`prefers-reduced-motion` 下全部关掉。

### 贡献者区块

页面结尾（FAQ 之后、页脚之前）是「贡献者」区块 `components/CreditsSection.vue`，
两张卡片分别对应**阳路相逢（开发者）**和**叶冷（开发者贡献）**。
每张卡片是**横向布局**：左侧真实头像（`public/avatars/yang.jpg`、`public/avatars/ye.jpg`，
用 `useAsset()` 取路径），外圈是 conic-gradient 细描边环（`mask: radial-gradient` 掏空成细圈，
用百分比而非 px 以便移动端自适应）；右侧是姓名 + 角色标签 + 简介。
数据在 `assets/data/site.ts` 的 `credits` 字段。顶栏导航也加了「贡献者」锚点指向该区块。

**注意**：`matrix.foot` 这类字段是 `{zh, en}` 对象，模板里必须走 `L()` 拿值。
直接 `{{ c.why.matrix.foot }}` 会把整个对象渲染成 `{"zh":"个构建目标","en":"build targets"}`
漏在页面上。

### 移动端注意点

移动端抽屉菜单用了 `position: absolute`（原来在文档流里），否则隐藏状态的 `.panel`
会撑高 `position: fixed` 的头部，把首屏内容顶到视口外看不见。改这块样式时别改回静态定位。
贡献者卡片在 ≤560px 时改成竖排（头像在上、文字在下），否则简介会被挤成碎行。

#- **功能卡片**：改成**单行从右向左匀速滚动的无缝轨道**（`components/FeaturesSection.vue`）。
  悬停任意卡片即停、移开从原位续跑；点卡片会把它平滑移到轨道最前。两侧用 mask 渐隐。
- **技术参数**：删掉了原先右侧那四张统计卡（`7 / 3 / 2 / AGPL` 的数字左边表格里全都有，
  属于重复信息），改成**「平台与架构」矩阵卡**——按 Windows / macOS / Linux 分组列出架构，
  底部汇总构建目标数。表格同时补了「联机」一行、删掉与矩阵重复的「平台」行。
- **CTA 区**：已按反馈**整块删除**（`components/CtaSection.vue` 与 `pages/index.vue` 里的挂载一并移除）。
  页面现在的收尾顺序是：`top → features → why → download → changelog → faq → credits`。

### 滚动轨道的实现要点（改这块前先看）

**不要用 CSS `animation` + `:hover { animation-play-state: paused }`。**
卡片本身在移动，鼠标底下的卡片会「跑掉」，`:hover` 反复失效，表现为「悬停时停不下来 /
一抖动就恢复」。实测用 `elementFromPoint` 判断也会误判（卡片位移后该点可能已经不是那张卡）。

现在的做法是 `requestAnimationFrame` 手动改 `transform`：

- 每帧用**卡片自身的 `getBoundingClientRect()`** 判断指针是否压在某张卡上（不是 `elementFromPoint`）
- 指针离开整行（`mouseleave`）→ 立刻恢复滚动
- 内容渲染两份，位移超过「一份内容的宽度」就回绕，实现无缝循环
- `prefers-reduced-motion` 下完全停用动画，改为横向可滚动

## 交付形态：三种打包方式

| 产物 | 命令 | 用途 |
| --- | --- | --- |
| `.output/public/` | `npm run generate` | 正常部署到静态托管（Nginx / OSS / Pages） |
| `dist/`（相对路径） | `npm run generate:offline` | 放到任意子目录 / 任意静态服务器，打开即用；也可直接双击 `index.html` |
| `dist-single/vibrantbit-launcher.html` | `npm run generate:single` | **单个 HTML 文件**，双击就能打开（`file://` 协议） |

### 单文件离线版（`npm run generate:single`）

`scripts/build-single.mjs` 把所有 JS、CSS、截图、favicon 全部内联进一个 HTML，
产物约 1.2 MB。**用户拿到这个文件双击就能用**，不需要服务器、不需要联网（字体走 CDN，
没网时回退到系统字体）。

改动这个脚本前请先看下面这些坑，每一个都实际踩过：

1. **`file://` 下 ES Module 会被 CORS 拦截。** Nuxt 默认产出 `<script type="module">`，
   浏览器在 `file://` 下直接拒绝执行，整页 JS 全挂——表现为「点不了、没动过、图片裂开」。
   必须先用 esbuild 打成单文件 IIFE：`--bundle --format=iife --platform=browser`。
2. **`import.meta.url` 在 IIFE 里是空的。** Nuxt 产物拿它当 modulepreload 的 base，
   会抛 `Failed to construct 'URL': Invalid base URL`，应用挂不上。
   用 `--define:import.meta.url=document.baseURI` 打掉。
3. **`String.replace` 会把替换串当模板。** bundle 里含有 `$&`、`$'` 等序列时，
   第二个参数会被特殊解释，代码被改坏（报 `Unexpected token '<'`）。
   所有替换一律用函数式写法 `out.replace(re, () => ...)`，并且要把 `</script` 转义成 `<\/script`。
4. **bundle 必须放在 `window.__NUXT__.config` 赋值之后。**
   Nuxt 把 module 入口放在 `<head>`，config 在 `</body>` 前的内联脚本里。
   bundle 若先执行，`useRuntimeConfig()` 读到 `undefined`，直接挂载失败。
5. **Vite 的拆包清单必须整个置空。** `__vitePreload` helper 会按 `mapDeps` 清单去 fetch
   拆分的 js / css，`file://` 下必然 404。只把数组清空不够——`i.map(i => d[i])` 仍会 map 出
   `undefined` 项，helper 拿它 `new URL()` 生成一个字面量 "undefined" 的请求。
   正确做法是把整个 `mapDeps` 函数替换成 `() => []`。
6. **`file://` 下 `history.replaceState` / `pushState` 抛 `SecurityError`。**
   vue-router 初始化时必然触发，页面直接挂不上。降级成 no-op。
7. **`file://` 下改 `location.hash` 会触发 `popstate`，vue-router 会拿
   `location.pathname`（磁盘文件路径）去匹配路由**，结果 `matched` 为空 → `NuxtPage`
   渲染成空白，**整页内容消失**。
   解决方式是在捕获阶段拦掉 `popstate` / `hashchange`，让浏览器原生的锚点滚动接管。
   （之前试过 `router.options.hashMode = true`，更糟：hash 路由会把 `#download`
   当成路由路径 `/download`，同样是白屏，已回退。）
8. **图片资源不能只改 HTML 属性。** SSR 输出的截图路径和客户端 hydration 时
   `useAsset()` 算出来的路径必须一致，否则会报 hydration mismatch。
   做法是同时生成一张「相对路径 → data URI」映射表注入 `window.__VBL_ASSETS__`，
   `composables/useAsset.ts` 优先查这张表。
9. **`experimental.appManifest` 要关掉。** 它会在运行时请求 `/_nuxt/builds/meta/*.json`，
   静态部署和 `file://` 下都是 404。

### 多文件离线版（`npm run generate:offline`）在 `file://` 下的两个坑

`dist/` 这一版是多文件的（`index.html` + `_nuxt/` + `screens/` + `avatars/`），
也可以直接双击 `index.html` 打开。两个必须处理的点：

1. **`history.replaceState` 的 SecurityError 会让整页只剩一个目录列表。**
   vue-router 初始化时调 `replaceState`，`file://` 下抛异常后 Nuxt 挂载失败，
   浏览器退回显示 `file:///` 的目录索引（看起来像「打开了文件夹」）。
   修复：在 `<head>` 注入 `scripts/file-protocol-patch.mjs` 里的补丁，
   把 `replaceState` / `pushState` 降级为 no-op，并在捕获阶段拦掉 `popstate` / `hashchange`。
   **单文件版和多文件版共用这一份补丁**，不要各写一份。
2. **运行时拼出来的资源路径必须是相对的。**
   `useAsset()` 按 `app.baseURL` 拼路径，`baseURL = '/'` 时得到 `/screens/launch.png`，
   `file://` 下会被解析到**磁盘根目录** `file:///screens/launch.png` → 404、图片裂开。
   做法是构建时打开 `VBL_OFFLINE=1`，`runtimeConfig.public.offline` 置真，
   `useAsset()` 改返回 `./screens/launch.png`。
   同时 `offline-paths.mjs` 负责把 HTML / JS 里写死的绝对路径改相对。

> `scripts/offline-paths.mjs` 现在会**先清空并重新拷贝** `.output/public` → `dist/`，
> 再做路径改写。之前 `dist/` 是手工拷贝的，改完源码容易忘了同步，
> 出现「`dist/` 里还是旧路径、多文件版图片裂开」的假象。

验证方式：Chromium（Playwright）打开 `file://` 产物，检查控制台无报错、无失败请求，
并实测主题切换、锚点跳转、FAQ 手风琴、平台切换、滚动轨道悬停暂停。
多文件版要额外确认 `<img>` 全部加载成功（`naturalWidth > 0`），
因为路径错位不会报 JS 错，只会静默裂图。

## 修过的坑

- `html` 加了 `overflow-x: hidden`：几处装饰性光晕（`.halo` / `.shot-glow` / `.card-glow` /
  `.cta-glow`）用负 inset + 大尺寸定位，在窄屏会把 `scrollWidth` 撑到 600px 以上产生横向滚动。
- Hero 切换器按钮加 `white-space: nowrap`，否则「下载中心」在中文下折行。

## 开发

```bash
npm install
npm run dev            # http://localhost:3000
npm run generate       # 静态产物在 .output/public
npm run generate:offline  # 相对路径版（放子目录 / 任意静态服务器）
npm run generate:single  # 单文件离线版 → dist-single/vibrantbit-launcher.html
npm run preview        # 预览已生成的产物
```

发布时把 `.output/public` 整个目录丢到任意静态托管（Nginx / OSS / Pages）即可，不需要 Node 运行时。

## 部署到 GitHub Pages

`.github/workflows/deploy.yml` 已经写好：push 到 `master` 就 `npm ci` → `npm run generate` →
上传 `.output/public` → `deploy-pages`。

**跑之前必须手动做一次**：仓库 → **Settings → Pages → Build and deployment → Source**，
选 **GitHub Actions**。这一步只能人点，`GITHUB_TOKEN` 没有创建 Pages 站点的权限——
`configure-pages` 的 `enablement: true` 会直接 403 `Resource not accessible by integration`，
所以 workflow 里已经去掉了它，改成开头用 API 探一次，没启用就带提示失败。

两个容易踩的点：

1. **baseURL 取决于访问路径**，现在是自定义域名 `https://vbl.easycolorful.cn/`，站点在根路径，
   所以 workflow 里**没有**设 `NUXT_APP_BASE_URL`，走 `nuxt.config.ts` 的默认 `'/'`，
   `_nuxt/*`、`screens/*`、`favicon.svg` 都是根绝对路径。
   如果哪天去掉自定义域名、退回 `https://<user>.github.io/<repo>/`，必须把
   `env: NUXT_APP_BASE_URL: /${{ github.event.repository.name }}/` 加回来，
   否则页面能开、所有 JS/CSS/截图全 404。
   `public/` 下的新资源不要手写 `/xxx.png`，用 `useAsset()` 拼前缀，换部署路径时只改一处。
2. **workflow 的权限**必须是 `pages: write` + `id-token: write`，缺一个 `deploy-pages` 就报 401/404。

### 报错对照

| CI 报的错误 | 实际原因 | 怎么修 |
| --- | --- | --- |
| `Get Pages site failed` / `Not Found ... /pages` | Pages 没启用 | Settings → Pages → Source 选 GitHub Actions |
| `Create Pages site failed: Resource not accessible by integration` | 想让 token 代替你去建站，权限不够 | 同上，手动启用一次；把 `enablement: true` 删掉 |
| `Cannot find module @rollup/rollup-linux-x64-gnu` | Windows 生成的锁文件缺 Linux 原生包 | 见下面「锁文件与原生依赖」 |
| 页面能开但 JS/CSS/截图 404，路径里多出仓库名 | 绑了自定义域名却还留着 `/<repo>/` 前缀 | 删掉 `NUXT_APP_BASE_URL`，让它回落到 `/` |

如果仓库是**私有**的，免费账号没有 Pages，怎么点都建不出来——需要 Pro/Team/Enterprise，
或者把仓库设为 public。也可以直接用 Cloudflare Pages / Netlify 这类第三方托管，
产物就是 `.output/public` 一个目录，不需要任何 GitHub 侧配置。

本地想验证子路径形态（把产物丢到 `/<repo>/` 下时用）：

```bash
MSYS_NO_PATHCONV=1 NUXT_APP_BASE_URL=/vibrantbitlauncher-website/ npm run generate
```

`MSYS_NO_PATHCONV=1` 不是可选项：Git Bash 会把 `/xxx/` 这种值当路径改写成 `D:\...\xxx`，
构建直接报 `ENOENT: mkdir '.output\public\D:\...'`。CI 是 Linux，不受影响。

### 锁文件与原生依赖

`package-lock.json` 是在 Windows 上生成的，npm 会把“非本平台”的 optional 原生绑定裁掉
（[npm/cli#4828](https://github.com/npm/cli/issues/4828)），于是 Linux runner 上 rollup 找不到
`@rollup/rollup-linux-x64-gnu`，报 `Cannot find module`。

workflow 里有一个 `Add missing linux native bindings` 步骤，按已装版本号把缺的包补回来，
所以 Windows 生成的锁文件也能在 CI 里跑通。想彻底去掉这个步骤，在 Linux/WSL/容器里执行一次：

```bash
rm -rf node_modules package-lock.json && npm install
```

再把新的 `package-lock.json` 提交上去（锁文件里应该出现 `@rollup/rollup-linux-x64-gnu`）。


## 内容写在哪

| 想改什么 | 改哪里 |
| --- | --- |
| 文案、功能条目、参数表、FAQ、页脚 | `assets/data/site.ts`（中英各一份） |
| 更新日志 | 跑 `npm run changelog`，从启动器仓库的 `CHANGELOG.md` 重新生成 `assets/data/changelog.json` |
| 界面截图 | 覆盖 `public/screens/` 下的 `launch.png` / `account.png` / `download.png` |
| 主题色、圆角、阴影 | `assets/css/main.css` 里的 CSS 变量 |

更新日志的解析脚本在 `scripts/build-changelog.mjs`，默认读
`E:/VibrantbitLauncher.Avalonia/CHANGELOG.md`，也可以用 `CHANGELOG_PATH` 环境变量指定别的路径。
下载区显示的版本号和日期直接取这份 JSON 的第一条，不需要两处改。

## 目录

```
app.vue                 应用外壳（主题 / 语言的本地存储恢复）
layouts/default.vue     顶栏 + 内容 + 页脚，含跳转到主内容的链接
pages/index.vue         单页，按顺序拼各个区块
components/             各区块组件（Hero / Features / Why / Download / Changelog / Faq / Cta / Footer）
composables/            useSite（中英文案）、useTheme（亮暗切换）、useAsset（拼 baseURL 前缀）
plugins/reveal.ts       v-reveal 指令，进视口淡入，尊重 prefers-reduced-motion
scripts/build-single.mjs 单文件离线版打包器（内联 JS/CSS/截图，见上面「交付形态」）
scripts/offline-paths.mjs 把产物里的绝对路径改相对路径
```

## 说明

- 首屏用 `public/screens/` 里的真实截图，通过「启动页 / 账户 / 下载中心」三个标签切换。
- 顶栏语言键切换 zh / en，主题键切换亮暗，两者都存 localStorage，首屏前由内联脚本读取，避免闪色。
- 下载按钮目前指向 GitHub Releases 页面，等 release 打上 tag 后可以改成
  `releases/latest/download/<文件名>`。

# vbl-website — 官网项目约定

- 目录：`E:/vbl-website`（独立仓库，与 `E:/VibrantbitLauncher.Avalonia` 分开；更新日志从后者读取）。
- 技术栈：Nuxt 3 + Vue 3 SFC + 手写 scoped CSS + lucide-vue-next。没有 Tailwind，不引外部字体
  （用 Segoe UI Variable / 微软雅黑栈，国内不打 Google Fonts）。
  **唯一例外**是页脚字标：Inter 700 的 latin 子集自托管在 `public/fonts/inter-latin-700.woff2`（24 KB），
  `@font-face` 写在 `nuxt.config.ts` 的 `head.style`，并用 `withBase()` 拼前缀 + preload。
- 圆角：按钮 / 胶囊标签 / 分段控件统一 999px，令牌 `--radius-btn` 与 `--radius-pill`；
  Fluent 原生的 4px 方角只需改 `--radius-btn`。
- scoped CSS 里覆盖暗色样式必须写成 `:global(:root[data-theme='dark'] .foo)`——
  `:global(...)` 只包前半段时，编译器会把后代选择器丢掉，规则会落到 `:root` 上。
- 视觉：Fluent 设计语言，强调色 `#0078D4` 与启动器默认 CustomAccentColor 对齐；
  令牌集中在 `assets/css/main.css`，亮/暗用 `:root[data-theme]`，首屏内联脚本读 localStorage。
- 文案：平铺直叙，禁止口号式排比与「——」解释腔；只写能用仓库核对的数字
  （920 版本 / 4 加载器 / 7 架构 / 29 MB / AGPL-3.0）。
- 发布形态默认自包含（1.0.9.6 起），因此站点可以写「机器不用装 .NET」；
  `--framework-dependent` 才需要运行时（约 15 MB）。
- 更新日志与下载区版本号单一来源：`npm run changelog` 生成 `assets/data/changelog.json`，
  下载区取第一条的 version/date，不再手写常量。
- 截图：`public/screens/{launch,account,download}.png`，替换即生效（1602 宽，启动页 1002 高，另两张 856 高）。
- 命令：`npm run dev` / `npm run generate`（产物 `.output/public`，`dist` 是它的软链）/ `npm run changelog`。
- 部署：GitHub Pages + 自定义域名 **`https://vbl.easycolorful.cn/`**（仓库 `vibrantbitlauncher-website`，
  原来叫 `vbl-website`）。域名是根路径，所以**不要**设 `NUXT_APP_BASE_URL`，走 `app.baseURL` 默认的 `/`；
  一旦去掉自定义域名退回 `github.io/<repo>/`，必须加回 `/${{ github.event.repository.name }}/`。
  `public/` 资源一律用 `useAsset()` 拼前缀，不要手写 `/xxx.png`。Pages 的 Source 必须是
  「GitHub Actions」，workflow 见 `.github/workflows/deploy.yml`。
  **`configure-pages` 的 `enablement: true` 不可用**：创建 Pages 站点需要仓库管理权限，
  `GITHUB_TOKEN` 一定拿不到，只会 403 `Resource not accessible by integration`。
  workflow 改成开头用 API 探一次 Pages 状态再 fail-fast。
- **`package-lock.json` 是在 Windows 上生成的，缺 Linux 原生可选依赖**（npm/cli#4828：
  `@rollup/rollup-linux-x64-gnu`、`lightningcss-linux-x64-gnu` 都不在锁里）。
  workflow 里靠 `Add missing linux native bindings` 步骤按版本号补装；彻底解决要在 Linux 上删锁重装。
- 本机网络：github.com 与 npm registry 常常不可达（`Empty reply from server` / npm 挂死），
  涉及 `npm install`、`git push` 的动作不要假设能成功，先探一下。

# vbl-website — 官网项目约定

- 目录：`E:/vbl-website`（独立仓库，与 `E:/VibrantbitLauncher.Avalonia` 分开；更新日志从后者读取）。
- 技术栈：Nuxt 3 + Vue 3 SFC + 手写 scoped CSS + lucide-vue-next。没有 Tailwind，不引外部字体
  （用 Segoe UI Variable / 微软雅黑栈，国内不打 Google Fonts）。
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

# Vibrantbit Launcher 官网

VibrantbitLauncher.Avalonia 的官方网站。Nuxt 3 + Vue 3 单页静态站，样式是手写的 scoped CSS，
设计语言用 Fluent（圆角、Mica 底色、acrylic 顶栏、Fluent 动效曲线），配色跟启动器默认的
`#0078D4` 一致。

## 开发

```bash
npm install
npm run dev        # http://localhost:3000
npm run generate   # 静态产物在 .output/public
npm run preview    # 预览已生成的产物
```

发布时把 `.output/public` 整个目录丢到任意静态托管（Nginx / OSS / Pages）即可，不需要 Node 运行时。

## 部署到 GitHub Pages

`.github/workflows/deploy.yml` 已经写好：push 到 `master` 就 `npm ci` → `npm run generate` →
上传 `.output/public` → `deploy-pages`。仓库这边只需要把

**Settings → Pages → Build and deployment → Source** 选成 **GitHub Actions**。
（workflow 里带了 `enablement: true`，多数情况下第一次跑完会自动建站；如果组织策略不允许，
就一直卡在上面那条 `Get Pages site failed`，用手动选一次最稳。）

两个容易踩的点：

1. **站点挂在 `/<repo>/` 子路径下**，所以 CI 里设了 `NUXT_APP_BASE_URL=/vbl-website/`，
   Nuxt 会把 `_nuxt/*`、`screens/*`、`favicon.svg` 的引用都加上前缀。
   换成自定义域名或 `<user>.github.io` 根仓库时，删掉这个环境变量即可，不设就是 `/`。
   `public/` 下的新资源不要手写 `/xxx.png`，用 `useAsset()` 拼一下前缀。
2. **workflow 的权限**必须是 `pages: write` + `id-token: write`，缺一个 `deploy-pages` 就报 401/404。

本地想验证子路径形态：

```bash
NUXT_APP_BASE_URL=/vbl-website/ npm run generate   # Git Bash 前面加 MSYS_NO_PATHCONV=1
```


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
components/             各区块组件（Hero / Features / Why / Download / Changelog / Faq / Footer）
composables/            useSite（中英文案）、useTheme（亮暗切换）、useAsset（拼 baseURL 前缀）
plugins/reveal.ts       v-reveal 指令，进视口淡入，尊重 prefers-reduced-motion
```

## 说明

- 首屏用 `public/screens/` 里的真实截图，通过「启动页 / 账户 / 下载中心」三个标签切换。
- 顶栏语言键切换 zh / en，主题键切换亮暗，两者都存 localStorage，首屏前由内联脚本读取，避免闪色。
- 下载按钮目前指向 GitHub Releases 页面，等 release 打上 tag 后可以改成
  `releases/latest/download/<文件名>`。

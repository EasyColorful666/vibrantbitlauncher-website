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
components/             各区块组件（Hero / Features / Why / Download / Changelog / Faq / Footer）
composables/            useSite（中英文案）、useTheme（亮暗切换）、useAsset（拼 baseURL 前缀）
plugins/reveal.ts       v-reveal 指令，进视口淡入，尊重 prefers-reduced-motion
public/fonts/           页脚字标用的 Inter 700（latin 子集 24 KB），自托管，不请求外网
```

## 说明

- 首屏用 `public/screens/` 里的真实截图，通过「启动页 / 账户 / 下载中心」三个标签切换。
- 顶栏语言键切换 zh / en，主题键切换亮暗，两者都存 localStorage，首屏前由内联脚本读取，避免闪色。
- 下载按钮目前指向 GitHub Releases 页面，等 release 打上 tag 后可以改成
  `releases/latest/download/<文件名>`。
- 按钮、胶囊标签、分段控件的圆角统一走 `--radius-btn` / `--radius-pill`（999px），
  要回到 Fluent 的 4px 方角只需把 `--radius-btn` 改成 4px。
- 页脚字标（Vibrantbit Launcher）用 Inter 700，两段各自一条渐变；字距 `-0.038em` /
  `-0.061em`、词间距 `0.317em` 是按参考稿量出来的，改了字重就得跟着重调。
  暗色下的浅色版本靠 `:global(:root[data-theme='dark'] .mark-a)` 覆盖，
  注意 `:global()` 必须包住整条选择器，否则 scoped 编译只会留下 `:root`。

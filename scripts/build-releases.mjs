/**
 * 把启动器仓库的**最新 Release** 解析成站点用的 JSON。
 *
 *   node scripts/build-releases.mjs
 *   RELEASE_JSON=/tmp/latest.json node scripts/build-releases.mjs
 *
 * 为什么要预先落地成静态文件，而不是页面里运行时调 API：
 *   1. api.github.com 未认证只有 60 次/小时，按访客 IP 算，很容易被刷爆；
 *   2. 站点要能打成 file:// 的离线单文件版，运行时 fetch 在那种场景下必挂；
 *   3. 下载链接本来就是几个小时才变一次，构建时抓一次足够。
 *
 * 输出 assets/data/releases.json：
 *   { tag, version, publishedAt, htmlUrl, assets: { "<文件名>": { url, size } } }
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const UPSTREAM_API =
  'https://api.github.com/repos/EasyColorful666/VibrantbitLauncher.Avalonia/releases/latest'
// RELEASE_JSON 优先：CI 和本地都先用 curl 把 JSON 拉下来再交给本脚本，
// 免得 Node 的 fetch 在需要走代理的机器上连不上（它不读 http_proxy）。
const SOURCE = process.env.RELEASE_JSON || UPSTREAM_API
const OUT = resolve(root, 'assets/data/releases.json')

const isRemote = /^https?:\/\//i.test(SOURCE)

async function readSource(src) {
  if (!isRemote) {
    return existsSync(src) ? readFileSync(src, 'utf8') : null
  }
  if (typeof fetch !== 'function') {
    throw new Error('当前 Node 版本没有全局 fetch（需要 Node 18+）')
  }
  const res = await fetch(src, {
    redirect: 'follow',
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'vbl-website-build' }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
  return await res.text()
}

let text
try {
  text = await readSource(SOURCE)
} catch (err) {
  console.error(`[releases] 读取 ${SOURCE} 失败：${err.message}`)
  process.exit(1)
}

if (text === null) {
  console.error(`[releases] 找不到 ${SOURCE}，保留现有的 releases.json`)
  process.exit(0)
}

let raw
try {
  raw = JSON.parse(text)
} catch (err) {
  console.error(`[releases] ${SOURCE} 不是合法 JSON：${err.message}`)
  process.exit(1)
}

const tag = String(raw.tag_name ?? '').trim()
if (!tag) {
  console.error('[releases] 响应里没有 tag_name，可能拉到的不是 release 对象')
  process.exit(1)
}

const assets = {}
for (const a of raw.assets ?? []) {
  if (!a?.name || !a?.browser_download_url) continue
  assets[a.name] = { url: a.browser_download_url, size: a.size ?? 0 }
}

const payload = {
  generatedAt: new Date().toISOString(),
  source: UPSTREAM_API,
  tag,
  // 站点的版本号显示统一不带 v 前缀
  version: tag.replace(/^v/i, ''),
  publishedAt: String(raw.published_at ?? '').slice(0, 10),
  htmlUrl: raw.html_url ?? '',
  assets
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(payload, null, 2), 'utf8')
console.log(`[releases] ${tag}，${Object.keys(assets).length} 个文件 → ${OUT}`)

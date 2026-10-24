/**
 * 打包「单文件离线版」：把 JS / 截图全部内联进一个 index.html。
 * 双击就能打开（file:// 协议下 ES Module 会被浏览器拦截，所以必须先合并成单文件）。
 *
 * 用法：npm run generate:single
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync, mkdirSync } from 'node:fs'
import { join, extname, dirname } from 'node:path'
import { execFileSync } from 'node:child_process'
import { FILE_PROTOCOL_PATCH } from './file-protocol-patch.mjs'

const PUB = '.output/public'
const OUT = 'dist-single/vibrantbit-launcher.html'

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

const files = walk(PUB)
let out = readFileSync(join(PUB, 'index.html'), 'utf-8')

const normalize = (p) => p.replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\//, '')
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, (m) => '\\' + m)

/* ---------- 1. 图片转 base64 ---------- */
// 同时生成「相对路径 → data URI」的映射，注入到 window.__VBL_ASSETS__，
// 供 composables/useAsset.ts 在运行时取用（与 SSR 输出一致，避免 hydration 不匹配）
const assetMap = {}
const IMG_DIRS = ['/screens/', '/avatars/']
for (const f of files.filter(
  (f) => IMG_DIRS.some((d) => f.includes(d)) && ['.png', '.jpg', '.jpeg', '.webp'].includes(extname(f))
)) {
  const rel = normalize(f.replace(`${PUB}/`, ''))
  const mime = extname(f) === '.png' ? 'image/png' : extname(f) === '.webp' ? 'image/webp' : 'image/jpeg'
  const b64 = readFileSync(f).toString('base64')
  const uri = `data:${mime};base64,${b64}`
  assetMap[rel] = uri
  const key = esc(rel)
  const re = new RegExp(`(src|href)="(?:\./)?/?${key}"`, 'g')
  out = out.replace(re, (_m, attr) => `${attr}="${uri}"`)
}

/* ---------- 2. favicon 转 base64 ---------- */
if (existsSync(join(PUB, 'favicon.svg'))) {
  const b64 = readFileSync(join(PUB, 'favicon.svg')).toString('base64')
  out = out.replace(
    /href="(?:\.\/|\/)?favicon\.svg"/g,
    () => `href="data:image/svg+xml;base64,${b64}"`
  )
}

/* ---------- 3. JS 合并成单个 IIFE ---------- */
const entryMatch = out.match(/<script[^>]*type="module"[^>]*src="([^"]+)"/)
if (!entryMatch) throw new Error('找不到 JS 入口')
const entry = entryMatch[1]
const entryPath = join(PUB, normalize(entry))
if (!existsSync(entryPath)) throw new Error('入口文件不存在: ' + entryPath)

const tmpDir = '.output/.single-tmp'
execFileSync('rm', ['-rf', tmpDir])
mkdirSync(tmpDir, { recursive: true })

execFileSync(
  'npx',
  [
    'esbuild',
    entryPath,
    '--bundle',
    '--format=iife',
    '--platform=browser',
    '--target=es2019',
    '--minify',
    '--charset=utf8',
    '--outfile=' + join(tmpDir, 'bundle.js'),
    '--loader:.png=dataurl',
    '--loader:.svg=dataurl',
    '--define:process.env.NODE_ENV="production"',
    // Nuxt 产物用 import.meta.url 作为 modulepreload 的 base，
    // 在 IIFE 里它为空会导致 `new URL(x, undefined)` 抛错、应用无法挂载。
    '--define:import.meta.url=document.baseURI'
  ],
  { stdio: 'inherit' }
)

let bundle = readFileSync(join(tmpDir, 'bundle.js'), 'utf-8')

// Vite 的 preload helper 会按 deps 清单动态去 fetch 拆分的 js / css，
// 在 file:// 下必然 404。esbuild 已把它们全部打进 bundle，把清单清空即可。
// 注意要小心两件事：
//  1) 只清空数组不够，mapDeps 仍会 map 出 undefined 项，
//     helper 会拿它去 new URL()，产生一个 "undefined" 的请求。
//     所以要把整个 mapDeps 变成返回空数组。
//  2) 变量名是 esbuild minify 后随机生成的（这版是 ko/n/o，之前是 o），
//     所以正则必须用捕获组互相引用，不能写死变量名。
const before = bundle
bundle = bundle.replace(
  /([A-Za-z_$][\w$]*)=\(([A-Za-z_$][\w$]*),t=\1,([A-Za-z_$][\w$]*)=t\.f\|\|\(t\.f=\[[^\]]*\]\)\)=>([A-Za-z_$][\w$]*)\.map\(([A-Za-z_$][\w$]*)=>\3\[\5\]\)/,
  '$1=()=>[]'
)
if (before === bundle) {
  console.warn('[single] 提示：未匹配到 mapDeps，拆分资源可能仍会请求外部文件')
}
// 内联脚本里若出现 </script> 会提前闭合 <script> 标签，必须转义
bundle = bundle.replace(/<\/script/gi, '<\\/script')

/* ---------- 4. 组装 HTML ---------- */
// 移除 preload / prefetch（file:// 下 fetch 会失败）
out = out.replace(/<link[^>]*rel="modulepreload"[^>]*>/g, () => '')
out = out.replace(/<link[^>]*rel="prefetch"[^>]*>/g, () => '')
out = out.replace(/<link[^>]*as="fetch"[^>]*>/g, () => '')
// 移除 payload 的 data-src（file:// 下无法 fetch，内联数据已足够）
out = out.replace(/\sdata-src="[^"]*"/g, () => '')
// 移除所有外链脚本（entry 依赖已打进 bundle）
out = out.replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g, () => '')

// file:// 协议下的两个坑（history 降级 + popstate 拦截），
// 补丁实现见 scripts/file-protocol-patch.mjs，与多文件版共用同一份。
const historyPatch = FILE_PROTOCOL_PATCH

// 关键：bundle 必须放在 window.__NUXT__.config 赋值之后。
// Nuxt 产物把 module 入口放在 <head>，而 config 在 body 末尾的内联脚本里，
// 若 bundle 先执行，useRuntimeConfig() 会读到 undefined 而挂载失败。
const assetScript = `<script>window.__VBL_ASSETS__=${JSON.stringify(assetMap)}</script>`
out = out.replace(
  '</body>',
  () => `${historyPatch}${assetScript}<script>${bundle}</script></body>`
)

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, out, 'utf-8')
execFileSync('rm', ['-rf', tmpDir])

const kb = (statSync(OUT).size / 1024).toFixed(0)
// 检查是否还有指向本地文件的绝对路径外链。
// 注意要排除 bundle 里的模板字符串（如 href="${l}"），那是 Vue 编译产物，不是真实资源引用。
const leftOver =
  out.match(/(?:src|href)="(?![.\s]|\/|data:|#|https?:|\$\{|\{)[^"]+"/g) || []
console.log(`[single] 已生成单文件：${OUT}（${kb} KB）`)
console.log(`[single] 残留外链资源：${leftOver.length ? leftOver.join(', ') : '无'}`)

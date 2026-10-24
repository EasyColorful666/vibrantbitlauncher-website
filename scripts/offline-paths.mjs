/**
 * 把 .output/public 拷贝到 dist/ 并把绝对路径改成相对路径，
 * 这样解压后直接双击 index.html（file:// 协议）也能正常加载 CSS / JS / 截图 / 头像。
 *
 * 用法：npm run generate:offline
 */
import {
  readdirSync, readFileSync, writeFileSync, statSync,
  existsSync, rmSync, mkdirSync, copyFileSync
} from 'node:fs'
import { join, extname } from 'node:path'
import { injectFileProtocolPatch } from './file-protocol-patch.mjs'

const ROOT = '.output/public'
const OUT = 'dist'
const EXTS = new Set(['.html', '.js', '.css', '.json', '.svg'])

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (EXTS.has(extname(name))) out.push(p)
  }
  return out
}

function copyAll(src, dest) {
  mkdirSync(dest, { recursive: true })
  for (const name of readdirSync(src)) {
    const s = join(src, name)
    const d = join(dest, name)
    if (statSync(s).isDirectory()) copyAll(s, d)
    else copyFileSync(s, d)
  }
}

// 1) 清空并重新拷贝，保证 dist 与 .output/public 一致
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true })
copyAll(ROOT, OUT)

// 2) 绝对路径 -> 相对路径
const REPLACEMENTS = [
  ['/_nuxt/', './_nuxt/'],
  ['/screens/', './screens/'],
  ['/avatars/', './avatars/'],
  ['/favicon.svg', './favicon.svg'],
  ['/_payload.json', './_payload.json']
]

let changed = 0
for (const file of walk(OUT)) {
  const src = readFileSync(file, 'utf-8')
  let out = src
  for (const [from, to] of REPLACEMENTS) {
    // 整串精确匹配："/screens/x.png"
    out = out.split(`"${from}"`).join(`"${to}"`)
    out = out.split(`'${from}'`).join(`'${to}`)
    // 引号后紧跟路径前缀："/screens/xxx.png"、"/screens/"
    out = out.split(`"${from}`).join(`"${to}`)
    out = out.split(`'${from}`).join(`'${to}`)
    // 属性赋值形式：src="/screens/x.png"
    out = out.split(`="${from}`).join(`="${to}`)
    out = out.split(`='${from}`).join(`='${to}`)
  }
  // 3) 注入 file:// 协议补丁（history / popstate 降级）
  if (extname(file) === '.html') {
    out = injectFileProtocolPatch(out)
  }
  if (out !== src) {
    writeFileSync(file, out)
    changed++
  }
}

console.log(`[offline] 已拷贝到 ${OUT}/ 并改写 ${changed} 个文件为相对路径`)

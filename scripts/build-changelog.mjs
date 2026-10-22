/**
 * 把启动器仓库的 CHANGELOG.md 解析成站点用的 JSON。
 *
 *   node scripts/build-changelog.mjs
 *
 * 默认读取 E:/VibrantbitLauncher.Avalonia/CHANGELOG.md，可用 CHANGELOG_PATH 覆盖。
 * 输出 assets/data/changelog.json，供「更新日志」区块静态渲染（不依赖运行时接口）。
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = process.env.CHANGELOG_PATH || 'E:/VibrantbitLauncher.Avalonia/CHANGELOG.md'
const OUT = resolve(root, 'assets/data/changelog.json')

if (!existsSync(SOURCE)) {
  console.error(`[changelog] 找不到 ${SOURCE}，保留现有的 changelog.json`)
  process.exit(0)
}

const raw = readFileSync(SOURCE, 'utf8').replace(/\r\n/g, '\n')

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** 行内 markdown → 安全 HTML（只保留 strong / code / em） */
function inline(md) {
  let out = esc(md)
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
  // 跨行的加粗（** 开头、下一行才收尾）正则匹配不到，剩下的标记直接去掉
  out = out.replace(/\*\*/g, '')
  out = out.replace(/\s+/g, ' ').trim()
  // 折行拼接后中文标点前会多一个空格
  out = out.replace(/\s+([，。；：、！？）】」』…])/g, '$1')
  return out
}

const KIND_ALIAS = {
  新增: '新增',
  新增功能: '新增',
  修复: '修复',
  修正: '修复',
  变更: '变更',
  调整: '变更',
  改进: '改进',
  界面: '界面',
  界面设计: '界面',
  说明: '说明',
  已知: '说明'
}

const releases = []
let release = null
let section = null
let current = ''

for (const line of raw.split('\n')) {
  const version = line.match(/^##\s+\[([^\]]+)\]\s*-\s*(\S+)/)
  if (version) {
    release = { version: version[1], date: version[2], sections: [] }
    releases.push(release)
    section = null
    continue
  }

  if (!release) continue

  const head = line.match(/^###\s+(.+?)\s*$/)
  if (head) {
    const label = head[1].replace(/（.*?）/g, '').replace(/\(.*?\)/g, '').trim()
    const kind = KIND_ALIAS[label] ?? label
    section = { kind, items: [] }
    release.sections.push(section)
    continue
  }

  // 只收一级项目符号；嵌套明细、表格、引用一概不进站点
  const bullet = line.match(/^[-*]\s+(.+)$/)
  if (bullet && section) {
    const text = bullet[1].trim()
    if (!text) continue
    current = text
    section.items.push({ text: current })
    continue
  }

  // 折行的续写：接着上一条，直到句子结束或超长
  const cont = line.match(/^\s{2,}(?![-*#>|])(.+)$/)
  if (cont && section && current && section.items.length) {
    const add = cont[1].trim()
    if (!/[。；！？]$/.test(current) && current.length + add.length < 210) {
      current = `${current} ${add}`
      section.items[section.items.length - 1].text = current
    }
  }
}

const cleaned = releases
  .map((r) => {
    const sections = r.sections
      .map((s) => ({ ...s, items: s.items.slice(0, 12).map((it) => ({ html: inline(it.text) })) }))
      .filter((s) => s.items.length > 0)
    const changes = sections.reduce((n, s) => n + s.items.length, 0)
    return { version: r.version, date: r.date, changes, sections }
  })
  .filter((r) => r.sections.length > 0)

const payload = {
  generatedAt: new Date().toISOString(),
  source: SOURCE.replace(/\\/g, '/'),
  count: cleaned.length,
  releases: cleaned
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(payload, null, 2), 'utf8')
console.log(`[changelog] ${cleaned.length} 个版本 → ${OUT}`)

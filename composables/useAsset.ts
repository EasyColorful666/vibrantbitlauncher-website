/**
 * 把 public/ 下的资源路径拼上 app.baseURL。
 * 部署到 GitHub Pages 项目页时 baseURL 是 /<repo>/，直接用 "/screens/x.png" 会 404。
 *
 * baseURL 为 "./"（相对路径模式）时，返回相对路径，
 * 这样直接把产物解压到本地双击 index.html 也能正常加载资源。
 *
 * offline 标志（NUXT_PUBLIC_OFFLINE=1）会在构建时打开相对路径模式，
 * 供「多文件离线版」使用：file:// 下 "/screens/x.png" 会被解析成磁盘根目录，
 * 必须输出 "./screens/x.png" 这种相对当前 html 的路径。
 *
 * 单文件离线版（dist-single）会在构建时注入 window.__VBL_ASSETS__，
 * 里面是「相对路径 → data URI」的映射，命中时直接返回内联资源。
 */
export function useAsset() {
  const config = useRuntimeConfig()
  const base = config.app.baseURL || '/'
  const offline = Boolean((config.public as Record<string, unknown>)?.offline)
  const map = (globalThis as Record<string, any>).__VBL_ASSETS__ as
    | Record<string, string>
    | undefined

  return (path: string) => {
    // 归一化：去掉前导 "/" 或 "./"，避免出现 "././screens/x.png"
    const key = path.replace(/^\.?\/+/, '')

    // 单文件离线版：直接用内联好的 data URI
    if (map && map[key]) return map[key]

    if (offline || base === './' || base === '.') {
      return `./${key}`
    }

    return `${base.replace(/\/+$/, '')}/${key}`
  }
}

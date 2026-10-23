/**
 * 把 public/ 下的绝对路径拼上 app.baseURL。
 * 部署到 GitHub Pages 项目页时 baseURL 是 /<repo>/，直接用 "/screens/x.png" 会 404。
 */
export function useAsset() {
  const base = useRuntimeConfig().app.baseURL || '/'
  return (path: string) => `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

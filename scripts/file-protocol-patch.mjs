/**
 * file:// 协议下的通用补丁。
 *
 * 直接双击 index.html 用 file:// 打开时，有两个坑：
 *
 * 1) history.replaceState / pushState 会抛 SecurityError
 *    （file:// 下不允许创建带 URL 的 history state），
 *    vue-router 初始化时必然触发 → 页面挂载失败、白屏。
 *    这里把它们降级为 no-op —— 单页站本来也不需要改写地址栏。
 *
 * 2) 改 location.hash 会触发 popstate / hashchange，
 *    vue-router 会拿 location.pathname（file:// 下是磁盘文件路径）
 *    去匹配路由，结果 matched 为空 → NuxtPage 渲染成空白，整页内容消失。
 *    这里在捕获阶段拦掉这两个事件，浏览器原生的锚点滚动照常工作。
 *
 * 注意：这段脚本必须早于 Nuxt 的 entry 脚本执行，所以要插在 <head> 里。
 */
export const FILE_PROTOCOL_PATCH = `<script>(function(){try{
if(location.protocol!=='file:')return;
history.replaceState=function(){};
history.pushState=function(){};
var stop=function(e){e.stopImmediatePropagation();};
window.addEventListener('popstate',stop,true);
window.addEventListener('hashchange',stop,true);
document.addEventListener('popstate',stop,true);
document.addEventListener('hashchange',stop,true);
}catch(e){}})();</script>`

/**
 * 把补丁插入 HTML 的 <head> 开头。
 * @param {string} html
 * @returns {string}
 */
export function injectFileProtocolPatch(html) {
  if (html.includes('__VBL_FILE_PATCH__')) return html
  const marker = '<head>'
  const i = html.indexOf(marker)
  if (i === -1) return html
  const at = i + marker.length
  return html.slice(0, at) + FILE_PROTOCOL_PATCH + html.slice(at)
}

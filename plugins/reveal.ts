/* v-reveal：进入视口后上浮淡入。参数为延迟毫秒数。 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    getSSRProps() {
      return {}
    },
    mounted(el: HTMLElement, binding: { value?: number }) {
      if (!import.meta.client) return

      const delay = Number(binding.value ?? 0)
      if (delay > 0) el.style.setProperty('--reveal-delay', `${delay}ms`)

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced || !('IntersectionObserver' in window)) {
        el.classList.add('reveal', 'is-visible')
        return
      }

      el.classList.add('reveal')

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            el.classList.add('is-visible')
            io.disconnect()
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
      )

      io.observe(el)
      ;(el as any).__revealObserver = io
    },
    unmounted(el: HTMLElement) {
      ;(el as any).__revealObserver?.disconnect?.()
    }
  })
})

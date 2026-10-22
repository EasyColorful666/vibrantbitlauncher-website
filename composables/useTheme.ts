export type Theme = 'light' | 'dark'

export function useTheme() {
  const theme = useState<Theme>('theme', () => 'light')

  function apply(next: Theme, persist = true) {
    theme.value = next
    if (!import.meta.client) return
    document.documentElement.setAttribute('data-theme', next)
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', next === 'dark' ? '#1c1c1c' : '#f3f3f3')
    if (persist) {
      try {
        localStorage.setItem('vbl-theme', next)
      } catch {
        /* ignore */
      }
    }
  }

  function initTheme() {
    if (!import.meta.client) return
    let saved: string | null = null
    try {
      saved = localStorage.getItem('vbl-theme')
    } catch {
      saved = null
    }
    if (saved === 'light' || saved === 'dark') {
      apply(saved, false)
      return
    }
    apply(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light', false)
  }

  function toggleTheme() {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, apply, initTheme, toggleTheme }
}

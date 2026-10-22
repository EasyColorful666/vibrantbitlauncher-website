import { CONTENT } from '~/assets/data/site'

export type Locale = 'zh' | 'en'

export function useSite() {
  const locale = useState<Locale>('locale', () => 'zh')

  const c = computed(() => CONTENT[locale.value])
  const isEn = computed(() => locale.value === 'en')

  function setLocale(next: Locale) {
    locale.value = next
    if (import.meta.client) {
      try {
        localStorage.setItem('vbl-locale', next)
      } catch {
        /* 私密模式下忽略 */
      }
      document.documentElement.setAttribute('lang', next === 'en' ? 'en' : 'zh-CN')
    }
  }

  function toggleLocale() {
    setLocale(locale.value === 'zh' ? 'en' : 'zh')
  }

  function initLocale() {
    if (!import.meta.client) return
    let saved: string | null = null
    try {
      saved = localStorage.getItem('vbl-locale')
    } catch {
      saved = null
    }
    if (saved === 'en' || saved === 'zh') {
      locale.value = saved
      document.documentElement.setAttribute('lang', saved === 'en' ? 'en' : 'zh-CN')
    }
  }

  /** 取本地化字段：字段本身是 {zh,en} 还是纯字符串都能吃 */
  function L(field: any) {
    if (field == null) return ''
    if (typeof field === 'string') return field
    return field[locale.value] ?? field.zh ?? ''
  }

  return { locale, c, isEn, setLocale, toggleLocale, initLocale, L }
}

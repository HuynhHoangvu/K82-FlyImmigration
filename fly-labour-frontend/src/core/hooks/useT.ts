import { useLangStore } from '@/core/store/langStore'
import { translations } from '@/core/i18n/translations'

export function useT() {
  const lang = useLangStore(s => s.lang)
  const dict = translations[lang]

  const t = (key: string): any => {
    const keys = key.split('.')
    let val: any = dict
    for (const k of keys) {
      val = val?.[k]
      if (val === undefined) return key
    }
    return val
  }

  return { t, lang }
}

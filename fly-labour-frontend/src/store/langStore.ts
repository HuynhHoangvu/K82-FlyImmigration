import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Lang = 'en' | 'vi'

interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
}

export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: 'vi',
      setLang: (lang) => set({ lang }),
      toggle: () => set({ lang: get().lang === 'vi' ? 'en' : 'vi' }),
    }),
    { name: 'fly-labour-lang' }
  )
)
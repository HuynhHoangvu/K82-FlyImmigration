import { useRef } from 'react'
import { Palette } from 'lucide-react'
import { useEditModeStore } from '@/core/store/editModeStore'
import { useContentStore } from '@/core/hooks/usePageContent'

interface Props {
  /** Unique key for this section, e.g. "page.jobs.header" */
  sectionKey: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * Generic section wrapper that adds background-color editing in edit mode.
 * Unlike DraggableSection, this works for any page — no drag/sort/HOME_SECTIONS.
 */
export function EditableSection({ sectionKey, children, className = '', style }: Props) {
  const isEditMode = useEditModeStore(s => s.isEditMode)
  const setChange  = useEditModeStore(s => s.setChange)
  const bgKey      = `${sectionKey}.bg`
  const storedBg   = useContentStore(s => s.content[bgKey])
  const setStored  = useContentStore(s => s.set)
  const colorRef   = useRef<HTMLInputElement>(null)

  const bgColor = storedBg || ''

  const combinedStyle: React.CSSProperties = {
    ...(bgColor ? { backgroundColor: bgColor } : {}),
    ...style,
  }

  const handleColorChange = (color: string) => {
    setStored(bgKey, color)
    setChange(`content.${bgKey}`, color)
  }

  if (!isEditMode) {
    return (
      <div className={className} style={Object.keys(combinedStyle).length ? combinedStyle : undefined}>
        {children}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={Object.keys(combinedStyle).length ? combinedStyle : undefined}>
      {/* Edit-mode color picker button */}
      <div className="absolute top-2 right-2 z-30 flex items-center gap-1 bg-gray-900/90 border border-brand-gold/30 rounded-xl px-2 py-1 shadow-lg backdrop-blur">
        <span className="text-[10px] text-gray-400">Màu nền</span>
        <div
          className="w-4 h-4 rounded-full border-2 border-white/30 cursor-pointer hover:scale-110 transition-transform shadow"
          style={{
            background: bgColor || 'transparent',
            backgroundImage: bgColor
              ? undefined
              : 'linear-gradient(45deg,#555 25%,transparent 25%,transparent 75%,#555 75%),linear-gradient(45deg,#555 25%,transparent 25%,transparent 75%,#555 75%)',
            backgroundSize: '6px 6px',
            backgroundPosition: '0 0,3px 3px',
          }}
          onClick={() => colorRef.current?.click()}
        />
        {bgColor && (
          <button
            onClick={() => handleColorChange('')}
            className="text-[10px] text-gray-500 hover:text-red-400 transition-colors"
            title="Xóa màu nền"
          >
            ✕
          </button>
        )}
        <button
          onClick={() => colorRef.current?.click()}
          className="text-gray-400 hover:text-purple-400 transition-colors"
          title="Chọn màu nền"
        >
          <Palette size={12} />
        </button>
        <input
          ref={colorRef}
          type="color"
          value={bgColor || '#1a1a1a'}
          onChange={e => handleColorChange(e.target.value)}
          className="w-0 h-0 opacity-0 absolute pointer-events-none"
        />
      </div>
      {children}
    </div>
  )
}

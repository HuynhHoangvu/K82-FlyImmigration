import { useState } from 'react'
import { MessageCircle, X, Phone, Facebook } from 'lucide-react'

export default function FloatingContact() {
  const [open, setOpen] = useState(false)

  const contacts = [
    {
      icon: <Phone size={18} />,
      label: 'Hotline',
      value: '0901 234 567',
      href: 'tel:0901234567',
      bg: 'bg-green-500',
      ring: 'hover:ring-green-500/40',
    },
    {
      icon: <span className="text-sm font-black">Z</span>,
      label: 'Zalo',
      value: 'Chat Zalo',
      href: 'https://zalo.me/0901234567',
      bg: 'bg-[#0068FF]',
      ring: 'hover:ring-[#0068FF]/40',
    },
    {
      icon: <Facebook size={18} />,
      label: 'Messenger',
      value: 'Fly Labour',
      href: 'https://m.me/flylabour',
      bg: 'bg-[#0099FF]',
      ring: 'hover:ring-[#0099FF]/40',
    },
  ]

  return (
    <div className="fixed right-5 bottom-8 z-50 flex flex-col items-end gap-3">
      {/* Contact items */}
      {open && (
        <div className="flex flex-col gap-2 animate-fade-up">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-3 bg-brand-card border border-brand-border rounded-2xl px-4 py-2.5 shadow-xl hover:border-white/20 ring-2 ring-transparent ${c.ring} transition-all duration-200`}
            >
              <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                {c.icon}
              </div>
              <div>
                <p className="text-xs text-brand-muted leading-none">{c.label}</p>
                <p className="text-sm text-white font-semibold">{c.value}</p>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center text-black transition-all duration-300 hover:scale-105 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #e4a808, #fdd52f)' }}
      >
        {open
          ? <X size={22} className="text-black" />
          : <MessageCircle size={22} className="text-black" />
        }
      </button>

      {/* Pulse ring when closed */}
      {!open && (
        <span className="absolute w-14 h-14 rounded-2xl animate-ping opacity-25" style={{background:'linear-gradient(135deg,#e4a808,#fdd52f)'}} />
      )}
    </div>
  )
}

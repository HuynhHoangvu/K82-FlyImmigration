import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import { useT } from '@/hooks/useT'

export default function ServiceSelectorSection() {
  const { t } = useT()
  const h = t('home')

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-brand-yellow text-sm font-semibold uppercase tracking-widest mb-2">
            {h.svcBadge}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide">
            {h.svcTitle}{' '}
            <span className="gradient-text">{h.svcTitleAccent}</span>
          </h2>
          <p className="text-brand-muted mt-3 max-w-lg mx-auto text-sm">{h.svcSubtitle}</p>
        </div>

        {/* 3 service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {h.svcItems.map((svc: any, i: number) => {
            const isActive = !svc.soon

            return isActive ? (
              <Link
                key={i}
                to={svc.link}
                className="group relative card-dark p-8 flex flex-col items-center text-center border-2 border-brand-yellow/40 hover:border-brand-yellow transition-all duration-300 hover:shadow-[0_0_30px_rgba(253,213,47,0.15)] rounded-2xl"
              >
                {/* Active badge */}
                <span className="absolute top-4 right-4 text-xs px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 font-medium">
                  ✓ Đang mở
                </span>

                <div className="text-5xl mb-5">{svc.icon}</div>
                <h3 className="font-display text-2xl text-brand-yellow tracking-wide mb-1">{svc.sub}</h3>
                <p className="text-gray-500 text-xs mb-4">{svc.title}</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">{svc.desc}</p>

                <span className="mt-auto inline-flex items-center gap-2 text-brand-yellow text-sm font-semibold group-hover:gap-3 transition-all">
                  Khám phá ngay <ArrowRight size={15} />
                </span>
              </Link>
            ) : (
              <div
                key={i}
                className="relative card-dark p-8 flex flex-col items-center text-center opacity-55 rounded-2xl border border-brand-border"
              >
                {/* Coming soon badge */}
                <span className="absolute top-4 right-4 text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10 font-medium flex items-center gap-1">
                  <Clock size={11} /> {svc.soonLabel}
                </span>

                <div className="text-5xl mb-5 grayscale">{svc.icon}</div>
                <h3 className="font-display text-2xl text-gray-400 tracking-wide mb-1">{svc.sub}</h3>
                <p className="text-gray-600 text-xs mb-4">{svc.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{svc.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

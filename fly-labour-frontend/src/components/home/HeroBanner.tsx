import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Search, MapPin, Briefcase, Play, Pause } from 'lucide-react'

const SLIDES = [
  {
    id: 1,
    badge: '🇦🇺 Australia · 2026',
    title: 'Cơ hội vàng',
    titleAccent: 'TẠI XỨ SỞ KANGAROO',
    subtitle: 'Hơn 200+ vị trí đang chờ bạn tại Úc. Thu nhập 3.000–5.500 AUD/tháng. Bao visa, bao ăn ở.',
    ctaLink: '/jobs?country=australia',
    stats: [
      { label: 'Việc đang tuyển', value: '200+' },
      { label: 'Đã xuất cảnh', value: '1,200+' },
      { label: 'Tỉ lệ thành công', value: '96%' },
    ],
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80&fit=crop',
    imageAlt: 'Cánh đồng nông trại Úc',
    accent: '#fdd52f',
  },
  {
    id: 2,
    badge: '🇨🇦 Canada · 2026',
    title: 'Định cư lâu dài',
    titleAccent: 'TẠI ĐẤT NƯỚC LÁ PHONG',
    subtitle: 'Canada mở cửa nhập cư lao động tay nghề. Cơ hội thường trú (PR) sau 2 năm làm việc.',
    ctaLink: '/jobs?country=canada',
    stats: [
      { label: 'Vị trí tuyển dụng', value: '150+' },
      { label: 'Hỗ trợ PR', value: '100%' },
      { label: 'Thu nhập', value: '$4k+' },
    ],
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1600&q=80&fit=crop',
    imageAlt: 'Cảnh đẹp Canada',
    accent: '#e4a808',
  },
  {
    id: 3,
    badge: '🇳🇿 New Zealand · 2026',
    title: 'Cuộc sống xanh',
    titleAccent: 'TẠI NEW ZEALAND',
    subtitle: 'Môi trường sống lý tưởng, thiên nhiên tuyệt đẹp. Nhiều ngành đang cần lao động Việt Nam.',
    ctaLink: '/jobs?country=new_zealand',
    stats: [
      { label: 'Vị trí mở', value: '80+' },
      { label: 'Hỗ trợ visa', value: '100%' },
      { label: 'Chất lượng sống', value: 'Top 10' },
    ],
    image: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=1600&q=80&fit=crop',
    imageAlt: 'Thiên nhiên New Zealand',
    accent: '#D97706',
  },
]

const TICKER_ITEMS = [
  '🇦🇺 Sydney · NSW', '🇦🇺 Melbourne · VIC', '🇦🇺 Brisbane · QLD',
  '🇦🇺 Perth · WA', '🇦🇺 Adelaide · SA', '🇨🇦 Toronto · ON',
  '🇨🇦 Vancouver · BC', '🇨🇦 Calgary · AB', '🇨🇦 Montreal · QC',
  '🇳🇿 Auckland', '🇳🇿 Wellington', '🇳🇿 Christchurch',
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [search, setSearch] = useState('')
  const [playing, setPlaying] = useState(true)
  const [loaded, setLoaded] = useState<boolean[]>(SLIDES.map(() => false))
  const navigate = useNavigate()

  const next = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), [])
  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(next, 5500)
    return () => clearInterval(t)
  }, [next, playing])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) navigate(`/jobs?search=${encodeURIComponent(search.trim())}`)
  }

  const slide = SLIDES[current]

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">

      {/* Background images with crossfade */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: 0 }}
        >
          <img
            src={s.image}
            alt={s.imageAlt}
            className="w-full h-full object-cover"
            onLoad={() => setLoaded(prev => { const n = [...prev]; n[i] = true; return n })}
            style={{ display: loaded[i] ? 'block' : 'none' }}
          />
          {!loaded[i] && (
            <div className="w-full h-full bg-gradient-to-br from-brand-card to-brand-dark animate-pulse" />
          )}
        </div>
      ))}

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(105deg, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.82) 45%, rgba(10,10,10,0.4) 100%)' }}
      />

      {/* Grain texture */}
      <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* Accent glow */}
      <div
        className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full blur-3xl z-10 pointer-events-none transition-all duration-1000"
        style={{ background: slide.accent, opacity: 0.07 }}
      />

      {/* Main content */}
      <div className="relative z-20 flex-1 flex items-center">
        <div className="max-w-7xl w-full mx-auto px-6 pt-24 pb-20">
          <div className="max-w-2xl">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border animate-fade-up"
              style={{ background: `${slide.accent}18`, borderColor: `${slide.accent}40` }}
            >
              <span className="text-sm text-white">{slide.badge}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Đang tuyển dụng</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-white tracking-wide leading-none mb-4 animate-slide-in">
              {slide.title}
              <br />
              <span style={{ color: slide.accent }}>{slide.titleAccent}</span>
            </h1>

            <p className="text-gray-300 text-lg mb-8 max-w-xl leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {slide.subtitle}
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex-1 relative max-w-md">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Tìm kiếm việc làm, ngành nghề..."
                  className="input-dark pl-11 h-12 text-sm"
                />
              </div>
              <button type="submit" className="btn-primary text-sm px-6 h-12 whitespace-nowrap">
                Tìm kiếm
              </button>
              <Link to="/jobs" className="btn-outline text-sm px-4 h-12 flex items-center gap-1.5 whitespace-nowrap">
                <Briefcase size={14} /> Tất cả
              </Link>
            </form>

            {/* Quick category filters */}
            <div className="flex flex-wrap gap-2 mb-10 animate-fade-up" style={{ animationDelay: '0.25s' }}>
              {['🌾 Farm', '💅 Nail', '⚙️ Kỹ thuật', '🏗️ Xây dựng', '🍽️ Nhà hàng'].map(cat => (
                <Link key={cat} to={`/jobs?search=${cat.split(' ')[1]}`}
                  className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-full text-gray-300 hover:text-white transition-all duration-200">
                  {cat}
                </Link>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              {slide.stats.map(stat => (
                <div key={stat.label}>
                  <p className="font-display text-4xl" style={{ color: slide.accent }}>{stat.value}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide index top-right */}
      <div className="absolute top-24 right-8 z-20 hidden lg:flex items-baseline gap-1">
        <span className="font-display text-4xl" style={{ color: slide.accent }}>{String(current + 1).padStart(2, '0')}</span>
        <span className="text-white/20 text-lg mx-1">/</span>
        <span className="font-display text-xl text-white/20">{String(SLIDES.length).padStart(2, '0')}</span>
      </div>

      {/* Country switcher (desktop right) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2 z-20">
        {SLIDES.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`px-3 py-2 rounded-xl text-sm transition-all duration-200 border backdrop-blur-sm ${
              i === current ? 'text-white' : 'text-gray-500 border-brand-border bg-black/20 hover:text-gray-300'
            }`}
            style={i === current ? { borderColor: `${s.accent}60`, background: `${s.accent}20`, color: '#fff' } : {}}
          >
            {s.badge.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        <button onClick={prev}
          className="w-9 h-9 rounded-xl border border-brand-border bg-black/50 backdrop-blur flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={16} />
        </button>
        <div className="flex gap-2 items-center">
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className="h-1.5 rounded-full transition-all duration-400"
              style={{
                width: i === current ? '2rem' : '0.5rem',
                background: i === current ? slide.accent : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
        <button onClick={() => setPlaying(p => !p)}
          className="w-9 h-9 rounded-xl border border-brand-border bg-black/50 backdrop-blur flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          {playing ? <Pause size={13} /> : <Play size={13} />}
        </button>
        <button onClick={next}
          className="w-9 h-9 rounded-xl border border-brand-border bg-black/50 backdrop-blur flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Location ticker */}
      <div className="relative z-20 bg-black/60 backdrop-blur border-t border-brand-border py-2.5">
        <div className="ticker-wrap">
          <div className="ticker-content text-xs text-brand-muted">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((loc, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 mr-8">
                <MapPin size={9} style={{ color: slide.accent }} />
                <span>{loc}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Facebook, Youtube } from 'lucide-react'
import { useT } from '@/hooks/useT'

export default function Footer() {
  const { t } = useT()
  const f = t('footer')

  return (
    <footer className="bg-brand-card border-t border-brand-border mt-20">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#e4a808,#fdd52f)'}}>
              <span className="text-black font-display text-base font-black">FL</span>
            </div>
            <span className="font-display text-xl text-white tracking-wider">
              FLY <span style={{color:'#fdd52f'}}>LABOUR</span>
            </span>
          </div>
          <p className="text-brand-muted text-sm leading-relaxed">{f.tagline}</p>
          <div className="flex gap-3 mt-5">
            <a href="#" className="w-9 h-9 rounded-lg bg-brand-border flex items-center justify-center text-brand-muted hover:text-brand-yellow hover:bg-brand-yellow/10 transition-colors">
              <Facebook size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-brand-border flex items-center justify-center text-brand-muted hover:text-brand-yellow hover:bg-brand-yellow/10 transition-colors">
              <Youtube size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-brand-border flex items-center justify-center text-brand-muted hover:text-[#06C755] hover:bg-[#06C755]/10 transition-colors">
              <span className="text-xs font-bold">Z</span>
            </a>
          </div>
        </div>

        {/* Jobs Links */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest" style={{color:'#fdd52f'}}>{f.jobs}</h4>
          <ul className="space-y-2">
            {(f.jobLinks as string[]).map((item: string) => (
              <li key={item}><Link to="/jobs" className="text-brand-muted hover:text-white text-sm transition-colors">{item}</Link></li>
            ))}
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest" style={{color:'#fdd52f'}}>{f.support}</h4>
          <ul className="space-y-2">
            {(f.supportLinks as string[]).map((item: string) => (
              <li key={item}><Link to="/" className="text-brand-muted hover:text-white text-sm transition-colors">{item}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest" style={{color:'#fdd52f'}}>{f.contact}</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-brand-muted">
              <MapPin size={15} className="mt-0.5 shrink-0" style={{color:'#fdd52f'}} />
              <span>123 Nguyen Van Linh, District 7, Ho Chi Minh City</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-brand-muted">
              <Phone size={15} style={{color:'#fdd52f'}} />
              <a href="tel:0901234567" className="hover:text-white transition-colors">0901 234 567</a>
            </li>
            <li className="flex items-center gap-2 text-sm text-brand-muted">
              <Mail size={15} style={{color:'#fdd52f'}} />
              <a href="mailto:info@flylabour.com" className="hover:text-white transition-colors">info@flylabour.com</a>
            </li>
          </ul>
          <div className="mt-5 p-3 bg-brand-yellow/5 border border-brand-yellow/20 rounded-xl">
            <p className="text-xs text-brand-yellow font-semibold">{f.officeHours}</p>
            <p className="text-xs text-brand-muted mt-1 whitespace-pre-line">{f.hoursText}</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-brand-border py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-brand-muted">
          <p>{f.copyright}</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-white transition-colors">{f.privacy}</Link>
            <Link to="/" className="hover:text-white transition-colors">{f.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

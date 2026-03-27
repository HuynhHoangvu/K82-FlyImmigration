/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // ── Gold palette ──────────────────────────────
          yellow:  '#fdd52f',   // Primary CTA / accent
          gold:    '#e4a808',   // Dark gold — gradient / hover
          lime:    '#f2ee8c',   // Soft lime-gold — subtle highlights
          cream:   '#ffea80',   // Cream yellow — badges / backgrounds
          orange:  '#e4a808',   // alias kept for backward compat
          // ── Neutrals ──────────────────────────────────
          gray:    '#505050',   // Mid gray
          muted:   '#888888',   // Muted text
          // ── Dark surfaces ─────────────────────────────
          dark:    'rgba(12, 12, 12, 0.86)',
          card:    'rgba(20, 20, 20, 0.88)',
          panel:   'rgba(26, 26, 26, 0.88)',
          border:  '#2a2a2a',
          line:    '#1f1f1f',
        },
      },
      fontFamily: {
        display: ['"Montserrat"', 'sans-serif'],
        body:    ['"Nunito Sans"', 'sans-serif'],
        mono:    ['"Courier New"', 'monospace'],
      },
      animation: {
        'slide-in':   'slideIn 0.5s ease forwards',
        'fade-up':    'fadeUp 0.6s ease forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ticker':     'ticker 40s linear infinite',
        'float':      'float 3s ease-in-out infinite',
      },
      keyframes: {
        slideIn: { from: { opacity: 0, transform: 'translateX(-30px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        fadeUp:  { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        ticker:  { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float:   { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      backgroundImage: {
        'hero-gradient':   'linear-gradient(135deg, #0C0C0C 0%, #181200 55%, #0C0C0C 100%)',
        'gold-gradient':   'linear-gradient(135deg, #e4a808 0%, #fdd52f 100%)',
        'gold-gradient-v': 'linear-gradient(180deg, #fdd52f 0%, #e4a808 100%)',
        'gold-soft':       'linear-gradient(135deg, #fdd52f 0%, #f2ee8c 100%)',
        'card-gradient':   'linear-gradient(180deg, #161616 0%, #111111 100%)',
      },
      boxShadow: {
        'gold':    '0 4px 24px rgba(228,168,8,0.28)',
        'gold-sm': '0 2px 10px rgba(228,168,8,0.20)',
        'card':    '0 2px 12px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}

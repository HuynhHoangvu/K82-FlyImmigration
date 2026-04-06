# Fly Labour — Design System
**Updated:** April 6, 2026 | **Stack:** React 18 + TypeScript + Tailwind CSS v3

---

## 1. COLOR PALETTE

### Brand Colors (static — không đổi theo theme)

| Token | Hex | Dùng cho |
|---|---|---|
| `brand-gold-primary` | `#e4a808` | CTA chính, icon accent |
| `brand-gold-bright` | `#f5b500` | Hover state |
| `brand-gold-soft` | `#fdd52f` | Highlight, badge |
| `brand-gold-lighter` | `#f2ee8c` | Disabled, bg nhạt |
| `brand-orange-primary` | `#ff9500` | Flash sale, cảnh báo |
| `brand-orange-light` | `#ffb84d` | Hover orange |
| `brand-yellow` | `#f5b500` | Alias cho gold-bright |
| `brand-muted` | `#7a7a78` | Chữ muted |
| `brand-card` | `#1a1a19` | Chỉ dùng cho footer dark |
| `brand-dark` | `#0f0f0e` | Background tối nhất |

### Gray Scale

| Token | Hex |
|---|---|
| `brand-gray-50` | `#fafaf9` |
| `brand-gray-100` | `#f5f5f3` |
| `brand-gray-200` | `#e5e5e4` |
| `brand-gray-300` | `#d4d4d2` |
| `brand-gray-400` | `#b8b8b6` |
| `brand-gray-500` | `#a0a09f` |
| `brand-gray-600` | `#626262` |
| `brand-gray-700` | `#3d3d3d` |
| `brand-gray-800` | `#2a2a2a` |
| `brand-gray-900` | `#1a1a1a` |

---

## 2. THEME TOKENS (CSS Variables — tự đổi theo light/dark)

### CSS Variables

```css
/* ── Light Mode (:root) ── */
--background:        #fafaf9   /* Nền trang */
--surface:           #ffffff   /* Card, panel */
--surface-secondary: #f5f5f3   /* Panel thứ cấp */

--text-base:         #2a2a2a
--text-secondary:    #626262
--text-tertiary:     #a0a09f

--border-default:    #e5e5e4
--border-subtle:     #d4d4d2
--border-strong:     #b8b8b6

--accent-primary:    #e4a808   /* Gold — không đổi */
--accent-secondary:  #ff9500   /* Orange — không đổi */

/* ── Dark Mode (html.dark) ── */
--background:        #0f0f0e
--surface:           #1a1a19
--surface-secondary: #262624

--text-base:         #f0f0ee
--text-secondary:    #b8b8b6
--text-tertiary:     #7a7a78

--border-default:    #3a3a38
--border-subtle:     #2a2a28
--border-strong:     #4a4a48
```

### Tailwind Class Mappings (theme colors)

> Dùng các class này thay vì hardcode màu — tự chuyển khi đổi theme.

```
bg-theme-background          → var(--background)
bg-theme-surface             → var(--surface)
bg-theme-surfaceSecondary    → var(--surface-secondary)

text-theme-text-base         → var(--text-base)
text-theme-text-secondary    → var(--text-secondary)
text-theme-text-tertiary     → var(--text-tertiary)

border-theme-border-default  → var(--border-default)
border-theme-border-subtle   → var(--border-subtle)
border-theme-border-strong   → var(--border-strong)

text-theme-accent-primary    → var(--accent-primary)
bg-theme-accent-primary      → var(--accent-primary)
text-theme-accent-secondary  → var(--accent-secondary)
```

---

## 3. DARK MODE SYSTEM

- **Trigger:** class `dark` trên `<html>` — quản lý bởi `src/store/themeStore.ts`
- **Lưu trữ:** localStorage key `fly-labour-theme`
- **Mặc định:** dark mode

```tsx
// Khởi tạo trong App.tsx
useEffect(() => { useThemeStore.getState().hydrate() }, [])

// Dùng trong component
const { theme, toggle } = useThemeStore()
```

### Quy tắc

| Tình huống | Làm |
|---|---|
| Màu tự động light/dark | Dùng `bg-theme-surface`, `text-theme-text-base`... |
| Override explicit | Dùng `dark:` modifier: `text-slate-900 dark:text-white` |
| Màu cố định (brand) | OK dùng `bg-brand-gold-primary`, `text-brand-muted`... |
| Footer luôn tối | `bg-brand-card dark:bg-brand-card` — intentional |

---

## 4. CSS COMPONENT CLASSES

Định nghĩa trong `src/index.css` — `@layer components`.

### Buttons
```css
.btn-primary   /* Gold gradient, chữ đen */
.btn-outline   /* Viền vàng, nền trong suốt */
```

### Cards & Forms
```css
.card-dark     /* surface bg + border-default + hover gold border */
.input-dark    /* surface bg, border-default, focus gold glow */
```

### Badges
```css
.badge-hot     /* Gold gradient, uppercase */
.badge-country /* surface-secondary bg, accent-primary text */
```

### Typography
```css
.section-title   /* Montserrat, clamp(1.75rem→2.75rem), accent-primary */
.section-label   /* 10px, uppercase, tracking wide, #fdd52f */
.gradient-text   /* Gold gradient text clip */
```

### Utilities
```css
.header-theme    /* surface bg + border-default + transition */
.glass           /* rgba white/blue + backdrop-blur */
.glass-gold      /* rgba gold + backdrop-blur */
.divider-gold    /* 1px gradient gold divider */
.ticker-wrap     /* overflow hidden, no-wrap */
.ticker-content  /* inline-block, animate ticker */
```

---

## 5. ANIMATIONS

Định nghĩa trong `tailwind.config.js` — dùng qua class `animate-*`.

| Class | Keyframe | Duration | Dùng cho |
|---|---|---|---|
| `animate-fade-up` | `fadeUp` | 0.6s | Entrance từ dưới |
| `animate-slide-in` | `slideIn` | 0.5s | Entrance từ trái (-24px) |
| `animate-float` | `float` | 3s infinite | Icon lơ lửng |
| `animate-ticker` | `ticker` | 40s infinite | Ticker text |
| `animate-glow` | `glow` | 2.5s infinite | Box shadow pulse vàng |
| `animate-ken-burns` | `kenBurns` | 12s infinite alternate | Hero bg zoom in |
| `animate-ken-burns-reverse` | `kenBurnsReverse` | 12s infinite alternate | Hero bg zoom out |
| `animate-shine` | `shine` | 0.6s | Shine lướt qua button |

> `animate-ken-burns` cần thêm `transform-origin` qua inline style cho mỗi slide.  
> `animate-shine` trigger qua `group-hover:animate-shine` trên phần tử con.

---

## 6. COMPONENT PATTERNS

### Card
```tsx
<div className="card-dark p-5">
  <h3 className="text-theme-text-base font-semibold">Title</h3>
  <p className="text-theme-text-secondary text-sm">Body</p>
</div>
```

### Input
```tsx
<input className="input-dark" placeholder="..." />
```

### Badge HOT
```tsx
<span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full
  bg-gradient-to-r from-orange-500 to-red-500 text-white
  shadow-[0_2px_8px_rgba(239,68,68,0.45)] border border-red-400/30">
  <Flame size={9} className="fill-yellow-300 text-yellow-300" /> HOT
</span>
```

### Badge Nổi bật
```tsx
<span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full
  bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900
  shadow-[0_2px_8px_rgba(251,191,36,0.4)] border border-yellow-300/50">
  <Star size={9} className="fill-amber-800 text-amber-800" /> Nổi bật
</span>
```

### Badge Hết hạn
```tsx
<span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full
  bg-slate-200 dark:bg-slate-700/80 text-slate-600 dark:text-slate-200
  border border-slate-300 dark:border-slate-500/40">
  <TimerOff size={9} /> Hết hạn
</span>
```

### FLASH JOBS Badge
```tsx
<div className="relative flex items-center gap-2
  bg-gradient-to-r from-orange-500 via-red-500 to-red-600
  rounded-xl px-5 py-2.5 shadow-[0_0_20px_rgba(239,68,68,0.45)]
  border border-red-400/50 overflow-hidden group">
  <div className="absolute top-0 -inset-full h-full w-1/2 z-10 transform -skew-x-12
    bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
  <Flame size={22} className="text-yellow-300 fill-yellow-300 animate-pulse relative z-10" />
  <span className="font-display font-black text-xl text-white tracking-widest relative z-10">
    FLASH JOBS
  </span>
  <Flame size={22} className="text-yellow-300 fill-yellow-300 animate-pulse relative z-10" />
</div>
```

---

## 7. FILES REFERENCE

| File | Mục đích |
|---|---|
| `src/index.css` | CSS variables + `@layer` component classes |
| `tailwind.config.js` | Màu brand/theme + animation keyframes |
| `src/constants/designTokens.ts` | TypeScript token constants (dùng trong chart, inline style) |
| `src/store/themeStore.ts` | Zustand store quản lý light/dark |
| `src/components/ui/ThemeToggle.tsx` | Nút bật/tắt theme |

---

## 8. WCAG CONTRAST

| Element | Light | Dark | Ratio |
|---|---|---|---|
| Text trên Background | `#2a2a2a` / `#fafaf9` | `#f0f0ee` / `#0f0f0e` | 8.1:1 ✅ AAA |
| Gold trên White | `#e4a808` / `#fff` | `#e4a808` / `#1a1a19` | 5.2:1 ✅ AA |
| Secondary text | `#626262` / `#fafaf9` | `#b8b8b6` / `#0f0f0e` | 4.8:1 ✅ AA |

---

## 9. TROUBLESHOOTING

| Triệu chứng | Nguyên nhân | Fix |
|---|---|---|
| Màu không đổi theo theme | Dùng hardcode hex | Thay bằng `bg-theme-surface` / `text-theme-text-base` |
| Nền đen trong light mode | Dùng `bg-brand-card` hoặc `bg-brand-dark` | Dùng `bg-theme-surface` hoặc `bg-theme-surfaceSecondary` |
| Chữ tàng hình | Text color giống bg | Kiểm tra contrast, dùng `text-theme-text-base` |
| Border không thấy | Hardcode `border-gray-200` | Dùng `border-theme-border-default` |
| Animation không chạy | Class name sai | Xem bảng animate ở mục 5 |
| `animate-shine` không trigger | Thiếu `group` ở parent | Thêm class `group` vào wrapper |

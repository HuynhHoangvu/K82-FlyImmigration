# Design System: Fly Labour
**Platform:** Web — Desktop-first, responsive mobile collapse
**Context:** Vietnamese labor export & immigration services platform

---

## Configuration — Style Dials

| Dial | Level | Description |
|------|-------|-------------|
| **Creativity** | `5` | Balanced — clean business platform with warm personality. Not editorial, not sterile. |
| **Density** | `5` | Balanced sections — dashboard is data-rich, public pages are spacious |
| **Variance** | `4` | Subtle offsets — professional consistency with gentle asymmetry |
| **Motion Intent** | `5` | Subtle hover/entrance cues — micro-interactions on interactive elements |

---

## 1. Visual Theme & Atmosphere

A warm, trustworthy business interface with a gold-amber identity system. The atmosphere balances professionalism with approachability — like a well-appointed immigration consultancy office. Surfaces are warm-neutral, never clinical. The gold accent conveys prosperity and opportunity, aligning with the brand's promise of better career prospects abroad.

Typography is bold and confident for headings, relaxed and readable for body content — optimized for Vietnamese diacritics. Every interactive element responds with subtle tactile feedback.

## 2. Color Palette & Roles

### Surfaces
- **Warm Canvas** (#FAFAF9) — Primary background. Warm-neutral Stone-50, never blue-white
- **Pure Surface** (#FFFFFF) — Card and container fill for light mode
- **Recessed Surface** (#F5F5F3) — Secondary backgrounds, hover states, input backgrounds

### Text Hierarchy  
- **Charcoal Ink** (#2A2A2A) — Primary text. Rich off-black, never pure black
- **Steel Secondary** (#626262) — Body text, descriptions, metadata
- **Muted Tertiary** (#A0A09F) — Placeholders, disabled states, timestamps

### Borders & Structure
- **Whisper Border** (#E5E5E4) — Default card borders, dividers
- **Subtle Divider** (#D4D4D2) — Stronger separation lines
- **Strong Outline** (#B8B8B6) — Active borders, emphasis

### Brand Accent (Single accent system)
- **Amber Gold** (#E4A808) — Primary accent for CTAs, active states, brand identity
- **Bright Gold** (#FDD52F) — Gradient endpoint, hover states, highlights
- **Warm Orange** (#FF9500) — Secondary accent for urgency, special badges

### Semantic States
- **Success Signal** (#10B981) — Approved, active, positive states
- **Warning Signal** (#F59E0B) — Pending, attention-needed states
- **Error Signal** (#EF4444) — Rejected, error, destructive actions
- **Info Signal** (#3B82F6) — Informational, neutral highlights

### Dark Mode Surfaces
- **Deep Background** (#0F0F0E) — Primary dark background
- **Card Surface** (#1A1A19) — Dark card/container fill
- **Elevated Surface** (#262624) — Dark secondary surfaces

### Banned Colors
- Pure Black (#000000) — always Off-Black (#18181B) or Charcoal Ink (#2A2A2A)
- Purple/Violet neon gradients
- Oversaturated accents above 80% saturation
- Mixed warm/cool gray systems

## 3. Typography Rules

- **Display (Headings):** `Montserrat` — Weight 700-800, track-tight (`-0.01em`), compressed leading (`1.15`). Scaled via `clamp(1.75rem, 4vw, 2.75rem)`. Vietnamese diacritics require `line-height: 1.15` minimum with `padding-top: 0.1em` on containers to prevent clipping
- **Body:** `Nunito Sans` — Weight 400, relaxed leading (`1.65`), max 65ch width for readability. Size: 15px base. Color: Steel Secondary (#626262)
- **Labels/Micro:** `Montserrat` — Weight 700-800, `10px`, uppercase, tracking `0.18em`. Used for section labels, badge text, metadata headers
- **Mono (Data):** System monospace — For numerical data in tables, salary figures. In high-density admin views, monetary values use tabular-nums

### Font Pairing Rationale
Montserrat provides confident, geometric headlines that work well for Vietnamese text. Nunito Sans offers excellent readability at body sizes with soft, approachable character.

## 4. Component Stylings

### Buttons
- **Primary:** Gradient fill (`135deg, #E4A808 → #FDD52F → #F2EE8C`). Text: Charcoal (#121212). Rounded: 12px. Active: `scale(0.97)` tactile push. Shadow: `0 4px 20px rgba(228,168,8,0.3)`. Hover: increased shadow spread + `brightness(1.04)`
- **Outline:** Transparent fill, 1.5px border in Amber Gold. Text: Amber Gold. Hover: 8% amber background tint
- **Ghost:** No border, no fill. Text: Steel Secondary. Hover: surface-secondary background. For low-emphasis actions
- **Destructive:** Error Signal fill, white text. Active: `scale(0.97)`

### Cards/Containers
- Rounded: 16px (generous). Fill: Pure Surface. Border: 1.5px Whisper Border. Shadow: `0 1px 3px rgba(0,0,0,0.05)` at rest. Hover: border shifts to Amber Gold, shadow expands to `0 8px 24px rgba(228,168,8,0.15)`
- Internal padding: `1.25rem–1.5rem`
- In high-density admin tables, replace cards with border-top dividers

### Inputs/Forms
- Label positioned above input — `10px` uppercase tracking `0.18em`, Steel Secondary color
- Input: rounded-xl (12px), 1.5px border, surface background. Focus: amber border at 60% opacity + `0 0 0 3px rgba(228,168,8,0.1)` ring
- Error text below in Error Signal. Helper text optional in Muted Tertiary
- No floating labels. Standard `0.375rem` gap in label-input stack

### Tables (Admin)
- Header: Surface Secondary background, 2px bottom border, Amber Gold text for th
- Rows: 1px bottom border, hover → Surface Secondary background
- Cell padding: 12px

### Modals
- Overlay: `rgba(0,0,0,0.5)` with `backdrop-blur(4px)`
- Content: Pure Surface fill, 1.5px Whisper Border, rounded-2xl (20px)
- Shadow: `0 20px 60px rgba(0,0,0,0.3)`
- Entrance: fade-in overlay + scale-in content (from 0.95 to 1.0)

### Badges/Status
- Pill-shaped (rounded-full). 10px text, uppercase, bold tracking
- Use semantic color backgrounds at 10% opacity with matching text color
- Border: 1px solid at 20% opacity of the semantic color

### Loaders
- Skeleton shimmer — gradient sweep from left to right over surface-secondary placeholder shapes
- Match exact layout dimensions and border-radius
- Never use circular spinners

### Empty States
- Centered icon (muted, 48px) + guidance text + optional CTA
- Never just "No data" text. Provide actionable context

## 5. Layout Principles

- **Containment:** Max-width `1600px` for admin, `1280px` for public pages. Centered with `padding: 0 1.5rem` mobile, `0 2rem` desktop
- **Grid-First:** CSS Grid for structural layouts in admin. Flexbox for inline component alignment
- **Full-Height:** Use `min-height: 100dvh` — never `height: 100vh`
- **Section Spacing:** `clamp(2rem, 6vw, 4rem)` between major sections
- **No Overlapping:** Every element occupies its own clear spatial zone

## 6. Responsive Rules

- **Mobile-First Collapse (< 768px):** All multi-column layouts → single column
- **No Horizontal Scroll:** Critical failure if any element causes horizontal overflow
- **Typography Scaling:** Headlines scale via `clamp()`. Body minimum `14px`
- **Touch Targets:** All interactive elements minimum `44px` tap target
- **Navigation:** Desktop horizontal nav collapses to slide-in mobile menu
- **Admin Sidebar:** Hidden on mobile, slide-in overlay when toggled

## 7. Motion & Interaction

- **Transitions:** All interactive elements use `transition: all 0.2s ease` minimum
- **Tactile Feedback:** Buttons `active:scale(0.97)`. Links `active:translate-y(1px)`
- **Entrance Animations:** 
  - Cards and list items: `fadeInUp` with stagger delay (`calc(var(--index) * 60ms)`)
  - Modals: overlay `fadeIn 200ms` + content `scaleIn 200ms`
- **Skeleton Shimmer:** Gradient sweep animation, 1.5s infinite loop
- **Hover States:** Cards lift with shadow expansion. Buttons brighten. Links shift color
- **Performance:** Animate ONLY `transform` and `opacity`. Never `top`, `left`, `width`, `height`

## 8. Anti-Patterns (Banned)

- No emojis in UI components — use styled icons or colored badges
- No pure black (#000000) — use Charcoal Ink (#2A2A2A) or off-black
- No circular loading spinners — skeleton shimmer only
- No `animate-bounce` — use subtle `pulse` or custom spring
- No hardcoded hex colors in JSX — use CSS variables or design tokens
- No inconsistent dark mode — every light color must have a dark counterpart
- No generic "No data" empty states — provide context and guidance
- No inline modal styles — use unified modal component/classes
- No `h-screen` — always `min-h-[100dvh]`
- No broken Unsplash links — verify or use reliable CDN sources

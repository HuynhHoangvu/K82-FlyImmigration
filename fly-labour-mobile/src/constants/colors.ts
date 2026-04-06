// ────────────────────────────────────────────────────────────────────
// BRAND COLORS (Static - Logo Based) - Synced with Frontend Design System
// Reference: fly-labour-frontend/DESIGN_SYSTEM.md
// ────────────────────────────────────────────────────────────────────
export const BrandColors = {
  gold: {
    primary: '#e4a808',      // Main brand — CTA buttons, primary accents
    bright: '#f5b500',       // Hover / secondary accent
    soft: '#fdd52f',         // Highlights, stat values, badges
    lighter: '#f2ee8c',      // Disabled / subtle background
  },
  orange: {
    primary: '#ff9500',      // Secondary CTA, HOT badge
    light: '#ffb84d',        // Hover orange
    lighter: '#ffe5cc',      // Background tint
  },
  cream: '#fffbf0',          // Warm white (not used in dark theme)
  gray: {
    50: '#fafaf9',
    100: '#f5f5f3',
    200: '#e5e5e4',
    300: '#d4d4d2',
    400: '#b8b8b6',
    500: '#a0a09f',
    600: '#626262',
    700: '#3d3d3d',
    800: '#2a2a2a',
    900: '#1a1a1a',
  },
  // Semantic shortcuts (match web darkTheme CSS variables)
  card: '#1a1a19',           // Cards, panels  → web: --surface
  surface: '#262624',        // Inputs, elevated surfaces → web: --surface-secondary
  border: '#3a3a38',         // Default border → web: --border-default
  borderSubtle: '#2a2a28',   // Subtle divider → web: --border-subtle
  borderStrong: '#4a4a48',   // Focus / strong → web: --border-strong
  dark: '#0f0f0e',           // Page background → web: --background
  muted: '#7a7a78',          // Muted text (tertiary) → web: --text-tertiary
  yellow: '#fdd52f',         // Alias for gold.soft (stat highlights)
} as const

// ────────────────────────────────────────────────────────────────────
// SEMANTIC COLORS (for status, state, feedback)
// ────────────────────────────────────────────────────────────────────
export const SemanticColors = {
  // Status colors (job/application state)
  statusActive: '#3fb950',      // Active/Approved
  statusPaused: '#d29922',      // Paused/Warning
  statusClosed: '#f85149',      // Closed/Rejected
  statusDraft: '#8b949e',       // Draft (muted)
  statusPending: '#f0883e',     // Pending

  // Application status
  appPending: '#d29922',        // Pending review
  appReviewing: '#58a6ff',      // Under review
  appApproved: '#3fb950',       // Approved
  appRejected: '#f85149',       // Rejected
  appWithdrawn: '#8b949e',      // Withdrawn

  // Feedback
  success: '#3fb950',
  warning: '#d29922',
  danger: '#f85149',
  info: '#58a6ff',
  neutral: '#8b949e',
} as const

// ────────────────────────────────────────────────────────────────────
// THEME — Dark mode token map (matches web CSS variables)
// Use these in StyleSheet for semantic, theme-aware values
// ────────────────────────────────────────────────────────────────────
export const Theme = {
  // Surfaces
  background: BrandColors.dark,        // #0f0f0e — page bg
  surface: BrandColors.card,           // #1a1a19 — card / panel
  surfaceSecondary: BrandColors.surface, // #262624 — inputs, elevated

  // Text
  textBase: '#f0f0ee',                 // Primary text (high contrast)
  textSecondary: '#b8b8b6',            // Secondary text
  textTertiary: BrandColors.muted,     // #7a7a78 — muted / disabled

  // Borders
  borderDefault: BrandColors.border,   // #3a3a38
  borderSubtle: BrandColors.borderSubtle, // #2a2a28
  borderStrong: BrandColors.borderStrong, // #4a4a48

  // Accents
  accentPrimary: BrandColors.gold.primary,  // #e4a808 — CTA, links
  accentSecondary: BrandColors.orange.primary, // #ff9500 — HOT, warnings
  accentSoft: BrandColors.gold.soft,   // #fdd52f — highlights, stats
} as const

// ────────────────────────────────────────────────────────────────────
// COLORS — Flat export (backwards compatible, synced values)
// ────────────────────────────────────────────────────────────────────
export const Colors = {
  // Backgrounds
  dark: BrandColors.dark,              // #0f0f0e
  card: BrandColors.card,              // #1a1a19
  surface: BrandColors.surface,        // #262624

  // Borders
  border: BrandColors.border,          // #3a3a38

  // Text
  text: Theme.textBase,                // #f0f0ee — primary text
  textSub: Theme.textSecondary,        // #b8b8b6 — secondary text
  muted: BrandColors.muted,            // #7a7a78 — muted/disabled

  // Brand accents
  gold: BrandColors.gold.primary,      // #e4a808 — main CTA color
  yellow: BrandColors.gold.primary,    // #e4a808 — alias (CTAs, tabs, links)
  goldSoft: BrandColors.gold.soft,     // #fdd52f — highlight, stats, badges
  orange: BrandColors.orange.primary,  // #ff9500 — HOT badge, secondary CTA

  // Semantic status
  green: SemanticColors.success,       // #3fb950
  red: SemanticColors.danger,          // #f85149
  blue: SemanticColors.info,           // #58a6ff

  // Job status
  statusActive: SemanticColors.statusActive,
  statusPaused: SemanticColors.statusPaused,
  statusClosed: SemanticColors.statusClosed,
  statusDraft: SemanticColors.statusDraft,
  statusPending: SemanticColors.statusPending,

  // Application status
  appPending: SemanticColors.appPending,
  appReviewing: SemanticColors.appReviewing,
  appApproved: SemanticColors.appApproved,
  appRejected: SemanticColors.appRejected,
  appWithdrawn: SemanticColors.appWithdrawn,
} as const

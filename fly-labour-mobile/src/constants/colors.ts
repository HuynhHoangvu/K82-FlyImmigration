// ────────────────────────────────────────────────────────────────────
// BRAND COLORS (Static - Logo Based) - Match Frontend
// ────────────────────────────────────────────────────────────────────
export const BrandColors = {
  gold: {
    primary: '#e4a808',      // Main brand
    bright: '#f5b500',       // Hover
    soft: '#fdd52f',         // Light accent
    lighter: '#f2ee8c',      // Disabled/bg
  },
  orange: {
    primary: '#ff9500',      // Secondary CTA
    light: '#ffb84d',        // Hover
    lighter: '#ffe5cc',      // Background
  },
  cream: '#fffbf0',          // Warm white
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
  // Semantic
  border: '#21262d',
  card: '#1a1a19',           // Dark card background
  dark: '#0f0f0e',           // Deep black background
  muted: '#7a7a78',          // Muted text
  surface: '#1c2128',        // Surface background
  yellow: '#f5b500',         // Hover gold (alias)
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
// LEGACY EXPORT - For backwards compatibility
// ────────────────────────────────────────────────────────────────────
export const Colors = {
  // Backgrounds
  dark: BrandColors.dark,
  card: BrandColors.card,
  surface: BrandColors.surface,
  border: BrandColors.border,

  // Text
  text: '#e6edf3',             // Primary text
  textSub: '#7d8590',          // Secondary text
  muted: BrandColors.muted,

  // Brand colors - Match Frontend
  yellow: BrandColors.gold.soft,       // #fdd52f - Light accent
  gold: BrandColors.gold.primary,      // #e4a808 - Main brand
  orange: BrandColors.orange.primary,  // #ff9500 - Secondary CTA (hot badge)

  // Extended colors (for status)
  green: SemanticColors.success,       // #3fb950
  red: SemanticColors.danger,          // #f85149
  blue: SemanticColors.info,           // #58a6ff

  // Status
  statusActive: SemanticColors.statusActive,
  statusPaused: SemanticColors.statusPaused,
  statusClosed: SemanticColors.statusClosed,
  statusDraft: SemanticColors.statusDraft,
  statusPending: SemanticColors.statusPending,

  // App status
  appPending: SemanticColors.appPending,
  appReviewing: SemanticColors.appReviewing,
  appApproved: SemanticColors.appApproved,
  appRejected: SemanticColors.appRejected,
  appWithdrawn: SemanticColors.appWithdrawn,
} as const

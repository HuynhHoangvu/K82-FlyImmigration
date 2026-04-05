/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ────────────────────────────────────────────────────────────────
        // BRAND COLORS (Static - Logo Based) - Match Frontend
        // ────────────────────────────────────────────────────────────────
        brand: {
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
          // Semantic colors
          border: '#21262d',
          card: '#1a1a19',           // Dark card background
          dark: '#0f0f0e',           // Deep black background
          muted: '#7a7a78',          // Muted text
          surface: '#1c2128',        // Surface background
          yellow: '#f5b500',         // Hover gold (alias)
        },

        // ────────────────────────────────────────────────────────────────
        // SEMANTIC COLORS (for status, state)
        // ────────────────────────────────────────────────────────────────
        semantic: {
          success: '#3fb950',
          warning: '#d29922',
          danger: '#f85149',
          info: '#58a6ff',
          neutral: '#8b949e',
        },
      },
    },
  },
  plugins: [],
}

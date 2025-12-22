const { theme } = require('./src/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../apps/**/src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: theme.colors,
      spacing: theme.spacing,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      fontWeight: theme.typography.fontWeight,
      lineHeight: theme.typography.lineHeight,
      letterSpacing: theme.typography.letterSpacing,
      keyframes: theme.animations.keyframes,
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'fade-out': 'fadeOut 300ms ease-in',
        'slide-in-right': 'slideInRight 300ms ease-out',
        'slide-out-right': 'slideOutRight 300ms ease-in',
        'slide-in-left': 'slideInLeft 300ms ease-out',
        'slide-out-left': 'slideOutLeft 300ms ease-in',
        'slide-in-up': 'slideInUp 300ms ease-out',
        'slide-out-down': 'slideOutDown 300ms ease-in',
        'scale-in': 'scaleIn 200ms ease-out',
        'scale-out': 'scaleOut 200ms ease-in',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'bounce': 'bounce 1s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      transitionTimingFunction: theme.animations.easings,
      transitionDuration: theme.animations.durations,
    },
  },
  plugins: [],
}
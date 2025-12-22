const { theme } = require('@myorg/ui/src/theme');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'
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
    },
  },
  plugins: [],
}

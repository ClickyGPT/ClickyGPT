import { theme } from './src/styles/theme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: theme.colors,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      letterSpacing: theme.typography.letterSpacing,
      boxShadow: {
        ...theme.effects.shadows,
        primary: theme.effects.glow.primary,
        secondary: theme.effects.glow.secondary,
        accent: theme.effects.glow.accent,
      },
      transitionTimingFunction: theme.animation.easing,
      transitionDuration: theme.animation.timing,
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
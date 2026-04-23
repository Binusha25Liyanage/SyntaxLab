/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cherry: {
          50: '#FBECEE',
          100: '#F5C6CB',
          200: '#E88892',
          500: '#C1121F',
          700: '#8E0D17',
          800: '#7B0D14',
          900: '#4A060A',
        },
        mercury: {
          50: '#F5F5F5',
          100: '#E8E8E8',
          300: '#C4C4C4',
          500: '#B0B0B0',
          700: '#6B6B6B',
          900: '#2E2E2E',
        },
        bg: {
          base: '#0D0D0D',
          surface: '#181818',
          elevated: '#222222',
          overlay: '#2A2A2A',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#C1121F',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

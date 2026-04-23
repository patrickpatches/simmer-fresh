/**
 * Tailwind / NativeWind config.
 *
 * Colour names mirror `src/theme/tokens.ts` exactly — if you change one,
 * change both. The design tokens come from simmer-fresh.html (editorial
 * cookbook palette). Do not invent shades ad hoc; extend this file.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#F5F0E8',
        'bg-deep': '#EDE5D7',
        ink: '#1A1612',
        'ink-soft': '#3D342C',
        muted: '#8B7968',
        paprika: '#C44536',
        'paprika-deep': '#9B2F24',
        ochre: '#D4A574',
        sage: '#5B6B47',
        cream: '#FAF6EE',
        line: '#D9CEBB',
        warn: '#B8860B',
      },
      fontFamily: {
        display: ['Fraunces_700Bold'],
        'display-italic': ['Fraunces_600SemiBold_Italic'],
        sans: ['Manrope_500Medium'],
        'sans-bold': ['Manrope_700Bold'],
        'sans-xbold': ['Manrope_800ExtraBold'],
      },
    },
  },
  plugins: [],
};

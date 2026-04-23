/**
 * Design tokens — the editorial-cookbook palette from the HTML prototype.
 *
 * These values are the single source of truth. `tailwind.config.js` mirrors
 * them by name so you can use either `tokens.paprika` in inline styles or
 * `className="text-paprika"` via NativeWind — the colour is identical.
 *
 * If a colour is missing from the palette, add it here FIRST, then mirror
 * it in tailwind.config.js. Do not invent shades ad hoc in components.
 */
export const tokens = {
  // Surfaces
  bg: '#F5F0E8',
  bgDeep: '#EDE5D7',
  cream: '#FAF6EE',

  // Ink — text and structural black
  ink: '#1A1612',
  inkSoft: '#3D342C',
  muted: '#8B7968',

  // Accents — warm, food-referential
  paprika: '#C44536',      // primary CTA, highlight
  paprikaDeep: '#9B2F24',
  ochre: '#D4A574',        // secondary badges, in-plan indicators
  sage: '#5B6B47',         // "cook with what you have" CTA, calm confirmation
  warn: '#B8860B',

  // Structural
  line: '#D9CEBB',
} as const;

/**
 * Font family tokens — matches @expo-google-fonts package names verbatim.
 * expo-font exposes each weight under its full package name.
 */
export const fonts = {
  display: 'Fraunces_700Bold',
  displayItalic: 'Fraunces_600SemiBold_Italic',
  sans: 'Manrope_500Medium',
  sansBold: 'Manrope_700Bold',
  sansXBold: 'Manrope_800ExtraBold',
} as const;

export type TokenName = keyof typeof tokens;

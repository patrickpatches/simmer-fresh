/**
 * Design tokens — Studio Kitchen pastel palette.
 *
 * Warm linen backgrounds, dusty terracotta primary, muted sage for positive
 * states. Text colours are tuned for WCAG AA contrast on the warm linen bg
 * (muted was bumped from #9B8E85, which only hit ~2.8:1, to #6E635A at ~5.0:1).
 *
 * Single source of truth. Never hardcode colours in components.
 */

export const tokens = {
  // Surfaces
  bg:      '#F8F5F0',   // warm linen — primary background
  bgDeep:  '#EDE8E0',   // section headers, pressed states
  cream:   '#FFFFFF',   // card faces, inputs
  cardBg:  '#FFFFFF',

  // Ink — text and structural. Warmed slightly toward espresso so it sits
  // better on the linen bg without reading as cold near-black.
  ink:     '#1F1814',   // primary text  — ~16:1 on bg
  inkSoft: '#544337',   // secondary text — ~9.2:1 on bg
  muted:   '#6E635A',   // captions, hints, placeholders — ~5.0:1 on bg (AA)

  // Primary — dusty terracotta
  primary:      '#D4845A',
  primaryDeep:  '#B86D45',
  primaryLight: 'rgba(212,132,90,0.12)',

  // Positive / confirmation — muted sage
  sage:      '#6B9E8F',
  sageDeep:  '#4D8070',
  sageLight: 'rgba(107,158,143,0.12)',

  // Accent — warm ochre (badges, secondary states)
  ochre:     '#C4A05A',
  ochreDeep: '#A68445',

  // Structural
  line:     '#E5DDD5',   // dividers, borders
  lineDark: '#C8BFB5',   // stronger borders on white cards
} as const;

/**
 * Font family tokens.
 * Must match exactly what _layout.tsx loads via useFonts.
 *
 * Lora (display) + Inter (body): warm humanist serif paired with the most
 * legible UI sans-serif available. Inter handles small body sizes far
 * better than Manrope; Lora gives recipe titles and section headers a
 * book-like, editorial feel without Fraunces's heavier display flourishes.
 */
export const fonts = {
  display:      'Lora_700Bold',
  displayItalic:'Lora_500Medium_Italic',
  sans:         'Inter_500Medium',
  sansBold:     'Inter_700Bold',
  sansXBold:    'Inter_800ExtraBold',
} as const;

export type TokenName = keyof typeof tokens;

/**
 * Design tokens — Hone Sage palette.
 *
 * DECISION-011 · 2026-05-05. Direction: Sage.
 * Prototype reference: docs/prototypes/app-flow-v2.html
 *
 * DIRECTION CHANGE FROM v0.7 Dark Dramatic:
 *   v0.7 Dark Dramatic: near-black surfaces, warm off-white text, gold primary.
 *   Sage: natural sage-green surfaces, dark text, rust primary, forest secondary.
 *
 * THREE CHANGES:
 *   1. Surfaces returned to light: near-black → sage green #E8F0E6. Cards → #FAFAF7.
 *   2. Ink returned to dark: off-white → near-black #111410.
 *   3. Primary: gold #E8B830 → rust #B84030. Forest green #2E5E3E as second accent.
 *      Kitchen eyebrow = rust. Pantry / Shop eyebrow = forest.
 *      Buttons with `backgroundColor: primary` use `color: tokens.onPrimary` (#FAFAF7).
 *
 * Font pairing unchanged: Playfair Display (display) + Inter (body).
 * Token NAMES unchanged — no component rename pass required (except one addition:
 * `onPrimary` — text/icon colour to use on solid rust primary surfaces).
 *
 * Contrast notes (against bg #E8F0E6):
 *   ink         #111410   ~16:1   AAA body
 *   inkSoft     #3D3830   ~10:1   AAA body
 *   muted       #7A766E   ~4.6:1  AA body (passes large text + UI components)
 *   primary     #B84030   ~4.7:1  AA — rust on sage passes AA for large text and UI
 *   sage/forest #2E5E3E   ~6.1:1  AA+ — forest on sage, use for text freely
 *
 * Cook mode (CLAUDE.md mandate: dark, OLED-friendly true blacks) stays OLED black
 * — visually distinct from the now-light app surfaces (#E8F0E6).
 */

export const tokens = {
  // Surfaces — sage
  bg:      '#E8F0E6',   // sage green — primary background
  bgDeep:  '#DEEADB',   // deeper sage — section headers, pressed states
  cream:   '#FAFAF7',   // warm near-white — card surfaces, inputs

  // Ink — dark on light
  ink:     '#111410',   // near-black — primary text
  inkSoft: '#3D3830',   // warm dark — secondary text
  muted:   '#7A766E',   // warm taupe — captions, hints, placeholders

  // Primary — rust (buttons, links, Kitchen eyebrow, active states, step numbers).
  // Buttons with `backgroundColor: primary` use `color: tokens.onPrimary` (#FAFAF7).
  // For inline text: `primaryInk` — same rust, reads AA on sage bg.
  primary:      '#B84030',
  primaryDeep:  '#8E2E20',                   // pressed states / borders
  primaryInk:   '#B84030',                   // primary-as-text on light surfaces
  primaryLight: 'rgba(184,64,48,0.09)',      // tint for chips, selected states
  onPrimary:    '#FAFAF7',                   // text/icon on solid rust surfaces

  // Secondary — forest green (Pantry/Shop eyebrow, "See all" chip, "why" callouts,
  //   step completion, checked states).
  // Text on solid forest = tokens.onPrimary (#FAFAF7).
  sage:      '#2E5E3E',
  sageDeep:  '#1E4E2E',
  sageLight: 'rgba(46,94,62,0.11)',

  // Tertiary — amber/ochre (mise en place zone, badges, highlights).
  ochre:     '#A05C28',
  ochreDeep: '#7C4420',

  // Warm brown — recipe detail framing headers (Finishing & tasting band).
  warmBrown: '#8A6040',

  // Amber — mise en place zone background + border.
  amber:     '#FEF4E2',
  amberLine: 'rgba(160,92,40,0.18)',

  // Sky — soft info/filter accent (filter chips, informational states).
  sky:      '#7AAABB',
  skyDeep:  '#5A8A9B',
  skyLight: 'rgba(122,170,187,0.18)',

  // Structural — sage-tinted on light surfaces
  line:     '#D8E4D6',   // sage-tinted dividers
  lineDark: '#C0D4BE',   // stronger sage-tinted borders

  // Cook-mode surfaces. CLAUDE.md mandate: dark, OLED true blacks.
  // True #000000 to be visually distinct from the now-light app bg (#E8F0E6).
  // The recipe screen pulls from this group while `cooking` is true.
  cookMode: {
    screenBg: '#000000',   // true OLED black — visually distinct from light app bg
    cardBg:   '#0D0D0D',   // raised card surface
    bgDeep:   '#161616',   // callouts, leftover note
    ink:      '#F5EFE8',   // warm cream — primary text
    inkSoft:  '#C4B8A8',   // softer cream for body
    muted:    '#8A7E72',   // warm taupe for captions
    line:     'rgba(255,255,255,0.06)',
    lineDark: 'rgba(255,255,255,0.12)',
    // Accents — rust and forest read well on true black.
    primary:  '#B84030',   // rust — same as app primary
    sage:     '#2E5E3E',   // forest — same as app sage
    ochre:    '#A05C28',   // amber ochre
  },
} as const;

/**
 * Shadow tokens — single source of truth for elevation.
 *
 * `card` is the default shadow for any raised surface (recipe cards, pantry
 * zone, shop sections). One look across the app, no per-component tuning.
 * `cardLifted` is for actively-pressed-up surfaces.
 * `toast` is for floating overlays (undo banner, etc.).
 */
export const shadows = {
  card: {
    shadowColor: '#1F1814',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLifted: {
    shadowColor: '#1F1814',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
  },
  toast: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
} as const;

/**
 * Font family tokens.
 * Must match exactly what _layout.tsx loads via useFonts.
 *
 * Playfair Display (display) + Inter (body): editorial serif paired with
 * a geometric sans. v0.6 change: Source Sans 3 → Inter for body text.
 * Inter is more architectural and confident at UI sizes (12–15sp); it
 * also has tighter default letter-spacing which suits the deeper terracotta
 * palette — less delicate, more considered.
 *
 * Engineer note: swap @expo-google-fonts/source-sans-3 → @expo-google-fonts/inter
 * in package.json and update useFonts() in mobile/app/_layout.tsx.
 * Constant names are unchanged — no component rename pass required.
 */
export const fonts = {
  display:       'PlayfairDisplay_700Bold',
  displayItalic: 'PlayfairDisplay_500Medium_Italic',
  sans:          'Inter_400Regular',
  sansBold:      'Inter_600SemiBold',
  sansXBold:     'Inter_800ExtraBold',
} as const;

export type TokenName = keyof typeof tokens
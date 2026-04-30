/**
 * Design tokens — Hone v0.7 Dark Dramatic palette.
 *
 * Direction chosen by Patrick on 30 April 2026.
 * Prototype reference: docs/prototypes/concept-dark-dramatic.html
 *
 * FULL DIRECTION CHANGE FROM v0.6:
 *   v0.6 was Medium Iteration (warm cream #F6F0E8 bg, deep terracotta #C04A2E primary).
 *   v0.7 is Dark Dramatic — OLED-dark surfaces, gold accent, inverted ink values.
 *
 * THREE CHANGES:
 *   1. Surfaces inverted: warm linen → near-black #111111. Cards → #1A1A1A.
 *   2. Ink inverted: near-black text → warm off-white #F5EFE8.
 *   3. Primary colour: deep terracotta #C04A2E → gold #E8B830.
 *      Gold is the single accent colour — used for CTAs, active states,
 *      and the typographic grid labels on the browse screen.
 *
 * Font pairing is unchanged: Playfair Display (display) + Inter (body).
 * Token NAMES are unchanged — no component rename pass required.
 *
 * Contrast notes (against bg #111111):
 *   ink         #F5EFE8   ~18:1   AAA body
 *   inkSoft     #C4B8A8   ~9.5:1  AAA body
 *   muted       #8A7E72   ~4.5:1  AA body
 *   primary     #E8B830   ~9.8:1  AAA — gold reads very well on dark; use freely
 *
 * Buttons with `backgroundColor: primary` (gold) use `color: tokens.bgDeep`
 * (dark), not tokens.ink — gold is light, label must be dark for contrast.
 *
 * Cook mode (CLAUDE.md mandate: dark, OLED-friendly true blacks) uses
 * true #000000 to be visually distinct from the dark app bg (#111111).
 * The recipe screen swaps surfaces to cookMode while `cooking` is true.
 */

export const tokens = {
  // Surfaces — dark dramatic
  bg:      '#111111',   // near-black — primary background
  bgDeep:  '#080808',   // section headers, pressed states, label panels
  cream:   '#1A1A1A',   // card surfaces, inputs (legacy name kept for compat)

  // Ink — inverted for dark surfaces
  ink:     '#F5EFE8',   // warm off-white — primary text
  inkSoft: '#C4B8A8',   // softer warm — secondary text
  muted:   '#8A7E72',   // warm taupe — captions, hints, placeholders

  // Primary — gold (buttons, links, active states, typographic accents).
  // v0.7 change: deep terracotta #C04A2E → gold #E8B830.
  // Gold reads AAA on dark surfaces. Use freely.
  // Buttons with `backgroundColor: primary` use `color: tokens.bgDeep` (dark label).
  // For inline text links use `primaryInk` — same gold, same AA on dark.
  primary:      '#E8B830',
  primaryDeep:  '#C49820',                    // pressed states / borders
  primaryInk:   '#E8B830',                    // primary-as-text on dark surfaces
  primaryLight: 'rgba(232,184,48,0.18)',      // tints for chips, selected states

  // Secondary — sage (success, checked states).
  // Lifted slightly for readability on dark bg. Text on solid sage = tokens.bgDeep.
  sage:      '#AACCA8',
  sageDeep:  '#8AAE88',
  sageLight: 'rgba(170,204,168,0.20)',

  // Tertiary — ochre/butter (badges, highlights).
  ochre:     '#F2D896',
  ochreDeep: '#D4B860',

  // Warm brown — category headers, labels. Lightened for AA on dark bg.
  warmBrown: '#C4A882',

  // Sky — soft info/filter accent.
  // Use as a tint background; for text on solid sky use tokens.bgDeep.
  sky:      '#A8C4D0',
  skyDeep:  '#7AAABB',
  skyLight: 'rgba(168,196,208,0.20)',

  // Structural — subtle on dark surfaces
  line:     'rgba(255,255,255,0.08)',   // dividers, light borders
  lineDark: 'rgba(255,255,255,0.14)',   // stronger borders on card surfaces

  // Cook-mode surfaces. CLAUDE.md mandate: dark, OLED true blacks.
  // True #000000 to be visually distinct from the dark app bg (#111111).
  // The recipe screen pulls from this group while `cooking` is true.
  cookMode: {
    screenBg: '#000000',   // true OLED black — visually distinct from app bg
    cardBg:   '#0D0D0D',   // raised card surface
    bgDeep:   '#161616',   // callouts, leftover note
    ink:      '#F5EFE8',   // warm cream — primary text (unchanged from app layer)
    inkSoft:  '#C4B8A8',   // softer cream for body
    muted:    '#8A7E72',   // warm taupe for captions
    line:     'rgba(255,255,255,0.06)',
    lineDark: 'rgba(255,255,255,0.12)',
    // Accents — gold and sage read well on true black without adjustment.
    primary:  '#E8B830',   // gold — same as app primary, reads AAA on #000000
    sage:     '#AACCA8',   // sage — unchanged
    ochre:    '#F2D896',   // ochre — unchanged
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

export type TokenName = keyof typeof tokens;

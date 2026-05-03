/**
 * ingredient-derivations.ts
 *
 * Culinary Verifier deliverable — Phase 1 of the pantry derivation handoff
 * (docs/coo/handoffs.md, 2026-05-04).
 *
 * PURPOSE
 * -------
 * The pantry-match algorithm in pantry-helpers.ts treats every ingredient as
 * atomic. Having "Eggs" in the pantry does not match a recipe calling for
 * "Egg yolks" — they are structurally different strings that the substring and
 * token checks both miss.
 *
 * This file defines a map from a *source* ingredient (what the user has in
 * their pantry) to the *derived* ingredients those pantry items can produce,
 * along with the prep required and an honest quality flag.
 *
 * WHAT THE EXISTING MATCHER ALREADY HANDLES (no entry needed here)
 * -----------------------------------------------------------------
 * normalizeForMatch() in pantry-helpers.ts strips "fresh", "dried", "ground",
 * "crushed", "whole", "raw", "cooked". cleanIngredientName() strips everything
 * after a comma and strips prep adjectives. Together they already handle:
 *
 *   • garlic → garlic cloves, crushed garlic, garlic paste, sliced garlic
 *     ("garlic cloves" strips comma-prep → "garlic cloves"; substring check
 *      fires because "garlic cloves".includes("garlic") = true)
 *
 *   • ginger → fresh ginger, grated ginger, ginger paste
 *     (normalizeForMatch strips "fresh"; same substring logic applies)
 *
 *   • lemon → lemon juice, lemon zest, lemon (juice and zest)
 *     ("lemon juice".includes("lemon") = true; parens stripped from
 *      "lemon (juice and zest)" → "lemon" → exact match)
 *
 *   • lime → lime juice, lime zest
 *     (same as lemon)
 *
 *   • cumin seeds → ground cumin
 *     (normalizeForMatch strips "ground" → "cumin"; "cumin seeds".includes("cumin") = true)
 *
 *   • coriander seeds → ground coriander  (same strip logic)
 *   • peppercorns, black → black pepper, ground pepper  (substring on "pepper")
 *   • cinnamon stick → ground cinnamon  (substring on "cinnamon")
 *   • allspice berries → ground allspice  (substring on "allspice")
 *   • cardamom pods → ground cardamom  (substring on "cardamom")
 *   • cloves (whole) → ground cloves  (substring on "cloves")
 *   • tomatoes → tinned tomatoes, crushed tomatoes, tomato paste
 *     ("tinned whole tomatoes" and "tomato paste" both contain "tomato";
 *      substring fires in both directions as needed)
 *   • dried chickpeas → tinned chickpeas  (substring on "chickpeas")
 *   • parsley, coriander, thyme, rosemary → their chopped/torn forms
 *     (comma-strip removes the prep suffix)
 *   • prawns → raw prawns, shell-on prawns
 *     (normalizeForMatch strips "raw"; "prawns" ⊂ "raw prawns, shell-on")
 *   • bread → breadcrumbs, panko breadcrumbs  ("breadcrumbs".includes("bread") = true...
 *     wait: substring check fires as "breadcrumbs".includes("bread") but the check is
 *     norm.includes(p) OR p.includes(norm). "bread".includes("breadcrumbs") = false,
 *     "breadcrumbs".includes("bread") = true ✓)
 *   • pitta bread → stale pitta bread  (substring)
 *
 * GENUINE GAPS THAT REQUIRE THIS FILE
 * ------------------------------------
 * These are the cases the existing matcher CANNOT resolve:
 *
 *   1. eggs → egg yolks / egg whites
 *      "eggs" vs "egg yolks": neither is a substring of the other.
 *      Token match: ["egg","yolks"] ∩ ["eggs"] = ∅ (singular ≠ plural).
 *      This is the most impactful gap — Carbonara, Pavlova, Beef Wellington
 *      all require derived egg forms.
 *
 *   2. parmesan → parmigiano
 *      The bolognese recipe uses "Parmigiano, grated" (the Italian name).
 *      normalizeForMatch("Parmigiano, grated") = "parmigiano".
 *      normalizeForMatch("Parmesan") = "parmesan".
 *      Neither is a substring or token-overlap of the other.
 *
 *   3. whole chicken → chicken stock (stock-making is a transformation, not
 *      prep — the substring check partially covers "chicken" but "chicken stock"
 *      in the pantry would match already; the problem is a user who has a WHOLE
 *      CHICKEN and could MAKE stock from it but doesn't have stock in the pantry)
 *
 *   4. beef bones → beef stock  (same as above)
 *
 *   5. prawn shells → prawn stock  (the Laksa recipe calls for a stock made
 *      from reserved prawn shells; the user will have "prawns" not "prawn stock")
 *
 *   6. unsalted butter → ghee  ("ghee".includes("butter") = false)
 *
 *   7. desiccated coconut → kerisik  ("kerisik" is opaque — the Rendang and
 *      Nasi Lemak recipes use it; "coconut" does not substring-match "kerisik")
 *
 *   8. coconut (fresh/desiccated) → coconut milk
 *      ("coconut milk".includes("coconut") = true — ACTUALLY this one works.
 *      Keeping the entry for UI annotation purposes only.)
 *
 * HOW THE ENGINEER SHOULD USE THIS FILE
 * --------------------------------------
 * See the Phase 2 note in docs/coo/handoffs.md. Short version:
 *
 *   1. Normalise the pantry item name: norm = normalizeForMatch(pantryItem.name)
 *   2. Look up norm in DERIVATION_LOOKUP (the pre-built flattened map exported below).
 *   3. If a hit, add the derived forms to the set of "virtual pantry items" before
 *      running the existing isMatch() logic.
 *   4. When rendering a matched ingredient row, check derivationSource to show
 *      the "from your eggs →" annotation and the prep_note icon.
 *
 * Keys in INGREDIENT_DERIVATIONS use clean canonical names (no prep suffixes,
 * no comma notes). They are intentionally not pre-normalised — call
 * normalizeForMatch() on them at lookup time to stay consistent with the
 * main matching pipeline.
 *
 * QUALITY FLAGS
 * -------------
 * 'perfect'   — structurally identical; zero culinary trade-off
 *               (separating egg yolks from whole eggs yields exactly what
 *               the recipe needs — nothing is lost or added)
 *
 * 'good'      — the substitution works well but there is a minor difference
 *               the cook should know about (fresh-made chicken stock is
 *               slightly deeper than carton stock but the dish works either way)
 *
 * 'compromise' — the dish works but something meaningful changes
 *               (using fresh tomatoes as a stand-in for tinned loses the
 *               reduced, jammy intensity; acceptable in a pinch)
 *
 * AUSTRALIAN ENGLISH NOTE
 * -----------------------
 * All names use Australian ingredient names: capsicum (not bell pepper),
 * coriander (not cilantro), bicarbonate of soda (not baking soda),
 * plain flour (not all-purpose flour), tinned (not canned).
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A single derived-ingredient entry.
 *
 * `derived`      — the name as it appears (or would appear) in a recipe ingredient.
 *                  Use the canonical form without prep suffixes — the matcher will
 *                  strip those. E.g. "egg yolks" not "egg yolks, separated".
 *
 * `prep_note`    — what the cook must do to produce this from the source ingredient.
 *                  Shown in the UI as a small annotation next to the "matched via"
 *                  label. Omit when the prep is trivial (e.g. grating cheese).
 *                  CLAUDE.md rule: never use "simply" or "just". Be specific.
 *
 * `quality`      — honest assessment of the match. See block comment above.
 */
export interface DerivationEntry {
  derived: string;
  prep_note?: string;
  quality: 'perfect' | 'good' | 'compromise';
}

/**
 * The full derivations map.
 * Key = source ingredient (clean canonical name, what the user might call it
 * in their pantry). Value = list of recipe ingredients this source can produce.
 */
export type IngredientDerivations = Record<string, DerivationEntry[]>;

// ---------------------------------------------------------------------------
// INGREDIENT_DERIVATIONS — the authoritative culinary map
// ---------------------------------------------------------------------------

export const INGREDIENT_DERIVATIONS: IngredientDerivations = {

  // ── EGGS ──────────────────────────────────────────────────────────────────
  // Highest-impact gap in the current matcher. Carbonara (egg yolks + whole
  // egg), Pavlova (egg whites), and Beef Wellington (egg yolk wash) all fail
  // without this.

  'eggs': [
    {
      derived: 'egg yolks',
      prep_note: 'Crack the egg over a bowl, pass the yolk between the two shell halves while the white drains away.',
      quality: 'perfect',
    },
    {
      derived: 'egg yolk',
      prep_note: 'Crack the egg over a bowl, pass the yolk between the two shell halves while the white drains away.',
      quality: 'perfect',
    },
    {
      derived: 'egg whites',
      prep_note: 'Separate over a clean, grease-free bowl — a single drop of yolk will prevent the whites from whipping.',
      quality: 'perfect',
    },
    {
      derived: 'egg white',
      prep_note: 'Separate over a clean, grease-free bowl — a single drop of yolk will prevent the whites from whipping.',
      quality: 'perfect',
    },
    {
      derived: 'beaten egg',
      // prep is trivial — whisk until yolk and white are combined
      quality: 'perfect',
    },
    {
      derived: 'egg wash',
      prep_note: 'Whisk one egg with a splash of water or milk until smooth.',
      quality: 'perfect',
    },
  ],

  // ── DAIRY ─────────────────────────────────────────────────────────────────

  /**
   * Parmesan / Parmigiano — the single most confusing naming gap in the seed
   * library. The Bolognese recipe uses "Parmigiano, grated" (the Italian name).
   * normalizeForMatch yields "parmigiano" which shares no substring or token
   * with "parmesan". These are the same cheese; the difference is label origin.
   *
   * Grana Padano is a near-identical cheese — same production method, same
   * texture, slightly milder. A cook with Grana Padano can use it anywhere
   * Parmigiano is called for.
   */
  'parmesan': [
    {
      derived: 'parmigiano',
      prep_note: 'Grate finely on a microplane — avoid pre-grated which clumps in sauces.',
      quality: 'perfect',
    },
    {
      derived: 'parmigiano reggiano',
      prep_note: 'Grate finely on a microplane.',
      quality: 'perfect',
    },
    {
      derived: 'grana padano',
      // no meaningful prep difference — just grate it
      quality: 'good',
    },
  ],

  'parmigiano': [
    {
      derived: 'parmesan',
      prep_note: 'Grate finely on a microplane.',
      quality: 'perfect',
    },
    {
      derived: 'grana padano',
      quality: 'good',
    },
  ],

  'parmigiano reggiano': [
    {
      derived: 'parmesan',
      quality: 'perfect',
    },
    {
      derived: 'parmigiano',
      quality: 'perfect',
    },
  ],

  /**
   * Pecorino — "pecorino" vs "pecorino romano" is partially covered by substring
   * (pecorino romano".includes("pecorino") = true), but an explicit entry is
   * useful for the UI annotation. Kept here for completeness.
   */
  'pecorino': [
    {
      derived: 'pecorino romano',
      prep_note: 'Grate finely on a microplane — pecorino romano is firmer than parmesan and saltier.',
      quality: 'perfect',
    },
  ],

  /**
   * Unsalted butter → ghee.
   * Ghee is clarified butter with the milk solids removed. The process takes
   * ~20 minutes and is a genuine transformation, not a simple prep step.
   * "ghee".includes("butter") = false — this is a real gap.
   */
  'unsalted butter': [
    {
      derived: 'ghee',
      prep_note: 'Melt butter over low heat until the foam rises and the milk solids settle. Skim the foam, then strain through a fine cloth into a clean jar — the clear golden liquid is ghee. Takes 15–20 minutes.',
      quality: 'good',
    },
  ],

  'butter': [
    {
      derived: 'ghee',
      prep_note: 'Melt butter over low heat until the foam rises and the milk solids settle. Skim the foam, then strain through a fine cloth — the clear golden liquid is ghee. Takes 15–20 minutes.',
      quality: 'good',
    },
  ],

  /**
   * Cream → crème fraîche is a stretch and takes days to culture properly;
   * not included. But double cream and pure cream are synonymous in Australia.
   */
  'pure cream': [
    {
      derived: 'double cream',
      quality: 'perfect',
    },
    {
      derived: 'thickened cream',
      // thickened cream has a stabiliser — whips more reliably, slightly less
      // rich flavour in sauces, but functionally equivalent for most uses
      quality: 'good',
    },
  ],

  'double cream': [
    {
      derived: 'pure cream',
      quality: 'perfect',
    },
    {
      derived: 'thickened cream',
      quality: 'good',
    },
  ],

  // ── WHOLE PROTEINS → STOCK ────────────────────────────────────────────────
  // Making stock from whole proteins is the other major class of gap.
  // The user has "Whole chicken" in their pantry. Several recipes call for
  // "Chicken stock". The substring check on "chicken" alone isn't reliable here
  // because it would false-positive on "chicken thighs" recipes too.
  // An explicit derivation is cleaner and allows the "requires prep" icon.

  'whole chicken': [
    {
      derived: 'chicken stock',
      prep_note: 'Simmer the carcass or a jointed chicken with onion, celery, carrot, bay leaf, and peppercorns in cold water for 2–3 hours. Strain and cool — skim the fat once cold.',
      quality: 'good',
    },
    {
      derived: 'chicken breast',
      quality: 'perfect',
    },
    {
      derived: 'chicken breast fillets',
      quality: 'perfect',
    },
    {
      derived: 'chicken thighs',
      quality: 'perfect',
    },
    {
      derived: 'chicken thigh',
      quality: 'perfect',
    },
    {
      derived: 'chicken drumsticks',
      quality: 'perfect',
    },
    {
      derived: 'chicken wings',
      quality: 'perfect',
    },
    {
      derived: 'chicken pieces',
      quality: 'perfect',
    },
    {
      derived: 'chicken bones',
      quality: 'perfect',
    },
    {
      derived: 'chicken carcass',
      quality: 'perfect',
    },
  ],

  /**
   * Beef bones → beef stock.
   * Less common as a pantry item but users who roast a joint often have bones.
   */
  'beef bones': [
    {
      derived: 'beef stock',
      prep_note: 'Roast bones at 220 °C for 30 min until browned, then simmer with onion, carrot, celery, and tomato paste for 4–6 hours. Strain and reduce by half for depth.',
      quality: 'good',
    },
  ],

  /**
   * Beef chuck / brisket are not commonly made into stock, but if a user has
   * them they can make a rough stock. Listed as compromise.
   */
  'beef chuck': [
    {
      derived: 'beef stock',
      prep_note: 'Simmer the beef in water with aromatics for 2–3 hours. The stock will be lighter than bone stock but usable.',
      quality: 'compromise',
    },
  ],

  /**
   * Prawn shells → prawn stock.
   * The Laksa recipe specifies "reserve shells for stock". A user who has
   * prawns in their pantry can produce this — the stock builds the base of
   * the soup.
   */
  'prawns': [
    {
      derived: 'prawn stock',
      prep_note: 'Reserve the shells when peeling. Fry shells in oil until pink and fragrant, add water and a splash of fish sauce, simmer 20 minutes, strain.',
      quality: 'good',
    },
  ],

  'raw prawns': [
    {
      derived: 'prawn stock',
      prep_note: 'Reserve the shells when peeling. Fry in oil until pink and fragrant, add water and a splash of fish sauce, simmer 20 minutes, strain.',
      quality: 'good',
    },
  ],

  // ── FRESH HERBS → DRIED ───────────────────────────────────────────────────
  // Note: the reverse (dried → fresh) is a compromise in the other direction.
  // These entries handle the case where a user has fresh herbs and a recipe
  // calls for dried. The general rule: 1 tsp dried ≈ 1 tbsp fresh.

  'fresh thyme': [
    {
      derived: 'dried thyme',
      prep_note: 'Use one-third the volume of fresh — dried herbs are more concentrated. Strip leaves from woody stems.',
      quality: 'good',
    },
    {
      derived: 'thyme',
      quality: 'perfect',
    },
    {
      derived: 'thyme sprigs',
      quality: 'perfect',
    },
  ],

  'thyme': [
    {
      derived: 'thyme sprigs',
      quality: 'perfect',
    },
    {
      derived: 'fresh thyme',
      quality: 'perfect',
    },
  ],

  'fresh rosemary': [
    {
      derived: 'rosemary sprigs',
      quality: 'perfect',
    },
    {
      derived: 'dried rosemary',
      prep_note: 'Use one-third the volume of fresh. Crumble between fingers to release oils.',
      quality: 'good',
    },
  ],

  'rosemary': [
    {
      derived: 'rosemary sprigs',
      quality: 'perfect',
    },
    {
      derived: 'fresh rosemary',
      quality: 'perfect',
    },
  ],

  'fresh mint': [
    {
      derived: 'mint leaves',
      quality: 'perfect',
    },
    {
      derived: 'dried mint',
      prep_note: 'Use one-third the volume. Dried mint loses the bright freshness but adds earthiness — common in Levantine cooking.',
      quality: 'compromise',
    },
  ],

  'mint': [
    {
      derived: 'fresh mint leaves',
      quality: 'perfect',
    },
    {
      derived: 'mint leaves',
      quality: 'perfect',
    },
  ],

  /**
   * Coriander (the fresh herb) → coriander leaves, seeds.
   * Note: in Australia "coriander" means the fresh herb; the seeds are
   * "coriander seeds". Both derive from the same plant but are very different
   * ingredients — only the leaf derivation is included here.
   */
  'coriander': [
    {
      derived: 'fresh coriander',
      quality: 'perfect',
    },
    {
      derived: 'coriander leaves',
      quality: 'perfect',
    },
    {
      derived: 'fresh coriander leaves',
      quality: 'perfect',
    },
    {
      derived: 'chopped coriander',
      quality: 'perfect',
    },
  ],

  'fresh coriander': [
    {
      derived: 'coriander leaves',
      quality: 'perfect',
    },
    {
      derived: 'chopped coriander',
      quality: 'perfect',
    },
  ],

  /**
   * Parsley — flat-leaf and curly are different but interchangeable in most
   * cooked applications. Only flat-leaf is used in this recipe library.
   */
  'parsley': [
    {
      derived: 'flat-leaf parsley',
      quality: 'perfect',
    },
    {
      derived: 'fresh parsley',
      quality: 'perfect',
    },
    {
      derived: 'chopped parsley',
      quality: 'perfect',
    },
  ],

  'flat-leaf parsley': [
    {
      derived: 'parsley',
      quality: 'perfect',
    },
    {
      derived: 'chopped parsley',
      quality: 'perfect',
    },
  ],

  // ── SPICES — WHOLE TO GROUND ──────────────────────────────────────────────
  // normalizeForMatch() already strips "ground" so "ground cumin" normalises to
  // "cumin", and "cumin seeds".includes("cumin") = true. These entries are kept
  // for UI annotation purposes (the "requires prep" icon) even though the
  // substring matcher technically catches them.

  'cumin seeds': [
    {
      derived: 'ground cumin',
      prep_note: 'Toast seeds in a dry pan over medium heat until fragrant (about 90 seconds), then grind in a spice grinder or mortar. Fresh-ground cumin is significantly more aromatic than pre-ground.',
      quality: 'perfect',
    },
    {
      derived: 'cumin',
      quality: 'perfect',
    },
  ],

  'coriander seeds': [
    {
      derived: 'ground coriander',
      prep_note: 'Toast seeds in a dry pan until fragrant, then grind in a spice grinder or mortar.',
      quality: 'perfect',
    },
  ],

  'black peppercorns': [
    {
      derived: 'ground black pepper',
      prep_note: 'Grind in a pepper mill or mortar just before use — pre-ground pepper loses its volatile aromatics quickly.',
      quality: 'perfect',
    },
    {
      derived: 'black pepper',
      quality: 'perfect',
    },
    {
      derived: 'cracked black pepper',
      prep_note: 'Crack coarsely with the flat of a knife or in a mortar — do not grind fine.',
      quality: 'perfect',
    },
    {
      derived: 'freshly cracked black pepper',
      prep_note: 'Crack coarsely with the flat of a knife or in a mortar.',
      quality: 'perfect',
    },
    {
      derived: 'freshly ground black pepper',
      quality: 'perfect',
    },
  ],

  'whole peppercorns': [
    {
      derived: 'ground black pepper',
      quality: 'perfect',
    },
    {
      derived: 'black pepper',
      quality: 'perfect',
    },
    {
      derived: 'cracked black pepper',
      quality: 'perfect',
    },
  ],

  'allspice berries': [
    {
      derived: 'ground allspice',
      prep_note: 'Grind in a spice grinder or mortar. Allspice berries look like large peppercorns — don\'t confuse them with a spice blend.',
      quality: 'perfect',
    },
  ],

  'cardamom pods': [
    {
      derived: 'ground cardamom',
      prep_note: 'Split pods, discard husks, grind the seeds inside. The husks add a slightly woody flavour if left in — remove them.',
      quality: 'perfect',
    },
  ],

  'cinnamon stick': [
    {
      derived: 'ground cinnamon',
      prep_note: 'Break stick into pieces and grind in a spice grinder. Fresh-ground cinnamon is more fragrant — reduce the quantity by 20% vs what the recipe specifies for pre-ground.',
      quality: 'good',
    },
  ],

  'whole cloves': [
    {
      derived: 'ground cloves',
      prep_note: 'Grind in a spice grinder or mortar. Cloves are intensely aromatic — use sparingly.',
      quality: 'perfect',
    },
  ],

  'cloves': [
    {
      derived: 'ground cloves',
      prep_note: 'Grind in a spice grinder or mortar. A tiny amount — cloves dominate quickly.',
      quality: 'perfect',
    },
  ],

  'nutmeg': [
    {
      derived: 'ground nutmeg',
      prep_note: 'Grate directly on a microplane or fine grater. Freshly grated nutmeg is far more fragrant than pre-ground.',
      quality: 'perfect',
    },
  ],

  'mustard seeds': [
    {
      derived: 'ground mustard',
      prep_note: 'Toast seeds briefly in a dry pan, then grind in a mortar. Yellow mustard seeds are mild; black are sharper.',
      quality: 'good',
    },
    {
      derived: 'mustard powder',
      prep_note: 'Grind seeds in a spice grinder to a fine powder.',
      quality: 'perfect',
    },
  ],

  // ── LEMON & LIME — explicit entries for UI annotation ─────────────────────
  // The substring matcher handles these ("lemon juice".includes("lemon") = true)
  // but these entries allow the Engineer to show "from your lemon →" annotations
  // and the prep icon.

  'lemon': [
    {
      derived: 'lemon juice',
      prep_note: 'Roll the lemon on the bench to loosen the juice, then cut and squeeze.',
      quality: 'perfect',
    },
    {
      derived: 'lemon juice, freshly squeezed',
      prep_note: 'Roll the lemon on the bench to loosen the juice, then cut and squeeze.',
      quality: 'perfect',
    },
    {
      derived: 'lemon zest',
      prep_note: 'Use a microplane or fine grater — take only the yellow layer, the white pith underneath is bitter.',
      quality: 'perfect',
    },
    {
      derived: 'lemon zest and juice',
      prep_note: 'Zest before juicing — it\'s impossible the other way around.',
      quality: 'perfect',
    },
  ],

  'lime': [
    {
      derived: 'lime juice',
      prep_note: 'Roll the lime on the bench before cutting — releases more juice.',
      quality: 'perfect',
    },
    {
      derived: 'lime juice, freshly squeezed',
      prep_note: 'Roll the lime on the bench before cutting.',
      quality: 'perfect',
    },
    {
      derived: 'lime zest',
      prep_note: 'Zest before juicing on a microplane — avoid the white pith.',
      quality: 'perfect',
    },
  ],

  // ── TOMATOES ──────────────────────────────────────────────────────────────
  // Substring handles these but annotations are valuable. Fresh tomatoes as a
  // stand-in for tinned is a compromise — see prep_note.

  'tomatoes': [
    {
      derived: 'tinned whole tomatoes',
      prep_note: 'Fresh tomatoes work but the dish will be less intense. Roast fresh tomatoes at 180 °C for 30 min to concentrate flavour before using. The quality of tinned Italian tomatoes (San Marzano) in a slow-cooked sauce will likely exceed fresh out-of-season tomatoes.',
      quality: 'compromise',
    },
    {
      derived: 'canned crushed tomatoes',
      prep_note: 'Peel fresh tomatoes by scoring an X on the base, blanching 30 seconds in boiling water, then slipping the skins off. Crush by hand.',
      quality: 'compromise',
    },
    {
      derived: 'tinned tomatoes',
      prep_note: 'Roast fresh tomatoes first to concentrate them, or simmer an extra 10–15 minutes to compensate for the extra water content.',
      quality: 'compromise',
    },
    {
      derived: 'tomato paste',
      prep_note: 'This is a significant transformation, not a quick swap. Blitz fresh tomatoes and cook down stirring frequently for 45–90 min until deep red and paste-like. This is a worthwhile technique but the dish will taste fresher and less caramelised.',
      quality: 'compromise',
    },
    {
      derived: 'diced tomatoes',
      quality: 'perfect',
    },
    {
      derived: 'chopped tomatoes',
      quality: 'perfect',
    },
    {
      derived: 'ripe tomatoes',
      quality: 'perfect',
    },
  ],

  'cherry tomatoes': [
    {
      derived: 'tomatoes',
      quality: 'good',
    },
    {
      derived: 'diced tomatoes',
      quality: 'good',
    },
  ],

  // ── CHICKPEAS ─────────────────────────────────────────────────────────────
  // The substring matcher handles "tinned chickpeas".includes("chickpeas") = true
  // but the prep note is important — dried chickpeas need overnight soaking.
  // The reverse (tinned → dried) is explicitly NOT a match because you cannot
  // un-cook chickpeas.

  'dried chickpeas': [
    {
      derived: 'tinned chickpeas',
      prep_note: 'Soak overnight in plenty of cold water (they triple in size). Drain, cover with fresh water, bring to a boil, then simmer 45–90 min until tender. Do NOT salt the water until the last 10 min — early salt toughens the skin.',
      quality: 'good',
    },
    {
      derived: 'cooked chickpeas',
      prep_note: 'Soak overnight then simmer until just tender — they should hold their shape, not be mushy.',
      quality: 'perfect',
    },
  ],

  // ── COCONUT ───────────────────────────────────────────────────────────────

  /**
   * Desiccated coconut → kerisik.
   * Kerisik is toasted desiccated coconut, pounded until the oils release and
   * it forms a rough paste. Used in Rendang and Nasi Lemak. "kerisik" is
   * opaque to Western cooks and has no substring relationship to "coconut".
   * This is a genuine gap.
   */
  'desiccated coconut': [
    {
      derived: 'kerisik',
      prep_note: 'Toast desiccated coconut in a dry pan over medium heat, stirring constantly, until deep golden brown (8–10 min). Pound in a mortar or process briefly until the oils release and it forms a rough, oily paste. It should smell nutty, not burnt.',
      quality: 'perfect',
    },
    {
      derived: 'toasted coconut',
      prep_note: 'Toast in a dry pan until golden, stirring constantly.',
      quality: 'perfect',
    },
  ],

  'coconut': [
    {
      derived: 'coconut milk',
      prep_note: 'For fresh coconut: grate the flesh, add warm water, and squeeze hard through a cloth. First pressing = thick coconut milk; second = thin. For desiccated coconut: blend 100g with 250ml hot water for 3 min, then strain through a fine cloth.',
      quality: 'good',
    },
    {
      derived: 'desiccated coconut',
      prep_note: 'Grate the fresh coconut flesh finely, spread on a tray, and dry at 60 °C for 2–3 hours, or leave uncovered in a warm oven with the door ajar.',
      quality: 'good',
    },
    {
      derived: 'kerisik',
      prep_note: 'Grate and toast the coconut flesh until deep golden, then pound until the oils release.',
      quality: 'good',
    },
  ],

  // ── GARLIC — explicit for UI annotations ──────────────────────────────────
  // Substring already handles these. Included for "from your garlic →" display.

  'garlic': [
    {
      derived: 'garlic cloves',
      quality: 'perfect',
    },
    {
      derived: 'crushed garlic',
      prep_note: 'Place the flat of a knife on the clove and press firmly with the heel of your hand.',
      quality: 'perfect',
    },
    {
      derived: 'minced garlic',
      prep_note: 'Crush first, then rock the knife across it repeatedly.',
      quality: 'perfect',
    },
    {
      derived: 'garlic paste',
      prep_note: 'Pound cloves with a pinch of salt in a mortar, or process in a small blender with a splash of oil.',
      quality: 'perfect',
    },
    {
      derived: 'sliced garlic',
      quality: 'perfect',
    },
  ],

  // ── GINGER — explicit for UI annotations ──────────────────────────────────

  'ginger': [
    {
      derived: 'fresh ginger',
      quality: 'perfect',
    },
    {
      derived: 'grated ginger',
      prep_note: 'Freeze the ginger first — frozen ginger grates more finely and the flavour is more intense.',
      quality: 'perfect',
    },
    {
      derived: 'ginger paste',
      prep_note: 'Blitz peeled ginger with a splash of water until smooth, or pound in a mortar.',
      quality: 'perfect',
    },
    {
      derived: 'ground ginger',
      prep_note: 'A compromise — ground ginger is sharper and more medicinal-tasting than fresh. Use half the volume. It will not give the same bright heat.',
      quality: 'compromise',
    },
  ],

  // ── BREAD ─────────────────────────────────────────────────────────────────

  'bread': [
    {
      derived: 'breadcrumbs',
      prep_note: 'Tear stale bread into chunks and pulse in a food processor. Fresh bread makes soggy crumbs — leave the bread uncovered overnight first.',
      quality: 'perfect',
    },
    {
      derived: 'panko breadcrumbs',
      prep_note: 'Tear bread into rough pieces and grate on a box grater (large holes) or pulse very briefly in a food processor — you want coarse, flaky crumbs, not fine powder. Dry on a tray in a 100 °C oven for 10 min. The texture will be slightly denser than commercial panko but works for schnitzel.',
      quality: 'good',
    },
    {
      derived: 'stale bread',
      prep_note: 'Leave uncovered on the bench overnight.',
      quality: 'perfect',
    },
  ],

  'pitta bread': [
    {
      derived: 'stale pitta bread',
      prep_note: 'Leave out uncovered overnight or dry briefly in a warm oven.',
      quality: 'perfect',
    },
    {
      derived: 'flatbread',
      quality: 'perfect',
    },
  ],

  'flatbread': [
    {
      derived: 'pitta bread',
      quality: 'good',
    },
    {
      derived: 'flat pitta',
      quality: 'good',
    },
  ],

  // ── LEMONGRASS ────────────────────────────────────────────────────────────

  'lemongrass': [
    {
      derived: 'lemongrass paste',
      prep_note: 'Use only the lower 10cm of the stalk (the pale, tender section). Slice thinly, then pound in a mortar with a pinch of salt until a fibrous paste forms. Blending works but the texture stays coarser.',
      quality: 'good',
    },
    {
      derived: 'lemongrass stalks',
      quality: 'perfect',
    },
  ],

};

// ---------------------------------------------------------------------------
// DERIVATION_LOOKUP — pre-built for fast runtime access
// ---------------------------------------------------------------------------

/**
 * Flattened lookup: normalised pantry ingredient name → array of DerivationEntry.
 *
 * Keyed by the result of normalizeForMatch() applied to the source ingredient name
 * so the Engineer can do a single normalised lookup without needing to iterate
 * INGREDIENT_DERIVATIONS directly.
 *
 * This map is built once at module load and is read-only at runtime.
 *
 * Usage (in pantry-helpers.ts, Phase 2):
 *
 *   import { DERIVATION_LOOKUP } from './ingredient-derivations';
 *   import { normalizeForMatch } from './pantry-helpers';
 *
 *   const normPantryName = normalizeForMatch(pantryItem.name);
 *   const derivations = DERIVATION_LOOKUP.get(normPantryName) ?? [];
 *
 *   // The derived names can then be normalised and compared against recipe
 *   // ingredient names using the existing isMatch() function.
 *
 * NOTE: DERIVATION_LOOKUP is intentionally a Map<string, DerivationEntry[]>,
 * not a plain object. Map lookup is O(1) and avoids prototype chain issues with
 * ingredient names that happen to shadow Object.prototype properties.
 */
function buildLookup(): Map<string, DerivationEntry[]> {
  // Minimal inline normalizer to avoid a circular import with pantry-helpers.ts.
  // Must stay in sync with normalizeForMatch() in pantry-helpers.ts.
  // If that function changes its strip list, update this too.
  const normalize = (s: string): string =>
    s
      .replace(/\(.*?\)/g, '')
      .replace(/,\s*.*/g, '')
      .replace(
        /\b(finely|roughly|thinly|coarsely|freshly|lightly|very|extra|large|medium|small|heaped|level)\b/gi,
        '',
      )
      .toLowerCase()
      .replace(/\b(fresh|dried|ground|crushed|whole|extra|raw|cooked|ripe|young|old)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const lookup = new Map<string, DerivationEntry[]>();

  for (const [source, entries] of Object.entries(INGREDIENT_DERIVATIONS)) {
    const normKey = normalize(source);
    const existing = lookup.get(normKey) ?? [];
    // Merge entries (multiple raw source names can normalise to the same key,
    // e.g. "parmesan" and "parmigiano" both normalise to themselves but
    // "fresh thyme" and "thyme" both normalise to "thyme")
    const merged = [...existing];
    for (const entry of entries) {
      if (!merged.some((e) => e.derived === entry.derived)) {
        merged.push(entry);
      }
    }
    lookup.set(normKey, merged);
  }

  return lookup;
}

/**
 * Pre-built lookup map. Import this in pantry-helpers.ts for Phase 2.
 * Keys are normalised source ingredient names.
 * Values are DerivationEntry arrays.
 */
export const DERIVATION_LOOKUP: Map<string, DerivationEntry[]> = buildLookup();

// ---------------------------------------------------------------------------
// Helper: given a normalised pantry ingredient, get all derived name strings
// ---------------------------------------------------------------------------

/**
 * Returns just the derived ingredient name strings for a given pantry item.
 * Useful when you need the derived names for isMatch() comparison only,
 * without caring about quality or prep_note.
 *
 * @param normalisedPantryName - the result of normalizeForMatch(pantryItem.name)
 * @returns array of derived ingredient name strings (empty array if none)
 */
export function getDerivedNames(normalisedPantryName: string): string[] {
  return (DERIVATION_LOOKUP.get(normalisedPantryName) ?? []).map((e) => e.derived);
}

/**
 * Returns the full DerivationEntry for a specific match pair, if one exists.
 * Used by the UI to get the prep_note and quality for a matched derivation.
 *
 * @param normalisedPantryName  - normalizeForMatch(pantryItem.name)
 * @param normalisedRecipeName  - normalizeForMatch(recipeIngredient.name)
 * @returns DerivationEntry if this pair is a known derivation, otherwise undefined
 */
export function getDerivationEntry(
  normalisedPantryName: string,
  normalisedRecipeName: string,
): DerivationEntry | undefined {
  const entries = DERIVATION_LOOKUP.get(normalisedPantryName) ?? [];
  // Inline normalizer (same as buildLookup above)
  const normalize = (s: string): string =>
    s
      .replace(/\(.*?\)/g, '')
      .replace(/,\s*.*/g, '')
      .replace(
        /\b(finely|roughly|thinly|coarsely|freshly|lightly|very|extra|large|medium|small|heaped|level)\b/gi,
        '',
      )
      .toLowerCase()
      .replace(/\b(fresh|dried|ground|crushed|whole|extra|raw|cooked|ripe|young|old)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  return entries.find((e) => normalize(e.derived) === normalisedRecipeName);
}

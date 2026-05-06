/**
 * Seed recipes for v0.1 — ported from the hone.html prototype source of truth
 * (22 chef-inspired recipes) plus 5 originals authored in-house and the existing
 * weekday-bolognese from the v0 seed.
 *
 * Conversion rules applied, verbatim from the handoff:
 *   difficulty    normalised to 'beginner' | 'intermediate' | 'advanced' (DECISION-009)
 *   time          → time_min
 *   baseServings  → base_servings
 *   inspiration + sourceUrl → source: { chef, video_url }
 *   heroImg       → hero_url
 *   heroEmoji     → emoji
 *   heroColor     → hero_fallback: [heroColor, warm mid-tone, parchment]
 *   step.why      → step.why_note
 *   step.timer    → step.timer_seconds        (nulls dropped)
 *   ingredient.notes → ingredient.prep
 *   category      → included in tags[]
 *
 * HTML "custom" scaling (water/stock via factor^0.85) is converted to the
 * schema's `curve` form with concrete servings-indexed values. See risotto
 * and sourdough-loaf below.
 *
 * Attribution (Golden Rule #2) is preserved on every chef-inspired recipe.
 * Originals use `chef: 'Hone Kitchen'` as source so the schema's refine
 * check passes without pretending to a chef who didn't author them.
 */

import type { Recipe } from './types';

// ── Fallback palette helper ─────────────────────────────────────────────────
// hero_fallback is used when the hero image URL fails to load. A 3-color
// gradient from the dish's dominant hue through a warm mid-tone to parchment
// keeps the offline card visually on-brand.
const MID = '#E8C9A0'; // warm cream mid-tone
const PARCHMENT = '#F7F2EA';
const fallback = (hero: string): [string, string, string] => [hero, MID, PARCHMENT];

// ────────────────────────────────────────────────────────────────────────────
//  22 ported recipes from hone.html
// ────────────────────────────────────────────────────────────────────────────

const SMASH_BURGER: Recipe = {
  id: 'smash-burger',
  title: 'Smash Burger',
  tagline: 'The crispy-edged diner classic',
  base_servings: 2,
  time_min: 20,
  difficulty: 'beginner',
  tags: ['beef', 'quick', 'crowd-pleaser'],
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Andy Cooks',
    video_url: 'https://www.youtube.com/watch?v=oa2g6gB_1BU',
  },
  emoji: '🍔',
  hero_fallback: fallback('#8B4513'),
  hero_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
  total_time_minutes: 20,
  active_time_minutes: 20,
  equipment: [
    "Cast iron skillet or heavy carbon steel pan (minimum 26cm)",
    "Flat, rigid spatula — fish slice or burger spatula, not slotted",
    "Baking paper cut into small squares — one per patty",
    "Burger press or flat-bottomed heavy pan (alternative to spatula for the smash)",
  ],
  before_you_start: [
    "Cast iron or heavy steel is not optional. Non-stick pans can't reach the temperature this needs and will warp. Stainless steel works if you don't own cast iron — preheat it longer.",
    "80/20 beef only. The fat is not background flavour — it's the crust. Lean mince has no fat to render into crispy lace. If your mince says extra lean, use it for something else.",
    "Season outside only, right before cooking. Salt on the ball draws moisture to the surface and kills the crust. Season the outside of the ball immediately before smashing — not in advance.",
  ],
  mise_en_place: [
    "Weigh and roll the beef into 100g balls — don't overwork, just enough to form a rough sphere. Place on a plate. Do not pack tightly.",
    "Mix burger sauce (mayo, ketchup, mustard — adjust ratios to taste).",
    "Slice pickles; dice onion as finely as you can.",
    "Cut baking paper squares — one per patty.",
    "Slice the buns. Don't pre-toast — that happens in the pan.",
    "Cast iron on maximum heat now — it needs 3 full minutes to reach the right temperature.",
  ],
  finishing_note: "There is no finishing. Stack it, eat it. The crust softens with every minute that passes and cannot be recovered. Cook them in sequence and eat as they come — don't hold them warm in an oven. The whole point of a smash burger is that 30-second window when the crust is still shatteringly crisp.",
  leftovers_note: "No. A smash burger is not a leftover. The crust becomes chewy within 10 minutes and cannot be revived. Make only what you'll eat.",
  whole_food_verified: true,

  ingredients: [
    {
      id: 'i1', name: 'Beef mince (80/20 fat)', amount: 200, unit: 'g', scales: 'linear',
      prep: 'Fat ratio is non-negotiable — leaner beef steams instead of crisping',
      substitutions: [
        {
          ingredient: 'Lean beef mince (92/8 fat)',
          changes: 'Significantly less crust. The fat is what creates the crispy lacey edges — lean beef steams from its own moisture instead of browning. Burger becomes drier throughout.',
          quality: 'compromise',
        },
        {
          ingredient: 'Wagyu beef mince',
          changes: 'More marbling gives a richer, beefier result. Cook 10–15 seconds shorter per side — the extra fat means faster browning. Excellent upgrade if budget allows.',
          quality: 'good',
          hard_to_find: false,
          local_alternative: 'Coles and Woolworths both stock wagyu beef mince in the premium section.',
        },
        {
          ingredient: 'Lamb mince (20% fat)',
          changes: 'Completely different flavour profile — gamey and richer. Works very well with yoghurt sauce and mint instead of burger sauce. Not a substitute, more of a different dish.',
          quality: 'compromise',
        },
      ],
    },
    // Buns: HTML prototype had amount:1 for a 2-serving recipe, which scales oddly
    // (2 people → 1 bun). Corrected to 2 so scaling is intuitive. Each burger uses
    // one whole bun (split top/bottom).
    {
      id: 'i2', name: 'Burger buns (brioche)', amount: 2, unit: '', scales: 'linear',
      substitutions: [
        {
          ingredient: 'Potato bun',
          changes: 'Slightly denser, less sweet, holds up equally well to sauce and steam. Common in American diners — a legitimate choice.',
          quality: 'good',
        },
        {
          ingredient: 'Regular sesame-seed burger bun',
          changes: 'Less richness without the egg and butter content of brioche. Toasting is even more critical to prevent sogginess. Budget option that works fine.',
          quality: 'compromise',
        },
      ],
    },
    {
      id: 'i3', name: 'American cheese slices', amount: 2, unit: '', scales: 'linear',
      substitutions: [
        {
          ingredient: 'Mild cheddar, thinly sliced',
          changes: 'Better flavour but inferior melt. American cheese is engineered for even, glossy melt — cheddar can turn oily or uneven. Place it on the patty earlier and cover the pan with a lid to steam-melt it.',
          quality: 'compromise',
        },
        {
          ingredient: 'Provolone',
          changes: 'Melts cleanly and has a mild, slightly nutty flavour. Italian-American diner standard — a genuine upgrade in flavour with no compromise on melt.',
          quality: 'good',
        },
        {
          ingredient: 'Gruyère',
          changes: 'Rich, nutty, excellent melt. Changes the character toward a more bistro-style burger. Pairs exceptionally with caramelised onion.',
          quality: 'good',
        },
      ],
    },
    {
      id: 'i4', name: 'White onion, finely diced', amount: 30, unit: 'g', scales: 'linear',
      substitutions: [
        {
          ingredient: 'Brown onion',
          changes: 'Slightly more pungent raw. Dice as fine as possible — it sits on the burger uncooked.',
          quality: 'good',
        },
        {
          ingredient: 'Shallots, finely minced',
          changes: 'Milder and slightly sweeter than white onion. A genuine improvement in most cases.',
          quality: 'good',
        },
      ],
    },
    {
      id: 'i5', name: 'Dill pickles', amount: 4, unit: 'slices', scales: 'linear',
      substitutions: [
        {
          ingredient: 'Bread and butter pickles',
          changes: 'Sweeter, less sharp. The balance with the sauce shifts — reduce the ketchup in the sauce slightly to compensate.',
          quality: 'compromise',
        },
        {
          ingredient: 'Cornichons, sliced',
          changes: 'More acidic and vinegary than dill pickles. Slice lengthways — they are smaller. Arguably the better choice for acidity balance.',
          quality: 'good',
        },
      ],
    },
    // Sauce and salt — HTML marked these 'fixed' but that makes 2 tbsp sauce for
    // 8 people, which is absurd. They're per-patty condiments, so linear is right.
    {
      id: 'i6', name: 'Burger sauce (mayo + ketchup + mustard)', amount: 2, unit: 'tbsp', scales: 'linear',
      substitutions: [
        {
          ingredient: 'Aioli + tomato relish',
          changes: 'More grown-up flavour, less sweetness. No mustard sharpness. Works very well with good cheese and fresh tomato.',
          quality: 'good',
        },
        {
          ingredient: 'Kewpie mayo alone',
          changes: 'Japanese mayo is richer and slightly more umami than standard mayo. Skip the ketchup and mustard — use pickles and the beef flavour to do the work.',
          quality: 'good',
        },
      ],
    },
    { id: 'i7', name: 'Salt', amount: 0.5, unit: 'tsp', scales: 'linear' },
  ],
  steps: [
    { id: 's1', title: 'Ball and season', content: "Divide the beef into 100g balls per patty — don't pack them tightly. Season only the outside with salt right before cooking. Salting early draws moisture and stops the crust forming.", why_note: 'Pre-salting denatures proteins and pulls water to the surface, which steams instead of browning. You want a dry surface hitting that hot iron.' },
    { id: 's2', title: 'Get the pan screaming', content: 'Cast iron or heavy steel pan on highest heat for at least 3 minutes. No oil — the beef fat does the work. It should be starting to smoke.', timer_seconds: 180, why_note: 'Maillard browning needs metal above 180°C. A warm pan just steams the meat. Three minutes on max heat gets cast iron where it needs to be.' },
    { id: 's3', title: 'Smash hard and hold', content: 'Place a ball on the pan, put a piece of baking paper on top, and press down with a flat spatula as hard as you can. Hold for 10 full seconds. The patty should be 1cm thin.', timer_seconds: 10, why_note: 'The smash maximises surface contact with hot metal. More contact = more Maillard = more crust. The paper stops the spatula sticking.' },
    { id: 's4', title: 'Cook and cheese', content: 'Cook 90 seconds without touching — you want a deep brown crust forming. Flip once, immediately add the cheese slice. Cook 45 more seconds. The cheese melts from the residual heat.', timer_seconds: 90, why_note: 'Single flip. Moving the patty cools the surface and breaks the crust formation. Cheese goes on right after the flip so it has the full second side cook time to melt properly.' },
    { id: 's5', title: 'Toast the bun', content: 'While the patty finishes, toast the bun cut-side down in the same pan. 30–45 seconds until golden. The beef fat left in the pan flavours it.', timer_seconds: 30, why_note: "A toasted bun won't go soggy when sauces and steam hit it. The fat residue adds flavour that plain toasting misses." },
    { id: 's6', title: 'Stack and serve', content: 'Sauce on the bottom bun, pickles, onion, patty (cheese-side up), top bun. Eat immediately — smash burgers do not improve with waiting.', why_note: 'Order matters: sauce on bottom bun protects it from moisture. Onion under the patty gets slightly warmed by the meat. Eat within 2 minutes before the crust softens.' },
  ],
  categories: { cuisines: ['american'], types: ['burgers', 'beef'] },
  whole_food_verified: false,
};

const PASTA_CARBONARA: Recipe = {
  id: 'pasta-carbonara',
  title: 'Pasta Carbonara',
  tagline: 'The Roman original — no cream, ever',
  base_servings: 2,
  time_min: 25,
  difficulty: 'intermediate',
  tags: ['pasta', 'italian', 'quick', 'eggs'],
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Gordon Ramsay',
    video_url: 'https://www.youtube.com/watch?v=5t7JLjr1FxQ',
  },
  emoji: '🍝',
  hero_fallback: fallback('#C8963C'),
  hero_url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80',
  total_time_minutes: 25,
  active_time_minutes: 25,
  equipment: [
    "Large pot for pasta",
    "Heavy-based frying pan or skillet — NOT non-stick (you need the fond from the guanciale)",
    "Whisk or fork",
    "Tongs or pasta fork",
    "A mug for pasta water reserve",
  ],
  before_you_start: [
    "Make the egg sauce before anything goes on the stove. Once the guanciale fat is in the pan and the pasta is draining, you have about 60 seconds to work. Mix the eggs and cheese now, while everything is cold and calm.",
    "Off heat means off heat. The pan comes fully off the burner before the egg mixture touches the pasta. The residual heat in the pan and pasta is exactly enough — the stove being on is not.",
    "The pasta water is your safety net. Keep a full mug next to the stove. If the sauce tightens or starts to look scrambled, a splash of water and fast tossing fixes it. Have it ready.",
  ],
  mise_en_place: [
    "Crack eggs into a bowl, separate the yolks.",
    "Grate pecorino finely — microplane if you have it, smallest grater holes if not.",
    "Whisk eggs, pecorino, and cracked pepper into a thick paste now, before anything goes on heat.",
    "Cut guanciale into 1cm cubes or lardons.",
    "Bring pasta water to the boil.",
    "Set a mug next to the stove ready to catch pasta water before you drain.",
  ],
  finishing_note: "Taste before plating. The sauce should be savoury, peppery, and rich without being heavy. If it tastes flat, it needs more Pecorino — the cheese is both seasoning and sauce. Plate into warm bowls, top with more grated Pecorino and a fresh crack of pepper.",
  leftovers_note: "Carbonara does not keep. The egg sauce continues to cook in the residual heat and reheating curdles it further. Make only what you'll eat. If you have leftover guanciale and egg mixture, refrigerate them separately (up to 2 days) and make a fresh batch.",

  ingredients: [
    {
      id: 'i1', name: 'Spaghetti', amount: 160, unit: 'g', scales: 'linear',
      substitutions: [
        {
          ingredient: 'Rigatoni (if using spaghetti)',
          changes: 'Rigatoni holds sauce inside the tube — many Romans prefer it. Identical technique. Pure preference.',
          quality: 'good',
        },
        {
          ingredient: 'Bucatini',
          changes: 'Hollow spaghetti-like strands that hold more sauce. Takes 1–2 minutes longer to cook. Excellent choice.',
          quality: 'good',
        },
      ],
    },
    {
      id: 'i2', name: 'Guanciale (or pancetta)', amount: 100, unit: 'g', scales: 'linear',
      substitutions: [
        {
          ingredient: 'Pancetta, diced',
          changes: 'Less fat than guanciale, slightly milder pork flavour. Widely accepted — many Roman trattorias use it. Minimal perceptible difference.',
          quality: 'good',
          hard_to_find: true,
          local_alternative: 'Guanciale is at Italian delis and Harris Farm Markets. Woolworths and Coles stock pancetta as a direct alternative.',
        },
        {
          ingredient: 'Smoked bacon (short-cut, rind off)',
          changes: 'Smokiness dominates and changes the character of the dish significantly. The result is delicious but is technically not carbonara — more of a bacon-and-egg pasta. Render it slowly the same way.',
          quality: 'compromise',
        },
      ],
    },
    {
      id: 'i3', name: 'Egg yolks', amount: 3, unit: '', scales: 'linear',
      substitutions: [
        {
          ingredient: 'Whole eggs (use 2 whole eggs instead of 3 yolks + 1 whole)',
          changes: 'More egg white protein makes the sauce set firmer and slightly rubbery if overworked. You lose the deep golden richness of a yolk-heavy sauce. Harder to keep in the emulsified window.',
          quality: 'compromise',
        },
      ],
    },
    { id: 'i4', name: 'Whole egg', amount: 1, unit: '', scales: 'linear' },
    {
      id: 'i5', name: 'Pecorino Romano, finely grated', amount: 60, unit: 'g', scales: 'linear',
      substitutions: [
        {
          ingredient: 'Parmigiano Reggiano',
          changes: 'Milder, nuttier, less sharp than Pecorino. A legitimate Roman variant — not a compromise, just a different style. Some prefer it.',
          quality: 'good',
        },
        {
          ingredient: 'Pecorino + Parmesan, 50/50',
          changes: 'The traditional Roman household approach. Sharper from the Pecorino, body and umami from the Parmesan. Arguably the best of both.',
          quality: 'good',
        },
      ],
    },
    { id: 'i6', name: 'Black pepper, freshly cracked', amount: 1, unit: 'tsp', scales: 'fixed' },
    { id: 'i7', name: 'Salt (for pasta water)', amount: 1, unit: 'tbsp', scales: 'fixed' },
  ],
  steps: [
    { id: 's1', title: 'Mix the sauce off-heat', content: 'Whisk yolks, whole egg, and pecorino into a thick paste. Add cracked pepper. This is your sauce — make it before anything else.', why_note: "Cold eggs mixed with cold cheese form a stable emulsion. Mixing it warm causes the eggs to start cooking before they hit the pasta, and you'll get scrambled eggs instead of silk." },
    { id: 's2', title: 'Render the guanciale', content: 'Cook guanciale cubes in a cold, dry pan over medium heat. The fat renders slowly and the meat crisps without burning. Remove and leave the fat in the pan.', timer_seconds: 480, why_note: 'Starting cold renders the fat gradually — starting hot burns the outside before the inside renders. The rendered fat is your cooking medium for the whole dish.' },
    { id: 's3', title: 'Cook pasta in well-salted water', content: 'Salt your pasta water until it tastes like the sea. Cook pasta 2 minutes short of package time — it finishes cooking in the sauce. Reserve 200ml of pasta water before draining.', why_note: "Pasta water is starch and salt. It's the only liquid that can loosen carbonara sauce without breaking it. Plain water dilutes and ruins it." },
    { id: 's4', title: 'Combine off heat — this is the critical step', content: 'Add drained pasta to the guanciale pan. Take the pan completely off heat. Add egg mixture, toss constantly, adding pasta water a splash at a time until you have a creamy sauce that coats every strand. If it seizes, add more water.', why_note: "Eggs scramble above 70°C. Off heat, the pasta's residual heat (around 65°C) is exactly right to cook the eggs without curdling. Adding water regulates the temperature and creates the emulsion. This is why carbonara has a reputation — the temperature window is narrow." },
    { id: 's5', title: 'Serve immediately', content: 'Plate immediately, top with extra pecorino and more black pepper. Carbonara does not wait — it thickens rapidly as it cools.' },
  ],
  categories: { cuisines: ['italian'], types: ['pasta'] },
  whole_food_verified: true,
};

const ROAST_CHICKEN: Recipe = {
  id: 'roast-chicken',
  title: 'Perfect Roast Chicken',
  tagline: 'Crisp skin, juicy thighs, every time',
  base_servings: 4,
  time_min: 90,
  difficulty: 'beginner',
  tags: ['chicken', 'roast', 'sunday', 'classic'],
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Thomas Keller / Bouchon',
    video_url: 'https://www.youtube.com/@ChefThomasKeller',
  },
  emoji: '🐔',
  hero_fallback: fallback('#B8721A'),
  hero_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c8?w=600&q=80',
  total_time_minutes: 205,
  active_time_minutes: 25,
  equipment: [
    "Roasting pan or heavy oven dish (not too large — excess space causes drippings to burn)",
    "Rack inside the roasting pan if available (air circulation = crispier skin)",
    "Meat thermometer (target 72–74°C breast, 82°C thigh)",
    "Basting brush (optional)",
    "Carving board",
  ],
  before_you_start: [
    "Dry brine the day before — or at minimum 2 hours ahead. The overnight salt rest seasons the meat through its full thickness, not just the surface, and desiccates the skin so it crisps instead of steams. Two hours is the minimum; overnight is the difference between good and memorable.",
    "Butter under the skin, not just on top. The butter on the outside browns the skin; the butter under the skin bastes the breast meat directly as it melts. The breast is the first part of a chicken to dry out — this solves it.",
    "Rest before carving, for real. Fifteen minutes minimum. Cutting into it early pours all the juices onto the board. A rested chicken carved properly pools its juice in the bowl, not on the cutting board.",
  ],
  mise_en_place: [
    "Day before (or 2+ hours ahead): pat chicken completely dry inside and out with paper towel. Rub ¾ tsp salt per 500g chicken over all surfaces and inside the cavity. Place on a rack in the fridge, uncovered. Do NOT cover it.",
    "45 minutes before cooking: take chicken out of fridge to temper.",
    "Soften butter and mix with crushed garlic and thyme leaves.",
    "Preheat oven to 230°C (fan 210°C) during the last 20 minutes of tempering.",
  ],
  finishing_note: "Carve the chicken and taste a piece of breast without any sauce. It should taste genuinely seasoned all the way through — not just salted on the surface. The skin should shatter slightly when you bite it. The pan drippings are the most flavourful thing in the whole dish — don't pour them away. Deglaze with a splash of water or white wine, scrape up all the fond, and pour it over the carved chicken as a simple jus.",
  leftovers_note: "Roast chicken leftovers are excellent. Cold sliced chicken keeps 3 days refrigerated. Use the carcass for chicken stock — cover with cold water, add a halved onion, carrot, celery, and bay leaf, simmer 2 hours. The stock freezes perfectly.",

  ingredients: [
    {
      id: 'i1', name: 'Whole chicken', amount: 1.8, unit: 'kg', scales: 'fixed', prep: 'One chicken feeds 4 — buy a bigger bird for more people, not more chickens',
      substitutions: [
        { ingredient: 'Spatchcocked (butterflied) chicken', changes: 'Split the backbone with shears and flatten. Cooks 20 minutes faster with more even browning across the whole bird. Better for weeknights.', quality: 'great_swap' },
        { ingredient: 'Chicken maryland pieces (4 large)', changes: 'Roast at 220°C for 35–40 minutes instead. More surface area browns faster. No carving needed. Nearly as satisfying, much less drama.', quality: 'great_swap' },
      ],
    },
    {
      id: 'i2', name: 'Unsalted butter, softened', amount: 60, unit: 'g', scales: 'fixed',
      substitutions: [
        { ingredient: 'Clarified butter (ghee)', changes: 'Higher smoke point means the skin browns faster at 230°C without any risk of burning. Excellent for high-heat roasting. Use the same amount.', quality: 'perfect_swap' },
        { ingredient: 'Extra virgin olive oil', changes: 'Dairy-free option. Doesn\'t baste the breast meat as richly but still flavours and crisps the skin well.', quality: 'good_swap', quantity_note: 'use 4 tablespoons (about 55ml)' },
      ],
    },
    { id: 'i3', name: 'Garlic cloves', amount: 4, unit: '', scales: 'fixed',
      substitutions: [
        { ingredient: 'Garlic paste (1 tsp per clove)', changes: 'Blends into the butter mixture more smoothly. Use 4 tsp total. Works very well under the skin.', quality: 'good_swap', quantity_note: 'use 4 tsp garlic paste total' },
        { ingredient: 'Roasted garlic (8 cloves)', changes: 'Sweeter, nuttier, and milder than raw. Squeeze from the skins and mash into the butter. Deeply fragrant without being sharp.', quality: 'great_swap', quantity_note: 'use 8 roasted cloves to match the flavour impact of 4 raw' },
      ],
    },
    {
      id: 'i4', name: 'Fresh thyme', amount: 6, unit: 'sprigs', scales: 'fixed',
      substitutions: [
        { ingredient: 'Fresh rosemary', changes: 'More assertive and piney than thyme — a strong classic pairing with roast chicken. Use fewer sprigs.', quality: 'great_swap', quantity_note: 'use 3–4 sprigs only — rosemary is more potent' },
        { ingredient: 'Fresh tarragon', changes: 'Sweet, anise-like, and classically French. A different character entirely but arguably the best herb with roast chicken. Same amount.', quality: 'great_swap' },
        { ingredient: 'Dried thyme', changes: 'Works fine — dried is more concentrated so you need less. No texture but the flavour carries through.', quality: 'good_swap', quantity_note: 'use 1.5 tsp dried per 6 sprigs fresh' },
      ],
    },
    { id: 'i5', name: 'Lemon', amount: 1, unit: '', scales: 'fixed',
      substitutions: [
        { ingredient: 'Orange', changes: 'Sweeter, less sharp. The skin and juice inside the cavity perfume the steam. Changes the character but delicious — particularly good with tarragon.', quality: 'good_swap' },
      ],
    },
    { id: 'i6', name: 'Flaky salt', amount: 1, unit: 'tbsp', scales: 'fixed' },
    { id: 'i7', name: 'Black pepper', amount: 1, unit: 'tsp', scales: 'fixed' },
  ],
  steps: [
    { id: 's1', title: 'Dry brine the day before', content: 'Pat the chicken completely dry. Rub salt all over, including inside the cavity. Refrigerate uncovered overnight — at minimum 2 hours.', why_note: 'Dry brining draws moisture to the surface via osmosis, then the salt dissolves back in. The resulting brine penetrates the meat. The uncovered fridge also dries the skin — dry skin crisps, wet skin steams.' },
    { id: 's2', title: 'Bring to room temp and preheat', content: 'Take chicken out of fridge 45 minutes before cooking. Preheat oven to 230°C (fan 210°C).', timer_seconds: 2700, why_note: 'Cold meat hitting a hot oven creates a large gradient — the outside overcooks before the inside is done. Room temp meat cooks more evenly. 230°C is high enough to blister the skin before reducing.' },
    { id: 's3', title: 'Butter under and over the skin', content: 'Mix softened butter with crushed garlic and thyme leaves. Carefully separate the skin from the breast meat with your fingers and push butter under it. Rub remaining butter over the outside.', why_note: 'Butter under the skin bastes the breast meat directly as it melts. Butter on the outside browns the skin through the Maillard reaction. The breast is the first part to dry out — this solves that.' },
    { id: 's4', title: 'Roast high then reduce', content: 'Place chicken breast-side up in a roasting pan. Roast at 230°C for 15 minutes, then reduce to 190°C. Continue for 50–60 minutes until the thigh juices run clear.', timer_seconds: 900, why_note: 'The initial high heat blisters and crisps the skin. Reducing heat prevents the skin burning before the interior is cooked. The breast-side-up position means the thighs — which take longer — face the heat from below and the reflected heat from the sides.' },
    { id: 's5', title: 'Rest properly', content: 'Transfer to a board, loosely tent with foil. Rest 15 minutes before carving. This is not optional.', timer_seconds: 900, why_note: 'Muscle fibres that contracted during cooking relax during resting, and the juices redistribute evenly. Cutting early releases all those juices onto the board. 15 minutes for a whole chicken — 5 minutes is not enough.' },
  ],
  categories: { cuisines: ['french'], types: ['chicken'] },
  whole_food_verified: true,
};

const HUMMUS: Recipe = {
  id: 'hummus',
  title: 'Hummus from Scratch',
  tagline: 'Palestinian hummus — dried chickpeas only',
  base_servings: 6,
  time_min: 720,
  difficulty: 'beginner',
  tags: ['levantine', 'palestinian', 'vegetarian', 'vegan'],
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Reem Kassis / The Palestinian Table',
    video_url: 'https://www.reemkassis.com/',
  },
  emoji: '🫘',
  hero_fallback: fallback('#C4A04A'),
  hero_url: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&q=80',
  total_time_minutes: 900,
  active_time_minutes: 30,
  equipment: [
    "Large bowl or pot for soaking (chickpeas double in size)",
    "Heavy pot for cooking",
    "Food processor — NOT a blender (blender produces a gluey texture)",
    "Microplane or fine grater for garlic",
    "Shallow bowl for serving",
  ],
  before_you_start: [
    "Soak the chickpeas the night before. Unsoaked dried chickpeas even after long cooking have a hard, grainy centre. 12 hours minimum, 24 is better. Discard the soak water.",
    "Cook until they crush between two fingers with almost no pressure. This sounds extreme but it's correct. Under-cooked chickpeas produce grainy hummus no matter how long you blend. When in doubt, cook them longer.",
    "Blend tahini with the lemon first, before the chickpeas go in. This creates the emulsion base that makes hummus silky rather than grainy. It will look broken and thick when you do it — this is correct.",
  ],
  mise_en_place: [
    "Night before: rinse chickpeas and pick out any shrivelled ones or small stones. Cover with at least 3x their volume of cold water — they will double in size. Leave 12–24 hours.",
    "Day of: drain and rinse the soaked chickpeas. Fill the pot with fresh cold water, add bicarbonate of soda.",
    "Squeeze lemon juice and measure tahini before the chickpeas finish cooking — you want to start the food processor while they're still hot.",
    "Peel garlic cloves.",
    "Fill a small bowl with ice water and measure 60ml ice-cold liquid just before blending.",
  ],
  finishing_note: "Taste the hummus and adjust: salt, lemon, or water for consistency. The right texture is thick enough to hold a well in the centre when spread in a bowl — it should not run. Spread in a shallow bowl using the back of a spoon in one circular motion to create the well that catches the olive oil. Fill the well with extra virgin olive oil, scatter a few whole cooked chickpeas, dust with paprika or sumac. Serve with warm flatbread.",
  leftovers_note: "Keeps 5 days refrigerated in an airtight container. It improves for the first 24 hours as the flavours integrate. It firms up when cold — take it out 20 minutes before serving, or reheat very gently in a pan with a splash of water. Don't microwave — it goes grainy. Drizzle fresh olive oil each time you serve.",

  ingredients: [
    { id: 'i1', name: 'Dried chickpeas', amount: 250, unit: 'g', scales: 'linear', prep: 'Tinned chickpeas make edible hummus. They do not make good hummus.',
      substitutions: [
        { ingredient: 'Tinned chickpeas (2 × 400g tins, drained)', changes: 'The hummus will be grainier and less silky. You skip the 12-hour soak and long cook, which is the trade-off. If you use tinned, boil them with bicarbonate for a further 20 minutes to soften them enough.', quality: 'compromise', quantity_note: 'use 2 × 400g tins, draining off the liquid' },
      ],
    },
    { id: 'i2', name: 'Good tahini (Palestinian or Lebanese)', amount: 120, unit: 'ml', scales: 'linear', prep: 'Brand matters enormously. Bitter or thin tahini ruins hummus. Taste it raw first — it should be nutty, not bitter.',
      substitutions: [
        { ingredient: 'Unhulled tahini', changes: 'Darker, more bitter, and earthier. The hummus will have a stronger sesame flavour — some prefer it. Use a touch less lemon to balance.', quality: 'good_swap' },
      ],
    },
    { id: 'i3', name: 'Lemon juice, freshly squeezed', amount: 60, unit: 'ml', scales: 'linear',
      substitutions: [
        { ingredient: 'White wine vinegar', changes: 'Sharper and less fruity than lemon. Use about half the quantity and taste — it lacks the floral note of fresh lemon but brightens the dip.', quality: 'compromise', quantity_note: 'use 30–35ml white wine vinegar' },
      ],
    },
    { id: 'i4', name: 'Garlic cloves', amount: 2, unit: '', scales: 'fixed',
      substitutions: [
        { ingredient: 'Roasted garlic cloves', changes: 'Sweeter, nuttier, and milder than raw garlic. The hummus will be more mellow — less pungent but deeply flavoured. Roast a whole head at 180°C for 45 minutes.', quality: 'great_swap', quantity_note: 'use 4 roasted cloves to match the flavour impact of 2 raw' },
      ],
    },
    { id: 'i5', name: 'Ice-cold water', amount: 60, unit: 'ml', scales: 'linear' },
    { id: 'i6', name: 'Bicarbonate of soda', amount: 0.5, unit: 'tsp', scales: 'fixed', prep: 'Added to the cooking water — it softens the chickpea skins and lets them blend ultra-smooth' },
    { id: 'i7', name: 'Salt', amount: 1, unit: 'tsp', scales: 'fixed' },
    { id: 'i8', name: 'Extra virgin olive oil, to serve', amount: 2, unit: 'tbsp', scales: 'fixed' },
    { id: 'i9', name: 'Paprika and whole chickpeas, to garnish', amount: 1, unit: 'pinch', scales: 'fixed',
      substitutions: [
        { ingredient: 'Sumac and toasted pine nuts', changes: 'A more complex, Middle Eastern garnish. Sumac adds tartness; pine nuts add richness and texture. A genuine upgrade.', quality: 'great_swap' },
        { ingredient: 'Smoked paprika and toasted sesame seeds', changes: 'Deeper colour and a smoky note. Looks beautiful and adds another layer of flavour.', quality: 'great_swap' },
      ],
    },
  ],
  steps: [
    { id: 's1', title: 'Soak overnight', content: 'Cover dried chickpeas with cold water — at least 3× their volume. Soak 12 hours minimum, 24 is better. They will roughly double in size.', why_note: 'Soaking rehydrates the chickpeas so they cook evenly. Unsoaked chickpeas have a hard, grainy centre even after long cooking. The soak water goes slightly acidic and breaks down oligosaccharides that cause gas — discard it.' },
    { id: 's2', title: 'Cook very soft with bicarbonate', content: 'Drain and rinse. Cover with fresh cold water, add bicarbonate of soda. Bring to boil, skim foam. Simmer 1.5–2 hours until completely, utterly soft — they should crush between two fingers with almost no pressure.', timer_seconds: 5400, why_note: 'Bicarbonate of soda raises the pH of the cooking water. In alkaline conditions, pectin in the chickpea cell walls breaks down faster, resulting in a softer, creamier texture. Under-cooked chickpeas give you grainy hummus no matter how long you blend.' },
    { id: 's3', title: 'Blend tahini and lemon first', content: 'In a food processor, blend tahini, lemon juice, and garlic for 1 minute until completely smooth and light-coloured. The mixture will seize and go thick — this is correct.', timer_seconds: 60, why_note: 'Blending tahini before adding chickpeas creates a stable emulsion base. The lemon acid causes the tahini proteins to reorganise into a smoother, fluffier texture. Adding chickpeas to unblended tahini gives a coarser result.' },
    { id: 's4', title: 'Add chickpeas and blend until completely smooth', content: 'Drain chickpeas but save the cooking water. Add hot chickpeas to the tahini mixture. Blend 4–5 minutes straight. Add ice-cold water gradually to achieve a silky, dropping consistency. Season with salt.', timer_seconds: 300, why_note: "Hot chickpeas blend smoother than cold ones — temperature helps break down the starch. The ice-cold water creates a thermal contrast that makes the emulsion fluffier (the same principle as cold butter in mantecatura). Blending 4–5 minutes isn't optional — 1–2 minutes produces gritty hummus." },
    { id: 's5', title: 'Rest and serve warm', content: 'Let the hummus rest 30 minutes before serving — flavours integrate. To serve, spread in a shallow bowl making a well in the centre, fill with olive oil, scatter chickpeas, sprinkle paprika.', timer_seconds: 1800, why_note: 'Freshly blended hummus tastes flat and slightly metallic. The rest allows the lemon, garlic, and tahini flavours to fully integrate. Hummus is at its best at room temperature or slightly warm — cold hummus is firm and mutes the flavour.' },
  ],
  categories: { cuisines: ['levantine'], types: ['vegetarian'] },
  whole_food_verified: true,
};

const THAI_GREEN_CURRY: Recipe = {
  id: 'thai-green-curry',
  title: 'Thai Green Curry',
  tagline: 'Aromatic, balanced, deeply fragrant',
  base_servings: 4,
  time_min: 35,
  difficulty: 'intermediate',
  tags: ['chicken', 'thai', 'asian', 'curry'],
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Andy Cooks',
    video_url: 'https://www.youtube.com/watch?v=lleTlMtbN8Q',
  },
  emoji: '🍛',
  hero_fallback: fallback('#3D7A3D'),
  hero_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80',
  total_time_minutes: 35,
  active_time_minutes: 30,
  equipment: [
    "Wok (preferred) or very wide, deep frying pan",
    "Wooden spoon or wok spatula",
    "Can opener (don't shake the coconut milk)",
    "Rice cooker or pot for jasmine rice (start before the curry)",
  ],
  before_you_start: [
    "Full-fat coconut milk only. The fat in the coconut cream is what carries the curry paste flavour through the whole dish. Light coconut milk breaks and goes watery — this is the one substitution in this recipe that genuinely changes the dish.",
    "Cracking the coconut cream is the technique. When you add the thick cream from the top of the can, stir it with the hot paste until the oil separates — you'll see it pool visibly. This is correct and is the foundation of the dish's flavour depth.",
    "Everything from the wok happens fast. Prep all your vegetables and protein before the wok goes on. Once the paste hits the oil, the dish moves at pace.",
  ],
  mise_en_place: [
    "Slice chicken thighs into bite-sized pieces.",
    "Open coconut milk without shaking — spoon the thick cream from the top into a separate bowl (roughly the top quarter of the can).",
    "Halve the Thai eggplants (or prepare your chosen vegetable).",
    "Measure fish sauce and palm sugar into a small bowl.",
    "Tear kaffir lime leaves slightly to release their oils (leave whole — remove before eating).",
    "Have Thai basil ready, leaves picked.",
    "Start jasmine rice now — it takes 12–15 minutes and should be ready when the curry finishes.",
  ],
  finishing_note: "Taste before serving: Thai cooking is built on the balance of salty (fish sauce), sweet (palm sugar), sour (lime), and aromatic (kaffir lime, basil). These need to be in harmony. Add a squeeze of lime if it tastes flat. A little extra fish sauce if it needs salt. If it's too spicy, a teaspoon more palm sugar softens the heat. Serve in deep bowls over jasmine rice.",
  leftovers_note: "Keeps 3 days refrigerated. The flavour actually deepens — the lime leaf and spices continue to infuse. Reheat gently on the stove (not microwave — the coconut milk can separate unevenly). Stir in a splash of water to loosen if it's thickened. Add the remaining fresh basil again on reheating.",

  ingredients: [
    {
      id: 'i1', name: 'Chicken thighs, sliced', amount: 600, unit: 'g', scales: 'linear',
      substitutions: [
        { ingredient: 'Prawns, peeled and deveined', changes: 'A great seafood version. Add in the last 3 minutes only — prawns cook very fast and turn rubbery if overdone.', quality: 'great_swap' },
        { ingredient: 'Firm tofu, pressed and cubed', changes: 'Absorbs the curry paste beautifully when pressed dry. Vegan option. Fry the tofu first for extra texture.', quality: 'great_swap' },
        { ingredient: 'Chicken breast, thinly sliced', changes: 'Leaner and quicker-cooking. Reduce the chicken step to 2 minutes or it dries out.', quality: 'good_swap' },
      ],
    },
    {
      id: 'i2', name: 'Coconut milk (full-fat)', amount: 400, unit: 'ml', scales: 'linear', prep: 'Use full fat — light coconut milk breaks and looks watery',
      substitutions: [
        { ingredient: 'Coconut cream', changes: 'Richer and thicker — a genuine upgrade. Dilute slightly before use.', quality: 'great_swap', quantity_note: 'use 350ml coconut cream + 100ml water' },
        { ingredient: 'Light coconut milk', changes: 'Will separate and look watery. The fat is what cracks the paste and carries the flavour — this is the one swap to avoid if you can.', quality: 'compromise' },
      ],
    },
    {
      id: 'i3', name: 'Green curry paste', amount: 3, unit: 'tbsp', scales: 'fixed',
      substitutions: [
        { ingredient: 'Red curry paste', changes: 'A completely different curry with an identical method. Bolder, deeper, and sweeter than green. Not a substitute — a different dish.', quality: 'good_swap' },
        { ingredient: 'Yellow curry paste', changes: 'Milder and more turmeric-forward. Same technique but a gentler, more aromatic result.', quality: 'good_swap' },
      ],
    },
    { id: 'i4', name: 'Thai eggplant', amount: 200, unit: 'g', scales: 'linear',
      substitutions: [
        { ingredient: 'Zucchini (courgette), cut in rounds', changes: 'Already in the recipe as an alternative — same technique, milder flavour. Widely available. Cooks slightly faster than eggplant.', quality: 'perfect_swap' },
        { ingredient: 'Broccolini, cut into florets', changes: 'More assertive, slightly bitter. Add in the last 5 minutes — broccolini overcooks fast. Holds its colour well.', quality: 'good_swap', quantity_note: 'add in the last 5 minutes of simmering' },
        { ingredient: 'Snow peas or sugar snap peas', changes: 'Sweet and crunchy — adds texture contrast. Add in the last 2 minutes only or they go limp.', quality: 'good_swap', quantity_note: 'add in the last 2 minutes' },
        { ingredient: 'Capsicum (red or green), sliced', changes: 'Adds sweetness and bulk. Holds up well in the simmer. Standard Thai curry vegetable addition.', quality: 'good_swap' },
        { ingredient: 'Butternut pumpkin, cut in 3cm cubes', changes: 'Sweet and starchy — absorbs the curry beautifully. Add at the same time as the coconut milk, not later, as it needs the full 12 minutes.', quality: 'good_swap' },
      ],
    },
    {
      id: 'i5', name: 'Fish sauce', amount: 2, unit: 'tbsp', scales: 'fixed',
      substitutions: [
        { ingredient: 'Light soy sauce', changes: 'Less funky, different saltiness profile. Vegan alternative. Use slightly less.', quality: 'good_swap', quantity_note: 'use 1.5 tbsp — soy is saltier than fish sauce' },
        { ingredient: 'Coconut aminos', changes: 'Sweeter and milder. Add a pinch of salt to compensate for the lower sodium.', quality: 'compromise' },
      ],
    },
    { id: 'i6', name: 'Palm sugar', amount: 1, unit: 'tsp', scales: 'fixed',
      substitutions: [
        { ingredient: 'Brown sugar', changes: 'Less complex caramel note than palm sugar, but perfectly serviceable. Dissolves faster. Direct swap.', quality: 'great_swap' },
        { ingredient: 'Coconut sugar', changes: 'Less sweet, more mineral, and slightly earthier than palm sugar. Works well in Thai cooking — a natural pairing.', quality: 'great_swap' },
        { ingredient: 'Honey', changes: 'Sweeter and more floral. Use half the quantity and stir in off-heat to avoid bitterness. Subtle flavour difference.', quality: 'good_swap', quantity_note: 'use ½ tsp honey per 1 tsp palm sugar' },
      ],
    },
    { id: 'i7', name: 'Kaffir lime leaves', amount: 4, unit: '', scales: 'fixed',
      substitutions: [
        { ingredient: 'Lime zest, freshly grated', changes: 'Provides citrus brightness without the distinctive floral-herbal complexity of kaffir lime. The broth will be simpler but still fragrant.', quality: 'compromise', quantity_note: 'use zest of 1 lime per 4 kaffir lime leaves', hard_to_find: true, local_alternative: 'Available frozen at most Asian grocers, Harris Farm Markets, and some Woolworths stores. Worth having in the freezer.' },
      ],
    },
    { id: 'i8', name: 'Thai basil', amount: 1, unit: 'handful', scales: 'fixed',
      substitutions: [
        { ingredient: 'Fresh Italian basil + a few fresh mint leaves', changes: 'Italian basil is sweeter and less anise-like than Thai basil. Adding a little mint approximates the aromatic complexity. Still works — just not identical.', quality: 'compromise', quantity_note: 'use a small handful of Italian basil + 4–5 fresh mint leaves' },
        { ingredient: 'Holy basil', changes: 'Slightly more peppery and clove-like than Thai basil. Traditional in some Thai dishes. The most authentic substitute — closer than Italian basil.', quality: 'great_swap', hard_to_find: true, local_alternative: 'Asian grocery stores. Less common than Thai basil but the same shops usually stock both.' },
      ],
    },
    { id: 'i9', name: 'Neutral oil', amount: 2, unit: 'tbsp', scales: 'fixed',
      substitutions: [
        { ingredient: 'Coconut oil', changes: 'Adds a subtle coconut note that integrates naturally into the curry. Works well and is commonly used in Thai cooking.', quality: 'great_swap' },
        { ingredient: 'Vegetable oil or sunflower oil', changes: 'Same neutral-flavour function. Either works identically. Standard swap.', quality: 'perfect_swap' },
      ],
    },
  ],
  steps: [
    { id: 's1', title: 'Fry the paste', content: 'Heat oil in a wok over high heat. Add curry paste and stir fry 2 minutes until fragrant and separated — it will spit.', timer_seconds: 120, why_note: 'Frying the paste in oil cooks out the raw galangal and lemongrass notes and develops a caramelised base flavour. Adding it directly to liquid makes a flat, raw-tasting curry.' },
    { id: 's2', title: 'Add coconut cream first', content: 'Add just the thick cream from the top of the can (don\'t shake it). Stir with the paste 2–3 minutes until the oil separates — "cracking" the coconut.', timer_seconds: 180, why_note: '"Cracking" means the coconut cream\'s emulsion breaks and the fat separates. This fat then carries the fat-soluble flavour compounds from the paste throughout the dish. You\'ll see the oil visibly pool — this is correct.' },
    { id: 's3', title: 'Cook the chicken', content: 'Add chicken, stir to coat in the paste-cream. Cook 3–4 minutes until sealed.', timer_seconds: 240 },
    { id: 's4', title: 'Add remaining coconut milk and simmer', content: 'Pour in the rest of the coconut milk and the thin liquid from the can. Add kaffir lime leaves, fish sauce, sugar, vegetables. Simmer 12 minutes.', timer_seconds: 720, why_note: 'The balance of fish sauce (salt + umami), sugar (sweetness), and lime leaf (citrus-floral) is the holy trinity of Thai cooking. Taste and adjust — the exact amounts depend on your brand of paste and fish sauce.' },
    { id: 's5', title: 'Finish with basil', content: "Remove from heat. Stir in Thai basil leaves — they'll wilt from the residual heat. Serve with jasmine rice.", why_note: 'Thai basil loses its anise-clove aroma with prolonged heat. Adding off heat preserves the volatile compounds. Italian basil is a poor substitute — different flavour profile entirely.' },
  ],
  categories: { cuisines: ['thai'], types: ['chicken'] },
  whole_food_verified: true,
};

const PAD_THAI: Recipe = {
  id: 'pad-thai',
  title: 'Pad Thai',
  tagline: 'The tamarind is non-negotiable',
  base_servings: 2,
  time_min: 20,
  difficulty: 'intermediate',
  tags: ['noodles', 'thai', 'asian', 'quick'],
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Andy Cooks',
    video_url: 'https://www.youtube.com/watch?v=6Lb1PyJxVQM',
  },
  emoji: '🍜',
  hero_fallback: fallback('#C87020'),
  hero_url: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&q=80',
  total_time_minutes: 40,
  active_time_minutes: 20,
  equipment: [
    "Wok (preferred) or the largest, heaviest pan you own",
    "Tongs or wok spatula",
    "Bowl for soaking noodles",
    "Small bowl for pre-mixed sauce",
  ],
  before_you_start: [
    "Soak the noodles in cold water before you start anything else. They need 20 minutes. Hot water or boiling makes them mush by the time they hit the wok.",
    "The sauce ratio is the dish. Mix tamarind, fish sauce, and palm sugar before the wok goes on and taste it cold — sour leads, then salty, then a whisper of sweet. Adjust now, not mid-cook.",
    "Maximum heat, always. Wok hei — the smokiness that makes restaurant pad thai different from home pad thai — only happens at very high temperature. Preheat the wok 3 full minutes. The oil should smoke the moment it hits.",
  ],
  mise_en_place: [
    "Soak noodles in cold water NOW before anything else — they need 20 minutes.",
    "Mix tamarind, fish sauce, and palm sugar in a small bowl — taste and adjust.",
    "Peel and devein prawns, slice if large. Press tofu dry with paper towel, cut into 1.5cm cubes.",
    "Crack eggs into a small bowl.",
    "Slice spring onions, separating white and green ends (white ends go into the wok early, green ends garnish).",
    "Measure and prepare all garnishes: peanuts, bean sprouts, lime wedges.",
    "Wok on maximum heat for the last 3 minutes of your mise — it needs to be ripping hot before the oil goes in.",
  ],
  finishing_note: "Taste before plating: the noodles should be well-seasoned — slightly sweet-sour-salty from the caramelised sauce. Adjust with a small splash of fish sauce if needed. The bean sprouts and spring onions go on at plating — their job is freshness and crunch against the hot noodles. Squeeze lime generously over everything. The lime is not garnish; it's part of the dish.",
  leftovers_note: "Pad thai does not keep well. The noodles absorb remaining sauce and stick together as they cool, and the bean sprouts go limp. If you have leftovers, reheat in a hot pan with a splash of water. Don't microwave — the noodles go gluey.",

  ingredients: [
    { id: 'i1', name: 'Flat rice noodles (5mm)', amount: 160, unit: 'g', scales: 'linear',
      substitutions: [
        { ingredient: 'Rice vermicelli (thin)', changes: 'Much thinner — the texture is more delicate and cooks faster. Soak 3 minutes only. The dish is lighter.', quality: 'good_swap' },
        { ingredient: 'Egg noodles (thin, fresh)', changes: 'Wheaten noodles with an eggy richness. Stir-fry the same way but cook from fresh without soaking.', quality: 'good_swap' },
      ],
    },
    {
      id: 'i2', name: 'Prawns, sliced', amount: 200, unit: 'g', scales: 'linear',
      substitutions: [
        { ingredient: 'Pork belly, thinly sliced', changes: 'Richer and fattier — less traditional but deeply satisfying. Cook in the wok the same way.', quality: 'great_swap' },
        { ingredient: 'Extra firm tofu, increase to 200g', changes: 'Vegetarian version — remove the prawns entirely and increase tofu to 200g. The dish reads as a complete vegetarian pad thai, not a compromise. Fry the tofu until golden before the noodles go in.', quality: 'good_swap' },
        { ingredient: 'Chicken thigh, thinly sliced', changes: 'Cooks in the same time as prawns. Use 180g. Slightly richer and less sweet than prawn. Slice thin so it cooks in 90 seconds at high heat.', quality: 'great_swap', quantity_note: 'use 180g chicken thigh, thinly sliced' },
        { ingredient: 'Squid, scored and sliced', changes: 'Traditional Thai market alternative. Needs the same high heat. Do not overcook — 60 seconds maximum or it turns rubbery.', quality: 'great_swap' },
      ],
    },
    { id: 'i3', name: 'Eggs', amount: 2, unit: '', scales: 'linear' },
    {
      id: 'i4', name: 'Tamarind paste', amount: 3, unit: 'tbsp', scales: 'fixed', prep: 'Ketchup is not a substitute — it changes the dish entirely',
      substitutions: [
        { ingredient: 'Tamarind concentrate', changes: 'More concentrated than paste — stronger and thicker. Use less and dilute with a splash of water.', quality: 'great_swap', quantity_note: 'use 2 tbsp concentrate + 1 tbsp water' },
        { ingredient: 'Lime juice + splash of rice vinegar', changes: 'Approximates the sourness without the deep complexity of tamarind. The result is thinner in body but the acidity works.', quality: 'compromise', quantity_note: '2 tbsp lime juice + 1 tbsp rice vinegar' },
      ],
    },
    {
      id: 'i5', name: 'Fish sauce', amount: 2, unit: 'tbsp', scales: 'fixed',
      substitutions: [
        { ingredient: 'Light soy sauce', changes: 'Less funky, different saltiness. Works as a vegan alternative. Use slightly less.', quality: 'good_swap', quantity_note: 'use 1.5 tbsp — soy is saltier' },
      ],
    },
    {
      id: 'i6', name: 'Palm sugar', amount: 1, unit: 'tbsp', scales: 'fixed',
      substitutions: [
        { ingredient: 'Brown sugar or dark muscovado', changes: 'Similar caramel notes. Brown sugar dissolves faster and is widely available. Nearly identical result.', quality: 'great_swap' },
        { ingredient: 'Coconut sugar', changes: 'Less sweet and more mineral. Works well — same amount.', quality: 'great_swap' },
      ],
    },
    { id: 'i7', name: 'Bean sprouts', amount: 80, unit: 'g', scales: 'linear',
      substitutions: [
        { ingredient: 'Shredded cabbage', changes: 'Crunchier but doesn\'t wilt as fast. A serviceable substitute when bean sprouts aren\'t available.', quality: 'good_swap' },
      ],
    },
    { id: 'i8', name: 'Spring onions, sliced', amount: 3, unit: '', scales: 'linear',
      substitutions: [
        { ingredient: 'Chives, thinly sliced', changes: 'Milder and more delicate. Add off heat only — they wilt immediately in the wok. Works well as a fresh garnish.', quality: 'good_swap' },
        { ingredient: 'Leek (green tops only), thinly sliced', changes: 'More robust than spring onion. Add to the wok 30 seconds before plating to warm through.', quality: 'good_swap' },
      ],
    },
    { id: 'i9', name: 'Crushed peanuts', amount: 40, unit: 'g', scales: 'linear',
      substitutions: [
        { ingredient: 'Cashews, toasted and roughly chopped', changes: 'Creamier and milder than peanuts. A good nut-allergy-alternative within the cashew category. Different but excellent.', quality: 'good_swap' },
        { ingredient: 'Toasted sunflower seeds', changes: 'Nut-free. Less rich, similar crunch. Toast in a dry pan until golden.', quality: 'compromise' },
      ],
    },
    { id: 'i10', name: 'Tofu, firm, cubed', amount: 100, unit: 'g', scales: 'linear' },
  ],
  steps: [
    { id: 's1', title: 'Soak noodles, mix sauce', content: 'Soak noodles in cold water 20 minutes until pliable but not cooked. Mix tamarind, fish sauce, sugar — taste it. Should be sour, salty, subtly sweet in that order.', timer_seconds: 1200, why_note: 'Cold soak (not boiling) means the noodles still have structural integrity when they hit the wok. Boiled noodles finish as mush. The sauce ratio defines pad Thai — get it right off the heat where you can taste clearly.' },
    { id: 's2', title: 'High heat wok', content: 'Wok on the highest flame you have for 3 minutes. Add oil — it should smoke immediately. This is the right temperature.', timer_seconds: 180, why_note: 'Wok hei — the smoky breath of the wok — only happens above 200°C on a dry wok. Restaurant woks run on industrial flames; home woks need maximum time to accumulate heat. A warm wok makes pad Thai soggy and grey.' },
    { id: 's3', title: 'Protein, then egg', content: 'Add protein to the wok edge, cook 2 minutes. Push to the side. Crack eggs into the hot centre, scramble until almost set, then push to the side with the protein.', timer_seconds: 120, why_note: 'Cooking protein and egg separately in zones keeps both from overcooking while you deal with the noodles. Mixed too early and you end up with one overcooked, broken mess.' },
    { id: 's4', title: 'Noodles and sauce', content: 'Add drained noodles, pour sauce over. Toss everything together using tongs. Cook 2 minutes — the sauce should evaporate and caramelise into the noodles.', timer_seconds: 120, why_note: 'Two minutes of high-heat contact lets the tamarind-sugar mixture caramelise onto the noodles. This creates the characteristic stickiness and complex flavour. Remove from heat the moment it looks slightly dry — residual heat finishes it.' },
    { id: 's5', title: 'Serve immediately', content: 'Top with bean sprouts, spring onions, peanuts. Serve with lime wedge, extra fish sauce, sugar, and chilli flakes on the side for adjusting.', why_note: 'Pad Thai cools fast and goes sticky cold. Serve immediately. The condiment table is traditional — every diner adjusts their own bowl.' },
  ],
  categories: { cuisines: ['thai'], types: ['pasta', 'seafood'] },
  whole_food_verified: true,
};

// ────────────────────────────────────────────────────────────────────────────
//  Kept from v0 seed (not in hone.html)
// ────────────────────────────────────────────────────────────────────────────

const WEEKDAY_BOLOGNESE: Recipe = {
  id: 'weekday-bolognese',
  title: 'The Weekday Bolognese',
  tagline: 'A proper ragù without the all-day Sunday commitment',
  description: 'Short version of the real thing. The soffritto and the milk-first step do the work 3 hours of simmering usually gets credit for.',
  base_servings: 4,
  time_min: 75,
  difficulty: 'intermediate',
  tags: ['italian', 'pasta', 'beef', 'comfort'],
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Andy Cooks',
    video_url: 'https://www.youtube.com/@andy_cooks',
    notes: "In the spirit of Andy's technique-first approach: soffritto built properly, milk before wine, patience with the brown bits.",
  },
  emoji: '🍝',
  hero_fallback: ['#8B3A2F', '#C44536', '#D4A574'],
  total_time_minutes: 75,
  active_time_minutes: 25,
  equipment: [
    "Heavy-based wide pan or Dutch oven",
    "Wooden spoon or silicone spatula",
    "Large pot for pasta",
    "Fine grater or microplane for Parmigiano",
  ],
  before_you_start: [
    "The soffritto is 30% of the final flavour. Twelve to fifteen minutes over medium heat, no shortcuts. If you rush it on high heat it browns — that's a different, less sweet, less complex base. You want the vegetables to dissolve into sweetness, not colour.",
    "Milk goes in before wine and tomatoes — every time. It tenderises the meat proteins before the acid can tighten them. This is the step that separates weekday ragù from the full Sunday version.",
    "A bare simmer, not a bubble. One small bubble every couple of seconds. A rolling simmer makes the meat tough and stringy. You're making collagen convert to gelatin — that only happens gently.",
  ],
  mise_en_place: [
    "Fine dice the onion, carrot, and celery — all the same size so they cook evenly.",
    "Mince or slice the garlic (it goes in late — with the wine).",
    "Measure the milk and wine into separate containers — they go in sequentially and you don't want to be measuring mid-cook.",
    "Open the tinned tomatoes and crush by squeezing through your fist, or use scissors in the tin.",
    "Have the stock measured and warm — cold stock drops the simmer temperature.",
    "Start the pasta water about 30 minutes before the ragù finishes.",
  ],
  finishing_note: "Before the pasta goes in, taste the ragù aggressively. It needs more salt than you think — the pasta and Parmigiano will dilute the seasoning. The flavour should be deep, meaty, slightly sweet from the carrot and the milk, with a clean red wine note. If it tastes flat, salt. If it tastes thin, reduce another 5 minutes. If it tastes acidic, a pinch of sugar or a small knob of butter will round it out. Finish with Parmigiano stirred through off-heat.",
  leftovers_note: "The ragù improves significantly overnight. Make a double batch and refrigerate or freeze the extra ragù (without pasta). Freezes perfectly for 3 months. Reheat gently with a splash of water to loosen.",

  ingredients: [
    { id: 'oil', name: 'Olive oil', amount: 2, unit: 'tbsp', scales: 'linear' },
    { id: 'onion', name: 'Onion, fine dice', amount: 1, unit: 'medium', scales: 'linear',
      substitutions: [
        { ingredient: 'Shallots, finely diced', changes: 'Milder and sweeter than brown onion. Use 3–4 shallots per 1 medium onion. A more refined soffritto base.', quality: 'great_swap', quantity_note: 'use 3–4 shallots per 1 medium onion' },
        { ingredient: 'Leek (white and pale green part), finely sliced', changes: 'Milder and sweeter than onion. Sweats down beautifully in the soffritto. Wash well — leeks trap grit.', quality: 'good_swap' },
      ],
    },
    { id: 'carrot', name: 'Carrot, fine dice', amount: 1, unit: 'medium', scales: 'linear',
      substitutions: [
        { ingredient: 'Parsnip, finely diced', changes: 'Sweeter and earthier than carrot. Works beautifully in a Northern Italian ragù — slightly different sweetness that blends well.', quality: 'great_swap' },
      ],
    },
    { id: 'celery', name: 'Celery stalk, fine dice', amount: 1, unit: 'stalk', scales: 'linear',
      substitutions: [
        { ingredient: 'Fennel bulb, finely diced', changes: 'Anise-like and slightly sweet. Works very well in Italian ragù — fennel and pork mince are a natural pairing.', quality: 'great_swap' },
        { ingredient: 'Celeriac (celery root), finely diced', changes: 'Concentrated celery flavour. Use a slightly smaller amount — celeriac is more assertive than celery stalk.', quality: 'good_swap', quantity_note: 'use slightly less — celeriac is more assertive than celery stalk' },
      ],
    },
    { id: 'garlic', name: 'Garlic cloves, minced', amount: 3, unit: 'cloves', scales: 'fixed', cap: 6,
      substitutions: [
        { ingredient: 'Garlic paste (1 tsp per clove)', changes: 'Consistent and convenient. Works very well in a long-cooked ragù where the raw edge will be cooked out regardless.', quality: 'good_swap', quantity_note: 'use 1 tsp garlic paste per clove' },
      ],
    },
    {
      id: 'beef', name: 'Beef mince (80/20)', amount: 400, unit: 'g', scales: 'linear',
      substitutions: [
        { ingredient: 'Veal mince', changes: 'Lighter, more delicate flavour — very traditional in Northern Italian ragù. The ragù will be paler and more refined.', quality: 'great_swap' },
        { ingredient: 'All beef mince (80/20), no pork', changes: 'Slightly less complex without the pork fat. Increase the total amount to compensate for the missing pork.', quality: 'compromise', quantity_note: 'use 600g beef total to replace both minces' },
      ],
    },
    {
      id: 'pork', name: 'Pork mince', amount: 200, unit: 'g', scales: 'linear',
      substitutions: [
        { ingredient: 'Italian sausage mince (casings removed)', changes: 'Already seasoned with fennel and garlic — adds complexity and richness. Reduce added salt elsewhere.', quality: 'great_swap' },
      ],
    },
    { id: 'milk', name: 'Whole milk', amount: 200, unit: 'ml', scales: 'linear',
      substitutions: [
        { ingredient: 'Full-fat oat milk or coconut milk', changes: 'Dairy-free. Oat milk is the closest in behaviour; coconut milk adds a subtle sweetness. The milk-first technique still tenderises. Same amount.', quality: 'good_swap' },
      ],
    },
    {
      id: 'wine', name: 'Dry red wine', amount: 200, unit: 'ml', scales: 'linear',
      substitutions: [
        { ingredient: 'Dry white wine', changes: 'Lighter character and paler sauce. A white-wine Bolognese is a real tradition in Emilia-Romagna — not a compromise, just different.', quality: 'good_swap' },
        { ingredient: 'Extra beef stock + red wine vinegar', changes: 'No alcohol option. Add the vinegar at the end — it won\'t replicate the tannins but adds the needed acidity.', quality: 'compromise', quantity_note: 'use 200ml extra stock + 1 tbsp red wine vinegar' },
      ],
    },
    { id: 'tomatoes', name: 'Tinned whole tomatoes', amount: 400, unit: 'g', scales: 'linear',
      substitutions: [
        { ingredient: 'Tinned chopped tomatoes', changes: 'Already chopped — identical result after 45 minutes of simmering. Slightly more watery initially.', quality: 'perfect_swap' },
        { ingredient: 'Tomato passata', changes: 'Already smooth — skip the breaking-down step. Use 350ml per 400g tin. Slightly sweeter and thicker.', quality: 'great_swap', quantity_note: 'use 350ml passata per 400g tin' },
        { ingredient: 'Fresh ripe tomatoes, roughly chopped (4 large)', changes: 'Better in peak tomato season. Blanch and peel for a smoother result. Extend simmering by 10–15 minutes — fresh tomatoes have more water.', quality: 'great_swap', quantity_note: 'extend simmering by 10–15 minutes — fresh tomatoes have more liquid' },
      ],
    },
    { id: 'stock', name: 'Beef stock', amount: 300, unit: 'ml', scales: 'linear',
      substitutions: [
        { ingredient: 'Chicken stock', changes: 'Lighter colour and less robustly beefy. Still makes excellent bolognese — the pork mince and long simmer carry the body.', quality: 'good_swap' },
      ],
    },
    { id: 'bay', name: 'Bay leaves', amount: 2, unit: 'leaves', scales: 'fixed', cap: 3 },
    {
      id: 'pasta', name: 'Pappardelle', amount: 400, unit: 'g', scales: 'linear',
      substitutions: [
        { ingredient: 'Rigatoni', changes: 'The sauce gets inside the tubes — many prefer this over flat pasta. Cook to package time exactly, then marry in the pan.', quality: 'great_swap' },
        { ingredient: 'Spaghetti or linguine', changes: 'Thinner strands hold less sauce per bite but work fine. Classic trattoria substitute.', quality: 'good_swap' },
      ],
    },
    { id: 'parm', name: 'Parmigiano, grated', amount: 60, unit: 'g', scales: 'linear',
      substitutions: [
        { ingredient: 'Grana Padano, grated', changes: 'Less complex and slightly milder than Parmigiano Reggiano. Melts and emulsifies identically. Far cheaper — a professional kitchen cost-saving standard.', quality: 'great_swap' },
        { ingredient: 'Pecorino Romano, grated', changes: 'Sharper, saltier, and more tangy. Use less — 40g per 60g Parmigiano. Changes the character slightly but classically Italian.', quality: 'good_swap', quantity_note: 'use 40g Pecorino per 60g Parmigiano — it\'s much saltier' },
      ],
    },
    { id: 'salt', name: 'Salt & black pepper', amount: 1, unit: 'to taste', scales: 'fixed' },
  ],
  steps: [
    { id: 's1', title: 'Build the soffritto', content: 'Warm oil over medium heat. Add onion, carrot, celery with a pinch of salt. Sweat gently for 12–15 min until soft and translucent — no colour.', stage_note: 'Vegetables glossy and soft, no browning on the edges. You should smell sweetness, not Maillard.', why_note: 'This quiet step is roughly 30% of the final flavour. Rushing it with higher heat browns the outside but leaves the inside raw-tasting.', timer_seconds: 900, ingredient_refs: ['oil', 'onion', 'carrot', 'celery'] },
    { id: 's2', title: 'Brown the mince', content: "Push soffritto to the side. Crank heat high. Add both minces in a single layer. Don't stir. Let them crust, then break up and brown.", stage_note: 'Deep mahogany brown in patches. Fond visible on the pan bottom. Audible crackle.', why_note: 'The dark fond — the stuck bits — is the foundation of the sauce. Stirring too early steams the meat and nothing sticks.', timer_seconds: 600, ingredient_refs: ['beef', 'pork'] },
    { id: 's3', title: 'Milk first — this matters', content: 'Pour in milk. Scrape up fond from the pan bottom. Simmer until nearly evaporated.', stage_note: 'Milk reduced to a thin glaze. No pooling liquid.', why_note: "Milk tenderises the meat proteins BEFORE the acid of wine and tomato tightens them. Adding it later doesn't undo what the acid already did — it has to go first.", timer_seconds: 420, ingredient_refs: ['milk'] },
    { id: 's4', title: 'Wine, then tomatoes & stock', content: 'Add wine, reduce by half. Then tomatoes (crushed by hand), stock, bay, and garlic. Bring to a murmur.', stage_note: 'Gently blipping, not boiling. One bubble every couple of seconds.', timer_seconds: 120, ingredient_refs: ['wine', 'tomatoes', 'stock', 'bay', 'garlic'] },
    { id: 's5', title: 'The long simmer', content: 'Partially cover. Simmer 45 min minimum — longer if you have it. Stir every 10. Splash of water if it tightens too much.', stage_note: 'Thick, glossy, fat separating slightly at the edges. Taste aggressively for salt.', lookahead: 'In the last 15 min, put a big pot of heavily-salted water on for the pasta.', timer_seconds: 2700 },
    { id: 's6', title: 'Marry with pasta', content: 'Cook pasta one minute shy of al dente. Transfer directly into the ragù with a ladle of pasta water. Toss over medium heat for 60 seconds. Finish with parmigiano off-heat.', stage_note: 'Each strand coated. No sauce pooling at the bottom of the bowl. Silky, not soupy.', why_note: "Starchy pasta water emulsifies with the fat in the sauce — that's what turns a ragù from \"meat in tomato\" into something that clings to the pasta.", timer_seconds: 60, ingredient_refs: ['pasta', 'parm'] },
  ],
  leftover_mode: {
    extra_servings: 2,
    note: 'Packs for two lunches the next day. Ragù actually improves overnight — make more, not less.',
  },
  categories: { cuisines: ['italian'], types: ['beef', 'pasta'] },
  whole_food_verified: true,
};

// ────────────────────────────────────────────────────────────────────────────
//  5 Originals — Hone Kitchen
//  Authored in-house in the chef-guide voice. Sourced as "Hone Kitchen"
//  so the Zod refine check passes honestly — no chef is claimed who didn't
//  actually author these.
// ────────────────────────────────────────────────────────────────────────────

const LAMB_SHAWARMA: Recipe = {
  id: 'lamb-shawarma',
  title: 'Home Oven Lamb Shawarma',
  tagline: 'Slow-roast shoulder with a spice bark — no rotisserie required',
  description: 'Real shawarma meat drips off a vertical spit. You will not build one of those in a home kitchen. But shoulder cooked low-and-slow, rested, then blasted high, gets you about 90% of the way — and the leftover fat in the tray is a treasure.',
  base_servings: 6,
  time_min: 300,
  difficulty: 'intermediate',
  tags: ['levantine', 'middle-eastern', 'beef', 'slow', 'dinner-party', 'batch-cook'],
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Hone Kitchen',
    notes: 'Original in-house recipe — a home-oven adaptation of the spit-roasted original. No chef attribution.',
  },
  emoji: '🥩',
  hero_url: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600&q=80',
  hero_fallback: fallback('#6B3A2A'),
  total_time_minutes: 420,
  active_time_minutes: 35,
  equipment: [
    "Deep roasting tray (deep enough to hold the whole shoulder with clearance)",
    "Baking paper AND foil (both needed — paper prevents foil touching the meat directly)",
    "Two forks for shredding",
    "Meat thermometer (target ~90°C internal for pull-apart collagen conversion)",
  ],
  before_you_start: [
    "Start the marinade the night before. The yoghurt marinade needs at least 6 hours — overnight gives a noticeably better result. The salt seasons through the full thickness of the shoulder; less than 6 hours seasons the surface only.",
    "Don't peek during the 4-hour low-and-slow. The sealed tray traps steam that keeps the meat from drying out. Opening it even once breaks the seal and you lose an hour of accumulated moisture. Set a timer and walk away.",
    "The fat in the tray after cooking is the most flavourful thing in the dish. Don't drain it. Shred the meat directly into it so every piece gets coated before you serve.",
  ],
  mise_en_place: [
    "Night before: combine all marinade ingredients (yoghurt, garlic, lemon, olive oil, all spices) into a thick paste. Score the shoulder in a few places. Coat every surface thoroughly, including under any skin flaps. Cover and refrigerate overnight.",
    "Day of, 1 hour before roasting: take shoulder out of fridge to temper.",
    "Preheat oven to 160°C (fan 140°C).",
    "Cut baking paper to fit the tray, tear foil for the seal.",
    "Warm the flatbreads in a dry pan just before serving.",
    "Prepare the condiments: tahini sauce, pickled turnips.",
  ],
  finishing_note: "Taste a shred of lamb from the tray before serving. It should be deeply spiced, savoury, slightly caramelised at the edges. Season the assembled tray with a little extra salt if the meat needs it. The wrap needs three things to be balanced: fatty spiced lamb + creamy tahini + the sharp acid of pickled turnips. If the pickled turnips you bought are not actually sour, add a splash of white wine vinegar to sliced raw onion as a quick substitute.",
  leftovers_note: "Built for leftovers. Shredded shawarma keeps 3 days in the fridge, freezes well, and reheats best in a pan with a splash of water — not the microwave.",

  ingredients: [
    { id: 'i1', name: 'Bone-in lamb shoulder', amount: 2, unit: 'kg', scales: 'fixed', prep: 'Bone-in — the bone keeps it from drying out during the long cook',
      substitutions: [
        { ingredient: 'Bone-in lamb leg', changes: 'Leaner than shoulder — less forgiving in a long cook. Reduce time to 3 hours covered and check frequently. Still excellent but tighter margin for error.', quality: 'good_swap' },
        { ingredient: 'Boneless lamb shoulder (butterflied)', changes: 'No bone to slow heat penetration — reduce covered cook time to 3 hours. Roll and tie tightly so it holds together when shredding.', quality: 'good_swap', quantity_note: 'reduce covered cook time to 3 hours' },
        { ingredient: 'Goat shoulder, bone-in', changes: 'Traditional in some shawarma traditions. Slightly gamier and leaner than lamb. Excellent — treat identically.', quality: 'great_swap' },
      ],
    },
    { id: 'i2', name: 'Yoghurt, full-fat', amount: 200, unit: 'g', scales: 'linear', prep: 'The tenderising base for the marinade',
      substitutions: [
        { ingredient: 'Coconut yoghurt', changes: 'Vegan and dairy-free. The lactic acid still tenderises; the coconut flavour is very subtle after the long cook. A good alternative.', quality: 'good_swap' },
        { ingredient: 'Buttermilk', changes: 'Tangier than yoghurt and more liquid. Works well as a marinade base — the acids tenderise similarly.', quality: 'good_swap' },
      ],
    },
    { id: 'i3', name: 'Garlic cloves', amount: 8, unit: '', scales: 'linear',
      substitutions: [
        { ingredient: 'Garlic paste (1 tsp per clove)', changes: 'Blends smoothly into the yoghurt marinade. Use 8 tsp total. A reliable shortcut for a dish with such strong competing flavours.', quality: 'good_swap', quantity_note: 'use 8 tsp garlic paste total' },
      ],
    },
    { id: 'i4', name: 'Lemon (juice and zest)', amount: 2, unit: '', scales: 'linear',
      substitutions: [
        { ingredient: 'Lime (juice and zest)', changes: 'More floral and slightly more acidic than lemon. Works very well in shawarma marinade — a common variation in Lebanese cooking.', quality: 'great_swap' },
      ],
    },
    { id: 'i5', name: 'Olive oil', amount: 4, unit: 'tbsp', scales: 'fixed' },
    { id: 'i6', name: 'Ground cumin', amount: 2, unit: 'tsp', scales: 'fixed',
      substitutions: [
        { ingredient: 'Cumin seeds, toasted and ground', changes: 'More aromatic than pre-ground. Toast in a dry pan 60 seconds until fragrant, then grind. A minor but noticeable upgrade.', quality: 'great_swap' },
        { ingredient: 'Caraway seeds, ground', changes: 'Earthy and slightly anise-like. Closer to cumin than most spices — used in North African cooking in similar applications.', quality: 'good_swap' },
      ],
    },
    { id: 'i7', name: 'Ground coriander', amount: 2, unit: 'tsp', scales: 'fixed',
      substitutions: [
        { ingredient: 'Coriander seeds, toasted and ground', changes: 'More aromatic and complex than pre-ground. Toast 60 seconds, grind in a mortar. Worth the extra minute.', quality: 'great_swap' },
        { ingredient: 'Ground caraway seeds', changes: 'Earthy and slightly anise-flavoured — different to coriander but works in the context of a complex spice blend.', quality: 'compromise' },
      ],
    },
    { id: 'i8', name: 'Smoked paprika', amount: 1, unit: 'tbsp', scales: 'fixed',
      substitutions: [
        { ingredient: 'Sweet paprika', changes: 'Less smoky but still adds colour and mild warmth. The char from the oven blast compensates partially for the missing smoke.', quality: 'good_swap' },
      ],
    },
    { id: 'i9', name: 'Ground cinnamon', amount: 0.5, unit: 'tsp', scales: 'fixed' },
    { id: 'i10', name: 'Ground cardamom', amount: 0.5, unit: 'tsp', scales: 'fixed' },
    { id: 'i11', name: 'Ground cloves', amount: 0.25, unit: 'tsp', scales: 'fixed', prep: 'A tiny amount — cloves take over if you push it' },
    { id: 'i12', name: 'Black pepper, freshly ground', amount: 1, unit: 'tsp', scales: 'fixed' },
    { id: 'i13', name: 'Salt', amount: 2, unit: 'tsp', scales: 'fixed' },
    { id: 'i14', name: 'Flatbreads, to serve', amount: 6, unit: 'large', scales: 'linear',
      substitutions: [
        { ingredient: 'Lebanese flatbread', changes: 'Thinner and more pliable than pitta — wraps beautifully around the pulled shawarma. Traditional in Lebanese shawarma shops.', quality: 'great_swap' },
        { ingredient: 'Lavash', changes: 'Very thin and wide. Roll tightly — better for a compact wrap than a laid-flat serve.', quality: 'good_swap' },
      ],
    },
    { id: 'i15', name: 'Tahini sauce, to serve', amount: 150, unit: 'g', scales: 'linear',
      substitutions: [
        { ingredient: 'Toum (Lebanese garlic sauce)', changes: 'Intensely garlicky and creamy — an entirely legitimate and arguably superior choice. Whip garlic, lemon, salt, and oil in a food processor until cloud-like.', quality: 'great_swap' },
        { ingredient: 'Tzatziki', changes: 'Yoghurt-based cooling sauce with cucumber and garlic. Different cultural context but pairs very well with spiced lamb.', quality: 'good_swap' },
      ],
    },
    { id: 'i16', name: 'Pickled turnips, to serve', amount: 100, unit: 'g', scales: 'linear', prep: 'The sharp pickled thing is not optional — it cuts the richness',
      substitutions: [
        { ingredient: 'Pickled cucumbers (gherkins), sliced', changes: 'Less complex than turnips but provides the same acidic cut through the fat. Widely available.', quality: 'good_swap' },
        { ingredient: 'Pickled red cabbage', changes: 'Vinegary and crunchy. Different flavour profile to turnips but serves the same purpose of cutting richness.', quality: 'good_swap' },
      ],
    },
  ],
  steps: [
    { id: 's1', title: 'Build the marinade and rub', content: 'Mix yoghurt, crushed garlic, lemon zest and juice, olive oil, cumin, coriander, smoked paprika, cinnamon, cardamom, cloves, pepper, and salt into a thick paste. Smear it into every crevice of the shoulder — get under any flaps and into score marks if your shoulder is scored. Cover and refrigerate overnight, or at least 6 hours.', why_note: "Yoghurt's lactic acid tenderises lamb shoulder gently without turning it mushy the way a straight lemon marinade would at this length of soak. Overnight means the salt pulls moisture out and then back in, seasoning through the full thickness. A 1-hour marinade seasons only the surface — not enough.", ingredient_refs: ['i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8', 'i9', 'i10', 'i11', 'i12', 'i13', 'i1'] },
    { id: 's2', title: 'Out of the fridge an hour before', content: 'Take the shoulder out of the fridge 60 minutes before roasting so it comes to room temperature. Preheat oven to 160°C (fan 140°C) in the last 20 minutes.', timer_seconds: 3600, why_note: 'Cold meat in a hot oven cooks unevenly — the outside crusts while the inside takes an hour longer to come up to temp. Room-temp starts the whole cook at the same baseline and gets you a more consistent interior.', ingredient_refs: ['i1'] },
    { id: 's3', title: 'Low and slow, covered', content: 'Place the shoulder in a deep roasting tray. Pour 200ml water into the tray around (not over) the lamb. Cover the whole tray tightly with a layer of baking paper then a layer of foil — a sealed lid, essentially. Roast for 4 hours. Do not peek.', timer_seconds: 14400, why_note: "This is a braise disguised as a roast. The sealed tray traps steam, which keeps the meat from drying as the collagen converts. The water at the bottom becomes the most flavourful dripping you will ever taste — do not pour it away. Opening the tray breaks the steam seal and you lose an hour of moisture in five seconds.", ingredient_refs: ['i1'] },
    { id: 's4', title: 'Rest, then crank the heat', content: 'Pull the tray. Uncover it. The shoulder should be pullable with a fork and the fat cap golden. Let it rest, uncovered, for 20 minutes while you turn the oven up to its maximum — 240°C if it will go there.', timer_seconds: 1200, why_note: 'The rest lets the juices redistribute and gives you a dry surface to crisp. Putting a wet-from-steam shoulder into a hot oven just steams it more. The oven crank during the rest means no wasted time when you put it back in.', ingredient_refs: ['i1'] },
    { id: 's5', title: 'Blast for crust', content: 'Return the uncovered tray to the oven at maximum heat for 10–15 minutes. Watch it — you want the fat cap and exposed meat to catch colour and crisp at the edges. If it looks like it is about to burn, pull it.', timer_seconds: 600, why_note: "This is your spit-roast simulation — fast, dry heat on a surface that is already dry from resting. The spice bark on the outside browns in a way it cannot under a foil cover. Under-blast and you have a stew; over-blast and it dries in 60 seconds.", ingredient_refs: ['i1'] },
    { id: 's6', title: 'Pull, shred, wrap', content: 'Pull the shoulder out. Shred the meat with two forks directly on the tray so every piece gets rolled in the spiced fat from the bottom. Pile into warm flatbreads with tahini sauce and pickled turnips. Eat standing up if you have to.', why_note: "The shredding-on-the-tray step is what separates this from a dry roast — you are deliberately re-dressing the meat in its own rendered spice-fat before serving. Never drain that fat; it is the best bit. The pickle and tahini make the wrap balanced — fatty meat alone is one-note.", ingredient_refs: ['i14', 'i15', 'i16', 'i1'] },
  ],
  leftover_mode: {
    extra_servings: 3,
    note: 'This is built for leftovers. Shredded shawarma keeps 3 days in the fridge, freezes well, and reheats best in a pan with a splash of water — not the microwave.',
  },
  categories: { cuisines: ['levantine'], types: ['lamb'] },
  whole_food_verified: true,
};

// ────────────────────────────────────────────────────────────────────────────
//  Phase 3 — Malaysian, Indian, Japanese, Thai, Australian
// ────────────────────────────────────────────────────────────────────────────

const BUTTER_CHICKEN: Recipe = {
  id: 'butter-chicken',
  title: 'Butter Chicken from Scratch',
  tagline: 'Tandoor-inspired chicken in a tomato-cream sauce — no jar',
  description: 'Butter chicken (murgh makhani) was invented in Delhi in the 1950s by Kundan Lal Gujral and Kundan Lal Jaggi — the story is that leftover tandoor chicken was simmered in a rich tomato and butter sauce to stop it drying out. A happy accident. This version does the whole thing from scratch, which takes time but tastes completely different from any commercial version you\'ve tried.',
  base_servings: 4,
  time_min: 330,
  difficulty: 'intermediate',
  tags: ['indian', 'chicken', 'tomato', 'cream', 'curry'],
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Joshua Weissman',
    video_url: 'https://www.youtube.com/watch?v=mrDJ2K3JXsA',
    notes: 'Inspired by Joshua\'s from-scratch Indian dishes. Tikka marinade and makhani sauce method.',
  },
  emoji: '🍗',
  hero_fallback: fallback('#D4660A'),
  categories: { cuisines: ['indian'], types: ['chicken'] },
  whole_food_verified: true,
  total_time_minutes: 330,
  active_time_minutes: 45,
  equipment: [
    "Large ziplock bag or covered bowl for marinating",
    "Oven rack set over a baking tray (essential for the grill step — a flat tray won't char the underside)",
    "Heavy-based pot or Dutch oven for the sauce",
    "Stick blender or countertop blender",
    "Fine grater for ginger",
  ],
  before_you_start: [
    "Start with the marinade — ideally the night before. The chicken needs at least 4 hours. Overnight gives a noticeably better result: the spices penetrate deeper and the lactic acid does more work on the texture.",
    "The char on the chicken is not a mistake — it's the point. When you grill the marinated chicken, you want edges that look slightly burned. Those charred bits are the tikka quality that gives butter chicken its depth. A uniformly pale oven-roasted piece of chicken produces a flat result.",
    "Blend the sauce completely smooth. A stick blender in the pot is fine. The silk is non-negotiable — chunks of onion in butter chicken sauce are a different dish.",
  ],
  mise_en_place: [
    "Day before / 4+ hours ahead: combine all marinade ingredients into a paste, cut chicken thighs into large chunks (~5–6cm), coat thoroughly in marinade, cover and refrigerate.",
    "Day of, 30 minutes before cooking: take chicken out of the fridge to temper.",
    "Dice the onion finely; grate remaining ginger; slice remaining garlic.",
    "Measure spices, have stock ready nearby.",
    "Set oven rack to middle-high position for the grill step.",
  ],
  finishing_note: "Before plating, taste for three things: salt (it probably needs more), sweetness (an extra half teaspoon of honey if the tomatoes are acidic), and heat (a pinch of cayenne if it's too mild). The sauce should be thick enough to coat a spoon — if it's too thin, simmer uncovered 5 more minutes. Serve over basmati with naan alongside. A small swirl of extra cream on top cools the surface so the dish isn't scalding when it hits the table.",
  leftovers_note: "The sauce genuinely improves overnight — the spices integrate and the sweetness rounds out. Refrigerate for up to 3 days or freeze (sauce only, not rice) for 3 months. Reheat gently — don't boil, the cream can split. Add a splash of water when reheating.",

  ingredients: [
    { id: 'i1', name: 'Chicken thighs, boneless skinless', amount: 800, unit: 'g', scales: 'linear', prep: 'Cut into large chunks — smaller pieces dry out in the oven',
      substitutions: [
        { ingredient: 'Chicken breast', changes: 'Dries out more easily. Reduce oven time by 5 minutes and watch closely.', quality: 'compromise' },
      ],
    },
    { id: 'i2', name: 'Full-fat natural yoghurt', amount: 150, unit: 'g', scales: 'linear', prep: 'For the marinade',
      substitutions: [
        { ingredient: 'Buttermilk', changes: 'More liquid than yoghurt but the same lactic acid that tenderises the chicken. Use 120ml — it\'s thinner so you\'ll need less. Works very well.', quality: 'good_swap', quantity_note: 'use 120ml buttermilk per 150g yoghurt' },
        { ingredient: 'Coconut yoghurt', changes: 'Dairy-free. The lactic acid still tenderises. Subtle coconut flavour integrates into the marinade. Same amount.', quality: 'good_swap' },
      ],
    },
    { id: 'i3', name: 'Lemon juice', amount: 2, unit: 'tbsp', scales: 'fixed', prep: 'For the marinade',
      substitutions: [
        { ingredient: 'Lime juice', changes: 'More floral and slightly more acidic than lemon. Works identically in the marinade — a common variation in Indian cooking.', quality: 'great_swap' },
        { ingredient: 'White wine vinegar', changes: 'Sharper acid note. Use slightly less — it\'s more assertive than lemon juice.', quality: 'good_swap', quantity_note: 'use 1.5 tbsp white wine vinegar per 2 tbsp lemon juice' },
      ],
    },
    { id: 'i4', name: 'Garlic cloves', amount: 8, unit: '', scales: 'linear', prep: '4 for marinade, 4 for sauce',
      substitutions: [
        { ingredient: 'Garlic paste (1 tsp per clove)', changes: 'Convenient — blends smoothly into both the marinade and the sauce. Use 4 tsp in each. A reliable shortcut.', quality: 'good_swap', quantity_note: 'use 4 tsp garlic paste in the marinade and 4 tsp in the sauce' },
      ],
    },
    { id: 'i5', name: 'Fresh ginger', amount: 6, unit: 'cm', scales: 'fixed', prep: 'Half for marinade, half for sauce — grated',
      substitutions: [
        { ingredient: 'Ginger paste (from tube)', changes: 'Consistent and convenient. Use 1 tsp per cm of fresh ginger — 3 tsp for the marinade and 3 tsp for the sauce.', quality: 'good_swap', quantity_note: 'use 3 tsp ginger paste for marinade + 3 tsp for sauce' },
        { ingredient: 'Ground ginger', changes: 'Dried and less fresh-tasting. Use very sparingly — it\'s a completely different flavour profile to fresh.', quality: 'compromise', quantity_note: 'use ¼ tsp ground ginger per 1 cm fresh — last resort only' },
      ],
    },
    { id: 'i6', name: 'Kashmiri chilli powder', amount: 2, unit: 'tsp', scales: 'fixed', prep: 'For marinade — gives the deep red colour without excessive heat',
      substitutions: [
        { ingredient: 'Mild paprika + pinch of cayenne', changes: 'Less vibrant colour but similar warmth. Use 1.5 tsp sweet paprika + ¼ tsp cayenne pepper.', quality: 'good_swap', quantity_note: '1.5 tsp mild paprika + ¼ tsp cayenne per 2 tsp kashmiri chilli', hard_to_find: true, local_alternative: 'Indian grocers and some Woolworths stores carry Kashmiri chilli powder.' },
      ],
    },
    { id: 'i7', name: 'Garam masala', amount: 2, unit: 'tsp', scales: 'fixed' },
    { id: 'i8', name: 'Ground cumin', amount: 1, unit: 'tsp', scales: 'fixed' },
    { id: 'i9', name: 'Ground coriander', amount: 1, unit: 'tsp', scales: 'fixed' },
    { id: 'i10', name: 'Turmeric', amount: 0.5, unit: 'tsp', scales: 'fixed' },
    { id: 'i11', name: 'Salt', amount: 2, unit: 'tsp', scales: 'fixed' },
    { id: 'i12', name: 'Canned crushed tomatoes', amount: 400, unit: 'g', scales: 'linear', prep: 'For the makhani sauce',
      substitutions: [
        { ingredient: 'Fresh ripe tomatoes, roughly chopped (4 large)', changes: 'More vibrant and less cooked-tin flavour. Blanch and peel if you want a smoother sauce. Blending is essential.', quality: 'great_swap' },
        { ingredient: 'Tomato passata', changes: 'Already smooth — skip the blending step. Slightly sweeter and more concentrated. Use 350ml per 400g tin.', quality: 'great_swap', quantity_note: 'use 350ml passata per 400g tin' },
      ],
    },
    { id: 'i13', name: 'Unsalted butter', amount: 60, unit: 'g', scales: 'fixed', prep: 'Real butter — this is the makhani (butter) in the name',
      substitutions: [
        { ingredient: 'Ghee', changes: 'More concentrated butter flavour and higher smoke point. An excellent upgrade — richer result.', quality: 'great_swap' },
      ],
    },
    { id: 'i14', name: 'Double cream', amount: 150, unit: 'ml', scales: 'linear',
      substitutions: [
        { ingredient: 'Coconut cream', changes: 'Dairy-free and vegan. Subtly sweet with a faint coconut note that integrates well into the spiced tomato base. A popular variation.', quality: 'good_swap' },
        { ingredient: 'Full-fat natural yoghurt', changes: 'Less rich and tangier than cream. Stir in off heat only — it will curdle if it boils. Produces a lighter, healthier result.', quality: 'good_swap' },
        { ingredient: 'Thickened cream', changes: 'Australian cream with a slightly lower fat content than double cream. Same technique — identical result in practice.', quality: 'perfect_swap' },
      ],
    },
    { id: 'i15', name: 'Cardamom pods', amount: 4, unit: '', scales: 'fixed', prep: 'Lightly crushed' },
    { id: 'i16', name: 'Cloves', amount: 3, unit: '', scales: 'fixed' },
    { id: 'i17', name: 'Cinnamon stick', amount: 1, unit: 'small', scales: 'fixed' },
    { id: 'i18', name: 'Yellow onion', amount: 1, unit: 'large', scales: 'linear', prep: 'Finely diced — for the sauce',
      substitutions: [
        { ingredient: 'Brown onion', changes: 'The same as yellow onion in Australian supermarkets — direct swap. Finely dice and cook 10–12 minutes until deeply golden as the recipe states.', quality: 'perfect_swap' },
        { ingredient: 'Shallots (4 large), finely diced', changes: 'Sweeter and milder than brown onion. Caramelise faster — check at 8 minutes. The sauce will be slightly more delicate.', quality: 'great_swap', quantity_note: 'check at 8 minutes — shallots caramelise faster' },
        { ingredient: 'Red onion, finely diced', changes: 'Slightly sweeter than yellow. Works fine — the colour difference disappears after 10+ minutes of cooking and blending.', quality: 'great_swap' },
      ],
    },
    { id: 'i19', name: 'Neutral oil', amount: 2, unit: 'tbsp', scales: 'fixed',
      substitutions: [
        { ingredient: 'Ghee (additional, instead of butter + oil)', changes: 'Use 3 tbsp ghee total instead of the butter and oil combination. More concentrated butter flavour with a higher smoke point. An upgrade.', quality: 'great_swap' },
      ],
    },
    { id: 'i20', name: 'Honey', amount: 1, unit: 'tsp', scales: 'fixed', prep: 'Small amount to balance the tomato acid',
      substitutions: [
        { ingredient: 'Maple syrup', changes: 'Slightly more complex than honey. Same amount. Works identically.', quality: 'great_swap' },
        { ingredient: 'Date syrup', changes: 'Rich and complex. Adds a deeper sweetness than honey. Pairs exceptionally well with the Indian spice profile.', quality: 'great_swap', hard_to_find: true, local_alternative: 'Middle Eastern grocers and some health food stores.' },
        { ingredient: 'Jaggery (grated)', changes: 'Unrefined cane sugar used throughout South Asian cooking. Earthy, complex sweetness. Very appropriate in this context.', quality: 'great_swap', hard_to_find: true, local_alternative: 'Indian grocers. Widely used in Indian desserts and curries.' },
      ],
    },
  ],
  steps: [
    { id: 's1', title: 'Marinate the chicken — minimum 4 hours', content: 'Mix yoghurt, lemon juice, 4 crushed garlic cloves, half the grated ginger, kashmiri chilli, 1 tsp garam masala, cumin, coriander, turmeric, and 1 tsp salt into a paste. Coat chicken thoroughly. Cover and refrigerate 4 hours minimum — overnight is better.', timer_seconds: 14400, why_note: 'The yoghurt marinade does two things: the lactic acid tenderises the surface proteins, and the fat in the yoghurt helps the spices penetrate. Four hours is the minimum for flavour to reach the centre of large chicken pieces. Under-marinated chicken tastes of sauce, not of spiced chicken.' },
    { id: 's2', title: 'Grill or roast the chicken hard', content: 'Set oven to 230°C grill/broil. Spread marinated chicken on a rack over a baking tray — the rack is important, it lets heat circulate underneath. Grill 15–18 minutes, turning once, until charred at the edges and cooked through (75°C internal). Some burning is correct — you want those slightly charred bits.', timer_seconds: 1080, stage_note: 'Charred edges, not raw pink centres. Some blackened spots on the edges are the goal — this is the tikka quality.', why_note: 'The char is not a mistake — it\'s the tandoor effect. Those blackened proteins add a smoky, complex note to the sauce that butter and cream alone can\'t provide. Missing this step is why restaurant butter chicken often tastes flat.' },
    { id: 's3', title: 'Build the makhani sauce', content: 'In a heavy pot, melt butter with oil on medium. Add cardamom, cloves, and cinnamon — fry 30 seconds. Add onion and fry 10–12 minutes until deeply golden, stirring often. Add remaining garlic and ginger, fry 2 minutes. Add crushed tomatoes, remaining garam masala, and salt. Simmer 20 minutes until thick.', timer_seconds: 2040, why_note: 'The whole-spice blooming in butter-oil releases fat-soluble flavour compounds from the cardamom and cloves — this is what gives makhani sauce its complexity beyond just tomato and cream. The deep golden onion is also non-negotiable: pale onions give a raw, sharp flavour; deeply golden onions give sweetness and depth.' },
    { id: 's4', title: 'Blend the sauce smooth', content: 'Remove the cinnamon stick. Carefully blend the sauce until completely smooth — use a stick blender in the pot or carefully transfer to a blender in batches. This silky-smooth sauce is the signature.', why_note: 'Blending transforms the onion and tomato into an emulsified, restaurant-quality sauce. Many home versions skip this and end up chunky. A chunk of onion in butter chicken sauce is jarring.' },
    { id: 's5', title: 'Finish with cream, simmer with chicken', content: 'Return blended sauce to pot on low heat. Pour in cream and honey. Add the grilled chicken pieces — including any charred drips from the tray. Simmer gently 10 minutes. Taste and adjust salt. The sauce should be rich, slightly sweet, mildly spiced, and bright orange-red.', timer_seconds: 600, why_note: 'Cream goes in at the end — boiling after adding cream makes it split and grassy. The chicken simmers in the sauce to pick up flavour and soften the char, while the sauce picks up the smoky chicken drips. The honey balances the tomato\'s sharpness without making it noticeably sweet.' },
  ],
};

const BARRAMUNDI: Recipe = {
  id: 'barramundi-lemon-butter',
  title: 'Pan-Seared Barramundi, Lemon Butter',
  tagline: 'The Australian fish, done right — crispy skin, brown butter, capers',
  description: 'Barramundi is Australia\'s best fish — firm, sweet, and forgiving. The skin is the prize: when properly pan-seared, it crisps like crackling. The lemon-caper brown butter is the classic accompaniment and the whole thing comes together in 12 minutes.',
  base_servings: 4,
  time_min: 20,
  difficulty: 'beginner',
  tags: ['australian', 'fish', 'seafood', 'quick', 'pan-fry'],
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Hone Kitchen',
    notes: 'Original in-house recipe. The dry-skin technique is standard professional kitchen practice.',
  },
  emoji: '🐟',
  hero_fallback: fallback('#4A8090'),
  categories: { cuisines: ['australian'], types: ['seafood'] },
  whole_food_verified: true,
  total_time_minutes: 50,
  active_time_minutes: 15,
  equipment: [
    "Stainless steel or cast iron pan — NOT non-stick (you need direct contact heat)",
    "Fish spatula (thin and flexible — for flipping without breaking the fillet)",
    "Wire rack set over a baking tray (for skin drying)",
    "Ladle or large spoon (for basting and spooning butter sauce)",
    "Kitchen thermometer — optional, target 60°C internal",
  ],
  before_you_start: [
    "Dry the skin 30 minutes before cooking. This is the whole technique. Wet skin steams against the pan and never crisps. Set a timer and put the fillets skin-side up on a rack in the fridge, uncovered.",
    "Don't touch the fish while the skin is searing. It will stick initially, then release naturally when the skin is ready. Lifting it early tears the skin and ruins the crust. Set a timer for 5 minutes and step back.",
    "Brown butter happens fast — watch it. The butter goes from golden to burnt in about 30 seconds at the end. Have your lemon juice measured and ready to stop the browning the moment you see the right colour.",
  ],
  mise_en_place: [
    "30 minutes before cooking: pat fillets completely dry with paper towel, place skin-side up on a wire rack over a tray. Put in the fridge uncovered.",
    "Just before cooking: pat skin one more time — any remaining moisture will pop and spit in the hot pan.",
    "Season skin side with salt and white pepper immediately before placing in the pan — not before.",
    "Squeeze lemon juice into a small bowl and have it ready — this stops the butter browning when you add it.",
    "Pat capers completely dry — wet capers in hot butter spit violently.",
    "Slice garlic thinly; roughly chop parsley.",
  ],
  finishing_note: "Taste the brown butter sauce before plating. It should be nutty, bright from the lemon, salty from the capers, and rounded from the garlic. If it's too sharp, a small extra knob of cold butter whisked in will soften it. Plate the fish skin-side up always — never rest the crispy skin on a plate. Spoon the sauce over generously and eat immediately.",
  leftovers_note: "Pan-seared fish is not a leftover dish. The skin goes flabby within 10 minutes and cannot be revived. If you have leftover fish, flake it cold into a salad the next day — but the crispy skin experience is gone.",

  ingredients: [
    { id: 'i1', name: 'Barramundi fillets, skin-on', amount: 4, unit: '180g portions', scales: 'linear', prep: 'Pat completely dry with paper towel — the dryer the skin, the crispier it gets',
      substitutions: [
        { ingredient: 'Snapper fillets, skin-on', changes: 'Slightly more delicate and sweeter than barramundi. Same technique. One of the best Australian fish for pan-searing.', quality: 'great_swap' },
        { ingredient: 'Salmon fillets, skin-on', changes: 'Richer and more assertive flavour — highly fatty skin needs slightly lower heat (medium rather than high) to render without burning.', quality: 'good_swap', quantity_note: 'use medium-high heat instead of high — salmon skin is fattier and burns faster' },
        { ingredient: 'Kingfish fillets, skin-on', changes: 'Premium Australian choice. Firm, sweet, and richly flavoured. Treat identically to barramundi.', quality: 'great_swap' },
        { ingredient: 'Flathead fillets, skin-on', changes: 'Delicate, white, and sweet — classic Australian fish. Slightly thinner than barramundi so check at 4 minutes rather than 5–6.', quality: 'great_swap', quantity_note: 'check at 4 minutes skin-side — flathead is thinner than barramundi' },
      ],
    },
    { id: 'i2', name: 'Unsalted butter', amount: 80, unit: 'g', scales: 'fixed', prep: 'Divided: 20g for the pan, 60g for the butter sauce',
      substitutions: [
        { ingredient: 'Clarified butter (ghee)', changes: 'Higher smoke point — less risk of burning in the initial hot sear. Equally nutty when browned. A practical improvement for this high-heat application.', quality: 'great_swap' },
        { ingredient: 'Salted butter', changes: 'Reduce or eliminate added salt in the dish. The lemon-caper-butter sauce will be quite salty with salted butter — taste before seasoning.', quality: 'good_swap', quantity_note: 'reduce or skip added salt — salted butter adds significant sodium' },
      ],
    },
    { id: 'i3', name: 'Neutral oil', amount: 2, unit: 'tbsp', scales: 'fixed', prep: 'Mixed with butter in the pan to raise the smoke point' },
    { id: 'i4', name: 'Capers', amount: 2, unit: 'tbsp', scales: 'fixed', prep: 'Rinsed and patted dry — wet capers spit violently in hot butter',
      substitutions: [
        { ingredient: 'Cornichons, finely chopped', changes: 'More vinegary and less salty than capers. Adds the same acidic brightness. Use the same amount.', quality: 'good_swap' },
        { ingredient: 'Green olives, pitted and roughly chopped', changes: 'Brininess with more body than capers. Slightly oily — pat them dry. Changes the sauce character toward Mediterranean.', quality: 'good_swap' },
      ],
    },
    { id: 'i5', name: 'Lemon', amount: 2, unit: '', scales: 'fixed', prep: '1 juiced, 1 sliced into rounds for garnish',
      substitutions: [
        { ingredient: 'Lime', changes: 'More floral and tropical than lemon. Works very well with barramundi — a natural Australian pairing. The garnish rounds are smaller but the visual impact is similar.', quality: 'great_swap' },
      ],
    },
    { id: 'i6', name: 'Garlic cloves', amount: 2, unit: '', scales: 'fixed', prep: 'Thinly sliced' },
    { id: 'i7', name: 'Flat-leaf parsley', amount: 1, unit: 'small handful', scales: 'fixed', prep: 'Roughly chopped',
      substitutions: [
        { ingredient: 'Fresh dill', changes: 'Classic pairing with fish. Sweet, anise-like, and delicate. Don\'t add with heat — stir in off heat like the parsley.', quality: 'great_swap' },
        { ingredient: 'Fresh tarragon', changes: 'French classic with fish and brown butter. More assertive than parsley — use half the quantity.', quality: 'great_swap', quantity_note: 'use half the quantity — tarragon is more potent' },
      ],
    },
    { id: 'i8', name: 'Salt and white pepper', amount: 1, unit: 'tsp', scales: 'fixed', prep: 'Season skin-side only just before cooking — salt on skin too early draws moisture' },
    { id: 'i9', name: 'Asparagus, to serve', amount: 200, unit: 'g', scales: 'linear', prep: 'Blanched 2 minutes',
      substitutions: [
        { ingredient: 'Broccolini, blanched 2 minutes', changes: 'Slightly more bitter and robust than asparagus. Great with the brown butter.', quality: 'great_swap' },
        { ingredient: 'Sugar snap peas', changes: 'Sweet and crunchy. Blanch 90 seconds only to keep the snap. A lighter, fresher garnish.', quality: 'great_swap' },
      ],
    },
  ],
  steps: [
    { id: 's1', title: 'Dry the fish thoroughly', content: 'At least 30 minutes before cooking, lay the fillets skin-side up on a wire rack over a tray. Pat with paper towel. Leave uncovered in the fridge — the cold, dry air desiccates the skin surface. This step is the difference between crispy and flabby.', timer_seconds: 1800, why_note: 'Fish skin contains a lot of moisture. That moisture vaporises when it hits the hot pan, creating steam between the skin and the pan surface — steam is what makes skin stick and stay pale. A completely dry skin contact-fries immediately, achieving the Maillard reaction that creates the crisp you want.' },
    { id: 's2', title: 'Get the pan properly hot', content: 'Heat a stainless steel or cast iron pan on high for 3 minutes. Add oil and 20g butter. The butter will foam immediately — wait for the foam to subside before adding fish. If the foam hasn\'t subsided in 30 seconds, it\'s not hot enough.', timer_seconds: 210, why_note: 'Butter foams as water evaporates. Once the foam subsides, the butter solids have started to colour — this is the exact right moment to add the fish. Add it too early (in the foam) and the skin steams; add it too late (butter browning) and the skin burns before the flesh is cooked.' },
    { id: 's3', title: 'Sear skin-side down — resist touching it', content: 'Season the skin side with salt and white pepper. Lay fillets in the pan skin-side down. Press firmly for 10 seconds with a spatula to prevent curling. Cook on high heat 5–6 minutes WITHOUT MOVING. The fish is ready to flip when the flesh is opaque about ¾ of the way up the side.', timer_seconds: 360, stage_note: 'Opacity rising ¾ up the fillet. Skin should be pulling away from the pan without sticking.', why_note: 'The long undisturbed sear is counterintuitive — it feels like it should be checked. But lifting the fish before the skin has fully rendered and crisped means it tears and sticks. The skin releases naturally when it\'s ready. The 5–6 minutes completes about 85% of the cooking — the residual heat after flipping finishes the rest.' },
    { id: 's4', title: 'Flip and finish briefly', content: 'Flip the fillets flesh-side down. Cook 60–90 seconds only. Remove to a warm plate, skin-side up — never rest fish on the crispy side or it steams against the plate.', timer_seconds: 90, why_note: 'Barramundi is done when it just flakes at the thickest point — about 60°C internal. The flesh side needs almost no time because it\'s already 85% cooked from the skin-side sear. Resting skin-side up preserves the crispiness by allowing steam to escape upwards instead of condensing against a plate.' },
    { id: 's5', title: 'Make brown butter and plate', content: 'Turn heat to medium. Add remaining 60g butter to the pan — it will foam. Add garlic slices and cook 30 seconds, then add capers. When butter turns golden-brown and smells nutty — about 90 seconds — remove from heat. Add lemon juice. It will spit. Spoon over the fish. Scatter parsley.', timer_seconds: 90, stage_note: 'Butter should be golden-brown with a nutty smell — not dark brown or black. It happens fast.', why_note: 'Beurre noisette — brown butter — has a nutty, toffee-like flavour created by Maillard reactions in the milk solids. It\'s completely different from plain melted butter. Adding the lemon juice off-heat stops the browning instantly and deglazes any good bits from the pan.' },
  ],
};

const PAVLOVA: Recipe = {
  id: 'pavlova',
  title: 'Australian Pavlova',
  tagline: 'Crunchy shell, marshmallow centre, fresh cream and fruit — the national dessert',
  description: 'The meringue debate (Australia vs. New Zealand) is amusing but beside the point. What matters is the technique: getting that shatteringly crisp outer shell with the gooey, sticky marshmallow centre that makes pavlova what it is. Most failures come from oven temperature and humidity — address both and it\'s not as difficult as it seems.',
  base_servings: 1,
  yield_unit: 'pavlova',
  time_min: 150,
  difficulty: 'intermediate',
  tags: ['australian', 'dessert', 'meringue', 'cream', 'fruit'],
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Donna Hay',
    video_url: 'https://www.youtube.com/watch?v=qknVSyzmuo4',
    notes: 'Technique from Donna Hay\'s pavlova masterclass. The cornflour-and-vinegar method is the standard Australian pavlova approach.',
  },
  emoji: '🍓',
  hero_fallback: fallback('#F5F0E8'),
  categories: { cuisines: ['australian'], types: ['baking'] },
  whole_food_verified: true,
  total_time_minutes: 210,
  active_time_minutes: 30,
  equipment: [
    "Stand mixer or hand mixer — cannot be done by hand",
    "Large glass or stainless steel bowl (NOT plastic — fat absorbs into plastic)",
    "Cut lemon for wiping equipment",
    "Baking tray lined with baking paper",
    "Palette knife or large spoon for shaping",
    "Sifter for cornflour",
  ],
  before_you_start: [
    "Conventional oven, not fan. Fan creates uneven airflow that can brown the meringue unevenly or cause it to collapse. If your oven only has fan mode, reduce temperature by 10°C and watch closely.",
    "Grease is the enemy. Any trace of fat — even residue from dish soap in the bowl or yolk in the whites — will prevent the egg white foam from forming. Wipe your bowl and whisk with a piece of cut lemon before you start, then dry thoroughly.",
    "Don't make this on a humid day. Australian summer humidity and pavlova are enemies — the meringue absorbs moisture and weeps. Best made in dry weather. If it's muggy, run the air conditioning in the kitchen.",
  ],
  mise_en_place: [
    "Separate eggs at least 30 minutes before — room temperature whites whip to greater volume than cold.",
    "Wipe bowl and whisk with cut lemon, dry thoroughly.",
    "Draw a 22cm circle on baking paper, flip ink-side down onto the tray.",
    "Preheat conventional oven to 150°C (no fan).",
    "Measure caster sugar into a bowl ready to add gradually.",
    "Sift cornflour into a small bowl.",
    "Have fruit washed and prepared — but don't hull strawberries or slice kiwi until just before serving.",
  ],
  finishing_note: "Taste the whipped cream before it goes on — it should be lightly sweet. The pavlova itself is very sweet; the cream needs to balance it. The final dish should have: sweetness (meringue), richness (cream), tang (passionfruit), freshness (strawberries), and slight earthiness (kiwi). Top no more than 30 minutes before serving — the cream begins to soften the shell underneath.",
  leftovers_note: "Untopped meringue keeps in an airtight container for 2 days in dry conditions. Do not refrigerate — the moisture ruins the shell. Once topped with cream and fruit, serve within 1–2 hours. Make the meringue ahead; assemble just before serving.",

  ingredients: [
    { id: 'i1', name: 'Egg whites, at room temperature', amount: 6, unit: 'large', scales: 'linear', prep: 'Separated at least 30 minutes before — warm egg whites whip to greater volume than cold ones',
      substitutions: [
        { ingredient: 'Aquafaba (chickpea liquid)', changes: 'Vegan substitute. Use 45ml per egg white. Whips to a stable meringue but marshmallow centre is less pronounced.', quality: 'compromise' },
      ],
    },
    { id: 'i2', name: 'Caster sugar', amount: 300, unit: 'g', scales: 'linear', prep: 'Must be superfine — granulated sugar doesn\'t dissolve and leaves a grainy meringue',
      substitutions: [
        { ingredient: 'Blitz regular white sugar in blender 30 seconds', changes: 'Creates a superfine sugar. No difference in result.', quality: 'good_swap' },
      ],
    },
    { id: 'i3', name: 'White wine vinegar', amount: 1, unit: 'tsp', scales: 'fixed', prep: 'Acid stabilises the meringue and contributes to the marshmallow centre',
      substitutions: [
        { ingredient: 'Cream of tartar', changes: 'A more potent stabiliser — use less. Same marshmallow effect.', quality: 'great_swap', quantity_note: 'use ¼ tsp cream of tartar per 1 tsp white wine vinegar' },
        { ingredient: 'Fresh lemon juice', changes: 'Works identically to white wine vinegar. Same amount.', quality: 'perfect_swap' },
      ],
    },
    { id: 'i4', name: 'Cornflour', amount: 2, unit: 'tsp', scales: 'fixed', prep: 'Creates the marshmallow interior — do not skip',
      substitutions: [
        { ingredient: 'Arrowroot powder', changes: 'Gluten-free alternative. Same marshmallow result. Use the same amount.', quality: 'perfect_swap' },
      ],
    },
    { id: 'i5', name: 'Vanilla extract', amount: 1, unit: 'tsp', scales: 'fixed',
      substitutions: [
        { ingredient: 'Vanilla bean paste', changes: 'More intense vanilla flavour with visible seeds. Use the same amount. An upgrade.', quality: 'great_swap' },
      ],
    },
    { id: 'i6', name: 'Double cream', amount: 400, unit: 'ml', scales: 'linear', prep: 'Cold — whip to soft peaks just before serving',
      substitutions: [
        { ingredient: 'Thickened cream', changes: 'Australian standard whipping cream — behaves identically to double cream for this application. Direct swap.', quality: 'perfect_swap' },
      ],
    },
    { id: 'i7', name: 'Passionfruit', amount: 6, unit: '', scales: 'linear',
      substitutions: [
        { ingredient: 'Mango, diced', changes: 'Sweet and tropical — excellent in summer. No sourness to contrast the sweetness of the meringue, so add a squeeze of lime juice.', quality: 'great_swap' },
        { ingredient: 'Lemon curd', changes: 'Intensely sharp and tangy — a spectacular contrast with the sweet meringue. Spoon it into the cream hollow instead of passionfruit.', quality: 'great_swap' },
      ],
    },
    { id: 'i8', name: 'Strawberries', amount: 250, unit: 'g', scales: 'linear', prep: 'Hulled, halved',
      substitutions: [
        { ingredient: 'Raspberries', changes: 'More tart and intensely flavoured than strawberries. Don\'t need to be cut. Visually stunning against white meringue.', quality: 'great_swap' },
        { ingredient: 'Mixed summer berries (blueberries, raspberries, blackberries)', changes: 'Variety of flavours and textures. The full summer berry pavlova — a classic option.', quality: 'great_swap' },
      ],
    },
    { id: 'i9', name: 'Kiwi fruit', amount: 2, unit: '', scales: 'linear', prep: 'Peeled, sliced',
      substitutions: [
        { ingredient: 'Banana, sliced', changes: 'Softer and sweeter than kiwi. Less visual contrast against the white cream. Add just before serving — banana browns fast.', quality: 'good_swap' },
        { ingredient: 'Green grapes, halved', changes: 'Similar colour and visual lightness to kiwi. Sweet rather than tart — pairs well with the passionfruit.', quality: 'good_swap' },
      ],
    },
    { id: 'i10', name: 'Icing sugar', amount: 1, unit: 'tbsp', scales: 'fixed', prep: 'To sweeten the cream' },
  ],
  steps: [
    { id: 's1', title: 'Set up the oven and prepare your equipment', content: 'Preheat oven to 150°C (not fan — fan creates uneven browning). Draw a 22cm circle on baking paper, flip it ink-side down onto a baking tray. Your bowl and whisk must be completely grease-free — wipe with a cut lemon and dry. Even a trace of fat collapses egg white foam.', why_note: 'Fat — even residual dish soap — disrupts the protein network that makes meringue foam. Egg white foam is stabilised by protein strands linking together; fat molecules insert between them and prevent bonding. The lemon-wipe is standard professional technique. The 150°C starting temperature sets the meringue without rapid browning.' },
    { id: 's2', title: 'Whip egg whites to soft peaks', content: 'Beat egg whites on medium speed until white and foamy with soft peaks — about 3 minutes. The peaks should curl over when you lift the whisk. Do not over-beat to stiff peaks at this stage.', timer_seconds: 180, stage_note: 'Soft peaks: the foam holds its shape but the tips curl over. Firm but not dry.', why_note: 'Starting the sugar addition at soft peaks (not foamy, not stiff) gives the optimal base. Too early and the sugar can\'t integrate; too late and the meringue becomes dry and grainy when the sugar is added.' },
    { id: 's3', title: 'Add sugar gradually', content: 'With the mixer running, add caster sugar one tablespoon at a time, waiting 30 seconds between each addition. The full process takes about 8 minutes. When all sugar is incorporated, the meringue should be thick, glossy, and completely smooth — rub a little between your fingers; no grittiness means the sugar has dissolved.', timer_seconds: 480, stage_note: 'Glossy, thick, and smooth. No sugar grit between your fingers.', why_note: 'Adding sugar too fast dilutes the protein network before it can stabilise. The gradual addition allows the sugar to dissolve completely and integrate into a stable foam. Dissolved sugar = smooth, glossy meringue. Undissolved sugar = grainy texture and weeping after baking.' },
    { id: 's4', title: 'Fold in the secret ingredients', content: 'By hand, gently fold in vinegar, cornflour, and vanilla. Fold just until combined — 8–10 strokes. No electric mixer here; the cornflour would collapse the structure.', why_note: 'Cornflour and vinegar together create the marshmallow interior — they interfere with full starch gelatinisation, creating a soft, sticky centre rather than a completely set meringue. Vinegar (acid) tightens the protein network, giving a crisper crust. Overmixing at this stage deflates the foam.' },
    { id: 's5', title: 'Shape and start baking, then lower temperature', content: 'Pile the meringue onto the traced circle. Shape with a spatula — build high sides and a slight hollow in the centre (for the cream later). Put in the oven at 150°C for 5 minutes, then WITHOUT OPENING THE DOOR reduce to 120°C. Bake 1 hour 20 minutes.', timer_seconds: 4800, why_note: 'The initial blast at 150°C sets the outer crust before the internal heat reduces. Opening the door to adjust temperature would cause collapse. The long, low bake dries the inside without browning the outside. The hollow in the centre is where the marshmallow and cream live.' },
    { id: 's6', title: 'Cool in the oven — do not rush this', content: 'Turn the oven off. Leave the pavlova inside with the door ajar for at least 1 hour — ideally 2. Do not remove it to cool on a bench. The gradual temperature drop is why it doesn\'t crack.', timer_seconds: 3600, why_note: 'Rapid temperature change is the main cause of pavlova cracking. The outer shell contracts faster than the interior when shocked by cool air. Oven-cooling keeps the exterior and interior cooling at the same rate. A cracked pavlova still tastes the same — but a cream top hides it if needed.' },
    { id: 's7', title: 'Top and serve', content: 'Just before serving (not hours ahead), whip cold cream with icing sugar to soft peaks. Spoon into the hollow. Top with passionfruit pulp, strawberries, and kiwi. Serve immediately — assembled pavlova doesn\'t hold more than an hour before the cream soaks in.', why_note: 'The cream softens the meringue from the base up over time. Assembled too early, the whole thing collapses into a sweet cream puddle. Beautiful pavlova has contrasting textures — crisp shell, marshmallow interior, cloud cream, fresh fruit. All of that requires last-minute assembly.' },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
//  Phase 2 batch — 6 new recipes from culinary-research files (2026-05-03)
// ────────────────────────────────────────────────────────────────────────────

const CHICKEN_SCHNITZEL: Recipe = {
  id: 'chicken-schnitzel',
  title: 'Chicken Schnitzel',
  tagline: "Crisp, golden, pub-classic — the schnitzel that earns its place on the plate.",
  description: "Schnitzel is German and Austrian by heritage — Wiener Schnitzel from Vienna, traditionally veal pounded thin and crumbed. Post-war migration carried the technique into Australian kitchens, where chicken became the everyday version and the country pub turned it into a national dish. This is the weeknight rendition: the brine keeps the chicken juicy, the double-coat gives the crunch, a single pan does the work.",
  base_servings: 4,
  time_min: 45,
  difficulty: 'beginner',
  tags: ['schnitzel', 'pub classic', 'crumbed', 'pan-fried', 'weeknight'],
  categories: { cuisines: ['australian'], types: ['chicken'] },
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Adam Liaw',
    video_url: 'https://www.smh.com.au/goodfood/recipes/adam-liaws-classic-chicken-schnitzel-20180206-h0vphi.html',
    notes: "Inspired by Adam Liaw's brined-then-crumbed approach. The brine and the double-coat are his; the rest is simplified for the weeknight kitchen.",
  },
  hero_fallback: fallback('#C8A96E'),
  whole_food_verified: true,
  leftover_mode: { extra_servings: 2, note: "Cold schnitzel sliced over a salad makes tomorrow's lunch" },
  total_time_minutes: 35,
  active_time_minutes: 25,
  equipment: [
    "Meat mallet or heavy rolling pin",
    "Cling film or zip-lock bag (to contain splatter)",
    "Three shallow dishes or trays (flour / egg / panko)",
    "Large heavy-based frying pan — cast iron ideal",
    "Instant-read cooking thermometer",
    "Wire rack set over a baking tray",
    "Tongs",
  ],
  before_you_start: [
    "Pound it even — 1–1.5 cm throughout. The mallet is not optional; an uneven breast means one end is dry and rubbery before the other is cooked.",
    "Shake off the flour before the egg. Let the egg drip before the panko. Excess at each stage creates heavy, doughy patches.",
    "Oil temperature is the signal, not the clock. 175°C before the first schnitzel goes in — too cold and the crust absorbs oil, too hot and it burns before the chicken cooks through.",
  ],
  mise_en_place: [
    "Place each breast between two sheets of cling film; pound to 1–1.5 cm throughout — about 60 seconds per breast working from the centre outwards.",
    "Pat breasts dry with paper towel; season directly on both sides with salt and white pepper.",
    "Set up breading station in order: Dish 1 plain flour / Dish 2 2 beaten eggs / Dish 3 panko spread flat.",
    "Set a wire rack over a baking tray next to the hob.",
    "Pour oil into the pan to 3–4 cm depth. Do not heat yet.",
  ],
  finishing_note: "Plate on warmed plates with two lemon quarters per person. Any gravy goes alongside in a jug — not poured over the top, which softens the crust. Taste the schnitzel plain first, then with lemon — the acid transforms it. The crust should shatter cleanly on a fork, not flex.",
  leftovers_note: "Refrigerate on a rack (not stacked) for up to 2 days. Reheat at 180°C on a wire rack, uncovered, 10–12 minutes — do not microwave or re-fry. Cold schnitzel is brilliant in a crusty roll with shredded iceberg, sliced tomato, and mayo. Freeze raw breaded schnitzels between sheets of baking paper; fry from frozen at 160°C, 6–7 minutes per side.",
  ingredients: [
    {
      id: 'chicken_breast', name: 'Chicken breast fillets, butterflied', amount: 800, unit: 'g',
      scales: 'linear', prep: 'Butterflied and lightly pounded to 1 cm thick',
      substitutions: [
        { ingredient: 'Chicken thigh fillets (boneless, skinless)', changes: 'Richer flavour, more forgiving if cooked a touch long. Cooks 1–2 minutes longer per side.', quality: 'great_swap' },
        { ingredient: 'Veal escalope', changes: 'This is the original Wiener Schnitzel meat. Lighter colour, faster cook.', quality: 'perfect_swap', quantity_note: 'Same weight per serve.' },
        { ingredient: 'Pork loin steak', changes: 'Closer to the central-European original. Slightly drier — extend the brine to 45 minutes.', quality: 'great_swap' },
      ],
    },
    {
      id: 'salt_brine', name: 'Table salt (for brine)', amount: 50, unit: 'g',
      scales: 'linear', prep: 'Dissolved in 1 L cold water',
      scaling_note: "Concentration matters, not volume. The brine is 5% salt by water (50 g salt per 1 L water). When scaling down to 1–2 schnitzels, keep the ratio: 250 ml water + 12.5 g salt. Don't dilute below 5%; the brine stops working.",
      substitutions: [
        { ingredient: 'Sea salt flakes', changes: 'No flavour difference at the brine stage. Flakes are less dense, so use 70 g per 1 L water.', quality: 'perfect_swap', quantity_note: 'Use 70 g per 1 L water.' },
        { ingredient: 'Skip the brine entirely', changes: 'Faster, but the chicken dries at the edges and the crumb crusts before the meat finishes. The brine is what separates pub-grade from average.', quality: 'compromise' },
      ],
    },
    {
      id: 'plain_flour', name: 'Plain flour', amount: 100, unit: 'g',
      scales: 'linear',
      scaling_note: 'Bowl quantity, not consumption. 100 g of dusting flour crumbs up to 8 schnitzels — most stays in the tray. For 1–2 serves, drop to 50 g.',
      substitutions: [
        { ingredient: 'Gluten-free plain flour blend', changes: "Coating still crisps. The crumb feels slightly sandier in the mouth — most people won't notice.", quality: 'good_swap' },
      ],
    },
    {
      id: 'eggs', name: 'Eggs, large', amount: 2, unit: 'whole',
      scales: 'linear', prep: 'Beaten with a splash of water',
      scaling_note: '2 eggs cover up to 6 schnitzels. Add a third only if crumbing 7 or more pieces. Egg is a coverage ingredient, not a per-piece one.',
    },
    {
      id: 'panko', name: 'Panko breadcrumbs', amount: 200, unit: 'g',
      scales: 'linear',
      scaling_note: 'Bowl quantity, not consumption. 200 g crumbs up to 8 schnitzels. For 1–2 serves, 100 g is enough.',
      substitutions: [
        { ingredient: 'Fresh white breadcrumbs (day-old sourdough, blitzed)', changes: 'Less uniform crunch, more rustic crust. Australian pubs use both styles.', quality: 'great_swap' },
        { ingredient: 'Dry breadcrumbs (the supermarket bottle)', changes: 'Smaller crumb, denser coating, slightly less crunch.', quality: 'good_swap' },
      ],
    },
    {
      id: 'parmesan_schnitz', name: 'Parmesan, finely grated', amount: 30, unit: 'g',
      scales: 'linear', prep: 'Mixed through the panko',
      substitutions: [
        { ingredient: 'Pecorino', changes: 'Sharper, saltier — cut the finishing salt by a small pinch.', quality: 'great_swap' },
        { ingredient: 'Omit', changes: 'More neutral crumb; lets the chicken speak. The parmesan is a flavour booster, not a structural ingredient.', quality: 'good_swap' },
      ],
    },
    {
      id: 'lemon_zest_schnitz', name: 'Lemon zest', amount: 1, unit: 'lemon',
      scales: 'fixed', cap: 2, prep: 'Mixed through the panko',
      substitutions: [
        { ingredient: 'Omit', changes: 'Crumb is less aromatic; still very good.', quality: 'good_swap' },
      ],
    },
    {
      id: 'frying_oil_schnitz', name: 'Neutral vegetable oil (rice bran or canola)', amount: 200, unit: 'ml',
      scales: 'custom', curve: { '1': 100, '2': 150, '4': 200, '6': 250, '8': 300 },
      prep: 'For shallow frying — depth-driven, see scaling notes',
      scaling_note: "Depth-driven, not serving-driven. The oil must sit at 1 cm depth in whatever pan you're using. A 24 cm pan needs 150–200 ml; a 30 cm pan needs 250–300 ml.",
      substitutions: [
        { ingredient: 'Ghee or clarified butter', changes: 'Richer, faster browning, slightly more savoury crust. Higher cost.', quality: 'great_swap' },
        { ingredient: 'Light olive oil (not extra virgin)', changes: 'Faint olive note in the crust. Works fine. Do not use extra virgin — it burns at frying temperature and the dish goes bitter.', quality: 'good_swap' },
      ],
    },
    {
      id: 'lemon_wedges_schnitz', name: 'Lemon, cut into wedges, to serve', amount: 1, unit: 'lemon',
      scales: 'fixed', cap: 6,
    },
    {
      id: 'flake_salt_schnitz', name: 'Sea salt flakes, to finish', amount: 5, unit: 'g',
      scales: 'fixed', cap: 5,
    },
  ],
  steps: [
    {
      id: 'step_1_brine', title: 'Brine the chicken',
      content: 'Dissolve the salt in 1 L of cold water in a bowl big enough to hold the chicken flat. Slip the butterflied breasts in, cover, and rest in the fridge for 30 minutes. The salt is doing two jobs: seasoning the inside of the meat, and restructuring the proteins so they hold onto moisture while the crumb has time to crisp.',
      stage_note: 'Brine for 30 minutes — no longer. Past 45 the texture turns slightly springy.',
      lookahead: 'While the brine works, set up your three-tray crumbing line.',
      timer_seconds: 1800,
      why_note: 'Salt brining is the line between juicy schnitzel and dry chicken under crumb. Without it, by the time the panko goes golden, the meat at the edges is already overcooked.',
    },
    {
      id: 'step_2_setup', title: 'Set up the crumbing line',
      content: "Three shallow trays, left to right. Tray one: plain flour. Tray two: beaten eggs with a splash of water. Tray three: panko, parmesan, and lemon zest, tossed with your fingers so the zest scatters evenly.",
      stage_note: 'Each tray wide enough to lay a whole breast flat without folding it.',
      lookahead: "You'll work left-to-right with one wet hand and one dry hand.",
      why_note: 'Flour gives the egg something to stick to. Egg gives the panko something to stick to. Skip a layer and the crust falls off in the pan.',
    },
    {
      id: 'step_3_crumb', title: 'Crumb the chicken',
      content: "Pull a breast from the brine and pat it bone-dry with paper towel — wet chicken takes flour in patches. Coat in flour, shake the excess off. Drag through the egg, let the excess drip back into the tray. Press firmly into the panko on both sides — press, don't pat. You want the crumb embedded, not sitting on top.",
      stage_note: 'Crumb is even all the way to the edges, no bald patches.',
      lookahead: 'Rest the crumbed schnitzels on a wire rack for 5 minutes while the oil heats — this sets the coating.',
      why_note: 'A short rest after crumbing lets the egg start to set, which is why the crust survives the flip later.',
    },
    {
      id: 'step_4_heat_oil', title: 'Heat the oil',
      content: 'Pour the oil into a wide heavy-based frying pan to a depth of about 1 cm. Heat over medium-high. Drop in a few panko crumbs to test — they should sizzle steadily and turn golden in 25–30 seconds.',
      stage_note: 'A test crumb fizzes the moment it lands and turns golden in under 30 seconds. If it browns in 10, the oil is too hot — drop the heat for 30 seconds.',
      lookahead: 'Schnitzels go in one or two at a time, depending on pan size.',
      why_note: 'Panko at the right temperature shatters into glass-like crunch. Too cool and it drinks the oil and turns greasy; too hot and the crust burns before the chicken cooks through.',
    },
    {
      id: 'step_5_fry_first', title: 'Fry the first side',
      content: "Lay the schnitzels in away from you so any oil splashes back. Don't crowd — leave a thumb's width between them. Fry without touching for 2½ to 3 minutes.",
      stage_note: 'Lift one corner with tongs. Underside is deep golden — not pale, not mahogany.',
      lookahead: 'Flip once and only once.',
      timer_seconds: 165,
      why_note: 'Moving the schnitzel during frying breaks the crust away from the meat. Patience is what gives you the perfect even golden colour.',
    },
    {
      id: 'step_6_flip_finish', title: 'Flip and finish',
      content: "Flip carefully with tongs. Fry the second side for 2 minutes, then transfer to a wire rack set over a tray. The rack is non-negotiable — paper towel makes the bottom go soggy.",
      stage_note: "Both sides deep golden. Internal temperature 71 °C if you're checking, but at 1 cm thick, golden = done.",
      lookahead: 'Rest 2 minutes before plating — the crumb keeps crisping as it cools.',
      timer_seconds: 120,
      why_note: 'Resting on a rack lets steam escape from underneath. On a plate or paper towel, the steam re-condenses and ruins the crunch you just earned.',
    },
    {
      id: 'step_7_plate', title: 'Salt and plate',
      content: "Hit the schnitzel with sea salt flakes the moment it leaves the pan — flakes won't stick to a cooled crust. Plate with lemon wedges.",
      stage_note: 'Crumb shatters audibly when you cut it; chicken is opaque white through the centre with no pink.',
      why_note: 'Squeeze the lemon at the table, not in the kitchen. Citrus on hot crumb starts going soggy in seconds — this is the rule that separates pub-class schnitzel from cafe schnitzel.',
    },
  ],
};

const CHICKEN_VEG_STIR_FRY: Recipe = {
  id: 'chicken-vegetable-stir-fry',
  title: 'Easy Chicken & Vegetable Stir-Fry',
  tagline: 'Twenty minutes, one wok, the takeaway taste at home.',
  description: "Stir-fry comes from southern China — Cantonese kitchens with screaming-hot woks and the smoky char called wok hei that defines a great one. The technique travelled with Chinese migration into Australia from the 1850s gold rushes onwards, and the weeknight chicken-and-vegetable version below is what most Australian households cook on a Tuesday night. Velveting — the cornflour-and-soy slick on the chicken before it hits the wok — is the trick that takes a home stir-fry from average to takeaway-grade.",
  base_servings: 4,
  time_min: 25,
  difficulty: 'beginner',
  tags: ['stir-fry', 'wok', 'weeknight', 'velveting', '20-minute'],
  categories: { cuisines: ['chinese', 'australian'], types: ['chicken'] },
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Nagi Maehashi',
    video_url: 'https://www.recipetineats.com/chicken-stir-fry/',
    notes: "Inspired by Nagi Maehashi's all-purpose stir-fry sauce. The 'velveting' step (cornflour + soy on the chicken before cooking) is the technique that makes home stir-fries taste like takeaway, and it's the one technique she's drilled into Australian home cooks via RecipeTinEats.",
  },
  hero_fallback: fallback('#5C7A3E'),
  whole_food_verified: true,
  leftover_mode: { extra_servings: 2, note: 'Excellent next-day lunch — reheat fast in a hot pan, never the microwave or the chicken goes rubbery' },
  total_time_minutes: 25,
  active_time_minutes: 20,
  equipment: [
    "Wok (carbon steel preferred) or large heavy-based frying pan — not non-stick",
    "Sharp knife and chopping board",
    "Small bowl for the pre-mixed sauce",
    "Small bowl for the cornflour slurry",
    "Tongs or wok spatula",
  ],
  before_you_start: [
    "Everything goes in fast once the heat is on — prep is everything. Have every vegetable cut, every sauce measured, and the cornflour slurry made before you turn on the heat.",
    "High heat is the whole game. Work in smaller batches — crowding the pan drops the temperature and steams the vegetables instead of searing them.",
    "Velveting makes the chicken silky. A 10-minute soak in cornflour and soy sauce keeps it tender rather than rubbery at high heat. Don't skip it.",
  ],
  mise_en_place: [
    "Slice the chicken into 5 mm strips; toss with 1 tbsp cornflour and 1 tsp soy sauce. Set aside 10 minutes — this is the velveting step.",
    "Cut all vegetables: broccoli into small florets, carrot into thin batons, capsicum into strips. Keep them grouped — they go in at different times.",
    "Slice garlic. Grate ginger. Separate spring onion whites and greens into different piles.",
    "Mix the sauce in a small bowl: oyster sauce + light soy + sugar + water. Stir to dissolve.",
    "Mix the slurry in another small bowl: 1 tsp cornflour + 2 tbsp cold water. Stir until no lumps.",
    "Start the rice if using — stir-fry moves fast and the rice needs to be ready when the wok finishes.",
  ],
  finishing_note: "Serve immediately over steamed rice. Taste before plating — the sauce should be savoury and slightly sweet with a background of sesame. If it tastes flat, add a few drops more soy sauce. If one-dimensional, a few drops of rice wine vinegar or a wedge of lime wakes it up. Vegetables should have colour and slight bite — not soft.",
  leftovers_note: "Refrigerates well for up to 2 days. The sauce will absorb into the vegetables and texture softens — still good, just different. Reheat in a wok or frying pan over high heat with a splash of water, 2 minutes. Cold leftover stir-fry tossed through noodles or fried rice the next day is excellent — don't bin it.",
  ingredients: [
    {
      id: 'chicken_thigh', name: 'Chicken thigh fillets, boneless skinless', amount: 600, unit: 'g',
      scales: 'linear', prep: 'Sliced 1 cm thick across the grain',
      substitutions: [
        { ingredient: 'Chicken breast', changes: 'Drier than thigh — be strict on the timing or it overcooks. Velveting helps.', quality: 'good_swap', quantity_note: 'Same weight, slice slightly thinner.' },
        { ingredient: 'Firm tofu (extra-firm, pressed)', changes: 'Different dish in spirit but works on its own terms. Skip the velveting; pan-fry the tofu first to crisp the edges.', quality: 'good_swap', quantity_note: 'Use 500 g; tofu is denser per bite.' },
        { ingredient: 'Beef (rump or flank)', changes: 'Slice thinner across the grain. Velveting is even more important — beef can turn chewy fast.', quality: 'great_swap', quantity_note: 'Same weight.' },
      ],
    },
    {
      id: 'cornflour_velvet', name: 'Cornflour (for velveting the chicken)', amount: 2, unit: 'tsp',
      scales: 'linear', prep: 'Tossed through the chicken',
    },
    {
      id: 'soy_velvet', name: 'Light soy sauce (for velveting)', amount: 1, unit: 'tbsp',
      scales: 'linear', prep: 'Tossed through the chicken',
    },
    {
      id: 'peanut_oil', name: 'Peanut oil (or other high-smoke-point oil)', amount: 3, unit: 'tbsp',
      scales: 'linear',
      scaling_note: 'Wok-coverage, not per-serve. 3 tbsp slicks any household wok. For 2 serves, 2 tbsp; for 8, 4 tbsp. More oil makes the dish greasy without cooking it better.',
      substitutions: [
        { ingredient: 'Rice bran oil', changes: 'No flavour difference, identical smoke point.', quality: 'perfect_swap' },
        { ingredient: 'Vegetable oil (canola)', changes: 'Slightly less aromatic. Functions identically.', quality: 'good_swap' },
      ],
    },
    {
      id: 'garlic_stirfry', name: 'Garlic cloves', amount: 3, unit: 'cloves',
      scales: 'fixed', cap: 6, prep: 'Finely chopped',
    },
    {
      id: 'ginger_stirfry', name: 'Fresh ginger', amount: 20, unit: 'g',
      scales: 'linear', prep: 'Finely chopped',
    },
    {
      id: 'onion_stirfry', name: 'Brown onion', amount: 1, unit: 'medium',
      scales: 'fixed', cap: 2, prep: 'Sliced into wedges',
    },
    {
      id: 'capsicum_red', name: 'Red capsicum', amount: 1, unit: 'medium',
      scales: 'linear', prep: 'Sliced into 1 cm strips',
      substitutions: [
        { ingredient: 'Yellow or green capsicum', changes: 'Green is more vegetal; yellow milder and sweeter. Visual change only.', quality: 'perfect_swap' },
        { ingredient: 'Snow peas', changes: 'Lighter dish, more crunch.', quality: 'great_swap' },
      ],
    },
    {
      id: 'broccoli', name: 'Broccoli', amount: 400, unit: 'g',
      scales: 'linear', prep: 'Cut into small florets',
      substitutions: [
        { ingredient: 'Broccolini (asparation)', changes: 'Slightly more elegant; same flavour. Cooks 30 seconds faster.', quality: 'perfect_swap' },
        { ingredient: 'Snow peas + bok choy', changes: 'Different texture — crisper, more delicate. Add bok choy at the very end so the leaves wilt and stems stay crunchy.', quality: 'great_swap' },
      ],
    },
    {
      id: 'carrot_stirfry', name: 'Carrot', amount: 1, unit: 'medium',
      scales: 'linear', prep: 'Sliced into thin batons',
    },
    {
      id: 'spring_onion', name: 'Spring onions', amount: 4, unit: 'stalks',
      scales: 'linear', prep: 'Cut into 4 cm lengths, white and green separated',
    },
    {
      id: 'oyster_sauce', name: 'Oyster sauce', amount: 3, unit: 'tbsp',
      scales: 'linear',
      substitutions: [
        { ingredient: 'Vegetarian mushroom oyster sauce (Lee Kum Kee)', changes: 'Slightly earthier, less mineral. Most people cannot tell.', quality: 'great_swap', local_alternative: 'Asian grocers and large Coles/Woolworths.' },
        { ingredient: 'Skip and double the soy', changes: 'Loses the body and umami glaze. The dish becomes simpler — still good, no longer takeaway-style.', quality: 'compromise' },
      ],
    },
    {
      id: 'soy_sauce', name: 'Light soy sauce', amount: 2, unit: 'tbsp',
      scales: 'linear',
    },
    {
      id: 'shaoxing_wine', name: 'Chinese cooking wine (Shaoxing)', amount: 2, unit: 'tbsp',
      scales: 'linear',
      substitutions: [
        { ingredient: 'Dry sherry', changes: 'Almost identical — many AU restaurants substitute either way.', quality: 'great_swap', hard_to_find: true, local_alternative: "If you can't find Shaoxing at your supermarket, dry sherry is at every bottle shop." },
        { ingredient: 'Mirin', changes: 'Sweeter, less savoury. The dish leans Japanese in flavour. Reduce the soy slightly to compensate.', quality: 'compromise' },
        { ingredient: 'Skip', changes: 'Sauce is flatter. Add a teaspoon of rice vinegar at the end to wake it up.', quality: 'compromise' },
      ],
    },
    {
      id: 'sesame_oil', name: 'Sesame oil', amount: 1, unit: 'tsp',
      scales: 'fixed', cap: 2,
      prep: 'Off the heat at the end',
      scaling_note: 'Finishing oil only. 1 tsp is right for any reasonable batch; 2 tsp is the upper limit. Doubling it makes the dish taste like sesame, not chicken.',
    },
    {
      id: 'cornflour_sauce', name: 'Cornflour (to thicken sauce)', amount: 1, unit: 'tsp',
      scales: 'linear', prep: 'Whisked with 2 tbsp water',
    },
    {
      id: 'steamed_rice', name: 'Steamed jasmine rice, to serve', amount: 1, unit: 'cup per serve',
      scales: 'linear', prep: 'Cooked separately',
    },
  ],
  steps: [
    {
      id: 'step_1_velvet', title: 'Velvet the chicken',
      content: 'In a bowl, toss the sliced chicken with the cornflour and the 1 tablespoon of soy. Massage it with your hands for 30 seconds — every piece should look glossy and slick. Set aside while you prep the vegetables.',
      stage_note: 'Chicken looks coated and shiny, no dry patches.',
      lookahead: 'While it sits, get every vegetable cut and lined up beside the wok.',
      why_note: 'Velveting is what makes home stir-fries taste like the takeaway. The cornflour creates a thin barrier that stops the chicken from drying out when it hits the screaming-hot wok, and the soy seasons the meat from the surface in.',
    },
    {
      id: 'step_2_mise', title: 'Line up the wok station',
      content: "Stir-fry cooks in minutes — every ingredient needs to be cut and within arm's reach before the wok goes on. Whisk the oyster sauce, light soy, Shaoxing wine, and the cornflour-water slurry together in a small jug. Have the rice already cooked and warm.",
      stage_note: 'Vegetables in piles by cooking order: aromatics (garlic, ginger, white spring onion), then onion and carrot, then capsicum and broccoli, then green spring onion last.',
      lookahead: "From the moment the wok hits the heat, you won't have time to chop. This step is the difference between a clean stir-fry and a panicked one.",
      why_note: "This is what professional kitchens call mise en place. For stir-fry it's not optional — the cooking window is 4 minutes total.",
    },
    {
      id: 'step_3_sear_chicken', title: 'Sear the chicken hot and fast',
      content: 'Heat the wok over the highest flame your stovetop will give until you see the first wisp of smoke. Add 2 tablespoons of the peanut oil — it should shimmer immediately. Add the chicken in one layer and leave it. Do not stir for 30 seconds.',
      stage_note: 'Chicken sizzles loudly the moment it lands. The bottoms turn opaque and start to colour after 30 seconds.',
      lookahead: 'After the first 30 seconds, toss for another minute until the chicken is just cooked through, then tip it onto a plate. It finishes cooking later in the sauce.',
      timer_seconds: 90,
      why_note: 'The wok must be screaming hot before the protein goes in — this is what gives you wok hei, the smoky char that defines a good stir-fry. A medium pan steams the chicken instead of searing it.',
    },
    {
      id: 'step_4_aromatics', title: 'Aromatics into the hot wok',
      content: 'Drop the heat to medium-high. Add the last tablespoon of peanut oil, then the garlic, ginger, and the white parts of the spring onion. Toss continuously for 20 seconds.',
      stage_note: 'Aromatics smell sharp and toasted, garlic is pale gold — not brown. If garlic browns it goes bitter and the dish is poisoned.',
      lookahead: 'Vegetables are next, in order from hardest to softest.',
      timer_seconds: 20,
      why_note: 'Garlic, ginger and spring onion bloom in oil — their flavour compounds are fat-soluble and need this brief hot-oil moment to release. But the line between bloomed and burnt is about 15 seconds.',
    },
    {
      id: 'step_5_vegetables', title: 'Vegetables, hardest to softest',
      content: 'Add the onion and carrot first. Toss for 1 minute. Add the broccoli and capsicum. Toss for another 2 minutes — keep everything moving.',
      stage_note: 'Vegetables are vibrant in colour, with edges just starting to char. Broccoli is bright green, not olive. Capsicum still has bite.',
      lookahead: 'Chicken comes back in next, then sauce.',
      timer_seconds: 180,
      why_note: 'Stir-fry is about texture as much as flavour. Vegetables that go soft are vegetables that have given up — keep the heat high and the pan moving.',
    },
    {
      id: 'step_6_sauce', title: 'Return the chicken and sauce the wok',
      content: 'Tip the chicken back in along with any juices on the plate. Give the sauce jug one more whisk (the cornflour will have settled) and pour it down the side of the wok so it hits hot metal first.',
      stage_note: 'Sauce bubbles up, foams briefly, then thickens into a glossy coating that clings to every piece.',
      lookahead: 'Toss for 30 seconds to coat everything evenly. Off the heat: drizzle the sesame oil and scatter the green spring onion.',
      timer_seconds: 30,
      why_note: 'Pouring the sauce down the side of the wok flash-evaporates the alcohol from the Shaoxing and lets the cornflour activate against hot metal — this is what gives the sauce its glossy body in seconds rather than minutes.',
    },
    {
      id: 'step_7_serve', title: 'Plate and eat now',
      content: 'Spoon over hot jasmine rice and serve immediately. Stir-fry waits for nobody — every minute on the bench, the vegetables steam in their own residual heat and the texture goes downhill.',
      stage_note: 'Sauce is glossy, vegetables vibrant, chicken slippery and tender.',
      why_note: "This is why takeaway stir-fries are always sent in foil-vented containers — the kitchens know steam is the enemy. At home, plate it and call everyone to the table.",
    },
  ],
};

const BEEF_LASAGNE: Recipe = {
  id: 'beef-lasagne',
  title: 'Beef Lasagne',
  tagline: 'Slow ragù, silky béchamel, sheets that drink the sauce — the lasagne worth the afternoon.',
  description: "Lasagne alla bolognese is from Emilia-Romagna, the rich-cooking region of northern Italy centred on Bologna. The defining element is the ragù — meat slowly braised in milk, wine, and tomato — codified in English-language kitchens by Marcella Hazan in the early 1990s. Italian migration to Australia after the Second World War brought the dish into Australian homes, where the Sunday lasagne tray became a cross-cultural household standard. This version stays close to Hazan's milk-first ragù; the assembly is the way most Australian families build it — most of the work is the wait, and the wait is what makes it taste like Bologna and not a tray of mince.",
  base_servings: 6,
  time_min: 180,
  difficulty: 'intermediate',
  tags: ['lasagne', 'bolognese', 'ragù', 'béchamel', 'weekend cooking', 'family-sized'],
  categories: { cuisines: ['italian'], types: ['beef', 'pasta'] },
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Marcella Hazan',
    video_url: 'https://www.nytimes.com/recipes/12869/marcella-hazans-bolognese-meat-sauce.html',
    notes: "The ragù is Marcella Hazan's classic Bolognese — milk first, wine after, long slow simmer. The lasagne assembly is the home-cook approach Australian families have built around her ragù for forty years. We are not pretending the lasagne stack is a Hazan original; the ragù is.",
  },
  hero_fallback: fallback('#8B3A2A'),
  whole_food_verified: true,
  leftover_mode: { extra_servings: 2, note: 'Lasagne is better the next day. The slices set firm overnight and reheat cleanly in a 180 °C oven for 15 minutes' },
  total_time_minutes: 210,
  active_time_minutes: 45,
  equipment: [
    "Large heavy-based pot or Dutch oven (for the ragù)",
    "Medium saucepan (for the béchamel)",
    "Deep baking dish, approximately 30 × 20 cm",
    "Whisk (for béchamel)",
    "Wooden spoon or spatula",
  ],
  before_you_start: [
    "The ragù is the dish. A rushed 45-minute bolognese makes thin, acidic lasagne. Three hours on the lowest possible heat with milk added early — Marcella Hazan insisted on this and she was right.",
    "Build in layers, not heaps — thin, even layers of sauce and béchamel between each pasta sheet. Even layers equal even cooking and clean cuts.",
    "Rest before cutting. 15 minutes out of the oven minimum. The filling sets; the layers hold. Cut into hot lasagne and it collapses.",
  ],
  mise_en_place: [
    "Finely dice onion, carrot, and celery into equal-sized pieces — the soffritto. Uniformity matters; uneven pieces mean some burn before others are soft.",
    "Mince the garlic.",
    "Open and hand-crush the tinned tomatoes into a bowl — squeeze through your fist. Discard the tin juice.",
    "Measure milk and wine into separate jugs.",
    "For the béchamel: weigh butter and flour, measure milk and keep on the bench — béchamel needs full attention for 10 minutes.",
    "Grate the Parmigiano.",
  ],
  finishing_note: "Cut into squares with a sharp knife. Serve with a simple green salad and crusty bread. Taste a corner before plating — it should taste deeply savoury with a background sweetness from the soffritto. If it tastes flat, it needs salt and possibly a thread of good olive oil over the top. The layering should hold on the plate; if it collapses, it either didn't rest long enough or the ragù was too wet.",
  leftovers_note: "This is better the next day — flavours meld overnight and it cuts into cleaner squares when cold. Refrigerate up to 4 days. Reheat covered with foil at 160°C for 20 minutes, or individual portions in the microwave with a splash of water. Freezes brilliantly in individual portions — thaw overnight in the fridge, reheat covered in the oven. The bolognese ragù also freezes separately; make a double batch and freeze half as pasta sauce.",
  ingredients: [
    // Ragù
    {
      id: 'olive_oil_ragu', name: 'Olive oil', amount: 2, unit: 'tbsp',
      scales: 'linear',
      scaling_note: 'Pan-coverage, not per-serve. 2 tbsp oil + 60 g butter coats the soffritto for any reasonable batch.',
    },
    {
      id: 'butter_ragu', name: 'Unsalted butter', amount: 60, unit: 'g',
      scales: 'linear',
    },
    {
      id: 'onion_ragu', name: 'Brown onion', amount: 1, unit: 'medium',
      scales: 'fixed', cap: 2, prep: 'Finely chopped',
    },
    {
      id: 'celery', name: 'Celery stalk', amount: 1, unit: 'stalk',
      scales: 'linear', prep: 'Finely chopped',
    },
    {
      id: 'carrot_ragu', name: 'Carrot', amount: 1, unit: 'medium',
      scales: 'linear', prep: 'Finely chopped',
    },
    {
      id: 'beef_mince', name: 'Beef mince (chuck or oyster blade, 20% fat)', amount: 750, unit: 'g',
      scales: 'linear',
      substitutions: [
        { ingredient: '50/50 beef and pork mince', changes: "This is what an Italian household actually uses. Slightly richer, slightly sweeter. Hazan's original recipe calls for it.", quality: 'perfect_swap', quantity_note: 'Same total weight, 375 g of each.' },
        { ingredient: 'Veal mince (in place of part of the beef)', changes: 'Even closer to canonical Bolognese. 250 g veal + 500 g beef.', quality: 'great_swap', hard_to_find: true, local_alternative: 'Most Australian butchers will mince veal on request — supermarkets rarely stock it pre-minced.' },
      ],
    },
    {
      id: 'salt_ragu', name: 'Fine salt', amount: 5, unit: 'g',
      scales: 'linear', prep: 'For seasoning the mince at browning',
      scaling_note: 'Concentration, not volume. Taste the ragù at the end of the simmer and salt to taste rather than scaling rigidly.',
    },
    {
      id: 'whole_milk_ragu', name: 'Whole milk', amount: 250, unit: 'ml',
      scales: 'linear',
      substitutions: [
        { ingredient: 'Skim or low-fat milk', changes: 'The whole milk is structural — it tenderises the meat through a slow reaction with the lactose. Skim works but the ragù is less silky.', quality: 'compromise' },
        { ingredient: 'Skip', changes: 'The dish becomes more obviously tomato-forward. Still good. Not Hazan\'s Bolognese any more — it\'s a different ragù.', quality: 'compromise' },
      ],
    },
    {
      id: 'nutmeg_ragu', name: 'Whole nutmeg, freshly grated', amount: 1, unit: 'small grate',
      scales: 'fixed', cap: 1,
    },
    {
      id: 'white_wine_ragu', name: 'Dry white wine', amount: 250, unit: 'ml',
      scales: 'linear',
      substitutions: [
        { ingredient: 'Dry red wine', changes: 'Slightly heavier, slightly more tannic. A common Italian household variation; many cooks prefer it.', quality: 'good_swap' },
        { ingredient: 'Beef stock', changes: 'No alcohol means no fat-cutting acidity — the ragù feels heavier. Add a splash of white wine vinegar at the end if going this route.', quality: 'compromise' },
      ],
    },
    {
      id: 'tomato_passata', name: 'Tomato passata', amount: 500, unit: 'ml',
      scales: 'linear',
      substitutions: [
        { ingredient: 'Whole peeled tomatoes (tinned), crushed by hand', changes: 'More texture in the finished sauce. Less smooth. Many cooks prefer this for the rustic feel.', quality: 'great_swap', quantity_note: 'Use 400 g tin × 1 + a 250 ml splash of water.' },
        { ingredient: 'Tomato puree (paste)', changes: 'Far more concentrated. Thin with 250 ml water and the result is denser, less fresh-tasting.', quality: 'compromise' },
      ],
    },
    // Béchamel
    {
      id: 'butter_bechamel', name: 'Unsalted butter (for béchamel)', amount: 60, unit: 'g',
      scales: 'linear',
    },
    {
      id: 'plain_flour_bechamel', name: 'Plain flour (for béchamel)', amount: 60, unit: 'g',
      scales: 'linear',
    },
    {
      id: 'whole_milk_bechamel', name: 'Whole milk (for béchamel)', amount: 750, unit: 'ml',
      scales: 'linear', prep: 'Warmed',
    },
    {
      id: 'salt_bechamel', name: 'Fine salt (for béchamel)', amount: 4, unit: 'g',
      scales: 'linear',
      scaling_note: 'Concentration, not volume. Taste the béchamel before assembling and adjust.',
    },
    {
      id: 'nutmeg_bechamel', name: 'Whole nutmeg (for béchamel)', amount: 1, unit: 'small grate',
      scales: 'fixed', cap: 1,
    },
    // Assembly
    {
      id: 'lasagne_sheets', name: 'Fresh lasagne sheets', amount: 400, unit: 'g',
      scales: 'linear',
      scaling_note: "Tray-driven, not serve-driven. The recipe assumes a 25 × 35 cm dish. For 12 serves you'll want a deeper dish or two trays.",
      substitutions: [
        { ingredient: 'Dried lasagne sheets (no-precook kind)', changes: 'Wider gaps between layers; slightly chewier bite. Many Australian households use these — they work fine.', quality: 'good_swap' },
        { ingredient: 'Dried sheets that need precooking', changes: "Same final result; an extra 10 minutes of work blanching them. Don't skip the precook — they will not soften enough on baking alone.", quality: 'good_swap' },
      ],
    },
    {
      id: 'parmesan_lasagne', name: 'Parmesan, finely grated', amount: 100, unit: 'g',
      scales: 'linear',
      substitutions: [
        { ingredient: 'Grana Padano', changes: 'Younger, milder, cheaper. Most Australian households substitute on price alone.', quality: 'perfect_swap' },
        { ingredient: 'Pecorino Romano', changes: 'Sharper, saltier. Reduce the salt elsewhere.', quality: 'good_swap' },
      ],
    },
    {
      id: 'mozzarella', name: 'Fresh mozzarella (fior di latte), torn', amount: 200, unit: 'g',
      scales: 'linear', prep: 'Drained well',
      substitutions: [
        { ingredient: 'Bocconcini, drained and torn', changes: 'Same cheese in smaller balls. No flavour difference.', quality: 'perfect_swap' },
        { ingredient: 'Pre-grated pizza mozzarella', changes: "Drier, saltier, less stretch. Functional but the finish is more 'pizza' than 'lasagne'.", quality: 'compromise' },
        { ingredient: 'Omit and double the parmesan', changes: "More austere finish. Many Bolognese households don't put mozzarella in lasagne — it's an Italian-American/Australian addition.", quality: 'great_swap' },
      ],
    },
  ],
  steps: [
    {
      id: 'step_1_soffritto', title: 'Build the soffritto',
      content: 'Heat the olive oil and butter in a heavy-based pot over medium-low. Add the chopped onion, celery, and carrot. Cook gently, stirring now and then, until the onion is translucent and the vegetables smell sweet — not coloured.',
      stage_note: 'Vegetables are softened, glossy, no browning. The mixture smells sweet and herbal.',
      lookahead: 'The mince goes in next, but you want the vegetables fully soft before then — they will not soften further once the meat hits.',
      timer_seconds: 600,
      why_note: 'Soffritto is the flavour foundation. Italian cooks treat this step as non-negotiable — rushing it gives you raw onion bite running through the finished ragù.',
    },
    {
      id: 'step_2_brown_mince', title: 'Add the mince and brown gently',
      content: 'Crumble the mince into the pot. Salt it. Stir to break up large clumps and cook over medium heat until the meat loses its raw pink colour and starts to release fat — about 8 minutes.',
      stage_note: 'Mince is broken into small fragments, no large lumps, just turning from pink to grey-brown.',
      lookahead: 'The milk goes in next, before any tomato. This sequence matters.',
      timer_seconds: 480,
      why_note: "Hazan's signature instruction is to brown the meat lightly, not aggressively — heavy browning hardens the proteins and the ragù turns chewy. You want the meat cooked, not crusty.",
    },
    {
      id: 'step_3_milk', title: 'Milk first',
      content: 'Pour the milk in. Grate a small amount of nutmeg. Cook on a slow simmer until the milk has been almost entirely absorbed — about 15 minutes. The pot will look slightly curdled along the way; that\'s normal.',
      stage_note: 'Almost no liquid left in the pot. The mince smells faintly sweet.',
      lookahead: 'Wine goes in next, while the pot is dry. The sequence is dry-then-wet, twice over.',
      timer_seconds: 900,
      why_note: "This is Hazan's break with most other Bolognese recipes. Milk before wine tenderises the meat fibres — the lactose proteins coat the mince before the acid of the wine and tomato can toughen it. Skip this step and the dish is fine but it isn't Hazan's ragù.",
    },
    {
      id: 'step_4_wine', title: 'Wine, then reduce',
      content: 'Pour in the white wine and let it bubble briskly over medium heat until the alcohol has cooked off and the pot is mostly dry again — about 10 minutes.',
      stage_note: 'No more alcohol smell when you bend over the pot. The mixture is thick, not soupy.',
      lookahead: 'The tomato passata goes in next, then the long simmer begins.',
      timer_seconds: 600,
      why_note: 'Cooking off the alcohol before the tomato hits is what gives Bolognese its depth without harshness. Wine flashed off in tomato sauce stays sharp for the whole cook.',
    },
    {
      id: 'step_5_simmer', title: 'The long simmer',
      content: 'Add the passata. Bring the pot back to a simmer, then drop the heat to the lowest setting. Cover with the lid slightly ajar — you want the sauce to reduce, not seal in the steam. Cook for 2½ hours, stirring once every 20 minutes or so.',
      stage_note: 'Ragù is deep brick red, glossy, and tight — when you drag a spoon through it leaves a trail that closes slowly. The fat has separated and is sitting on top in pools.',
      lookahead: 'While it cooks, make the béchamel and pre-warm the oven. The ragù is ready when you\'re ready.',
      timer_seconds: 9000,
      why_note: 'Time, not heat, is what builds the depth. A fast simmer evaporates water without breaking down the meat fibres. A long, slow simmer melts the connective tissue in the mince and the sauce becomes silky rather than chunky.',
    },
    {
      id: 'step_6_bechamel', title: 'Make the béchamel',
      content: 'Melt the butter in a saucepan over medium heat. Once foaming, add the flour and whisk constantly for 90 seconds — you\'re cooking the raw flour taste out without colouring it. Pour in the warmed milk in a steady stream, whisking the whole time. Bring to a gentle simmer, season with salt and a small grate of nutmeg, then cook for another 3 minutes until the sauce coats the back of a spoon.',
      stage_note: 'Sauce is the consistency of pourable cream — thick enough to coat a spoon but still flowing.',
      lookahead: 'Press a piece of baking paper directly onto the surface to stop a skin forming. Move on to assembly.',
      timer_seconds: 360,
      why_note: 'Béchamel for lasagne is slightly thinner than for other dishes — it needs to flow between the layers. If your sauce is too thick, the lasagne will be dry; too thin and it pools at the bottom of the dish.',
    },
    {
      id: 'step_7_assemble', title: 'Build the lasagne',
      content: 'Heat the oven to 180 °C fan-forced. Spread a thin layer of ragù across the base of a 25 × 35 cm baking dish. Lay down a layer of pasta sheets, overlapping slightly. Top with a third of the remaining ragù, a third of the béchamel, a third of the mozzarella, and a sprinkle of parmesan. Repeat twice more. Finish with a final layer of pasta, the last of the béchamel, the last of the mozzarella, and a generous shower of parmesan.',
      stage_note: 'Five layers of pasta total, four layers of fillings between. Top is mostly béchamel and cheese.',
      lookahead: 'Cover with foil for the first half of baking, uncover for the colour at the end.',
      why_note: 'Sauce on the bottom of the dish is the rule that prevents stuck pasta. Mostly cheese and béchamel on top is the rule that gives you the brown, blistered crust everyone fights over.',
    },
    {
      id: 'step_8_bake', title: 'Bake covered, then uncovered',
      content: 'Cover the dish tightly with foil. Bake for 25 minutes. Remove the foil and bake for another 10 to 15 minutes, until the top is deep golden in patches and the edges are bubbling.',
      stage_note: 'Top is patchy gold to brown — not pale. Edges around the dish are bubbling. A skewer slid through the centre meets no resistance.',
      lookahead: 'Critical: rest before you cut.',
      timer_seconds: 2100,
      why_note: 'Foil for the first half cooks the pasta through with steam. Removing it for the second half gives you the colour. Skip the foil and the top burns before the centre softens.',
    },
    {
      id: 'step_9_rest', title: 'Rest 15 minutes, then cut',
      content: 'Pull the lasagne out and let it sit on the bench, uncovered, for 15 minutes before cutting. Cut into squares with a sharp knife.',
      stage_note: 'Squares hold their shape on the spatula — they do not slump or ooze.',
      why_note: 'A lasagne cut hot collapses into a heap of pasta and sauce. The 15-minute rest lets the béchamel and ragù set just enough to slice cleanly. The lasagne stays piping hot under its own mass.',
    },
  ],
};

const ROAST_LAMB: Recipe = {
  id: 'roast-lamb-rosemary-garlic',
  title: 'Roast Lamb with Rosemary & Garlic',
  tagline: 'A lamb shoulder that pulls apart with a fork, the way Sunday is supposed to taste.',
  description: "Lamb roasted with rosemary and garlic comes from two heritages that both shaped Australian cooking: the Mediterranean (Italy, Greece, Spain — where lamb, herbs, and olive oil are everyday) and the British Sunday roast that arrived with colonisation. The slow-roast shoulder method — long, low, lid on for the first hour — is associated in Australia with Maggie Beer, whose Barossa kitchen made this style of cooking the modern Australian Sunday roast. This is that recipe, lightly streamlined: three hours start to finish, almost all of it hands-off.",
  base_servings: 6,
  time_min: 200,
  difficulty: 'beginner',
  tags: ['Sunday roast', 'slow roast', 'lamb shoulder', 'family-sized', 'special occasion'],
  categories: { cuisines: ['australian'], types: ['lamb'] },
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Maggie Beer',
    video_url: 'https://maggiebeer.com.au/recipes/slow-roasted-lamb-shoulder',
    notes: "Inspired by Maggie Beer's slow-roast lamb shoulder approach — long and low, garlic and rosemary tucked into slits in the meat, the lid on for the first hour to steam the connective tissue. The hands-off elegance is hers; we've left it largely alone because it doesn't need fixing.",
  },
  hero_fallback: fallback('#7A4A2E'),
  whole_food_verified: true,
  leftover_mode: { extra_servings: 4, note: 'Pulled lamb is the gift the next day — sandwiches with chutney, or fold through pasta with the pan juices' },
  total_time_minutes: 135,
  active_time_minutes: 20,
  equipment: [
    "Roasting tin large enough to fit the leg without meat touching the sides",
    "Paring knife or small boning knife (for making pockets)",
    "Roasting rack (optional but recommended)",
    "Instant-read thermometer",
    "Basting brush or spoon",
  ],
  before_you_start: [
    "One leg feeds 6–8 people — buy by weight, not by person count. A 2–2.5 kg bone-in leg is the right size. For more than 8 people, roast two legs side by side rather than one enormous one.",
    "The resting period is not optional — it is part of the cooking. Twenty minutes minimum, uncovered (not under foil, which steams the crust).",
    "Temperature beats timing. A probe thermometer removes all guesswork: 58–60°C at the thickest part for blushing pink; 65°C for medium; 70°C for well done.",
  ],
  mise_en_place: [
    "Remove the lamb from the fridge 30 minutes before cooking — cold meat in a hot oven cooks unevenly.",
    "Preheat oven to 220°C (200°C fan-forced).",
    "Mix the marinade: olive oil + Dijon mustard + lemon juice + salt + pepper + half the chopped rosemary. Stir until combined.",
    "Using a paring knife, cut 16 small deep pockets into the lamb (8 per side, in the thicker sections, angled toward the bone); push a sliver of garlic and a pinch of rosemary deep into each pocket.",
    "Rub the marinade over the entire surface. Scatter remaining rosemary sprigs and whole garlic cloves in the base of the tin.",
  ],
  finishing_note: "Arrange slices on a warmed platter with the jus poured around — not over, which softens the crust. Scatter a few fresh rosemary sprigs and the roasted garlic cloves from the tin. Taste a slice: deeply savoury with a faint sweetness from the roasted garlic. If flat, add a pinch of flaky salt. Traditional accompaniments: roasted vegetables cooked alongside, and a mint sauce or fresh mint jelly.",
  leftovers_note: "Refrigerate carved slices for up to 3 days, stored with the jus poured over to prevent drying. Reheat covered with foil, with a splash of water or stock, at 160°C for 10–12 minutes. Thinly sliced cold lamb in a sandwich with mint sauce and dijon on good bread is exceptional — better cold than many meals hot. Simmer the bone with onion, carrot, and celery for 2 hours to make a lamb stock. Freezes well sliced with jus for up to 3 months.",
  ingredients: [
    {
      id: 'lamb_shoulder', name: 'Lamb shoulder, bone-in', amount: 2000, unit: 'g',
      scales: 'linear', prep: 'At room temperature 1 hour before cooking',
      scaling_note: 'Linear up to about 3 kg, after which two smaller shoulders cook more evenly than one giant one — the centre of a big shoulder takes too long to soften.',
      substitutions: [
        { ingredient: 'Lamb leg, bone-in', changes: 'Leaner cut. Cooks faster (about 2 hours instead of 3) and the meat will not pull apart the same way — it slices instead of shreds.', quality: 'good_swap', quantity_note: 'Same weight; reduce roast time by 30 minutes.' },
        { ingredient: 'Boneless lamb shoulder', changes: 'Easier to carve, slightly less flavour without the bone. Tie it with butcher\'s twine if not pre-rolled.', quality: 'good_swap', quantity_note: '1.6 kg boneless ≈ 2 kg bone-in.' },
      ],
    },
    {
      id: 'garlic_lamb', name: 'Garlic bulb', amount: 1, unit: 'whole bulb',
      scales: 'fixed', cap: 2, prep: 'Cloves separated, peeled, halved',
      substitutions: [
        { ingredient: 'Pre-peeled garlic from the supermarket fridge', changes: 'Less aromatic. Functional. Use 12 to 15 cloves for the equivalent of one fresh bulb.', quality: 'good_swap' },
      ],
    },
    {
      id: 'rosemary', name: 'Fresh rosemary', amount: 6, unit: 'sprigs',
      scales: 'fixed', cap: 10, prep: 'Some kept whole, some leaves stripped',
      substitutions: [
        { ingredient: 'Fresh thyme', changes: 'Lighter, more delicate herbal note. Use the same volume.', quality: 'great_swap' },
        { ingredient: 'Dried rosemary', changes: "Strong, slightly dusty flavour. Use a third of the quantity (2 tsp) and don't tuck it into slits — it will burn. Scatter into the roasting tray instead.", quality: 'compromise' },
      ],
    },
    {
      id: 'olive_oil_lamb', name: 'Extra virgin olive oil', amount: 3, unit: 'tbsp',
      scales: 'linear',
      scaling_note: 'Surface-area driven, not weight-driven. 3 tbsp coats any shoulder up to 3 kg.',
    },
    {
      id: 'flake_salt_lamb', name: 'Sea salt flakes', amount: 15, unit: 'g',
      scales: 'linear',
      scaling_note: 'Roughly 1 g per 130 g of meat. Linear within reason, but bigger roasts develop more concentrated pan juices — taste before serving.',
    },
    {
      id: 'black_pepper_lamb', name: 'Black pepper, freshly cracked', amount: 5, unit: 'g',
      scales: 'fixed', cap: 5,
    },
    {
      id: 'lemon_lamb', name: 'Lemon', amount: 1, unit: 'whole',
      scales: 'fixed', cap: 2, prep: 'Halved',
    },
    {
      id: 'onion_lamb', name: 'Brown onion', amount: 2, unit: 'medium',
      scales: 'fixed', cap: 4, prep: 'Quartered, skin on',
      scaling_note: 'Tray-driven cushion under the lamb. 2 onions cushion any tray for a 2–3 kg shoulder.',
    },
    {
      id: 'white_wine_lamb', name: 'Dry white wine', amount: 250, unit: 'ml',
      scales: 'linear',
      scaling_note: 'Tray-driven, not weight-driven. The 250 ml + 250 ml fills the tray to about 1 cm depth, which creates the steam phase. For larger trays, scale to maintain the 1 cm depth.',
      substitutions: [
        { ingredient: 'Dry red wine', changes: 'Heavier, more savoury pan juices. A common variation.', quality: 'good_swap' },
        { ingredient: 'Chicken stock (extra)', changes: 'No alcohol means no acidity to cut the lamb fat. Add a splash of red wine vinegar at the end if going this route.', quality: 'compromise' },
      ],
    },
    {
      id: 'chicken_stock_lamb', name: 'Chicken stock (homemade or low-sodium)', amount: 250, unit: 'ml',
      scales: 'linear',
      substitutions: [
        { ingredient: 'Lamb stock', changes: 'Deeper lamb flavour in the pan juices.', quality: 'great_swap' },
        { ingredient: 'Vegetable stock', changes: "Lighter pan juices. Won't overpower — works fine.", quality: 'good_swap' },
      ],
    },
    {
      id: 'potatoes_lamb', name: 'Roasting potatoes (Sebago or Dutch Cream)', amount: 1200, unit: 'g',
      scales: 'linear', prep: 'Peeled, cut into 5 cm chunks',
      scaling_note: 'Linear at 200 g per serve, but the tray must be wide enough that the potatoes do not stack. Stacked potatoes steam instead of roasting.',
      substitutions: [
        { ingredient: 'Maris Piper or King Edward', changes: 'Similar starch profile, identical roast result.', quality: 'perfect_swap', hard_to_find: true, local_alternative: 'Most large supermarkets stock these; if not, Sebago is the AU default.' },
        { ingredient: 'Kipfler or chat potatoes (small, waxy)', changes: "Won't fluff up the same way. Crisper outside but the inside stays dense — different texture entirely.", quality: 'compromise' },
      ],
    },
  ],
  steps: [
    {
      id: 'step_1_temper', title: 'Take the lamb out of the fridge',
      content: 'Pull the lamb out of the fridge a full hour before you start cooking. Let it come to room temperature on the bench, uncovered.',
      stage_note: 'Surface of the meat is dry to the touch and no longer cold against your wrist.',
      lookahead: 'While it sits, make slits all over the surface for the garlic and rosemary.',
      timer_seconds: 3600,
      why_note: 'A cold lamb shoulder going into the oven means the outside overcooks before the inside warms up. Tempering is the difference between evenly cooked meat and a grey rind around a rare middle.',
    },
    {
      id: 'step_2_score', title: 'Score and stuff the lamb',
      content: 'With a sharp paring knife, make 16 slits across the top and sides of the lamb, about 2 cm deep. Push half a garlic clove into each slit, followed by 3 or 4 rosemary leaves. Use the rest of the garlic and the whole rosemary sprigs to scatter underneath the lamb in the tray.',
      stage_note: 'Lamb looks evenly studded — no bald patches, no clusters.',
      lookahead: 'Next is the dry rub. The slits are filled, you\'re working on the surface now.',
      why_note: 'Cutting slits and tucking aromatics inside is what gets the rosemary and garlic flavour into the meat instead of just sitting on top. You can taste the difference — meat seasoned only on the outside is bland through the centre after three hours.',
    },
    {
      id: 'step_3_season', title: 'Rub with oil, salt, and pepper',
      content: "Drizzle the lamb generously with the olive oil and rub it in with your hands — get into every crevice. Sprinkle the salt flakes and pepper evenly across all sides. Squeeze the lemon halves over the top and tuck the spent halves into the tray.",
      stage_note: 'Lamb is glossy with oil, evenly speckled with salt — not patchy.',
      lookahead: 'The tray gets the onions, the wine, and the stock next, and the lamb goes on top.',
      why_note: 'Salt applied right before the oven, not hours ahead, gives a better crust. Long-salted meat draws moisture to the surface and steams instead of crisps.',
    },
    {
      id: 'step_4_tray', title: 'Build the roasting tray',
      content: "Scatter the quartered onions across the base of a heavy roasting tray. Pour in the wine and stock. Lay the lamb on top of the onions — they raise it off the bottom and stop the bottom from boiling in the liquid.",
      stage_note: 'Liquid sits in the tray about 1 cm deep. Onions cushion the lamb.',
      lookahead: 'Cover tightly with foil for the first hour — this is the key step.',
      why_note: "The onions are doing two jobs: lifting the lamb so it roasts rather than poaches, and gradually melting into the pan juices for sweetness. They're more important than they look.",
    },
    {
      id: 'step_5_first_roast', title: 'First hour, covered',
      content: 'Heat the oven to 220 °C fan-forced. Cover the tray tightly with foil and slide it onto the middle shelf. Roast for 20 minutes, then drop the heat to 160 °C fan-forced. Continue cooking, still covered, for 1 hour 40 minutes.',
      stage_note: 'When you peek under the foil at the 2-hour mark, the lamb is darker, fragrant, and the liquid has reduced by a third. The fork should slide in but meet some resistance.',
      lookahead: 'Foil comes off next, potatoes go in, and the heat goes back up.',
      timer_seconds: 7200,
      why_note: 'The high-heat blast at the start sets the crust. The long, low, covered phase that follows is what melts the connective tissue in the shoulder — this is what makes the meat fork-tender. Skip the cover and the surface dries out before the centre softens.',
    },
    {
      id: 'step_6_potatoes', title: 'Add the potatoes, take the foil off',
      content: "Pull the tray out, lift off the foil, and arrange the potato chunks around (not on top of) the lamb, rolling them through the pan juices. Crank the heat back up to 200 °C fan-forced. Roast for another 40 minutes, basting the lamb with the pan juices every 15 minutes.",
      stage_note: 'Potatoes are golden and crisp on the cut sides; lamb has a deep mahogany crust. The pan juices have reduced to a glossy slick.',
      lookahead: 'Once it\'s done, the lamb has to rest. The potatoes go on a hot tray to stay crisp.',
      timer_seconds: 2400,
      why_note: 'Potatoes added in the second half cook in the lamb fat — they\'re the bonus dish, full of flavour from the meat above. Adding them at the start means they go to mush; adding them at the end means they don\'t catch the juices.',
    },
    {
      id: 'step_7_rest', title: 'Rest the lamb under foil',
      content: 'Lift the lamb out of the tray onto a warm plate. Tent loosely with foil and let it rest for 15 minutes. Move the potatoes to a warmed tray and keep them in the (turned-off) oven, door slightly ajar.',
      stage_note: 'Lamb is hot to touch through the foil; juices on the plate are pooling rather than running.',
      lookahead: 'Pan juices need a quick reduction next, while the lamb rests.',
      timer_seconds: 900,
      why_note: 'Resting is the same physics as a brine: muscle fibres relax and the juices redistribute. Cut a roast straight from the oven and you lose half the moisture to the board. 15 minutes is the minimum for a 2 kg shoulder.',
    },
    {
      id: 'step_8_pan_juices', title: 'Reduce the pan juices',
      content: 'Pour the pan juices through a sieve into a small saucepan, pressing the onions to extract their liquid. Set the saucepan over medium-high heat and reduce by a third — about 4 minutes.',
      stage_note: 'Sauce coats the back of a spoon and tastes seasoned without needing more salt — taste it before serving.',
      lookahead: 'Lamb is ready to pull or carve.',
      timer_seconds: 240,
      why_note: "Reduction concentrates the lamb-and-aromatic flavour into something that goes from 'pan liquid' to 'sauce.' It's a 4-minute step that triples the dish's depth.",
    },
    {
      id: 'step_9_serve', title: 'Pull or carve, plate hot',
      content: 'Pull the lamb apart with two forks, or carve in thick slices off the bone. Pile onto a warm platter with the potatoes around it. Pour the reduced pan juices over the meat and scatter any leftover rosemary leaves on top.',
      stage_note: 'Meat falls apart at the touch of a fork; potatoes are golden, not soft.',
      why_note: 'A 2 kg shoulder pulled with two forks gives you the texture this dish is famous for — long strands of lamb that fall through the gravy. Carving works too if you prefer slices, but the cut needs to be thick — thin slices on lamb shoulder dry out in seconds.',
    },
  ],
};

const FISH_AND_CHIPS: Recipe = {
  id: 'fish-and-chips',
  title: 'Fish & Chips',
  tagline: 'Beer-battered flake, double-fried chips, lemon and salt — the Friday night that built this country.',
  description: "Fish and chips arrived in Australia with British migration in the late nineteenth century and made themselves at home in every coastal town. The Australian version differs from the British in two ways that matter: the fish is local (gummy shark, called flake, became the chip-shop standard), and the cooking is fast and bright rather than slow-fried in beef tallow. This is the home version of what you'd queue twenty minutes for at any seaside take-away — beer-battered fish, double-fried chips, served with lemon and salt and nothing else that doesn't need to be there.",
  base_servings: 4,
  time_min: 50,
  difficulty: 'intermediate',
  tags: ['fish and chips', 'beer batter', 'deep-fry', 'Friday night', 'pub classic', 'seaside'],
  categories: { cuisines: ['australian'], types: ['seafood'] },
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Australian Friday tradition',
    notes: "Fish and chips is the dish that doesn't have an author. Every Australian seaside town has a take-away that does it well, and the home version below is the consensus method — beer batter, double-fried chips, served the moment it lands.",
  },
  hero_fallback: fallback('#D4A832'),
  whole_food_verified: true,
  total_time_minutes: 55,
  active_time_minutes: 35,
  equipment: [
    "Large, deep heavy-based pot or deep fryer",
    "Cooking thermometer — non-negotiable for this recipe",
    "Wire rack set over a baking tray",
    "Paper towel",
    "Tongs",
    "Shallow dish for flour dusting",
  ],
  before_you_start: [
    "The batter needs to be cold and used immediately. Cold batter hitting hot oil, combined with the CO₂ in the beer, puffs the batter into a light shell. Warm batter or batter that has been resting makes a denser, heavier coating.",
    "Chips are twice-cooked — this is not optional. Par-cook at 150°C to cook through without colour, rest, then fry at 190°C to crisp. Single-frying produces chips that are either pale in the centre or burnt on the outside.",
    "Get the fish as dry as possible before battering. Moisture is the enemy of batter adhesion — pat dry thoroughly, then lightly dust with flour immediately before dipping.",
  ],
  mise_en_place: [
    "Cut and rinse the potato chips. Dry very thoroughly — spread on a clean tea towel and pat, then leave uncovered for 10 minutes. Wet chips spit in hot oil and don't crisp.",
    "Pat the fish fillets completely dry with paper towel. Refrigerate uncovered on a plate.",
    "Set up the oil in the pot. Do not heat yet.",
    "Measure flour and baking powder into a bowl for the batter. Do not add beer until immediately before frying.",
    "Set up the draining station: wire rack over a tray next to the hob.",
    "Make the tartare sauce if making from scratch — this takes 5 minutes and can be done any time.",
  ],
  finishing_note: "Serve immediately — fish and chips are a dish of minutes. Set on plates lined with paper (the traditional presentation; it absorbs oil and keeps everything crisp for the first few minutes). Lemon quarters, tartare sauce, malt vinegar on the side. Chips should be salty, crisp outside, fluffy inside. The batter should be crisp, light, with a faint yeasty note from the beer. Add more salt than you think you need.",
  leftovers_note: "This dish does not keep — fish and chips must be eaten within 10–15 minutes of frying. Refrigerating and reheating battered fish produces a limp, pale shadow of the original. If you must reheat chips: 220°C oven, spread on a rack, 5–8 minutes. Leftover fish without the batter can be flaked and mixed with mayo, lemon, and diced cornichons for a fish sandwich — perfectly good the next day.",
  ingredients: [
    {
      id: 'potatoes_chips', name: 'Sebago potatoes (or other floury variety)', amount: 1200, unit: 'g',
      scales: 'linear', prep: 'Peeled, cut into 1.5 cm-thick chips',
      substitutions: [
        { ingredient: 'Maris Piper', changes: 'Identical chip result. Maris Piper is the British chip-shop default.', quality: 'perfect_swap', hard_to_find: true, local_alternative: 'Some larger Australian supermarkets, otherwise greengrocers.' },
        { ingredient: 'Russet (Idaho) potatoes', changes: 'Slightly drier, very similar fluff.', quality: 'great_swap' },
        { ingredient: 'Desiree or Pontiac (red waxy potatoes)', changes: 'Will not fluff up the same way. The chips stay denser and waxier — a different texture.', quality: 'compromise' },
      ],
    },
    {
      id: 'salt_blanch', name: 'Fine salt (for blanching)', amount: 30, unit: 'g',
      scales: 'linear', prep: 'Dissolved in cold water',
      scaling_note: 'Concentration, not volume. The blanching water is salted at roughly 30 g per 4 L. For 2 serves use 15 g salt + 2 L water.',
    },
    {
      id: 'frying_oil_chips', name: 'Neutral oil for deep frying (rice bran or vegetable)', amount: 2000, unit: 'ml',
      scales: 'custom', curve: { '2': 1500, '4': 2000, '6': 2500, '8': 3000 },
      scaling_note: 'Depth-driven, not serving-driven. 2 L fills a typical heavy-based household pot to about half. Safety rule: the pot must never be more than half full of oil — hot oil overflowing onto a gas flame is the most common kitchen-fire cause for this dish.',
      substitutions: [
        { ingredient: 'Beef tallow', changes: 'Traditional British chippy fat — beefier, slightly more flavourful chip. Higher cost.', quality: 'great_swap', hard_to_find: true, local_alternative: 'Butchers will sell rendered tallow, or you can render your own from beef trim.' },
        { ingredient: 'Peanut oil', changes: 'No real difference; some people prefer it for the higher smoke point.', quality: 'perfect_swap' },
      ],
    },
    {
      id: 'flake', name: 'Flake (gummy shark) or other firm white fish', amount: 600, unit: 'g',
      scales: 'linear', prep: 'Skin off, pin-boned, cut into 4 portions',
      substitutions: [
        { ingredient: 'Hoki', changes: 'Lighter, slightly flakier. Common Australian fish-and-chip-shop substitute.', quality: 'great_swap' },
        { ingredient: 'Snapper', changes: 'Sweeter, slightly firmer. Excellent fish but more expensive.', quality: 'great_swap' },
        { ingredient: 'Barramundi', changes: 'Mild, firm, and reliably available in Australia. Works well with batter.', quality: 'good_swap' },
        { ingredient: 'Ling', changes: 'Many Sydney fish-and-chip shops use ling — firm, white, takes batter beautifully.', quality: 'perfect_swap' },
      ],
    },
    {
      id: 'plain_flour_dust', name: 'Plain flour for dusting', amount: 50, unit: 'g',
      scales: 'linear',
      scaling_note: 'Bowl quantity, not consumption. 50 g coats up to 8 fish portions; most stays in the tray.',
    },
    {
      id: 'plain_flour_batter', name: 'Plain flour for batter', amount: 200, unit: 'g',
      scales: 'linear',
    },
    {
      id: 'cornflour_batter', name: 'Cornflour for batter', amount: 50, unit: 'g',
      scales: 'linear',
    },
    {
      id: 'baking_powder_chips', name: 'Baking powder', amount: 1, unit: 'tsp',
      scales: 'linear',
      substitutions: [
        { ingredient: 'Bicarb soda + cream of tartar (1:2)', changes: 'What baking powder is, dismantled. Same result.', quality: 'perfect_swap', quantity_note: '1 tsp baking powder = ⅓ tsp bicarb + ⅔ tsp cream of tartar.' },
      ],
    },
    {
      id: 'salt_batter', name: 'Fine salt (for batter)', amount: 5, unit: 'g',
      scales: 'linear',
    },
    {
      id: 'beer', name: 'Cold lager or pale ale', amount: 330, unit: 'ml',
      scales: 'linear', prep: 'Straight from the fridge',
      substitutions: [
        { ingredient: 'Soda water', changes: 'Same effect — the bubbles are what lighten the batter. Slightly less flavour. Works for a non-alcoholic batter.', quality: 'great_swap', quantity_note: 'Same volume.' },
        { ingredient: 'Pilsner or other light lager', changes: 'Any cold light beer works the same.', quality: 'perfect_swap' },
      ],
    },
    {
      id: 'flake_salt_fish', name: 'Sea salt flakes, to finish', amount: 10, unit: 'g',
      scales: 'linear',
    },
    {
      id: 'lemon_chips', name: 'Lemon', amount: 2, unit: 'whole',
      scales: 'fixed', cap: 4, prep: 'Cut into wedges',
    },
  ],
  steps: [
    {
      id: 'step_1_blanch', title: 'Blanch the chips',
      content: 'Drop the cut chips into a large pot of cold salted water. Bring to the boil, then drop the heat to a simmer. Cook for 6 minutes — the chips should be just tender at the edges but still hold their shape. Drain gently and lay them in a single layer on a tray lined with a clean tea towel. Pat dry.',
      stage_note: 'Chips bend slightly when picked up but do not break. Surface is matte and slightly fuzzy from the starch.',
      lookahead: 'Now they need to dry. Move them into the freezer for 20 minutes — this is the secret that gives them the proper chippy texture.',
      timer_seconds: 360,
      why_note: 'Blanching is the first of two cooks. It gelatinises the starch on the surface, which then crisps in the second fry. A single fry gives you a chip that\'s either undercooked inside or over-coloured outside — the double cook is non-negotiable.',
    },
    {
      id: 'step_2_freeze', title: 'Cold-shock the chips',
      content: 'Lay the blanched chips on a tray in a single layer and slide them into the freezer for 20 minutes. They should be cold and dry to the touch when you take them out — not frozen solid.',
      stage_note: 'Chips are firm, dry, and very cold.',
      lookahead: 'While they chill, heat the oil and prep the batter and fish. Timing should land all three at the same moment.',
      timer_seconds: 1200,
      why_note: 'Cold, dry chips going into hot oil cause violent steam, which is what creates the rough, blistered surface that holds salt and shatters in the mouth. Wet chips into hot oil = soggy chips, every time.',
    },
    {
      id: 'step_3_oil', title: 'Heat the oil',
      content: "Pour the oil into a deep heavy-based pot — it should come no more than halfway up the sides. Heat to 160 °C for the first chip fry. Use a thermometer if you have one; if not, drop a wooden chopstick in — steady stream of small bubbles around it = right temperature.",
      stage_note: 'Oil is shimmering. A test chip dropped in floats up within 5 seconds with a steady fizz of small bubbles.',
      lookahead: 'The chips go in at 160, the fish goes in later at 180.',
      why_note: 'Two oil temperatures, two purposes. 160 °C cooks the chip inside without colouring the outside. 180 °C will sear the colour on later.',
    },
    {
      id: 'step_4_first_fry', title: 'First fry the chips',
      content: "Lower the chips into the oil in 2 batches — don't crowd, the temperature drops too far if you do. Fry for 5 minutes, until the chips are pale and just starting to colour. Lift out with a spider strainer and rest on a wire rack — never paper towel.",
      stage_note: 'Chips are pale yellow with no real browning. Surface is dry and rough rather than smooth.',
      lookahead: 'Now you cook the fish. The chips wait on the rack.',
      timer_seconds: 300,
      why_note: 'This first fry is half-cooking the chip from the inside out. The colour comes later. Skip this step or rush it and the chip is hollow or soggy.',
    },
    {
      id: 'step_5_batter', title: 'Mix the batter',
      content: 'In a large bowl, whisk the plain flour, cornflour, baking powder, and salt. Pour the cold beer in all at once. Whisk only until the mixture comes together — small lumps are fine. Do not overmix.',
      stage_note: 'Batter is the consistency of pouring cream — it coats a spoon but flows off in a steady ribbon. Small lumps remain visible.',
      lookahead: 'Use the batter immediately. The bubbles in the beer are doing the lifting and they do not last.',
      why_note: 'Cold liquid + minimal mixing = light batter. The cornflour keeps it crisp; the baking powder and beer bubbles keep it lacy. Overmixed batter develops gluten and goes chewy.',
    },
    {
      id: 'step_6_heat_high', title: 'Bring the oil to fish temperature',
      content: 'Crank the oil up to 180 °C. Test with a tiny dollop of batter dropped in — it should rise to the surface immediately, sizzling, and turn golden in 60 seconds.',
      stage_note: 'Test batter dollop bobs up the moment it lands and turns golden in under a minute.',
      lookahead: 'Fish is dipped, dunked, and goes straight in.',
      why_note: 'Hot oil = the batter sets in a second-skin shell. Lukewarm oil = batter sloughs off the fish and absorbs oil.',
    },
    {
      id: 'step_7_fry_fish', title: 'Dust, dip, and fry the fish',
      content: 'Dust each piece of fish in the seasoning flour, shake off the excess, then drag through the batter, letting the surplus drip back. Lower into the hot oil holding the tail end of the fish — let half submerge, let go, and step back. Fry for 4 to 5 minutes, flipping once halfway through.',
      stage_note: 'Batter is deep gold and crisp. The fish underneath is opaque white when you lift a corner with tongs.',
      lookahead: 'Fish out, onto a wire rack, salted while hot. Chips go back in next.',
      timer_seconds: 270,
      why_note: 'Dusting the fish in flour first gives the batter something to grip. Without the dust, the batter slides off. The "hold the tail and let go" trick stops the batter from sticking to the bottom of the pot.',
    },
    {
      id: 'step_8_second_fry', title: 'Second fry the chips',
      content: 'Drop the parboiled chips back into the oil — still at 180 °C. Fry for 2 to 3 minutes, until deeply golden and crisp.',
      stage_note: 'Chips rattle against the sides of the spider when you lift them — that\'s the sound of crisp.',
      lookahead: 'Salt while hot, plate immediately.',
      timer_seconds: 150,
      why_note: 'This is the colour cook. The inside is already done from earlier; you\'re now creating the shattering crust.',
    },
    {
      id: 'step_9_serve', title: 'Plate and serve immediately',
      content: "Pile the chips on a serving plate, lay the battered fish on top or beside, scatter sea salt flakes generously, and add lemon wedges. Serve straight away — fish and chips wait for nobody.",
      stage_note: 'Steam rises off the plate; batter is glassy and golden; chips are visibly crisp.',
      why_note: "From the moment they leave the oil, the clock is against you. Five minutes on the bench and the steam from the chips has softened the batter on the fish. The reason fish-and-chip shops wrap in butcher's paper, not plastic, is the same reason — paper lets the steam escape.",
    },
  ],
};

const FALAFEL: Recipe = {
  id: 'falafel',
  title: 'Falafel',
  tagline: 'Bright-green inside, shattering crust outside — the falafel of every good Beirut, Damascus, Amman and Ramallah street corner.',
  description: "Falafel's deepest roots are Egyptian — the fava-bean fritters called ta'amia, traditionally made by Coptic Christians during Lent. The chickpea version most Australians know is the Levantine adaptation, eaten daily across Palestine, Lebanon, Syria, and Jordan, where it's street food, breakfast, and the heart of a thousand sandwich shops. This is that recipe: dried chickpeas (never tinned), soaked overnight, blitzed raw with herbs and spices, fried until the outside shatters and the inside is bright green and tender. Made well, it's one of the great vegetarian dishes of the world.",
  base_servings: 4,
  time_min: 60,
  difficulty: 'intermediate',
  tags: ['falafel', 'middle eastern', 'levantine', 'palestinian', 'lebanese', 'syrian', 'chickpea', 'deep-fry', 'vegan', 'street food'],
  categories: { cuisines: ['levantine'], types: ['vegetarian'] },
  user_added: false,
  generated_by_claude: false,
  source: {
    chef: 'Levantine tradition',
    notes: "Falafel is a Levantine folk dish without a single author. Every household across Palestine, Lebanon, Syria, and Jordan has its own version. This is the consensus method — dried chickpeas soaked overnight, blitzed raw with herbs and spices, fried until the outside shatters.",
  },
  hero_fallback: fallback('#4A7A2E'),
  whole_food_verified: true,
  leftover_mode: { extra_servings: 2, note: 'Reheat in a hot oven (200 °C, 8 minutes) — never the microwave, which steams the crust soft' },
  total_time_minutes: 1560,
  active_time_minutes: 45,
  equipment: [
    "Food processor — not a blender, which will over-smooth the mixture",
    "Deep saucepan or Dutch oven — at least 6 cm oil depth",
    "Kitchen thermometer (highly recommended)",
    "Falafel scoop or two tablespoons",
    "Slotted spoon or spider strainer",
    "Wire rack or paper towel–lined tray for draining",
  ],
  before_you_start: [
    "Dried chickpeas only — soaked overnight. Tinned or pre-cooked chickpeas hold too much moisture; the mixture won't bind and will fall apart in the oil. There is no shortcut here.",
    "Grainy, not smooth. The blitz should give you a paste like damp sand with flecks of herb — if it looks like hummus, you've gone too far and the falafel will be dense.",
    "Test fry one first. Before you cook the whole batch, drop one falafel into the oil. If it falls apart, the mixture needs more blitzing or a little more flour. Catch it in the pot, not on 24 falafel.",
  ],
  mise_en_place: [
    "Soak the dried chickpeas in cold water for 24 hours (they'll double in size — use a big bowl). Drain and pat dry.",
    "Roughly chop the onion; peel the garlic.",
    "Wash and dry the parsley and coriander — excess moisture makes the mixture wet.",
    "Measure all spices into one small bowl.",
    "Set up the frying station: pot, thermometer, slotted spoon, rack or paper-lined tray nearby.",
    "Have all serve ingredients prepped and laid out — falafel wait for nobody.",
  ],
  finishing_note: "Taste one falafel the moment it's cool enough to eat. It should be distinctly seasoned — the outside slightly salty from the fry, the inside fragrant from the cumin and coriander. If the spice isn't coming through, add a pinch more ground cumin to the next batch. A squeeze of lemon over the falafel as you serve is not optional — it cuts the oil and lifts the herb flavour. The crunch is perishable: serve immediately.",
  leftovers_note: "Falafel is best eaten fresh. Cooked leftovers reheat in a 200°C oven for 8–10 minutes — they'll crisp back up. Do not microwave. Uncooked mixture refrigerates for up to 48 hours. Freezes well: portion into balls, freeze on a tray, then bag. Fry from frozen at 175°C for 5–6 minutes.",
  ingredients: [
    {
      id: 'chickpeas_dried', name: 'Dried chickpeas (never tinned)', amount: 250, unit: 'g',
      scales: 'linear', prep: 'Soaked in plenty of cold water for 12–24 hours, then drained and patted dry',
      scaling_note: 'Linear by weight, but watch the food processor capacity. 250 g of soaked chickpeas (~600 g hydrated) fills a 2 L processor bowl. Doubling means processing in two batches.',
      substitutions: [
        { ingredient: '50/50 dried chickpeas + dried fava beans (both soaked)', changes: "Closer to the original Egyptian ta'amia lineage. Fava beans add sweetness and a softer interior. Common in Egyptian, Syrian, and Palestinian recipes.", quality: 'great_swap', hard_to_find: true, local_alternative: "Dried fava beans at Middle Eastern grocers (called 'ful' or 'broad beans'); rare in Coles/Woolworths." },
        { ingredient: 'Dried fava beans only (the Egyptian ta\'amia version)', changes: 'A different dish in spirit, but legitimate and historically older. Slightly sweeter, paler green, softer texture. Same method.', quality: 'great_swap', hard_to_find: true },
      ],
    },
    {
      id: 'onion_falafel', name: 'Brown onion, small', amount: 1, unit: 'medium',
      scales: 'fixed', cap: 2, prep: 'Roughly chopped',
      substitutions: [
        { ingredient: 'Red onion', changes: 'Slightly sweeter, very common in Palestinian and Lebanese versions.', quality: 'perfect_swap' },
        { ingredient: 'Spring onion (white parts only)', changes: 'Lighter, more delicate. Use 6 stalks.', quality: 'good_swap' },
      ],
    },
    {
      id: 'garlic_falafel', name: 'Garlic cloves', amount: 4, unit: 'cloves',
      scales: 'fixed', cap: 8, prep: 'Peeled',
    },
    {
      id: 'coriander_fresh', name: 'Fresh coriander', amount: 30, unit: 'g',
      scales: 'linear', prep: 'Stems and leaves, roughly chopped',
      substitutions: [
        { ingredient: 'Double the parsley, omit coriander', changes: 'More straightforwardly herbal, less citrus-edge. Some Lebanese versions use parsley-only.', quality: 'good_swap' },
        { ingredient: 'Mint added (10 g) plus the coriander', changes: 'A Syrian and Palestinian variation. Brightens the whole mix.', quality: 'great_swap' },
      ],
    },
    {
      id: 'parsley_fresh', name: 'Fresh flat-leaf parsley', amount: 30, unit: 'g',
      scales: 'linear', prep: 'Stems and leaves, roughly chopped',
    },
    {
      id: 'cumin_ground', name: 'Ground cumin', amount: 1, unit: 'tsp',
      scales: 'linear', prep: 'Toasted whole and freshly ground if possible',
    },
    {
      id: 'coriander_ground', name: 'Ground coriander', amount: 1, unit: 'tsp',
      scales: 'linear',
    },
    {
      id: 'cayenne', name: 'Cayenne pepper (optional)', amount: 0.25, unit: 'tsp',
      scales: 'fixed', cap: 0.5,
      substitutions: [
        { ingredient: 'Aleppo pepper (sweet, mild, fruity)', changes: 'Closer to authentic Levantine flavour profile. Use double quantity — Aleppo is much milder.', quality: 'perfect_swap', hard_to_find: true, local_alternative: 'Middle Eastern grocers; some specialty spice retailers in Sydney/Melbourne.', quantity_note: 'Use ½ tsp — Aleppo is much milder than cayenne.' },
        { ingredient: 'Omit', changes: 'Many traditional Levantine versions include no heat. Authentic with or without.', quality: 'perfect_swap' },
      ],
    },
    {
      id: 'salt_falafel', name: 'Fine salt', amount: 1, unit: 'tsp',
      scales: 'linear',
      scaling_note: 'Linear, but taste a tiny pinch of the raw mixture before the rest — Australian salt brands vary slightly in saltiness.',
    },
    {
      id: 'black_pepper_falafel', name: 'Black pepper, freshly cracked', amount: 0.5, unit: 'tsp',
      scales: 'fixed', cap: 1,
    },
    {
      id: 'bicarb_soda', name: 'Bicarb soda', amount: 0.5, unit: 'tsp',
      scales: 'linear', prep: 'Added at frying time, not earlier',
      scaling_note: 'Timing matters more than amount. Add to only the batch you are about to fry — do not pre-mix a large batch and let it sit.',
      substitutions: [
        { ingredient: 'Increase baking powder to 2 tsp, omit bicarb', changes: 'Falafel will be lighter but lose the bright green colour and the slight savoury minerality. Bicarb is what gives the inside that distinctive green-yellow tone.', quality: 'compromise' },
      ],
    },
    {
      id: 'baking_powder_falafel', name: 'Baking powder', amount: 1, unit: 'tsp',
      scales: 'linear', prep: 'Added at frying time, not earlier',
    },
    {
      id: 'sesame_seeds', name: 'Sesame seeds (optional, for coating)', amount: 30, unit: 'g',
      scales: 'linear',
    },
    {
      id: 'frying_oil_falafel', name: 'Neutral oil for deep frying', amount: 1500, unit: 'ml',
      scales: 'custom', curve: { '2': 1000, '4': 1500, '6': 2000, '8': 2500 },
      scaling_note: 'Depth-driven, not serving-driven. 1.5 L fills a typical heavy-based household pot to about half. The pot must never be more than half full — same safety rule as fish & chips.',
    },
    {
      id: 'flatbread_serve', name: 'Lebanese flatbread or pita', amount: 4, unit: 'rounds',
      scales: 'linear', prep: 'Warmed',
      substitutions: [
        { ingredient: 'Greek-style pita (pocket bread)', changes: 'Smaller, thicker. Holds the falafel well but the bread-to-filling ratio shifts.', quality: 'good_swap' },
      ],
    },
    {
      id: 'hummus_serve', name: 'Hummus', amount: 1, unit: 'cup',
      scales: 'linear',
      substitutions: [
        { ingredient: 'Skip and double the tahini sauce', changes: 'Lighter, less starchy. Lebanese street-falafel sandwiches often skip the hummus.', quality: 'good_swap' },
      ],
    },
    {
      id: 'tahini_sauce', name: 'Tahini sauce (tahini + lemon + water + salt)', amount: 1, unit: 'cup',
      scales: 'linear',
    },
    {
      id: 'tomato_serve', name: 'Roma tomatoes', amount: 2, unit: 'medium',
      scales: 'linear', prep: 'Diced',
    },
    {
      id: 'cucumber_serve', name: 'Lebanese cucumber', amount: 2, unit: 'medium',
      scales: 'linear', prep: 'Diced',
    },
    {
      id: 'pickled_turnips', name: 'Pink pickled turnips (optional)', amount: 100, unit: 'g',
      scales: 'linear', prep: 'Sliced',
    },
    {
      id: 'lemon_falafel', name: 'Lemon', amount: 1, unit: 'whole',
      scales: 'fixed', cap: 2, prep: 'Cut into wedges',
    },
  ],
  steps: [
    {
      id: 'step_1_soak', title: 'Soak the chickpeas (the night before)',
      content: 'Tip the dried chickpeas into a large bowl and cover with at least 5 cm of cold water — they\'ll triple in size. Leave on the bench overnight, or up to 24 hours in cool weather; transfer to the fridge if your kitchen is warm. Drain well the next day and pat dry with a clean tea towel.',
      stage_note: 'Chickpeas have roughly tripled in volume and a fingernail can split one in half cleanly without resistance.',
      lookahead: 'Tomorrow you blitz, rest, fry. The 12–24 hour soak is what does the work — there is no shortcut.',
      timer_seconds: 43200,
      why_note: 'Soaked-but-uncooked chickpeas are the entire point of falafel. Tinned chickpeas are already cooked, and cooked chickpea purée is hummus. Falafel needs the structure of the raw bean — the proteins have not been broken down by heat yet, so the fritters hold together when they hit the oil instead of dissolving.',
    },
    {
      id: 'step_2_blitz', title: 'Blitz to coarse, not smooth',
      content: 'Tip the drained chickpeas into a food processor along with the onion, garlic, coriander, parsley, cumin, ground coriander, cayenne, salt, and black pepper. Pulse — do not run continuously — for about a minute, scraping the bowl down twice, until the mixture looks like coarse damp couscous. You should still see flecks of chickpea, not a smooth purée.',
      stage_note: 'Mixture is bright green-flecked and grainy. A pinch held tightly in your fist holds together briefly before crumbling.',
      lookahead: 'This rests in the fridge before you fry — the rest tightens the texture and the flavours marry.',
      why_note: 'Smooth purée gives you wet, dense fritters that fall apart in the oil. The coarse texture is what gives falafel its signature ragged crust and tender, distinct interior. If your processor over-runs, the dish is done — start again rather than push on.',
    },
    {
      id: 'step_3_rest', title: 'Rest 30 minutes in the fridge',
      content: 'Tip the mixture into a bowl, cover, and rest in the fridge for 30 minutes. Do not add the bicarb or baking powder yet — those go in just before frying.',
      stage_note: 'Mixture has firmed slightly and looks darker green from the herbs releasing.',
      lookahead: 'The bicarb-and-baking-powder addition is the final step before shaping.',
      timer_seconds: 1800,
      why_note: 'The rest lets the chickpea starch hydrate slightly from the herb moisture, which helps binding without turning the mixture wet. Skip this and the falafel can fall apart in the fryer; rest too long (over 2 hours) and the herbs go grey.',
    },
    {
      id: 'step_4_oil', title: 'Heat the oil',
      content: 'Pour the oil into a deep, heavy pot — never more than half full. Heat over medium-high to 175 °C. If you do not have a thermometer, drop a small pinch of the falafel mixture in: it should sink for a moment, then rise to the surface in a steady stream of bubbles.',
      stage_note: 'Test pinch sinks briefly, then rises within 3 seconds with steady bubbles around it. No splattering or violent fizz.',
      lookahead: 'While the oil heats, mix the bicarb and baking powder through and shape the falafel.',
      why_note: '175 °C is the falafel sweet spot. Hotter and the outside burns before the inside cooks; cooler and the falafel absorbs oil and goes greasy. The half-full pot rule is non-negotiable — overfilled oil is the most common kitchen-fire cause for deep-frying.',
    },
    {
      id: 'step_5_shape', title: 'Lift the mixture and shape',
      content: 'Sprinkle the bicarb and baking powder over the rested mixture and mix through gently with a fork — do not compact it. Take a heaped tablespoon at a time and shape into balls or small patties. If you have a falafel scoop, use it. Press sesame seeds onto one side if using.',
      stage_note: 'Falafel hold their shape on the bench without slumping. Surface is rough — not smoothed.',
      lookahead: 'Fry in batches as you shape — falafel shaped and held on the bench start to weep.',
      why_note: 'Bicarb and baking powder added at the last moment is the trick that makes home falafel light. Add them earlier and the leavening is wasted before the oil hits — the gas escapes through the rest. The rough surface is what gives the shattering crust; smoothing the falafel gives you a hard ball.',
    },
    {
      id: 'step_6_fry', title: 'Deep-fry in batches',
      content: 'Lower the falafel into the oil four or five at a time — never crowd. Fry for 3 to 4 minutes, turning once with a spider strainer halfway through. They\'re done when deep golden-brown all over.',
      stage_note: 'Outside is deep golden, almost mahogany. Lift one out and break it open: the inside is bright green-yellow, fluffy, and steaming.',
      lookahead: 'Drain on a wire rack — never paper towel — while you fry the rest.',
      timer_seconds: 210,
      why_note: 'Deep colour is the doneness signal — pale falafel is undercooked inside, mahogany falafel is overcooked. The bright-green interior is your check that the inside is hot through but not dried out.',
    },
    {
      id: 'step_7_serve', title: 'Build and eat now',
      content: "Warm the flatbread briefly. Spread with hummus, then pack with falafel, drizzle generously with tahini sauce, scatter the diced tomato and cucumber, add pickled turnips if you have them, and finish with a squeeze of lemon. Roll up tight or eat open.",
      stage_note: 'Falafel is hot, crust is crisp, fillings are bright and fresh.',
      why_note: "Falafel waits for nobody — five minutes on the bench and the crust softens. The classic Levantine sandwich is built in this exact order: hummus first as a moisture barrier on the bread, then falafel, then tahini, then salads, then pickles last for crunch and acid. Skip the order and the bread goes soggy from the bottom.",
    },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
//  Export — order reflects hone.html ordering, then kept v0 recipe, then
//  originals at the end.
// ────────────────────────────────────────────────────────────────────────────

export const SEED_RECIPES: Recipe[] = [
  SMASH_BURGER,
  PASTA_CARBONARA,
  ROAST_CHICKEN,
  HUMMUS,
  THAI_GREEN_CURRY,
  PAD_THAI,
  WEEKDAY_BOLOGNESE,
  LAMB_SHAWARMA,
  BUTTER_CHICKEN,
  BARRAMUNDI,
  PAVLOVA,
  // Phase 2 culinary-research batch (2026-05-03)
  CHICKEN_SCHNITZEL,
  CHICKEN_VEG_STIR_FRY,
  BEEF_LASAGNE,
  ROAST_LAMB,
  FISH_AND_CHIPS,
  FALAFEL,
];

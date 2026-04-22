# Competitive Analysis — the recipe-app landscape, honestly

_Date: 2026-04-19_
_Purpose: identify what every existing app fails at, so we don't rebuild the same failures. Each failure mode maps to a specific design decision in our app, tied to the 6 Golden Rules in CLAUDE.md._

No marketing language. No "we're better because we care." The question is: **what specifically do these apps do badly, why, and what do we do instead?**

---

## The apps people actually use

The market isn't crowded at the top — it's crowded with *the same five patterns wearing different skins*. Here's what each category actually is.

### 1. Paprika — the clipper (paid, ~$5/platform)
What it's good at: pulling recipes off any website, syncing across devices, grocery list consolidation, scaling, search. Treated by power users as "the iCloud of recipes."

What it's bad at: it is not a **cooking guide**. It hands you a recipe and steps aside. Steps are flat blocks of text imported from wherever. No stage cues, no doneness language, no "get the pan screaming hot" — whatever the source website wrote, that's what you get. When you're at the stove with oily hands, you're scrolling a glorified Safari reader view.

### 2. Yummly — the personalization/discovery engine (free, ad-laden)
What it's good at: ingredient-based filtering, dietary preferences, swipe-to-save.

What it's bad at: recipes are scraped from partner food blogs. Quality is wildly inconsistent — one recipe is from a Michelin kitchen's website, the next is a mommy-blog 800-word preamble with a 3-ingredient pasta. Ads are aggressive. The personalization optimizes for engagement, not for you cooking dinner. You leave the app having saved 40 recipes and cooked zero.

### 3. SideChef / Kitchen Stories — the video walkthrough
What it's good at: interactive step-by-step with voice, video per step, built-in timers. SideChef in particular tries to be cook-mode-first.

What it's bad at: **video is the wrong modality when you're cooking.** You can't scrub a video with wet hands. You have to wait for the video to get to "the point." Text + a single stage photo is faster to scan and faster to reference. Also: heavy sponsored content (Tyson chicken recipes, Kraft Velveeta recipes — the app's business model requires selling your cooking to CPG brands).

### 4. NYT Cooking — the editorial gold standard (paywalled, ~$5/mo)
What it's good at: the writing. Sam Sifton, Melissa Clark, Eric Kim — the recipes are genuinely tested, genuinely edited, with Notes sections that are worth reading.

What it's bad at: it's a **reader product** that someone bolted a timer to. No cook mode, no wake lock, no voice, no haptics. Designed for someone planning tomorrow's dinner on the couch, not cooking tonight's at the stove. The app is slow, the offline story is poor, and you're locked out if you haven't paid.

### 5. Tasty (BuzzFeed) — the top-down video
What it's good at: 60-second top-down videos are genuinely compelling. Great discovery.

What it's bad at: it's **entertainment that pretends to be instruction.** You watch and think you've learned. Then you try to cook it and realize the 60-second video hid 40 minutes of prep. No "why." No doneness cues. The whole business is ads.

### 6. Samsung Food (formerly Whisk) — the meal planner
What it's good at: recipe collection + weekly meal plan + shopping list, feature-packed.

What it's bad at: it's trying to be a social network, a meal planner, a recipe clipper, and an AI assistant. Result: bloat. The shopping list is mediocre (not aisle-aware). Recipe detail screens are ad-heavy. Samsung acquired it to sell fridges — product priorities reflect that.

### 7. AnyList — the shopping list god
What it's good at: the best shared shopping list on Android or iOS, full stop. Voice add, aisle-smart, shared with your partner, syncs instantly.

What it's bad at: not really a recipe app. You can paste recipes in, but there's no cook mode, no stage photos, no chef guidance. It's a list app with a recipes tab.

### 8. Copy Me That / RecipeKeeper — other clippers
Same class as Paprika. Cheaper or free. Same limitations: they manage recipes, they don't guide cooking.

### 9. BBC Good Food / Allrecipes — the content farms
What they're good at: SEO. Volume. Everybody's mum has used Allrecipes at least once.

What they're bad at: ad-laden, covered in display ads and video pre-rolls, food-blog prose ("this dish reminds me of my summer in Tuscany…" before the actual recipe), stock photos, inconsistent quality, comment sections full of "I made this but substituted everything and it was perfect." No cook mode. No accessibility work. They're optimised for a Google search to a web page, not a phone at the stove.

### 10. ChatGPT / Gemini as "recipe" tools
Worth naming because users increasingly go here first. Strengths: flexible, can adapt to what's in the fridge. Weaknesses: hallucinates ratios and times, no photo of what it should look like, no attribution, no testing. The answers *look* authoritative. They frequently aren't. A pro chef would spot the errors; a new cook won't, and ends up with a ruined dinner blaming themselves.

---

## The shared failure modes

Across all of these, the same problems keep appearing. This is what to beat, specifically.

### Failure 1: Video is treated as the premium format
**Why it's broken:** video is linear. Cooking is non-linear — you scan, jump back, re-reference. A 3-minute video can hide a 45-minute cook. And you can't scrub it with oily hands.
**Who does it:** Tasty, SideChef, Kitchen Stories, Yummly, most YouTube-integrated apps.
**What we do:** **text + one stage photo per step is the canonical format.** Video can exist as an optional fallback (link to Andy Cooks' original), never as the primary. Rule #5 locks this: *stage-by-stage photos*, not video.

### Failure 2: Glamour shot only — no stage photos
**Why it's broken:** the single biggest reason recipes fail is "mine doesn't look like the picture" — because the picture is of the *finished* dish, and the user has nothing to compare their *in-progress* pan to. "Is the onion brown enough? Is the sauce tight enough? Is the crust dark enough?" Without a reference photo *at that stage*, the user guesses wrong.
**Who does it:** literally every app listed, including NYT Cooking.
**What we do:** Rule #5 is not optional — every step has a real photo of what the food should look like *at that moment*. This is our single biggest lever against competitors.

### Failure 3: Food-blog prose
**Why it's broken:** people came to cook, not to read. Prose pads word count for SEO and ad impressions. It destroys scan-ability.
**Who does it:** BBC Good Food, Allrecipes, Yummly's sourced content, most scraped-recipe apps.
**What we do:** Golden Rule #6 + voice rules. Short, direct, present-tense imperatives. Zero preamble. The "why" appears *inline in the step*, not in a 400-word story about a summer in Provence.

### Failure 4: Times as source of truth, not doneness cues
**Why it's broken:** "cook 5 minutes" varies by pan, heat, altitude, starting temp. A user who follows the clock ends up with under- or over-cooked food and no idea why. A pro chef reads the pan, not the timer.
**Who does it:** Paprika (imports whatever the site said), most clipped recipes, Allrecipes, BBC Good Food.
**What we do:** every step has a **doneness cue** (`stage_note` in our schema) — visual/aural/olfactory. Timer is a backstop, not the signal. The UI shows the cue *prominently* and the timer *secondarily*.

### Failure 5: No anticipation — you learn what's next only when you get there
**Why it's broken:** cooking has physical parallelism. While the onions soften you should be measuring the stock. Most apps show step N with no hint of step N+1, so you end up standing there stirring, having done no prep for the next move. Pro recipes bake anticipation in ("while that reduces, grate the cheese…"). Most apps strip this out when they import.
**Who does it:** every clipper, every scraped-recipe app, NYT Cooking (mildly better because the prose sometimes hints).
**What we do:** the chef-guide voice (CLAUDE.md) explicitly includes *anticipation*. "In about 90 seconds we'll need the stock — measure it now." The step content gets a `lookahead` field that surfaces as a secondary line on screen.

### Failure 6: Dumb scaling
**Why it's broken:** doubling a recipe does not mean doubling everything. Salt caps out. Rice-to-water is non-linear. A pinch of herbs per person has a ceiling. If 1 person needs "a pinch," 6 people do not need "6 pinches."
**Who does it:** Paprika, Yummly, NYT Cooking — almost all of them multiply every ingredient by the same scalar.
**What we do:** Golden Rule #3. Each ingredient carries `scales: "linear" | "fixed" | "custom"`. "Custom" is a lookup table (for rice ratios, stock ratios, etc.). Leftover mode adds a second multiplier. This is a hard differentiator.

### Failure 7: The "hands are busy" failure
**Why it's broken:** during cooking, your hands are raw-chicken dirty or oily. You are not tapping tiny buttons with a clean index finger. Most apps have you pecking at small "Next" buttons with the cleanest knuckle you can find.
**Who does it:** NYT Cooking, Paprika, Allrecipes, most clippers — cook mode is cramped and tap targets are small.
**What we do:** a **knuckle-tap cook mode** — the current step fills the whole screen, a tap anywhere on the lower two-thirds advances to the next step, an upward swipe goes back. Visual feedback plus haptic confirmation (`expo-haptics`). Screen doesn't sleep (`expo-keep-awake`). No voice — voice is unreliable in a loud kitchen and adds a microphone permission we don't want to justify to Play review. Knuckle-tap works even with flour-covered hands.

### Failure 8: Attribution laundering
**Why it's broken:** half the "recipes" on Allrecipes and Yummly are lightly-edited versions of a chef's actual recipe with no credit. Rule #2 calls this what it is: theft.
**Who does it:** every scraper-based clipper, every content farm.
**What we do:** every chef-inspired recipe carries `source: { chef, video_url, notes }` in the schema. The recipe card prominently shows "Inspired by Andy Cooks — watch the original." If we can't link to the source, the recipe doesn't ship.

### Failure 9: No offline
**Why it's broken:** the kitchen is often the worst-connectivity room in the house. Thick walls, fridge/microwave EMI, router in another room. A dropped connection mid-recipe is catastrophic.
**Who does it:** NYT Cooking (weak offline), Yummly (bad), most web-wrapper apps.
**What we do:** **offline-first.** SQLite as the source of truth. Recipes load from local storage. Photos are pre-cached. Network is for sync and updates, never for rendering the recipe.

### Failure 10: Accessibility as afterthought
**Why it's broken:** 20% of your users will want text scaled up. Older users, users with tired eyes after work, users in dim light. If your layout breaks at 150% text scale, you've excluded them.
**Who does it:** most recipe apps break at 150% scale. TalkBack labels are often missing on interactive elements.
**What we do:** every control has a TalkBack label. Every layout survives 200% scale. Contrast meets WCAG AA in both light and dark themes. This is baseline, not polish.

### Failure 11: Bloat — trying to be everything
**Why it's broken:** once an app adds social feeds, chat, shopping integrations, meal delivery partnerships — the core cooking loop gets buried under tabs. Samsung Food is the poster child.
**Who does it:** Samsung Food, Yummly, SideChef.
**What we do:** CLAUDE.md Rule: features that don't serve a stage of `pick → gather → prep → cook → plate → eat` don't ship. No social feeds. No "likes." No calorie shaming. No meal delivery partnerships. Four bottom-tab destinations, max.

### Failure 12: Monetization via dark patterns
**Why it's broken:** ads interrupt cooking. Upsell modals in the middle of a step. "Unlock this recipe for $0.99" paywalls. You came to cook, not to be sold to.
**Who does it:** Yummly, Tasty, BBC Good Food, Allrecipes.
**What we do:** **v1 is free, no ads, ever.** If we ever monetize, it's a flat-fee pro tier (sync, premium recipes, Apple CarPlay mode). Ads break trust and trust is the product.

---

## Our 12 design commitments (direct responses)

| # | Competitor failure | Our response | Tied to Rule |
|---|---|---|---|
| 1 | Video as primary | Text + stage photo primary; video link optional | #5 |
| 2 | Glamour shot only | Real hand-shot photo on *every* step | #5 |
| 3 | Food-blog prose | Present-tense imperatives, zero preamble | Voice rules |
| 4 | Time-driven | Doneness cue primary, timer secondary | Voice rules |
| 5 | No anticipation | Each step has a `lookahead` field | Voice rules |
| 6 | Dumb scaling | linear / fixed / custom per ingredient | #3 |
| 7 | Hands-busy failure | Knuckle-tap cook mode (huge tap zones) + haptics + wake lock | CLAUDE.md Android |
| 8 | Attribution laundering | `source` mandatory; visible on card | #2 |
| 9 | No offline | SQLite + pre-cached photos | CLAUDE.md Android |
| 10 | Accessibility afterthought | TalkBack + 200% text + contrast AA, baseline | CLAUDE.md Android |
| 11 | Bloat | 4 tabs max, every screen serves a stage | Core loop |
| 12 | Ad-driven monetization | Free, no ads ever, optional pro tier later | #6 |

---

## What we deliberately skip (and why)

So we don't drift:

- **Social feeds** — people don't cook better because they saw a stranger's plate. Rule: every feature serves a cooking stage.
- **Calorie tracking** — broken by default (measurements of home-cooked food are wildly inaccurate), encourages unhealthy relationships with food. If a user wants this, they have MyFitnessPal.
- **"AI recipe" as generic slop** — every app is slapping a chatbot on and calling it a feature. We do the opposite: our pantry-to-recipe feature (see below) is *specifically* in a named chef's style with a visible disclaimer that it's a Claude-invented variation, not their recipe. Rule #6 lives in the attribution. An AI recipe that pretends to be authoritative (like ChatGPT does) is worse than no AI at all.
- **Web clipper** — Paprika owns that space. If users want it, they can paste recipes into our add-recipe form. We're not competing on import breadth.
- **Shopping list as main pillar** — AnyList is better at raw list mechanics. Our shopping list is *derived* from the meal plan, aisle-ordered for the user's primary store, and good enough. We don't try to beat AnyList at its own game.
- **Meal delivery partnerships** — Rule #6: honest about limitations. We don't sell your cooking to Tyson.

---

## The single-sentence positioning

> Every other recipe app treats you like a reader. This one treats you like a line cook with a head chef in your pocket, from the first chopped onion to the plated dish.

---

## The kill feature: pantry → recipe, honestly attributed

Everyone else does one of two bad versions of this:

1. **Yummly / AnyList / Samsung Food** — filter existing scraped recipes by ingredients you have. You end up with "32 matches" of varying quality, most of which need ingredients you don't actually have because the match is fuzzy.
2. **ChatGPT / Gemini** — generate a recipe from scratch. No attribution, no testing, frequently wrong ratios, and you can't tell when it's bluffing.

Neither is honest. Ours is:

**Stage 1 (client-side, free, instant):** user lists pantry items; app scores every recipe in its library against the list. Top matches shown with "You have 8/10 ingredients — missing: X, Y." No network call. No cost. Rule #6 respected.

**Stage 2 (optional, only on user request):** if the user taps "Invent me something," the app sends the pantry list + the user's preferred chef styles to a small backend (Cloudflare Worker, ~50 lines) which calls the Claude API and returns a structured recipe in our schema. The generated recipe carries:

- A `generated_by_claude: true` flag and a visible banner: *"Loosely inspired by Andy Cooks' technique — this is a Claude-invented variation, not his recipe."*
- Explicit confidence notes on anything unusual: *"I'm guessing on the salt — start with half and adjust."*
- The same structured fields as every other recipe (stage cues, why-notes, timers) so cook mode works on it identically.

**Cost math:** Claude Sonnet call is ~$0.01 per recipe. At 1000 free active users with 2 generations/week = $80/month. Sustainable or cap-able. If we ever monetise, "unlimited invention" is a natural pro-tier line.

**Why this wins:** it is the only app that makes "what can I cook with what I have?" work honestly. Yummly hands you 40 matches with 80% accuracy. We hand you the three best matches in your library, and if none are good enough, we admit it and offer to invent one — with attribution and flagged uncertainty.

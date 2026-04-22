# Simmer Fresh — Development Roadmap

> Last updated: 2026-04-22. This is the working build plan. Update it as phases complete or priorities shift.

## Status legend
- ⬜ Not started
- 🔄 In progress
- ✅ Done

---

## Phase 1 — Live PWA on your phone
**Goal:** Patrick can open a URL on his Android phone and test the app after every change.  
**Delivery:** GitHub Pages (patrickpatches account, no new accounts needed)  
**Effort:** ~1–2 hours

- ✅ mise.html prototype (22 recipes, core loop)
- ⬜ Create GitHub repo `simmer-fresh` under patrickpatches
- ⬜ Deploy mise.html to GitHub Pages → `patrickpatches.github.io/simmer-fresh`
- ⬜ Verify it loads and is usable on Android Chrome

---

## Phase 2 — Data foundation (substitutions schema)
**Goal:** Every ingredient in every recipe has a `substitutions[]` array. This is the foundation for the shopping list, ingredient swaps, and the future pantry feature.  
**Effort:** ~1 session

- ⬜ Update Zod schema in `mobile/src/data/types.ts` to add `substitutions[]` per ingredient
- ⬜ Add `categories[]` (cuisine + type) and `whole_food_verified: true` to recipe type
- ⬜ Rewrite existing seed recipes to conform to new schema
- ⬜ Validate schema passes Zod checks

---

## Phase 3 — Recipe library expansion
**Goal:** 30–40 recipes across all category axes. Chef-attributed. Every ingredient has substitutions. No preservatives.  
**Sources:** Andy Cooks, Joshua Weissman, Gordon Ramsay (inspired, attributed, linked)  
**Effort:** 2–3 sessions

**Cuisine targets:**
- ⬜ Levantine — musakhan, kafta, hummus, fattoush, kibbeh, shawarma (no Israeli labels)
- ⬜ Indian — butter chicken (from scratch), dal tadka, biryani, saag paneer
- ⬜ Malaysian — nasi lemak, laksa, char kway teow, rendang
- ⬜ Japanese — ramen, teriyaki chicken, gyoza, miso soup (real miso)
- ⬜ Thai — green curry, pad thai, tom yum, larb
- ⬜ Italian — carbonara, risotto, bolognese, pizza dough
- ⬜ American — smash burger, BBQ brisket, mac and cheese (from scratch)
- ⬜ Australian — barramundi, lamingtons, pavlova, kangaroo (if appropriate)

**Type targets:**
- ⬜ Burgers — smash burger (existing), chicken burger, lamb burger
- ⬜ Seafood — prawns, barramundi, salmon, fish tacos
- ⬜ Chicken — roast chicken (existing), adobo (existing), katsu, shawarma
- ⬜ Soups & Stews — beef stew (existing), french onion (existing), ramen (existing)

---

## Phase 4 — Shopping list feature
**Goal:** From any recipe (or multi-recipe plan), generate a grouped, checkable shopping list scaled to serving count.  
**Effort:** 1–2 sessions

- ⬜ Shopping list screen in Expo app
- ⬜ Group by aisle: produce, meat/seafood, pantry, dairy, bakery
- ⬜ Scale quantities to selected serving count
- ⬜ Check-off items (persisted in SQLite)
- ⬜ Flag hard-to-find Australian ingredients with local alternatives
- ⬜ Share/export list (share sheet)

---

## Phase 5 — Ingredient substitutions UI
**Goal:** Every ingredient line in a recipe has a dropdown showing alternatives with honest notes on what changes.  
**Effort:** 1 session

- ⬜ Substitution dropdown component
- ⬜ Triggered by tapping ingredient
- ⬜ Shows: alternative ingredient, what changes (flavour/texture/appearance), good swap or compromise rating

---

## Phase 6 — Cook mode
**Goal:** Full-screen step-by-step cook experience. Dark mode. Screen stays on. Haptics on step advance.  
**Effort:** 1 session

- ⬜ Cook mode screen
- ⬜ Wake lock (screen stays on)
- ⬜ OLED dark mode (true blacks)
- ⬜ Haptic confirmation on step advance
- ⬜ Doneness cues displayed prominently over timers
- ⬜ Why-notes available on tap

---

## Phase 7 — Play Store submission prep
**Goal:** Everything Google needs to approve and publish the app.  
**Depends on:** Play Console identity verification completing (~1 week wait)  
**Effort:** 1 session

- ⬜ Play Console verification confirmed
- ⬜ EAS production build (.aab) generated
- ⬜ Store listing: description, screenshots, feature graphic
- ⬜ Privacy policy (required by Play Store)
- ⬜ Data safety form completed
- ⬜ Submit to internal testing track
- ⬜ Patrick tests on device from Play Store
- ⬜ Submit for review → production

---

## Kill feature (post-launch or late v1)
**Pantry → recipe generation**
- Stage 1: client-side ingredient matching (free, offline)
- Stage 2: "invent me something" → Claude API → recipe in a chef's style
- Design doc: `docs/pantry-to-recipe.md`

---

## Accounts (Patrick's ownership)
| Account | Username/ID | Status |
|---|---|---|
| GitHub | patrickpatches | ✅ Active |
| Expo/EAS | patrick.nasr | ✅ Active |
| Google Play Console | patrick.nasr11@gmail.com | 🔄 Identity verification pending |
| Cloudflare | — | Not created |

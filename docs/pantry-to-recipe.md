# Pantry → Recipe — the kill feature

_Why this exists:_ it's the feature no one else does honestly, and it is the single strongest reason to pick this app over the alternatives. Yummly has pantry-matching but it scrapes recipes of wildly varying quality. ChatGPT invents recipes but has no attribution and hallucinates ratios. This doc is the design for a version that beats both by being honest about what it's doing.

## User story

"I have half an onion, a tin of tomatoes, some pasta, and half a bag of spinach. What can I cook?"

## Two-stage architecture

### Stage 1 — match existing recipes (client-side, always runs, free)

When the user opens the Pantry screen, they see a list of ingredients they've added. Under the list, the app scores every recipe in its library against the pantry and shows the top matches.

**Scoring model** (intentionally simple, readable, debuggable):

```
score(recipe, pantry) =
    ingredients_matched / total_ingredients   // coverage 0.0–1.0
  - 0.2 × missing_essential_count             // penalty for missing key ingredients
  + 0.1 × bonus_if_pantry_has_all_aromatics   // reward for aroma-complete matches
```

Essential ingredients are flagged in the recipe schema (`essential: true`). If a recipe's `essential` list has gaps against the pantry, it's either skipped or shown with a clear "you'd need to shop for X first" note.

**What the user sees:**
- Top 3–5 recipe cards, each labelled "You have 7 of 9 ingredients — missing: parmesan, wine."
- The missing items become a one-tap add to the shopping list.
- No network call. Runs instantly even offline.

This stage ALONE beats Yummly, because the recipe library is hand-curated chef-inspired recipes with real stage photos — not scraped blog posts.

### Stage 2 — invent a recipe (optional, user-triggered, costs money)

If the user taps **"Nothing feels right — invent me something"**, the app does the following:

1. Client sends the pantry list + the user's preferred chef styles (from recently-cooked history, or explicit selection) + serving count to a Cloudflare Worker.
2. Worker calls the Anthropic API (Claude Sonnet) with a carefully structured prompt:
   - Full recipe schema as the required output format (zod JSON schema → JSON mode).
   - Chef-style reference: "Write this in the technique-first, no-fluff voice of Andy Cooks. Short imperative sentences. Doneness cues over times. Include why-notes for non-obvious steps."
   - Pantry constraint: "Use only these ingredients plus a 'probably-in-the-cupboard' pantry staples list (salt, pepper, oil, flour, sugar, dried herbs)."
   - Honesty constraint: "If you're unsure about a quantity or technique, include an `uncertainty_notes` field explaining what you're guessing at."
3. Worker validates the response against the zod schema. If invalid, retries once with error feedback. If still invalid, returns an error to the client.
4. Client displays the recipe with a persistent banner: **"Loosely inspired by Andy Cooks' technique — this is a Claude-invented variation, not his recipe."** The `uncertainty_notes` if any are shown inline at the relevant steps.

## Rules this enforces

- **Rule #2 — credit the source chef.** Generated recipes carry the chef's name as the style reference, with the honest qualifier that they didn't actually write this one.
- **Rule #6 — honest about limitations.** The `uncertainty_notes` are the model saying "I don't know." That's shown to the user, not hidden.
- **Rule #1 — research-backed UX.** The chef-style constraint forces the LLM into voice and structure consistent with the rest of the app, not a random blog tone. The knowledge-cutoff-adjacent failure mode of LLMs inventing techniques is muted by the "stick to known techniques in this chef's style" guardrail.

## Why not just use ChatGPT directly

Users can and do. They get: no structure, no cook mode compatibility, no scaling metadata, no stage photos, no offline, no schema, no attribution. It's a single paragraph of text that they then have to mentally convert to "what do I do now."

Our version gives them a recipe that **works with cook mode, scales properly, attributes honestly, and ships with the structured fields the rest of the app expects.** It's a Claude recipe rendered as a real recipe, not a chat reply.

## Anti-patterns we're avoiding

- **Silent substitutions.** The model might want to say "no parmesan? use cheddar." We let it, but it annotates: *"Swapped parmesan for cheddar because pantry. Parmesan would give a drier, more pungent finish — cheddar melts softer, so the ragù will be richer but less savoury."* So the user learns *why*, not just *what*.
- **Hiding the AI.** Some apps do AI features and hide them. We don't. The generated-banner is visible throughout, and the recipe detail shows the full prompt/constraint set if the user taps "why did Claude suggest this?"
- **Unbounded cost.** Free users get N generations per week (default 5). Soft cap resets Sunday. Hard cap for logged-in pro users is higher. This is the natural monetisation lever — no ads, no dark patterns, just "pay if you generate a lot."

## Cost model

- Claude Sonnet 4.6 call: ~2k tokens in + 1k out = ~$0.012 per generation.
- Cloudflare Worker: $0 for first 100k requests/day.
- Free users at 5/week = $0.06/user/month worst case.
- 1000 free actives = $60/month cost.
- A small "pro" tier ($2/month unlimited) covers itself after ~35 generations, which is way beyond normal use.

## What we build in which order

1. **Stage 1 first**, on Pantry screen. No backend. No API key. Pure client code scoring the seed recipes. This alone is a feature.
2. **Stage 2 in week 3–4**, once Recipe Detail + Cook Mode work so generated recipes have a place to land. Deploy the Cloudflare Worker then.
3. **Rate limiting / pro tier in post-launch**, only if it's actually needed. Don't prebuild monetisation.

## Open questions

- **How does the model know chef styles?** Not from training-data recall — we provide style descriptors in the prompt: "Andy Cooks: technique-first, confident, blunt, zero preamble, doneness cues." Those style descriptors live in `docs/chef-styles.md` (to be written). This keeps the chef attribution honest — we're not claiming Claude knows the chef, we're telling Claude how to write in that mode.
- **Should we cache generations?** If two users with similar pantries both ask "pasta night," can we reuse a generation? Probably not — generations are personalised by pantry, and caching risks serving stale recipes. Skip.
- **Should we let users save generated recipes?** Yes. Already in the HTML prototype — saved generations carry the `generated_by_claude: true` flag forever, so the banner stays even in the user's saved library.

# ADR 002 — Delivery: PWA first, Play Store second, same codebase

_Date: 2026-04-19_
_Status: Accepted_
_Supersedes: nothing. Complements ADR 001._

## Decision

**Ship the web build (PWA) as the primary test surface during development, and target Google Play Store for the public v1 release — from a single Expo codebase.**

## Context

Patrick asked whether to go browser-based or native. The real answer is neither and both: Expo outputs iOS, Android, and web from one codebase, so this is not a binary choice. The question becomes *which target gets shipped first* and *whether the dual-target story degrades the final product*.

## Rationale

### Why PWA first

- **Zero phone-side friction.** Open a URL, "Add to Home Screen," done. No Expo Go install, no Play Store submission, no ID verification blocking testing, no dev account needed.
- **Instant iteration.** `npx expo start --web` serves a hot-reloading dev build over local network. Every edit shows on Patrick's phone in ~1 second. This is faster than the native Expo Go loop (which is already fast).
- **No blocker for testing.** Play Console identity verification takes 1–2 weeks. PWA testing can happen today.
- **Free deploy surfaces.** Cloudflare Pages, Vercel, Netlify — all free for our traffic level. Deploy on every merge.

### Why native still matters (not skipping it)

- **Play Store discovery.** The PWA is invisible to the ~80% of users who find apps via Play search. Production launch requires Play Store presence.
- **True offline.** Service workers are good but flaky on long timescales and some Android vendors aggressively evict PWA caches. A native app with bundled recipes doesn't have this problem.
- **Install trust.** Users trust Play Store apps more than "add this website to home screen." For a product positioned around honesty and quality, the install story matters.
- **Home screen widget potential.** PWA can't surface a "what's for dinner tonight" widget on the Android home screen; a native app can. Not v1, but on the roadmap.

### Why dual-target doesn't degrade the product

- **Expo handles the fork automatically.** Import the same components, read the same data, render the same UI. Platform-specific code lives in `.native.tsx` / `.web.tsx` file suffixes or `Platform.OS` branches where needed — rare for our stack.
- **Native-only features degrade gracefully on web.** Haptics are a no-op in browsers (acceptable — the interaction still works, just without the buzz). Wake Lock has a web API that works in Chrome mobile. SQLite has a WASM web shim. The worst-case degradation is "slightly less polished on web," not "broken."
- **One codebase = one bug surface.** No sync drift between a web prototype and a native app. What's on the PWA is what will be on Play Store, minus a few fidelity details.

## What changes from ADR 001

- `package.json` adds nothing — the web target is already built into `expo` + `expo-router`.
- `metro.config.js` already supports web via `withNativeWind`.
- A new deploy pipeline (Cloudflare Pages) gets wired up. This is a one-time setup, not per-feature work.
- For genuinely native-only interactions (Android-system-level wake lock, notification channels, home-screen shortcuts), we ship them only in the native build. The web version gets a comparable JS-only fallback or a no-op.

## Delivery sequencing

- **Weeks 1–4**: develop against web. Daily pushes to Cloudflare Pages. Patrick tests on phone's Chrome → home screen.
- **Week 4**: first EAS native build to Play Console internal testing track.
- **Weeks 4–5**: closed testing, feedback, native bug fixes.
- **Week 6**: Play Store production submission.
- **Post-launch**: PWA keeps running for iPhone users and desktop users for free — no additional work required.

## Consequences

**Good:**
- Patrick has an app on his phone today, not in three weeks.
- Dev loop is the fastest possible: edit → save → refresh phone.
- Two products (PWA + Android native) from one codebase — Play Store native for distribution, PWA as the fallback for anyone on a browser.
- No lock-in: if Play Store review rejects us, the PWA still ships.

**Bad:**
- Some native-polish features (rich haptics, screen-on-across-sessions wake lock, home widgets) don't work on web. Acceptable — they only need to work on the final Android build anyway.
- PWA install UX is less discoverable than a Play Store install. Users have to know to tap "Add to Home Screen." Acceptable because PWA is the dev/beta surface, not the public launch.
- Two deploy pipelines (Cloudflare Pages + EAS Build). Both are free. Small ops cost.

## Reversal cost

Near zero. Dropping the PWA target later costs one deploy script. Dropping the native target later loses Play Store access. Neither is disruptive to reverse.

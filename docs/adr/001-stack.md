# ADR 001 — Stack: Expo (React Native) + TypeScript

_Date: 2026-04-19_
_Status: Accepted_

## Decision

**Expo (React Native) with TypeScript, expo-router for navigation, and NativeWind for styling.**

## Context

Android-first app shipping to Google Play Store. Target: June 2026 (~6–8 weeks). One developer. Existing prototype is a single-file React + Tailwind HTML (2960 lines, runs in browser). CLAUDE.md mandates: voice input, haptics, wake lock, offline-first, accessibility baseline, Play Store compliance. The stack choice was between **Expo / React Native**, **Flutter**, and **native Kotlin**. Kotlin was ruled out in CLAUDE.md as too slow for v1.

## Forces

- **Timeline**: 6–8 weeks. Non-negotiable.
- **Existing code**: React + Tailwind. ~70% of component logic in the prototype will port to RN with small surface edits; Flutter requires Dart, full rewrite.
- **Test-on-device loop**: Patrick explicitly stated "test it regularly." The inner dev loop has to be instant.
- **Native modules required**: voice input (SpeechRecognizer), haptics, wake lock, SQLite, image caching, filesystem access, deep links to YouTube.
- **Single dev**: no specialization possible. Whatever stack wins has to be learnable on the job.
- **OTA updates**: post-launch bug fixes should not require a new Play Store submission and review cycle (3–7 days each).

## Decision rationale

| Factor | Expo/RN | Flutter | Winner |
|---|---|---|---|
| Port effort from HTML prototype | Low — component structure maps 1:1; NativeWind handles Tailwind classes | High — rewrite every component in Dart | **Expo** |
| Inner dev loop (hot reload on phone) | Expo Go: scan QR, instant | Flutter: requires Android Studio or USB debugging, slower initial setup | **Expo** (significant) |
| Voice/haptics/wake-lock package maturity | First-class Expo packages (`expo-haptics`, `expo-keep-awake`, `react-native-voice`) | Plugins exist but are plugin-quality, not first-party | **Expo** |
| Native-feeling polish | Good with Material 3 libraries (React Native Paper, react-native-unistyles) | Slightly better out of the box | **Flutter** (marginal) |
| 60fps under load | Usually adequate; occasional jank with complex lists | Consistently smooth | **Flutter** (marginal) |
| OTA updates post-launch | EAS Updates — ship JS fixes without Play Store re-review | Shorebird exists but paid and less mature | **Expo** |
| Community size, hiring options | Massive | Growing, still smaller | **Expo** |
| Learning curve from existing React skills | Negligible | New language (Dart), new idioms | **Expo** |

Flutter wins on polish and 60fps rendering. For a cooking app — static text, static photos, occasional fade transitions, a timer ring — neither is the limiting factor. The UX quality is gated by **stage photography quality**, not rendering performance.

Expo wins decisively on the two things that matter most for this project: **time-to-first-working-screen-on-your-phone** (the test-regularly requirement) and **porting cost** (the prototype is already React).

## Stack specifics

- **Runtime**: Expo SDK 52+ (most recent stable at scaffold time)
- **Language**: TypeScript, strict mode
- **Navigation**: `expo-router` (file-based routing, type-safe params)
- **Styling**: `NativeWind` v4 — Tailwind classes for RN, identical to the HTML prototype
- **Fonts**: `expo-font` + bundled Fraunces + Manrope assets (not runtime-loaded from Google)
- **State**: React's `useState` + `useReducer` + `AsyncStorage` for small stuff; SQLite for recipes and meal plan
- **Database**: `expo-sqlite` with a migration system; seeded from markdown at build time
- **Image handling**: `expo-image` (with caching, blurhash placeholders)
- **Voice input**: `react-native-voice` (Android built-in SpeechRecognizer — offline, no cloud STT → privacy + works without internet)
- **Haptics**: `expo-haptics`
- **Wake lock**: `expo-keep-awake` (toggled on entering cook mode, off on leaving)
- **Build**: EAS Build (managed) for Play Store AABs
- **OTA**: EAS Updates for JS-only patches post-launch

## Out of scope for v1

- Backend / accounts / sync → none. Local SQLite only. Add later if users ask.
- Push notifications → none. Adds complexity, FCM setup, privacy disclosures. Not needed for core loop.
- Analytics → none at launch. Adds tracking disclosure burden. Add post-launch if retention questions emerge.
- iOS build → deferred per CLAUDE.md. Expo makes this nearly free later; not the critical path now.

## Consequences

**Good:**
- Patrick can scan a QR code tonight and see the Home screen on his phone.
- Every edit in the editor hot-reloads in under 2 seconds.
- Post-launch fixes ship in minutes via EAS Updates, not days via Play Store.
- Single codebase ready for iOS later without rewrite.

**Bad:**
- If we ever need serious 60fps animation (e.g., a complex cook-mode animation sequence), we may hit RN performance walls and need to drop to native code. Acceptable.
- Expo's managed workflow imposes some constraints on native modules; if we need something exotic, we'd eject to bare workflow. Unlikely for this product.
- RN bridge overhead on Android is real but invisible for our use case.

## Reversal cost

High. Switching to Flutter after 2 weeks means rewriting. This decision should not be revisited casually. Commit.

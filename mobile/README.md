# Meal Master — the app

Expo + React Native + TypeScript. Android-first.

## Run it on your phone tonight

The fastest path is **Expo Go** — install one app from the Play Store, scan
a QR code, you're cooking. Real haptics, real wake-lock, real native feel.
Hot reload under 2s when you edit code on your PC.

### One-time setup on your PC

1. Install Node 18 or newer: <https://nodejs.org>
2. Open a terminal in this `mobile/` folder.
3. Install dependencies:

   ```bash
   npm install
   ```

   First install takes 3–5 minutes. Subsequent runs are instant.

### One-time setup on your phone

Install **Expo Go** from the Play Store:
<https://play.google.com/store/apps/details?id=host.exp.exponent>

### Every time you want to run the app

```bash
npx expo start
```

A QR code appears in the terminal. Open Expo Go on your phone, tap "Scan
QR code," point at the screen. The app downloads to Expo Go and opens.

**Phone and PC must be on the same wi-fi network.** If your wi-fi is
weird about device-to-device traffic (some hotel/office networks block
it), add `--tunnel`:

```bash
npx expo start --tunnel
```

Slower (routes through Expo's servers) but works on any network.

### When you edit code

Save the file. The phone reloads in 1–2 seconds. Shake the phone for the
dev menu (reload, inspect, performance overlay).

## Run it as a website (PWA — alternative)

If Expo Go isn't an option (no Play Store access, want to test the web
build, want to share a link), Expo also compiles to a regular website.

```bash
npx expo start --web
```

Opens at `http://localhost:8081`. To open it on your phone, find your
PC's local IP (Windows: `ipconfig`, Mac/Linux: `ifconfig`) and visit
`http://<your-pc-ip>:8081` in phone Chrome. Tap browser menu → "Add to
Home Screen" — behaves like an installed app.

Note: PWA on Android can't do real haptics or proper wake-lock.
For testing those features, use Expo Go (above).

## If something breaks on first install

```bash
npx expo install --check
```

Reports any dependency-version mismatches and fixes them. Run after any
`npm install` if you see warnings about Expo SDK compatibility.

## Project layout

```
mobile/
  app/                     # expo-router file-based routes
    _layout.tsx            # root layout — fonts, splash, status bar
    (tabs)/                # bottom-tab group
      _layout.tsx          # custom floating tab bar
      index.tsx            # Kitchen (Home)
      pantry.tsx           # placeholder
      plan.tsx             # placeholder
      add.tsx              # placeholder
    recipe/
      [id].tsx             # Recipe Detail (scaling, attribution, cook mode)
  src/
    components/
      Icon.tsx             # inline-SVG icon set (Lucide-style)
      RecipeCard.tsx       # home-screen card
      ServingsSelector.tsx # stepper + leftover mode pills
    data/
      types.ts             # Recipe zod schema + TS types
      seed-recipes.ts      # two recipes hand-authored against the schema
      scale.ts             # pure ingredient scaling (linear/fixed/custom)
    theme/
      tokens.ts            # design tokens (colours, fonts)
  app.json                 # Expo config — package name, permissions, plugins
  tailwind.config.js       # NativeWind theme — mirrors tokens.ts
  babel.config.js          # NativeWind preset
  metro.config.js          # NativeWind metro integration
  global.css               # Tailwind directives
  tsconfig.json            # strict TS, @/* path alias to src/
```

## What's in v0.1

- Bottom-tab shell (4 tabs) with the editorial cookbook palette
- Home screen: hero, search (client-side filter), recipe card grid
- Recipe Detail: live ingredient scaling (1–20 people × tonight/lunch/big
  modes), chef attribution kicker, three-tone callouts (look-for / why /
  heads-up), in-page cook mode with wake-lock and tap-to-tick steps
- Two seed recipes (Smash Burger, Weekday Bolognese) authored against the
  schema with stage cues, why-notes, lookahead, attribution

## What's NOT in v0.1 (by design)

- Full-screen knuckle-tap Cook Mode at `/cook/[id]` — currently the
  in-page lightweight version on Detail. Knuckle-tap version is task #13.
- Pantry matching, Plan, Add Recipe form — tab placeholders
- Real stage photos — cards render the three-band fallback gradient until
  hero URLs point to actual images
- The other 30 recipes from the HTML prototype — migrating once the
  markdown authoring pipeline ships (`/recipes/*.md` → SQLite at build time)

## House rules while editing

- Colours come from `src/theme/tokens.ts` or Tailwind classes that reference
  it. Don't hard-code a hex.
- Font families come from `src/theme/tokens.ts` `fonts` object.
- Every step in a recipe needs a `stage_note` (doneness cue). If you can't
  write one, the step isn't written yet.
- No food-blog prose. Short, present-tense, imperative.
- If a photo is missing, the card shows the fallback gradient — never an
  AI-generated stand-in.

See `../CLAUDE.md` for the 6 Golden Rules and voice guidance.
See `../docs/adr/001-stack.md` for the stack decision.
See `../docs/competitive-analysis.md` for what we're deliberately beating.

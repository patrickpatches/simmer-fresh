# Hone Post-Processing Preset

> Apply to every Hone photo so all shots feel like they came from one kitchen.
> Written for **Lightroom Mobile** (free tier). Each setting is a delta from zero unless noted.
> The goal: honest, well-lit food photography that looks like the NYT Cooking section shot in an Australian home kitchen — saturated food, rich shadows, no Instagram filters.

---

## Why a preset exists

Without a consistent post-processing pass, photos shot on different weekends will mismatch in:
- **White balance** — morning light vs. afternoon clouds changes food colour dramatically
- **Contrast** — the Dark Dramatic UI palette (#111111 bg, gold accents) needs photos with lifted midtones and deep blacks, not flat phone-processed JPEGs
- **Sharpening** — phone cameras apply varying sharpening depending on scene mode; we standardise it

A reshooot done months later should be indistinguishable from week-one shots. That's only possible if the preset is documented exactly.

---

## Lightroom Mobile settings

Apply in this order. Start from the white-balance reference frame (see pre-flight checklist) to calibrate WB first, then apply to the batch.

### Light panel

| Setting | Value | Why |
|---|---|---|
| Exposure | **0 to +0.2** | The dark surface is dark — don't compensate for it. Only lift if the food itself is underexposed. |
| Contrast | **+25** | Lifts the S-curve to complement the app's dark palette. Food pops; dark surfaces stay dark. |
| Highlights | **−25** | Prevent blowout on pale food (egg white, cream, pastry). If pavlova top blows out, go to −40. |
| Shadows | **+15** | Lifts shadow detail in the food only. Dark surfaces still look dark because they're in deep shadow by design. |
| Whites | **−10** | Pulls back the brightest whites to stay off the clipping edge. |
| Blacks | **−25** | Deepens the surface and bg area. This is the most important setting for the Dark Dramatic look — dark surfaces should approach #111111, not lift to grey. |

### Colour panel

| Setting | Value | Why |
|---|---|---|
| Temp (White balance) | **+200 to +400 Kelvin above auto** | Phone auto-WB often reads warm food as neutral and corrects it orange → wrong. Warm up slightly so food looks appetising, not clinical. Calibrate from WB reference frame. |
| Tint | **0 to +5 (magenta)** | Window light sometimes has a slight green cast. A touch of magenta corrects it. |
| Vibrance | **+20** | Boosts muted, undersaturated tones (the ones that make food look grey and sad) without blowing out already-saturated reds. |
| Saturation | **+5** | Small global saturation boost. If the dish has high-saturation elements (butter chicken sauce, capsicum), use vibrance only and leave saturation at 0. |

### Colour Mix panel (fine-tune per dish)

These are defaults; adjust by dish type.

| Colour | Hue | Saturation | Luminance | Dish types |
|---|---|---|---|---|
| Red | 0 | **+10** | 0 | Bolognese sauce, lamb dishes, capsicum |
| Orange | **−5** | **+15** | 0 | Butter chicken, roast chicken skin, schnitzel crust — the main food tones |
| Yellow | 0 | **+10** | 0 | Pavlova, egg dishes, fried items |
| Green | 0 | **+8** | +5 | Thai curry, herbs, salads |
| Aqua | 0 | 0 | 0 | Skip unless shooting seafood with green herbs |
| Blue | 0 | **−15** | 0 | Neutralise any blue cast from window sky reflection |

### Detail panel

| Setting | Value | Why |
|---|---|---|
| Sharpening Amount | **40** | Conservative. Phone cameras already sharpen in-camera; over-sharpening creates ringing artefacts. |
| Radius | **1.0** | Default. Don't touch unless for a specific texture shot. |
| Detail | **25** | Emphasises fine details (herbs, crust texture) without creating noise |
| Masking | **Hold the slider and use the range tool** to apply sharpening only to food, not the dark surface. At 40–60 mask value, the surface noise stays smooth. |
| Noise Reduction — Luminance | **35–50** | Phone cameras generate significant luminance noise at low light. This is always needed. Check at 100% zoom. |
| Noise Reduction — Colour | **25** | Reduces colour speckle on smooth surfaces (cream, sauce). |

### Effects panel

| Setting | Value | Why |
|---|---|---|
| Texture | **+10** | Adds mid-frequency detail. Makes crust, herbs, and crumb look tactile without the artificial clarity look. |
| Clarity | **+15** | Halos at +30+. Keep it at +15 for general shots. Go up to +20 for pure texture/detail shots. |
| Dehaze | **0** | Don't use. It crushes mid-tones on food and creates an unnatural look. |
| Vignette | **−10 to −15** | A very subtle darkening of the corners draws the eye inward to the food. Keep it subtle — at −20 it starts looking like an Instagram filter. Feather: 80. Midpoint: 50. |

---

## Crop standards

Apply the correct crop before final export. The app uses these aspect ratios:

| Shot type | Crop | Notes |
|---|---|---|
| Stage shots (in-recipe step view) | **4:5** | Portrait. Fills the step photo slot cleanly. |
| Hero shot (recipe card browse grid) | **1:1** | Square. The browse grid is 2×2 square cards. Compose the hero for 1:1 from the shoot, don't centre-crop portrait shots — you'll lose the plating. |
| Hero shot (recipe detail full-width) | **16:9** | Landscape. The recipe detail header banner. Shoot the hero wide enough that a 16:9 crop works — this usually means stepping back slightly and allowing more negative space. |

**Practical note:** You can't easily shoot a single frame that works at both 1:1 and 16:9 without compromise. Shoot two hero frames — one tighter for the card, one wider for the banner. Takes 60 extra seconds and saves a complete reshoot.

---

## Export settings

| Setting | Value |
|---|---|
| Format | JPEG |
| Quality | 90% |
| Colour space | sRGB |
| Resolution | Long edge 2000px (stage shots), 2400px (hero shots) |
| Filename | `[recipe-slug]_[shot-type]_[sequence].jpg` e.g. `roast-chicken_hero_01.jpg`, `roast-chicken_stage_03.jpg` |

---

## Applying to a new batch

1. Edit the **white-balance reference frame** first using the WB reference. Set the white paper to R:255, G:255, B:255 using the WB picker tool.
2. Save that WB correction as a preset called **"Hone WB — [date]"**.
3. Apply the rest of the preset settings as a second preset called **"Hone Base"**.
4. Select all frames from the day, auto-sync the Hone Base preset.
5. Go through one by one and adjust Exposure ±0.3 as needed per frame. Nothing else should need individual adjustment if the light was consistent.

---

## What to avoid

- **Over-brightening.** The temptation when you open a food photo is to push exposure up until it looks "clean." Resist this. The dark surfaces should stay dark — that's the whole point of the visual direction.
- **Skin-tone saturation.** If Patrick's hands are in an action shot, check the Orange and Red channels aren't so high that hands look sunburned.
- **Vignette > −20.** It looks like a filter, not a food photo.
- **Clarity > +25.** Food gets a hyper-real, over-sharpened look that reads as processed.
- **Auto-tone.** Lightroom's Auto Tone button ignores the dark surface intentionally and lifts everything. Don't press it.

---

## Version history

| Version | Date | What changed |
|---|---|---|
| v1.0 | 2026-05-01 | Initial preset for Dark Dramatic visual direction |

*Written by Photography Director. Update this doc whenever a setting is adjusted after a reshoot — future Patrick needs to match it.*

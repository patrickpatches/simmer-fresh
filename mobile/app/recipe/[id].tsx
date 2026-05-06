/**
 * Recipe Detail — the full recipe view with cook mode.
 *
 * BUG-001 FIX: Sticky header is a separate View ABOVE the ScrollView,
 * not inside it. This prevents the header floating over the hero.
 *
 * BUG-002 FIX: scrollView has keyboardShouldPersistTaps handled.
 *
 * Studio Kitchen palette throughout. Plan toggle is a simple
 * bookmark-style button — no calendar, no date picker.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as Haptics from 'expo-haptics';
import { useSQLiteContext } from 'expo-sqlite';

import type { Recipe, Ingredient, Substitution } from '../../src/data/types';
import {
  getRecipeById,
  getFavoriteIds,
  toggleFavorite,
  getPlannedRecipeIds,
  togglePlannedRecipe,
} from '../../db/database';
import { tokens, fonts } from '../../src/theme/tokens';
import { Icon } from '../../src/components/Icon';
import { SubstitutionSheet } from '../../src/components/SubstitutionSheet';
import { ServingsSelector } from '../../src/components/ServingsSelector';
import {
  formatAmount,
  scaleIngredient,
  leftoverById,
  totalPortionsFor,
  type LeftoverModeId,
} from '../../src/data/scale';

export default function RecipeDetailScreen() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [recipe, setRecipe]     = useState<Recipe | null | undefined>(undefined);
  const [favorite, setFavorite] = useState(false);
  const [isPlanned, setIsPlanned] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [r, favs, planned] = await Promise.all([
        getRecipeById(db, id ?? ''),
        getFavoriteIds(db),
        getPlannedRecipeIds(db),
      ]);
      if (!cancelled) {
        setRecipe(r);
        setFavorite(favs.has(id ?? ''));
        setIsPlanned(planned.has(id ?? ''));
      }
    }
    load().catch(console.error);
    return () => { cancelled = true; };
  }, [db, id]);

  // Sync default servings once recipe loads
  const [people, setPeople]         = useState<number>(2);
  const [leftoverKey, setLeftoverKey] = useState<LeftoverModeId>('tonight');

  useEffect(() => {
    if (recipe) setPeople(recipe.base_servings);
  }, [recipe]);

  // Reset mise en place when navigating to a different recipe
  useEffect(() => {
    setMiseChecked(new Set());
    setMiseExpanded(false);
    miseExpandOpacity.setValue(0);
  }, [recipe?.id]);

  // Cook mode
  const [cooking, setCooking]       = useState(false);
  const [stepsDone, setStepsDone]   = useState<Record<string, boolean>>({});
  const [ingTicked, setIngTicked]   = useState<Record<string, boolean>>({});

  // Substitution sheet state.
  // activeSwaps maps ingredient.id → chosen Substitution (null = restored original).
  const [sheetIngredient, setSheetIngredient] = useState<Ingredient | null>(null);
  const [sheetVisible, setSheetVisible]       = useState(false);

  // Mise en place state — session-only, no persistence (DECISION-008)
  const [miseChecked, setMiseChecked] = useState<Set<number>>(new Set());
  const [miseExpanded, setMiseExpanded] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [equipCollapsed, setEquipCollapsed] = useState(false);
  const [knowCollapsed, setKnowCollapsed] = useState(false);
  const miseExpandOpacity = useRef(new Animated.Value(0)).current;
  const [activeSwaps, setActiveSwaps]         = useState<Record<string, Substitution | null>>({});

  // Wake lock while cooking
  useEffect(() => {
    const tag = 'cook-mode';
    if (cooking) {
      activateKeepAwakeAsync(tag).catch(() => {});
      return () => { deactivateKeepAwake(tag); };
    }
    return undefined;
  }, [cooking]);

  // ── Loading states ──────────────────────────────────────────────────────────

  if (recipe === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={tokens.primaryInk} />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 22, color: tokens.ink, marginBottom: 8 }}>
          Recipe not found
        </Text>
        <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: tokens.muted, textAlign: 'center', marginBottom: 20 }}>
          It may have been removed or never existed.
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 999,
            backgroundColor: pressed ? tokens.primaryDeep : tokens.primary,
          })}
        >
          <Text style={{ fontFamily: fonts.sansBold, color: tokens.ink, fontSize: 14 }}>
            Back to Kitchen
          </Text>
        </Pressable>
      </View>
    );
  }

  // ── Derived ─────────────────────────────────────────────────────────────────

  const option       = leftoverById(leftoverKey);
  const totalPortions = totalPortionsFor(option, people, recipe.base_servings);
  // True only when every step already has a photo URL.
  // Derived, not persisted — no schema change needed.
  const hasStagePhotos = recipe.steps.every((s) => Boolean(s.photo_url));
  const stepsDoneCount = Object.values(stepsDone).filter(Boolean).length;
  const progress     = cooking ? stepsDoneCount / recipe.steps.length : 0;
  const gradient     = recipe.hero_fallback ?? [tokens.ink, tokens.warmBrown, tokens.bgDeep];

  // DECISION-008 derived display values
  const difficultyLabel = recipe.difficulty
    ? recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)
    : null;
  const cuisineLabel = recipe.categories?.cuisines?.[0]
    ? recipe.categories.cuisines[0].charAt(0).toUpperCase() + recipe.categories.cuisines[0].slice(1)
    : null;
  // Glance row only renders if at least one timing/difficulty field is populated
  const hasGlanceData = !!(recipe.total_time_minutes || recipe.active_time_minutes || difficultyLabel);

  // Cook-mode surface palette. CLAUDE.md: dark, OLED-friendly true blacks.
  // The same surface names are used in both modes so JSX can read `c.X`
  // without branching on `cooking` everywhere.
  //
  // `primary` is the surface fill (progress bar, button bg).
  // `primaryInk` is the same family used as TEXT colour on light cards
  // — deeper in light mode for WCAG AA contrast, lifted in cook mode
  // because the dark card already gives enough separation.
  const c = cooking
    ? {
        screenBg:   tokens.cookMode.screenBg,
        cardBg:     tokens.cookMode.cardBg,
        bgDeep:     tokens.cookMode.bgDeep,
        ink:        tokens.cookMode.ink,
        inkSoft:    tokens.cookMode.inkSoft,
        muted:      tokens.cookMode.muted,
        line:       tokens.cookMode.line,
        lineDark:   tokens.cookMode.lineDark,
        primary:    tokens.cookMode.primary,
        primaryInk: tokens.cookMode.primary,    // already lifted, reads on dark
        sage:       tokens.cookMode.sage,
        ochre:      tokens.cookMode.ochre,
      }
    : {
        screenBg:   tokens.bg,
        cardBg:     tokens.cream,
        bgDeep:     tokens.bgDeep,
        ink:        tokens.ink,
        inkSoft:    tokens.inkSoft,
        muted:      tokens.muted,
        line:       tokens.line,
        lineDark:   tokens.lineDark,
        primary:    tokens.primary,
        primaryInk: tokens.primaryInk,          // deeper for AA on cream
        sage:       tokens.sage,
        ochre:      tokens.ochre,
      };
  const attribution  = recipe.generated_by_claude
    ? 'Invented from your pantry'
    : recipe.source
      ? `Inspired by ${recipe.source.chef}`
      : recipe.user_added
        ? 'Your recipe'
        : '';

  // ── Handlers ────────────────────────────────────────────────────────────────

  const toggleCooking = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setCooking((c) => !c);
    if (cooking) { setStepsDone({}); setIngTicked({}); }
  };

  const tickStep = (stepId: string) => {
    if (!cooking) return;
    Haptics.selectionAsync().catch(() => {});
    setStepsDone((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const tickIngredient = (ingId: string) => {
    if (!cooking) return;
    Haptics.selectionAsync().catch(() => {});
    setIngTicked((prev) => ({ ...prev, [ingId]: !prev[ingId] }));
  };

  // Opens the SubstitutionSheet for the given ingredient.
  // Only called in non-cook mode (in cook mode, tapping ticks the ingredient).
  const openSwapSheet = (ing: Ingredient) => {
    Haptics.selectionAsync().catch(() => {});
    setSheetIngredient(ing);
    setSheetVisible(true);
  };

  // Called by SubstitutionSheet on confirm. null = restore original ingredient.
  const handleSwap = (sub: Substitution | null) => {
    if (!sheetIngredient) return;
    setActiveSwaps((prev) => ({ ...prev, [sheetIngredient.id]: sub }));
  };

  const handleSheetDismiss = () => {
    setSheetVisible(false);
    // Keep sheetIngredient set until after dismiss — sheet animates out and
    // still renders its content during the exit animation.
  };

  const toggleMise = (idx: number) => {
    Haptics.selectionAsync().catch(() => {});
    setMiseChecked(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const expandMise = () => {
    setMiseExpanded(true);
    Animated.timing(miseExpandOpacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleTogglePlan = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    const nowPlanned = await togglePlannedRecipe(db, recipe.id, recipe.base_servings);
    setIsPlanned(nowPlanned);
  };

  const openSource = () => {
    const url = recipe.source?.video_url;
    if (!url) return;
    Linking.openURL(url).catch(() => { Alert.alert('Could not open link', url); });
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <View style={{ flex: 1, backgroundColor: c.screenBg }}>

      {/* ── STICKY HEADER (above ScrollView, not inside it) ── */}
      <View
        style={{
          paddingTop: insets.top,
          backgroundColor: cooking ? tokens.cookMode.screenBg : tokens.bg,
          borderBottomWidth: cooking ? 0 : 1,
          borderBottomColor: tokens.line,
        }}
      >
        {cooking ? (
          /* Cook mode bar */
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 1.5, color: c.ink, textTransform: 'uppercase' }}>
                <Text style={{ color: c.ochre }}>Cooking</Text> · {stepsDoneCount}/{recipe.steps.length} steps
              </Text>
              <Pressable onPress={toggleCooking} hitSlop={8}>
                <Text style={{ fontFamily: fonts.sansBold, fontSize: 11, color: c.ochre }}>End session</Text>
              </Pressable>
            </View>
            {/* Progress bar */}
            <View style={{ height: 3, backgroundColor: c.lineDark, borderRadius: 2 }}>
              <View
                style={{
                  height: 3,
                  width: `${progress * 100}%`,
                  backgroundColor: c.primary,
                  borderRadius: 2,
                }}
              />
            </View>
          </View>
        ) : (
          /* Normal back bar */
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
            <Pressable
              onPress={() => router.back()}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Back"
              style={({ pressed }) => ({
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: pressed ? tokens.bgDeep : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <Icon name="arrow-left" size={20} color={tokens.ink} />
            </Pressable>
            <Text
              style={{
                flex: 1,
                fontFamily: fonts.display,
                fontSize: 16,
                color: tokens.ink,
              }}
              numberOfLines={1}
            >
              {recipe.title}
            </Text>
            {/* Plan toggle */}
            <Pressable
              onPress={handleTogglePlan}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={isPlanned ? 'Remove from plan' : 'Add to plan'}
              style={({ pressed }) => ({
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: isPlanned ? tokens.primaryLight : (pressed ? tokens.bgDeep : 'transparent'),
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <Icon name={isPlanned ? 'check' : 'plus'} size={20} color={isPlanned ? tokens.primaryInk : tokens.ink} />
            </Pressable>
            {/* Favourite */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                toggleFavorite(db, recipe.id).catch(console.error);
                setFavorite((f) => !f);
              }}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={favorite ? 'Unfavourite' : 'Favourite'}
              style={({ pressed }) => ({
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: pressed ? tokens.bgDeep : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <Icon name="heart" size={20} color={favorite ? tokens.primary : tokens.ink} fill={favorite ? tokens.primary : 'none'} />
            </Pressable>
          </View>
        )}
      </View>

      {/* ── SCROLLABLE CONTENT ── */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero — hidden in cook mode */}
        {!cooking && (
          <View style={{ height: 260 }}>
            {recipe.hero_url ? (
              <Image
                source={{ uri: recipe.hero_url }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                transition={250}
              />
            ) : (
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: gradient[0] }} />
                <View style={{ flex: 1, backgroundColor: gradient[1] }} />
                <View style={{ flex: 1, backgroundColor: gradient[2] }} />
                {recipe.emoji ? (
                  <Text style={{ position: 'absolute', bottom: 20, right: 20, fontSize: 72, opacity: 0.9 }}>
                    {recipe.emoji}
                  </Text>
                ) : null}
              </View>
            )}
          </View>
        )}

        {/* Title card */}
        <View style={{ paddingHorizontal: 20, marginTop: cooking ? 16 : -24 }}>
          <View
            style={{
              backgroundColor: c.cardBg,
              borderRadius: 24,
              padding: 20,
              borderWidth: 1,
              borderColor: c.lineDark,
              shadowColor: tokens.ink,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.07,
              shadowRadius: 10,
              elevation: 4,
            }}
          >
            {attribution ? (
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: c.primaryInk,
                  marginBottom: 6,
                }}
              >
                {attribution}
              </Text>
            ) : null}

            <Text style={{ fontFamily: fonts.display, fontSize: 28, lineHeight: 33, color: c.ink }}>
              {recipe.title}
            </Text>
            <Text
              style={{
                fontFamily: fonts.displayItalic,
                fontStyle: 'italic',
                fontSize: 15,
                lineHeight: 20,
                color: c.inkSoft,
                marginTop: 6,
              }}
            >
              {recipe.tagline}
            </Text>

            {/* Meta row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: 14 }}>
              <MetaPill icon="clock" label={`${recipe.time_min} min`} color={c.inkSoft} />
              <MetaPill icon="flame" label={recipe.difficulty} color={c.inkSoft} />
            </View>

            {/* Description — 3-line clamp with expand/collapse.
                Long recipe histories (Carbonara, Pavlova) are rich but not scan-level.
                User taps to read more; can collapse again. */}
            {recipe.description ? (
              <View
                style={{
                  backgroundColor: c.bgDeep,
                  borderRadius: 14,
                  padding: 12,
                  marginTop: 14,
                }}
              >
                <Text
                  numberOfLines={descExpanded ? undefined : 3}
                  style={{ fontFamily: fonts.sans, fontSize: 13, lineHeight: 18, color: c.inkSoft }}
                >
                  <Text style={{ fontFamily: fonts.sansBold, color: c.ink }}>A note: </Text>
                  {recipe.description}
                </Text>
                <Pressable
                  onPress={() => setDescExpanded(!descExpanded)}
                  accessibilityRole="button"
                  accessibilityLabel={descExpanded ? 'Show less' : 'Read more'}
                  style={{ marginTop: 6 }}
                >
                  <Text style={{ fontFamily: fonts.sansBold, fontSize: 12, color: c.primaryInk }}>
                    {descExpanded ? 'Read less ↑' : 'Read more ↓'}
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {/* Watch link — Pressable is bare touch target only; inner View
                carries all visual style. Pressable function-style style props
                (borderWidth, backgroundColor) do not reliably render on Android. */}
            {recipe.source?.video_url ? (
              <Pressable
                onPress={openSource}
                accessibilityRole="link"
                accessibilityLabel="Watch the original video"
                android_ripple={{ color: 'rgba(184,64,48,0.18)', borderless: false }}
                style={{ alignSelf: 'flex-start', marginTop: 14, borderRadius: 999 }}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 7,
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 999,
                  backgroundColor: 'transparent',
                  borderWidth: 2,
                  borderColor: tokens.primaryInk,
                }}>
                  <Icon name="play" size={10} color={c.primaryInk} fill={c.primaryInk} />
                  <Text style={{
                    fontFamily: fonts.sansBold,
                    fontSize: 12,
                    color: c.primaryInk,
                    letterSpacing: 0.2,
                  }}>
                    Watch the original
                  </Text>
                </View>
              </Pressable>
            ) : null}

            {/* Plan toggle — full width, inside card. Hidden in cook mode
                because you don't plan a meal you're already cooking.
                Pressable is bare touch target; inner View holds all visual style.
                Pressable function-style style props don't reliably render on Android. */}
            {!cooking && (
              <Pressable
                onPress={handleTogglePlan}
                accessibilityRole="button"
                accessibilityLabel={isPlanned ? 'Remove from plan' : 'Add to plan'}
                android_ripple={{ color: isPlanned ? 'rgba(255,255,255,0.22)' : 'rgba(184,64,48,0.18)', borderless: false }}
                style={{ marginTop: 16, borderRadius: 14 }}
              >
                <View style={{
                  paddingVertical: 13,
                  borderRadius: 14,
                  backgroundColor: isPlanned ? tokens.primary : 'transparent',
                  borderWidth: 2,
                  borderColor: isPlanned ? tokens.primary : tokens.primaryInk,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}>
                  <Icon
                    name={isPlanned ? 'check' : 'plus'}
                    size={15}
                    color={isPlanned ? tokens.ink : tokens.primaryInk}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.sansBold,
                      fontSize: 13,
                      letterSpacing: 0.2,
                      color: isPlanned ? tokens.ink : tokens.primaryInk,
                    }}
                  >
                    {isPlanned ? 'In your plan' : 'Plan this recipe'}
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        </View>


        {/* ── AT A GLANCE (DECISION-008) ──
            Renders only when the cook has populated timing/difficulty fields.
            Backwards-compatible: old recipes without these fields render nothing. */}
        {!cooking && hasGlanceData && (
          <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
            <View
              style={{
                backgroundColor: c.cardBg,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: c.lineDark,
                flexDirection: 'row',
                paddingVertical: 14,
              }}
            >
              {([
                recipe.total_time_minutes
                  ? { icon: 'clock' as const, value: String(recipe.total_time_minutes), sub: 'total min' }
                  : null,
                recipe.active_time_minutes
                  ? { icon: 'flame' as const, value: String(recipe.active_time_minutes), sub: 'active min' }
                  : null,
                difficultyLabel
                  ? { icon: 'flame' as const, value: difficultyLabel, sub: 'difficulty' }
                  : null,
                cuisineLabel
                  ? { icon: 'chef' as const, value: cuisineLabel, sub: 'cuisine' }
                  : null,
                { icon: 'check' as const, value: recipe.leftover_mode ? 'yes' : 'no', sub: 'leftovers' },
              ] as const).filter(Boolean).map((item, idx, arr) => (
                <View
                  key={idx}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    borderRightWidth: idx < arr.length - 1 ? 1 : 0,
                    borderRightColor: c.line,
                    paddingHorizontal: 4,
                    gap: 3,
                  }}
                >
                  <Icon name={item!.icon} size={14} color={c.muted} />
                  <Text
                    style={{ fontFamily: fonts.sansBold, fontSize: 12, color: c.ink, textAlign: 'center' }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {item!.value}
                  </Text>
                  <Text style={{ fontFamily: fonts.sans, fontSize: 10, color: c.muted, textAlign: 'center' }}>
                    {item!.sub}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Stage photos notice — shown once when recipe has no stage photos.
            Hidden in cook mode (no point showing it while actively cooking). */}
        {!cooking && !hasStagePhotos && (
          <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 10,
                backgroundColor: tokens.skyLight,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'rgba(168,196,208,0.35)',
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            >
              <Icon name="camera" size={14} color={tokens.skyDeep} style={{ marginTop: 2 }} />
              <Text
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 12,
                  lineHeight: 17,
                  color: tokens.inkSoft,
                  flex: 1,
                }}
              >
                Stage-by-stage photos are on the way — we'll photograph this recipe soon.
              </Text>
            </View>
          </View>
        )}

        {/* ── WHAT TO KNOW (DECISION-008) ──
            Accordion: tap header to collapse/expand the notes.
            Blue left-border: caution/information, not action.
            Default expanded — these are critical gotchas. User collapses
            after reading on subsequent visits. */}
        {!cooking && (recipe.before_you_start?.length ?? 0) > 0 && (
          <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
            <View
              style={{
                borderRadius: 14,
                borderWidth: 1,
                borderColor: 'rgba(91,143,212,0.25)',
                borderLeftWidth: 3,
                borderLeftColor: '#5B8FD4',
                backgroundColor: 'rgba(91,143,212,0.06)',
                paddingTop: 12,
                paddingBottom: knowCollapsed ? 12 : 4,
                paddingRight: 14,
                paddingLeft: 14,
              }}
            >
              <Pressable
                onPress={() => setKnowCollapsed(!knowCollapsed)}
                accessibilityRole="button"
                accessibilityLabel={knowCollapsed ? 'Expand what to know' : 'Collapse what to know'}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: knowCollapsed ? 0 : 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.sansBold,
                    fontSize: 9,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    color: '#5B8FD4',
                  }}
                >
                  What to know before you start
                </Text>
                <Icon
                  name={knowCollapsed ? 'chevron-down' : 'chevron-up'}
                  size={14}
                  color='#5B8FD4'
                />
              </Pressable>
              {!knowCollapsed && recipe.before_you_start!.map((note, idx) => (
                <View
                  key={idx}
                  style={{ flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}
                >
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: '#5B8FD4',
                      marginTop: 6,
                      flexShrink: 0,
                    }}
                  />
                  <Text style={{ fontFamily: fonts.sans, fontSize: 13, lineHeight: 19, color: c.inkSoft, flex: 1 }}>
                    {note}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Servings selector */}
        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <ServingsSelector
            people={people}
            setPeople={setPeople}
            leftoverKey={leftoverKey}
            setLeftoverKey={setLeftoverKey}
            baseServings={recipe.base_servings}
          />
        </View>

        {/* Ingredients */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <SectionHeader title="Ingredients" hint={cooking ? 'Tap to tick off' : undefined} inkColor={c.ink} mutedColor={c.muted} />
          <View
            style={{
              backgroundColor: c.cardBg,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: c.lineDark,
              overflow: 'hidden',
              shadowColor: tokens.ink,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {recipe.ingredients.map((ing, idx) => {
              const checked     = !!ingTicked[ing.id];
              const amount      = scaleIngredient(ing, totalPortions, recipe.base_servings);
              const showUnit    = ing.unit && ing.unit !== 'to taste' && ing.unit !== 'as needed';
              const inlineUnit  = ing.unit === 'to taste' || ing.unit === 'as needed';
              const hasSwaps    = (ing.substitutions?.length ?? 0) > 0;
              // Active swap for this ingredient: null means "restored to original",
              // undefined means "no swap ever chosen".
              const activeSwap  = activeSwaps[ing.id];
              const isSwapped   = activeSwap !== undefined && activeSwap !== null;
              const displayName = isSwapped ? (activeSwap as Substitution).ingredient : ing.name;

              return (
                <Pressable
                  key={ing.id}
                  onPress={
                    cooking
                      ? () => tickIngredient(ing.id)
                      : hasSwaps
                        ? () => openSwapSheet(ing)
                        : undefined
                  }
                  disabled={!cooking && !hasSwaps}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 13,
                    borderBottomWidth: idx < recipe.ingredients.length - 1 ? 1 : 0,
                    borderBottomColor: c.line,
                  }}
                >
                  {cooking ? (
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 7,
                        borderWidth: 1.5,
                        borderColor: checked ? c.sage : c.muted,
                        backgroundColor: checked ? c.sage : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 2,
                      }}
                    >
                      {checked && <Icon name="check" size={13} color={tokens.ink} />}
                    </View>
                  ) : null}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: fonts.sans,
                        fontSize: 14,
                        lineHeight: 20,
                        color: checked ? c.muted : c.ink,
                        textDecorationLine: checked ? 'line-through' : 'none',
                      }}
                    >
                      {!inlineUnit ? (
                        <>
                          <Text style={{ fontFamily: fonts.sansBold, fontVariant: ['tabular-nums'], color: checked ? c.muted : c.ink }}>
                            {formatAmount(amount)}
                          </Text>
                          {showUnit ? <Text style={{ fontFamily: fonts.sansBold }}> {ing.unit}</Text> : null}
                          {/* Show active swap name in gold if swapped, original otherwise */}
                          <Text style={isSwapped ? { color: c.primary } : undefined}> {displayName}</Text>
                          {isSwapped && (
                            <Text style={{ fontFamily: fonts.sans, color: c.muted, textDecorationLine: 'line-through' }}>
                              {' '}({ing.name})
                            </Text>
                          )}
                        </>
                      ) : (
                        <>
                          <Text style={isSwapped ? { color: c.primary } : undefined}>{displayName}</Text>
                          {isSwapped && (
                            <Text style={{ fontFamily: fonts.sans, color: c.muted, textDecorationLine: 'line-through' }}>
                              {' '}({ing.name})
                            </Text>
                          )}
                          <Text style={{ fontFamily: fonts.displayItalic, fontStyle: 'italic', color: c.muted }}>
                            {' — '}{ing.unit}
                          </Text>
                        </>
                      )}
                    </Text>
                    {ing.prep ? (
                      <Text style={{ fontFamily: fonts.sans, fontSize: 11, color: c.muted, marginTop: 2 }}>
                        {ing.prep}
                      </Text>
                    ) : null}
                  </View>

                  {/* Swap affordance icon — shown in non-cook mode when swaps are available */}
                  {!cooking && hasSwaps ? (
                    <Icon
                      name="swap"
                      size={14}
                      color={isSwapped ? c.primary : c.muted}
                      style={{ marginTop: 3 }}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── EQUIPMENT (DECISION-008) ──
            Accordion: header tap collapses/expands the pill row.
            Why collapsible: equipment is check-before-you-shop info.
            Once you've confirmed your kit, collapse to reduce scroll. */}
        {!cooking && (recipe.equipment?.length ?? 0) > 0 && (
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <Pressable
              onPress={() => setEquipCollapsed(!equipCollapsed)}
              accessibilityRole="button"
              accessibilityLabel={equipCollapsed ? 'Expand equipment list' : 'Collapse equipment list'}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: equipCollapsed ? 0 : 10,
              }}
            >
              <Text style={{ fontFamily: fonts.display, fontSize: 20, color: c.ink }}>
                Equipment
              </Text>
              <Icon
                name={equipCollapsed ? 'chevron-down' : 'chevron-up'}
                size={16}
                color={c.muted}
              />
            </Pressable>
            {!equipCollapsed && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {recipe.equipment!.map((item, idx) => (
                  <View
                    key={idx}
                    style={{
                      paddingHorizontal: 13,
                      paddingVertical: 8,
                      borderRadius: 20,
                      marginRight: 8,
                      marginBottom: 8,
                      backgroundColor: tokens.amber,
                      borderWidth: 1,
                      borderColor: tokens.amberLine,
                    }}
                  >
                    <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: c.inkSoft }}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── MISE EN PLACE (DECISION-008) ──
            Tappable checklist from mise_en_place[]. Session-only state.
            Expand pattern: show first 4; chip reveals the rest with 150ms fade.
            Progress counter counts all items including collapsed ones. */}
        {!cooking && (recipe.mise_en_place?.length ?? 0) > 0 && (
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <View
              style={{
                backgroundColor: c.cardBg,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: c.lineDark,
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  paddingTop: 14,
                  paddingBottom: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: c.line,
                }}
              >
                <View>
                  <Text style={{ fontFamily: fonts.sansBold, fontSize: 14, color: c.ink }}>
                    Mise en place
                  </Text>
                  <Text style={{ fontFamily: fonts.sans, fontSize: 11, color: c.muted, marginTop: 2 }}>
                    Do this before you heat anything
                  </Text>
                </View>
                <Text
                  style={{ fontFamily: fonts.sansBold, fontSize: 11, color: tokens.ochre }}
                  accessibilityLabel={`${miseChecked.size} of ${recipe.mise_en_place!.length} prep tasks done`}
                >
                  {miseChecked.size} / {recipe.mise_en_place!.length} done
                </Text>
              </View>

              {/* Always-visible items (first 4) */}
              {recipe.mise_en_place!.slice(0, 4).map((task, idx) => (
                <MiseItem
                  key={idx}
                  text={task}
                  checked={miseChecked.has(idx)}
                  onToggle={() => toggleMise(idx)}
                  isLast={idx === Math.min(3, recipe.mise_en_place!.length - 1) && recipe.mise_en_place!.length <= 4}
                  lineColor={c.line}
                  inkColor={c.inkSoft}
                />
              ))}

              {/* Expand chip */}
              {recipe.mise_en_place!.length > 4 && !miseExpanded && (
                <Pressable
                  onPress={expandMise}
                  accessibilityRole="button"
                  accessibilityLabel={`Show ${recipe.mise_en_place!.length - 4} more prep tasks`}
                  style={({ pressed }) => ({
                    margin: 10,
                    paddingVertical: 10,
                    borderRadius: 20,
                    backgroundColor: pressed
                      ? tokens.amber
                      : 'rgba(160,92,40,0.08)',
                    borderWidth: 1,
                    borderColor: tokens.amberLine,
                    alignItems: 'center',
                  })}
                >
                  <Text style={{ fontFamily: fonts.sansBold, fontSize: 12, color: tokens.ochre }}>
                    Show {recipe.mise_en_place!.length - 4} more prep tasks
                  </Text>
                </Pressable>
              )}

              {/* Expanded items (4+) */}
              {recipe.mise_en_place!.length > 4 && miseExpanded && (
                <Animated.View style={{ opacity: miseExpandOpacity }}>
                  {recipe.mise_en_place!.slice(4).map((task, idx) => (
                    <MiseItem
                      key={idx + 4}
                      text={task}
                      checked={miseChecked.has(idx + 4)}
                      onToggle={() => toggleMise(idx + 4)}
                      isLast={idx + 4 === recipe.mise_en_place!.length - 1}
                      lineColor={c.line}
                      inkColor={c.inkSoft}
                    />
                  ))}
                  <Pressable
                    onPress={() => setMiseExpanded(false)}
                    accessibilityRole="button"
                    accessibilityLabel="Show fewer prep tasks"
                    style={{
                      margin: 10,
                      paddingVertical: 10,
                      borderRadius: 20,
                      backgroundColor: 'rgba(160,92,40,0.08)',
                      borderWidth: 1,
                      borderColor: tokens.amberLine,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontFamily: fonts.sansBold, fontSize: 12, color: tokens.ochre }}>
                      Show less ↑
                    </Text>
                  </Pressable>
                </Animated.View>
              )}
            </View>
          </View>
        )}


        {/* Method */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <SectionHeader title="Method" hint={cooking ? 'Tap the number to mark done' : undefined} inkColor={c.ink} mutedColor={c.muted} />
          <View style={{ gap: 12 }}>
            {recipe.steps.map((step, idx) => {
              const done = !!stepsDone[step.id];
              // Step number badge: when cooking, the unticked badge sits on
              // the dark card so it needs to invert (cream-on-dark instead
              // of dark-on-cream). Done badge stays sage with dark ink text
              // (sage is now light fern in the new pastel palette).
              const numBadgeBg = done ? c.sage : (cooking ? c.cardBg : tokens.ink);
              const numBadgeFg = done ? tokens.ink : (cooking ? c.ink : '#FFF');
              const numBadgeBorder = cooking && !done ? c.lineDark : 'transparent';
              return (
                <View
                  key={step.id}
                  style={{
                    backgroundColor: c.cardBg,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: c.lineDark,
                    padding: 16,
                    opacity: done ? 0.55 : 1,
                    shadowColor: tokens.ink,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.04,
                    shadowRadius: 4,
                    elevation: 1,
                  }}
                >
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Pressable
                      onPress={() => tickStep(step.id)}
                      disabled={!cooking}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        backgroundColor: numBadgeBg,
                        borderWidth: numBadgeBorder === 'transparent' ? 0 : 1.5,
                        borderColor: numBadgeBorder,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {done ? (
                        <Icon name="check" size={15} color={tokens.ink} />
                      ) : (
                        <Text style={{ fontFamily: fonts.display, fontSize: 16, color: numBadgeFg }}>
                          {idx + 1}
                        </Text>
                      )}
                    </Pressable>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: fonts.sansBold,
                          fontSize: 15,
                          color: c.ink,
                          textDecorationLine: done ? 'line-through' : 'none',
                          marginBottom: 5,
                        }}
                      >
                        {step.title}
                      </Text>
                      <Text style={{ fontFamily: fonts.sans, fontSize: 14, lineHeight: 21, color: c.inkSoft }}>
                        {step.content}
                      </Text>

                      {step.stage_note ? (
                        <Callout label="Look for" accent={c.primary} bg={c.bgDeep} bodyColor={c.inkSoft} italic text={step.stage_note} />
                      ) : null}
                      {step.why_note ? (
                        <Callout label="Why" accent={c.sage} bg={c.bgDeep} bodyColor={c.inkSoft} text={step.why_note} />
                      ) : null}
                      {step.lookahead ? (
                        <Callout label="Heads-up" accent={c.ochre} bg={c.bgDeep} bodyColor={c.inkSoft} text={step.lookahead} />
                      ) : null}

                      {step.timer_seconds && cooking ? (
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Icon name="clock" size={12} color={c.muted} />
                          <Text style={{ fontFamily: fonts.sans, fontSize: 11, color: c.muted }}>
                            Rough timer: {formatTimer(step.timer_seconds)}
                          </Text>
                        </View>
                      ) : null}

                      {/* Step photo — render image if available, placeholder if not.
                          Shows in both browse and cook mode so users can see how
                          the dish should look at each stage. */}
                      {step.photo_url ? (
                        <View style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden', height: 160 }}>
                          <Image
                            source={{ uri: step.photo_url }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                            transition={200}
                          />
                        </View>
                      ) : (
                        <View
                          style={{
                            marginTop: 12,
                            height: 100,
                            borderRadius: 12,
                            borderWidth: 1.5,
                            borderStyle: 'dashed',
                            borderColor: c.lineDark,
                            backgroundColor: c.bgDeep,
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                          }}
                        >
                          <Icon name="camera" size={18} color={c.muted} />
                          <Text style={{ fontFamily: fonts.sans, fontSize: 11, color: c.muted }}>
                            Photo coming soon
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Leftover note removed — leftover_mode.note is superseded by the
              LEFTOVERS & STORAGE section below which uses leftovers_note. */}
        </View>

        {/* ── FINISHING & TASTING (DECISION-008) ──
            Warm-brown left border — conclusion, not caution. */}
        {!cooking && recipe.finishing_note && (
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <View
              style={{
                borderRadius: 14,
                borderWidth: 1,
                borderColor: 'rgba(196,168,130,0.3)',
                borderLeftWidth: 3,
                borderLeftColor: '#C4A882',
                backgroundColor: 'rgba(196,168,130,0.06)',
                padding: 14,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 9,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  color: '#C4A882',
                  marginBottom: 6,
                }}
              >
                Finishing & tasting
              </Text>
              <Text
                style={{
                  fontFamily: fonts.displayItalic,
                  fontStyle: 'italic',
                  fontSize: 14,
                  lineHeight: 21,
                  color: c.inkSoft,
                }}
              >
                {recipe.finishing_note}
              </Text>
            </View>
          </View>
        )}

        {/* ── LEFTOVERS & STORAGE (DECISION-008) ──
            Low surface, muted — honest and quiet. */}
        {!cooking && recipe.leftovers_note && (
          <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
            <View
              style={{
                backgroundColor: c.bgDeep,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: c.line,
                padding: 14,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 9,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  color: c.muted,
                  marginBottom: 6,
                }}
              >
                Leftovers & storage
              </Text>
              <Text style={{ fontFamily: fonts.sans, fontSize: 13, lineHeight: 19, color: c.inkSoft }}>
                {recipe.leftovers_note}
              </Text>
            </View>
          </View>
        )}

      </ScrollView>

      {/* ── FLOATING START-COOKING PILL ──
          Solid paprika-tint pill, centered horizontally near the bottom.
          Stays put while the recipe scrolls (ScrollView already pads
          bottom 140 so content clears it).

          Structure note: the Pressable is a bare tap target with no
          layout/visual styling — all of that lives on an inner View.
          On Android, Pressable + function-style + layout properties
          (flexDirection, backgroundColor) sometimes renders without
          the background. Splitting the roles makes the bg reliable
          and lets android_ripple handle press feedback. */}
      {!cooking ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: insets.bottom + 18,
            alignItems: 'center',
            pointerEvents: 'box-none',
          }}
        >
          <Pressable
            onPress={toggleCooking}
            accessibilityRole="button"
            accessibilityLabel="Start cooking"
            android_ripple={{ color: 'rgba(255,255,255,0.22)', borderless: false }}
            style={{ borderRadius: 999 }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 16,
                paddingHorizontal: 32,
                borderRadius: 999,
                backgroundColor: tokens.primary,
                shadowColor: tokens.ink,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.22,
                shadowRadius: 14,
                elevation: 8,
              }}
            >
              <Icon name="chef" size={18} color={tokens.ink} />
              <Text
                style={{
                  fontFamily: fonts.sansXBold,
                  fontSize: 15,
                  color: tokens.ink,
                  letterSpacing: 0.3,
                }}
              >
                Start Cooking
              </Text>
            </View>
          </Pressable>
        </View>
      ) : progress === 1 ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: insets.bottom + 18,
            alignItems: 'center',
            pointerEvents: 'box-none',
          }}
        >
          <Pressable
            onPress={toggleCooking}
            accessibilityRole="button"
            accessibilityLabel="Finish cooking"
            android_ripple={{ color: 'rgba(255,255,255,0.22)', borderless: false }}
            style={{ borderRadius: 999 }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 16,
                paddingHorizontal: 32,
                borderRadius: 999,
                backgroundColor: tokens.sage,
                shadowColor: tokens.ink,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.22,
                shadowRadius: 14,
                elevation: 8,
              }}
            >
              <Icon name="check" size={18} color={tokens.ink} />
              <Text
                style={{
                  fontFamily: fonts.sansXBold,
                  fontSize: 15,
                  color: tokens.ink,
                  letterSpacing: 0.3,
                }}
              >
                Done — eat well
              </Text>
            </View>
          </Pressable>
        </View>
      ) : null}

      {/* SubstitutionSheet — rendered outside ScrollView so it can overlay it.
          BottomSheetModal portals above all content via @gorhom/portal. */}
      <SubstitutionSheet
        ingredient={sheetIngredient}
        visible={sheetVisible}
        activeSwapName={
          sheetIngredient && activeSwaps[sheetIngredient.id]
            ? (activeSwaps[sheetIngredient.id] as Substitution).ingredient
            : undefined
        }
        inCookMode={cooking}
        onSwap={handleSwap}
        onDismiss={handleSheetDismiss}
      />
    </View>
  );
}

// ── Small pieces ──────────────────────────────────────────────────────────────

function MetaPill({
  icon,
  label,
  color = tokens.inkSoft,
}: {
  icon: React.ComponentProps<typeof Icon>['name'];
  label: string;
  color?: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Icon name={icon} size={14} color={color} />
      <Text style={{ fontFamily: fonts.sansBold, fontSize: 12, color }}>
        {label}
      </Text>
    </View>
  );
}

function SectionHeader({
  title,
  hint,
  inkColor = tokens.ink,
  mutedColor = tokens.muted,
}: {
  title: string;
  hint?: string;
  inkColor?: string;
  mutedColor?: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}
    >
      <Text style={{ fontFamily: fonts.display, fontSize: 22, color: inkColor }}>
        {title}
      </Text>
      {hint ? (
        <Text style={{ fontFamily: fonts.sans, fontSize: 11, color: mutedColor }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

function Callout({
  label,
  text,
  accent,
  italic,
  bg = tokens.bgDeep,
  bodyColor = tokens.inkSoft,
}: {
  label: string;
  text: string;
  accent: string;
  italic?: boolean;
  bg?: string;
  bodyColor?: string;
}) {
  return (
    <View
      style={{
        marginTop: 10,
        padding: 10,
        borderRadius: 12,
        backgroundColor: bg,
        borderLeftWidth: 3,
        borderLeftColor: accent,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.sansBold,
          fontSize: 9,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: accent,
          marginBottom: 3,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: italic ? fonts.displayItalic : fonts.sans,
          fontStyle: italic ? 'italic' : 'normal',
          fontSize: 13,
          lineHeight: 18,
          color: bodyColor,
        }}
      >
        {text}
      </Text>
    </View>
  );
}


function MiseItem({
  text,
  checked,
  onToggle,
  isLast,
  lineColor,
  inkColor,
}: {
  text: string;
  checked: boolean;
  onToggle: () => void;
  isLast: boolean;
  lineColor: string;
  inkColor: string;
}) {
  /* Pressable is bare touch target only — android_ripple + onPress.
     flexDirection:'row', borderBottomWidth, and opacity live on the inner
     View so Android actually renders them (function-style Pressable style
     props silently drop layout props on Android). borderWidth must be
     integer — 1.5 doesn't render reliably on Android. */
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityLabel={text}
      accessibilityState={{ checked }}
      android_ripple={{ color: 'rgba(160,92,40,0.10)', borderless: false }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 12,
          paddingHorizontal: 20,
          paddingVertical: 13,
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: lineColor,
          backgroundColor: 'transparent',
          opacity: checked ? 0.5 : 1,
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: checked ? tokens.ochre : lineColor,
            backgroundColor: checked ? 'rgba(160,92,40,0.10)' : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          {checked && <Icon name="check" size={10} color={tokens.ochre} />}
        </View>
        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 13,
            lineHeight: 19,
            color: inkColor,
            flex: 1,
            textDecorationLine: checked ? 'line-through' : 'none',
          }}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  );
}

function formatTimer(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem === 0 ? `${h} h` : `${h} h ${rem} min`;
}

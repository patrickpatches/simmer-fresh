/**
 * Pantry — v0.5.0 redesign (2026-05-02).
 *
 * Changes from v0.4.0:
 *   1. Search bar is now a tappable Pressable that opens the full-screen
 *      IngredientSearchOverlay. No more inline dropdown. Reason: inline
 *      dropdowns fight with keyboard height and collapse to a small scroll
 *      zone on short screens; the full-screen overlay gives the user the
 *      entire device surface to browse and add.
 *
 *   2. Have-it pills are now a horizontally-scrollable row directly below
 *      the search bar, no longer wrapped in the old "unified zone" card.
 *      The card chrome (cream bg, border, shadow) has been removed — the
 *      pills read as a status strip, not a data-entry container.
 *
 *   3. Gold match summary banner (compact, bordered) replaces the sage pill
 *      affordance as the "here's what you can cook" signal. It lives above
 *      the recipe carousel and provides a one-glance summary before the user
 *      scrolls into the cards.
 *
 *   4. Missing-ingredient chips on recipe match cards are now Variant A —
 *      gold-tinted, tap to add to the shopping list (not the pantry).
 *      Reason: if you're missing an ingredient, the right action is "pick it
 *      up next shop", not "pretend you have it". A 3-second undo banner
 *      covers accidental taps.
 *
 *   5. Percentage badge removed from recipe match cards. The "X of Y
 *      matched" counter below the title is enough information; the floating
 *      % badge was cognitive noise on an already-dense card.
 *
 *   6. Chips are sorted: ingredients with substitutions available come first.
 *      Reason: if the user is missing something, knowing they have a swap
 *      option is the most valuable signal. (Sorting happens in
 *      scoreRecipeAgainstPantry in pantry-helpers.ts.)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import * as Haptics from 'expo-haptics';

import { tokens, fonts, shadows } from '../../src/theme/tokens';
import { Icon } from '../../src/components/Icon';
import { VersionFooter } from '../../src/components/VersionFooter';
import { IngredientSearchOverlay } from '../../src/components/IngredientSearchOverlay';
import {
  clearAllPantryItems,
  getAllRecipes,
  getPantryItems,
  upsertPantryItem,
  deletePantryItem,
  upsertShoppingItem,
  deleteShoppingItem,
} from '../../db/database';
import type { PantryItem, ShoppingItem } from '../../db/database';
import type { Recipe } from '../../src/data/types';
import {
  categorizeIngredient,
  cleanIngredientName,
  normalizeForMatch,
  scoreRecipeAgainstPantry,
} from '../../src/data/pantry-helpers';
import type {
  PantryCategory,
  RecipeMatchResult,
} from '../../src/data/pantry-helpers';

// ── Constants ────────────────────────────────────────────────────────────────

const FRESH_DURATION_MS = 1500;
const TOP_MATCHES = 6;
const UNLOCK_MIN_PANTRY = 2;
const UNLOCK_MIN_COUNT = 2;
const UNDO_TIMEOUT_MS = 5000;
const SHOP_UNDO_TIMEOUT_MS = 3000;
const CARD_WIDTH = 260;
const CARD_GAP = 12;
const CAROUSEL_PADDING = 20;

// ── Helpers ──────────────────────────────────────────────────────────────────

function pantryId(name: string): string {
  return (
    'pantry-' +
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') +
    '-' +
    Date.now().toString(36)
  );
}

function shopId(name: string): string {
  return (
    'shop-' +
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') +
    '-' +
    Date.now().toString(36)
  );
}

function sameNorm(a: string, b: string): boolean {
  return normalizeForMatch(a) === normalizeForMatch(b);
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function PantryTab() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();

  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [addedAt, setAddedAt] = useState<Record<string, number>>({});
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());

  // Clear-all undo state
  const [undoSnapshot, setUndoSnapshot] = useState<{
    items: PantryItem[];
    addedAt: Record<string, number>;
    label: string;
  } | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Shopping-list add undo state (3 s window — shorter than clear-all)
  const [shopUndo, setShopUndo] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const shopUndoTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ── Load data ──────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [items, recs] = await Promise.all([
          getPantryItems(db),
          getAllRecipes(db),
        ]);
        if (!cancelled) {
          setPantryItems(items);
          setRecipes(recs);
        }
      } catch (e) {
        console.error('Pantry load failed', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [db]);

  // ── Derived ────────────────────────────────────────────────────────────────

  const sortedPantry = useMemo(() => {
    return [...pantryItems].sort((a, b) => {
      const ta = addedAt[a.id] ?? 0;
      const tb = addedAt[b.id] ?? 0;
      return tb - ta;
    });
  }, [pantryItems, addedAt]);

  const matchResults = useMemo<RecipeMatchResult[]>(() => {
    if (pantryItems.length === 0) return [];
    return recipes.map((r) => scoreRecipeAgainstPantry(r, pantryItems));
  }, [recipes, pantryItems]);

  const ranked = useMemo(() => {
    return [...matchResults]
      .filter((m) => m.haveCount > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_MATCHES);
  }, [matchResults]);

  const fullMatches = useMemo(
    () => ranked.filter((m) => m.haveCount === m.totalCount).length,
    [ranked],
  );

  // Unlock: single ingredient that unblocks the most near-miss recipes.
  const unlock = useMemo(() => {
    if (pantryItems.length < UNLOCK_MIN_PANTRY) return null;
    const counter = new Map<string, number>();
    for (const m of matchResults) {
      const coverage = m.totalCount > 0 ? m.haveCount / m.totalCount : 0;
      if (coverage < 0.5 || m.haveCount === m.totalCount) continue;
      for (const name of m.missingNames) {
        counter.set(name, (counter.get(name) ?? 0) + 1);
      }
    }
    let best: { name: string; count: number } | null = null;
    for (const [name, count] of counter.entries()) {
      if (count >= UNLOCK_MIN_COUNT && (!best || count > best.count)) {
        best = { name, count };
      }
    }
    return best;
  }, [matchResults, pantryItems.length]);

  // Have-it pills: only items with have_it = true, sorted by recency.
  const havePills = useMemo(
    () => sortedPantry.filter((p) => p.have_it),
    [sortedPantry],
  );

  // ── Mutators ───────────────────────────────────────────────────────────────

  const addByName = useCallback(
    async (rawName: string, category?: PantryCategory) => {
      const clean = cleanIngredientName(rawName);
      if (!clean) return;
      const existing = pantryItems.find((p) => sameNorm(p.name, clean));
      if (existing) {
        Haptics.selectionAsync().catch(() => {});
        const id = existing.id;
        setFreshIds((prev) => new Set(prev).add(id));
        setTimeout(() => {
          if (!mountedRef.current) return;
          setFreshIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }, FRESH_DURATION_MS);
        return;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      const id = pantryId(clean);
      const item: PantryItem = {
        id,
        name: clean,
        category: category ?? categorizeIngredient(clean),
        quantity: null,
        unit: null,
        have_it: true,
      };
      setPantryItems((prev) => [item, ...prev]);
      setAddedAt((prev) => ({ ...prev, [id]: Date.now() }));
      setFreshIds((prev) => new Set(prev).add(id));
      upsertPantryItem(db, item).catch((e) =>
        console.error('upsertPantryItem failed', e),
      );
      setTimeout(() => {
        if (!mountedRef.current) return;
        setFreshIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, FRESH_DURATION_MS);
    },
    [db, pantryItems],
  );

  const removeItem = useCallback(
    async (item: PantryItem) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      setPantryItems((prev) => prev.filter((p) => p.id !== item.id));
      setAddedAt((prev) => {
        if (!(item.id in prev)) return prev;
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      setFreshIds((prev) => {
        if (!prev.has(item.id)) return prev;
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      deletePantryItem(db, item.id).catch((e) =>
        console.error('deletePantryItem failed', e),
      );
    },
    [db],
  );

  // ── Clear all + undo ───────────────────────────────────────────────────────

  const clearAll = useCallback(async () => {
    if (pantryItems.length === 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
      () => {},
    );
    const snapshot = {
      items: [...pantryItems],
      addedAt: { ...addedAt },
      label: `Pantry cleared · ${pantryItems.length} item${pantryItems.length === 1 ? '' : 's'}`,
    };
    setPantryItems([]);
    setAddedAt({});
    setFreshIds(new Set());
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoSnapshot(snapshot);
    undoTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setUndoSnapshot(null);
    }, UNDO_TIMEOUT_MS);
    try {
      await clearAllPantryItems(db);
    } catch (e) {
      console.error('clearAllPantryItems failed', e);
    }
  }, [db, pantryItems, addedAt]);

  const undoClear = useCallback(async () => {
    if (!undoSnapshot) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    setPantryItems(undoSnapshot.items);
    setAddedAt(undoSnapshot.addedAt);
    setUndoSnapshot(null);
    await Promise.all(
      undoSnapshot.items.map((it) =>
        upsertPantryItem(db, it).catch((e) =>
          console.error('upsertPantryItem during undo failed', e),
        ),
      ),
    );
  }, [db, undoSnapshot]);

  // ── Shopping list add + undo ───────────────────────────────────────────────
  // Variant A: missing-ingredient chip tap adds to shopping list, not pantry.
  // Rationale: the user is *missing* this ingredient — the right action is
  // "add to shopping list so I pick it up next trip", not "mark as owned".

  const addToShoppingList = useCallback(
    async (
      ing: { name: string; amount: number; unit: string },
      recipeId: string,
    ) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      const id = shopId(ing.name);
      const item: ShoppingItem = {
        id,
        name: ing.name,
        category: categorizeIngredient(ing.name),
        quantity: ing.amount > 0 ? ing.amount : null,
        unit: ing.unit || null,
        notes: null,
        manually_added: false,
        in_cart: false,
        added_at: Date.now(),
        sources: [{ kind: 'pantry-suggestion', recipe_id: recipeId }],
      };
      // Optimistic: no local state to update (shopping list is on a different tab).
      if (shopUndoTimerRef.current) clearTimeout(shopUndoTimerRef.current);
      setShopUndo({ id, label: `${ing.name} added to shopping list` });
      shopUndoTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setShopUndo(null);
      }, SHOP_UNDO_TIMEOUT_MS);
      upsertShoppingItem(db, item).catch((e) =>
        console.error('upsertShoppingItem failed', e),
      );
    },
    [db],
  );

  const undoShopAdd = useCallback(async () => {
    if (!shopUndo) return;
    if (shopUndoTimerRef.current) clearTimeout(shopUndoTimerRef.current);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    const id = shopUndo.id;
    setShopUndo(null);
    deleteShoppingItem(db, id).catch((e) =>
      console.error('deleteShoppingItem during undo failed', e),
    );
  }, [db, shopUndo]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={tokens.primary} />
      </View>
    );
  }

  const snapOffsets = ranked.map((_, i) => i * (CARD_WIDTH + CARD_GAP));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: tokens.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Fixed header ───────────────────────────────────────────── */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 4,
          backgroundColor: tokens.bg,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.sansBold,
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: tokens.primary,
            marginBottom: 4,
          }}
        >
          Cook with what you have
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontFamily: fonts.display,
              fontSize: 36,
              lineHeight: 40,
              color: tokens.ink,
            }}
          >
            Your{' '}
            <Text
              style={{
                fontFamily: fonts.displayItalic,
                fontStyle: 'italic',
                color: tokens.sage,
              }}
            >
              Pantry
            </Text>
          </Text>
          {pantryItems.length > 0 ? (
            <Text
              style={{
                fontFamily: fonts.sans,
                fontSize: 11,
                color: tokens.muted,
                paddingBottom: 4,
              }}
            >
              {pantryItems.length} stocked
            </Text>
          ) : null}
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160, paddingTop: 14 }}
      >

        {/* ── Search bar (tappable → overlay) ────────────────────── */}
        <Pressable
          onPress={() => setOverlayVisible(true)}
          accessibilityRole="search"
          accessibilityLabel="Search or add an ingredient"
          style={({ pressed }) => ({
            marginHorizontal: 20,
            marginBottom: 14,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: tokens.cream,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: tokens.lineDark,
            paddingHorizontal: 16,
            paddingVertical: 13,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Icon name="search" size={15} color={tokens.muted} />
          <Text
            style={{
              flex: 1,
              fontFamily: fonts.sans,
              fontSize: 15,
              color: tokens.muted,
            }}
          >
            Search or add an ingredient…
          </Text>
          {pantryItems.length > 0 ? (
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                clearAll();
              }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Clear all pantry items"
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 0.7 })}
            >
              <Text
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 11,
                  color: tokens.muted,
                }}
              >
                Clear all
              </Text>
            </Pressable>
          ) : null}
        </Pressable>

        {/* ── Have-it pills (horizontal scroll) ──────────────────── */}
        {havePills.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 14,
              gap: 7,
            }}
          >
            {havePills.map((it) => (
              <Pill
                key={it.id}
                item={it}
                fresh={freshIds.has(it.id)}
                onRemove={() => removeItem(it)}
              />
            ))}
          </ScrollView>
        ) : (
          <EmptyPantry onAddFirst={() => setOverlayVisible(true)} />
        )}

        {/* ── Gold match summary banner ───────────────────────────── */}
        {ranked.length > 0 ? (
          <View
            style={{
              marginHorizontal: 20,
              marginBottom: 12,
              backgroundColor: tokens.cream,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: 'rgba(232,184,48,0.35)',
              paddingVertical: 13,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              overflow: 'hidden',
            }}
          >
            {/* Gold left strip */}
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                backgroundColor: tokens.primary,
                borderRadius: 4,
              }}
            />
            <View style={{ flex: 1, paddingLeft: 8 }}>
              <Text
                style={{
                  fontFamily: fonts.display,
                  fontSize: 15,
                  color: tokens.primary,
                  lineHeight: 19,
                  marginBottom: 2,
                }}
              >
                {fullMatches > 0
                  ? `${fullMatches} recipe${fullMatches === 1 ? '' : 's'} ready to cook`
                  : 'Getting close'}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 11,
                  color: tokens.muted,
                }}
              >
                {fullMatches > 0
                  ? `${ranked.length - fullMatches > 0 ? `+${ranked.length - fullMatches} more with a few extra ingredients` : 'You have everything you need'}`
                  : `${ranked.length} match${ranked.length === 1 ? '' : 'es'} · ranked by coverage`}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                color: tokens.primary,
                opacity: 0.7,
              }}
            >
              →
            </Text>
          </View>
        ) : null}

        {/* ── Unlock nudge ────────────────────────────────────────── */}
        {unlock ? (
          <Pressable
            onPress={() => addByName(unlock.name)}
            style={({ pressed }) => ({
              marginHorizontal: 20,
              marginBottom: 16,
              padding: 16,
              borderRadius: 18,
              backgroundColor: pressed ? tokens.primaryDeep : tokens.primary,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              ...shadows.card,
              shadowColor: tokens.primaryDeep,
              shadowOpacity: 0.18,
            })}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: 'rgba(26,19,14,0.10)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 22 }}>🔑</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 10,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  color: 'rgba(26,19,14,0.70)',
                  marginBottom: 3,
                }}
              >
                One ingredient unlocks more
              </Text>
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 15,
                  color: tokens.ink,
                  lineHeight: 19,
                }}
              >
                Add{' '}
                <Text style={{ textDecorationLine: 'underline' }}>
                  {unlock.name}
                </Text>{' '}
                → {unlock.count} more recipe{unlock.count === 1 ? '' : 's'}
              </Text>
            </View>
            <Text style={{ fontSize: 20, color: tokens.ink }}>＋</Text>
          </Pressable>
        ) : null}

        {/* ── Recipe match carousel ───────────────────────────────── */}
        {ranked.length > 0 ? (
          <View>
            <View
              style={{
                paddingHorizontal: 20,
                paddingBottom: 10,
                flexDirection: 'row',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 11,
                  letterSpacing: 1.8,
                  textTransform: 'uppercase',
                  color: tokens.inkSoft,
                }}
              >
                {fullMatches > 0 ? 'Ready to cook' : 'Closest matches'}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 11,
                  color: tokens.muted,
                }}
              >
                {fullMatches > 0
                  ? `${fullMatches} ready · ${ranked.length - fullMatches} close`
                  : `${ranked.length} dish${ranked.length === 1 ? '' : 'es'}`}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToOffsets={snapOffsets}
              snapToAlignment="start"
              disableIntervalMomentum
              contentContainerStyle={{
                paddingHorizontal: CAROUSEL_PADDING,
                gap: CARD_GAP,
              }}
            >
              {ranked.map((m) => (
                <RecipeMatchCard
                  key={m.recipe.id}
                  match={m}
                  onOpenRecipe={() => router.push(`/recipe/${m.recipe.id}`)}
                  onAddToShoppingList={(ing) =>
                    addToShoppingList(ing, m.recipe.id)
                  }
                />
              ))}
            </ScrollView>
          </View>
        ) : pantryItems.length > 0 ? (
          <NoMatchesState />
        ) : null}

        <VersionFooter paddingBottom={32} />
      </ScrollView>

      {/* ── Search overlay ──────────────────────────────────────────── */}
      <IngredientSearchOverlay
        visible={overlayVisible}
        pantryItems={pantryItems}
        onAdd={(name, category) => addByName(name, category)}
        onClose={() => setOverlayVisible(false)}
      />

      {/* ── Clear-all undo toast (5 s) ──────────────────────────────── */}
      {undoSnapshot ? (
        <Animated.View
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(120)}
          style={{
            position: 'absolute',
            bottom: insets.bottom + 80,
            left: 16,
            right: 16,
            backgroundColor: tokens.ink,
            borderRadius: 14,
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            ...shadows.toast,
          }}
        >
          <Text
            style={{
              flex: 1,
              fontFamily: fonts.sans,
              fontSize: 13,
              color: '#FFF',
            }}
          >
            {undoSnapshot.label}
          </Text>
          <Pressable onPress={undoClear} hitSlop={8}>
            <Text
              style={{
                fontFamily: fonts.sansBold,
                fontSize: 12,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: tokens.primary,
              }}
            >
              Undo
            </Text>
          </Pressable>
        </Animated.View>
      ) : null}

      {/* ── Shopping-list add undo toast (3 s) ──────────────────────── */}
      {shopUndo ? (
        <Animated.View
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(120)}
          style={{
            position: 'absolute',
            bottom: insets.bottom + (undoSnapshot ? 140 : 80),
            left: 16,
            right: 16,
            backgroundColor: tokens.bgDeep,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: 'rgba(232,184,48,0.30)',
            paddingVertical: 13,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            ...shadows.toast,
          }}
        >
          <Icon name="check" size={13} color={tokens.primary} />
          <Text
            style={{
              flex: 1,
              fontFamily: fonts.sans,
              fontSize: 13,
              color: tokens.inkSoft,
            }}
          >
            {shopUndo.label}
          </Text>
          <Pressable onPress={undoShopAdd} hitSlop={8}>
            <Text
              style={{
                fontFamily: fonts.sansBold,
                fontSize: 12,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: tokens.primary,
              }}
            >
              Undo
            </Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

// ── Subcomponents ─────────────────────────────────────────────────────────────

/**
 * Pill — have-it item in the horizontal strip.
 *
 * Fresh flash: brief gold tint on the pill immediately after adding.
 * This is the tactile "yes, that landed" receipt before it settles to sage.
 */
function Pill({
  item,
  fresh,
  onRemove,
}: {
  item: PantryItem;
  fresh: boolean;
  onRemove: () => void;
}) {
  const bg = fresh ? tokens.primaryLight : tokens.sageLight;
  const fg = fresh ? tokens.primaryDeep : tokens.sageDeep;
  const borderColor = fresh ? 'rgba(232,184,48,0.45)' : 'rgba(170,204,168,0.50)';
  const xBg = fresh ? 'rgba(163,68,31,0.18)' : 'rgba(70,94,64,0.18)';

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      exiting={FadeOut.duration(140)}
      layout={LinearTransition.duration(180)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 13,
        backgroundColor: bg,
        borderRadius: 999,
        borderWidth: 1,
        borderColor,
        minHeight: 34,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.sansBold,
          fontSize: 13,
          color: fg,
        }}
      >
        {item.name}
      </Text>
      <Pressable
        onPress={onRemove}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${item.name}`}
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          backgroundColor: xBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 2,
          marginRight: -4,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontFamily: fonts.sansBold,
            color: fg,
            lineHeight: 13,
          }}
        >
          ×
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function EmptyPantry({ onAddFirst }: { onAddFirst: () => void }) {
  return (
    <View
      style={{
        paddingVertical: 28,
        paddingHorizontal: 18,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: tokens.sageLight,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
        }}
      >
        <Text style={{ fontSize: 24 }}>🥘</Text>
      </View>
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 18,
          color: tokens.ink,
          marginBottom: 6,
          fontStyle: 'italic',
        }}
      >
        What's in your kitchen?
      </Text>
      <Text
        style={{
          fontFamily: fonts.sans,
          fontSize: 13,
          color: tokens.muted,
          textAlign: 'center',
          lineHeight: 18,
          maxWidth: 260,
          marginBottom: 20,
        }}
      >
        Add a few ingredients and Hone finds the best recipes you can cook right now — no shopping required.
      </Text>
      <Pressable
        onPress={onAddFirst}
        style={({ pressed }) => ({
          backgroundColor: tokens.primary,
          borderRadius: 12,
          paddingVertical: 12,
          paddingHorizontal: 22,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Text
          style={{
            fontFamily: fonts.sansBold,
            fontSize: 14,
            color: tokens.bgDeep,
          }}
        >
          Add ingredients
        </Text>
      </Pressable>
    </View>
  );
}

function NoMatchesState() {
  return (
    <View
      style={{
        marginHorizontal: 20,
        marginTop: 8,
        marginBottom: 16,
        paddingVertical: 28,
        paddingHorizontal: 20,
        backgroundColor: tokens.cream,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: tokens.line,
        alignItems: 'center',
        ...shadows.card,
      }}
    >
      <Text style={{ fontSize: 28, marginBottom: 8 }}>🔍</Text>
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 17,
          color: tokens.ink,
          marginBottom: 4,
        }}
      >
        Nothing matches yet
      </Text>
      <Text
        style={{
          fontFamily: fonts.sans,
          fontSize: 13,
          color: tokens.muted,
          textAlign: 'center',
          lineHeight: 18,
          maxWidth: 260,
        }}
      >
        Add a couple more ingredients and recipes will start appearing here.
      </Text>
    </View>
  );
}

/**
 * RecipeMatchCard — compact horizontal card for the match carousel.
 *
 * v0.5.0 changes from v0.4.0:
 *   - % badge removed. It was visual clutter on a small card; the "X of Y
 *     matched" line below the title carries the same info with more context.
 *   - MissingPill → ChipAdd (Variant A). Chips are gold-tinted, add to the
 *     shopping list on tap. A 3-second undo toast surfaces in the parent.
 *   - Chips are pre-sorted by substitution availability (done in
 *     scoreRecipeAgainstPantry) so the most actionable chips come first.
 */
function RecipeMatchCard({
  match,
  onOpenRecipe,
  onAddToShoppingList,
}: {
  match: RecipeMatchResult;
  onOpenRecipe: () => void;
  onAddToShoppingList: (ing: { name: string; amount: number; unit: string }) => void;
}) {
  const allReady = match.totalCount === match.haveCount;
  // Track added chips within this card's render lifetime.
  const [addedNames, setAddedNames] = useState<Set<string>>(new Set());

  const handleChipAdd = (
    ing: { name: string; amount: number; unit: string },
  ) => {
    setAddedNames((prev) => new Set(prev).add(ing.name));
    onAddToShoppingList(ing);
  };

  return (
    <Pressable
      onPress={onOpenRecipe}
      style={({ pressed }) => ({
        width: CARD_WIDTH,
        backgroundColor: tokens.cream,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: tokens.line,
        overflow: 'hidden',
        opacity: pressed ? 0.95 : 1,
        ...shadows.card,
      })}
    >
      {/* Hero image */}
      <View
        style={{
          height: 130,
          backgroundColor: tokens.bgDeep,
          position: 'relative',
        }}
      >
        {match.recipe.hero_url ? (
          <Image
            source={{ uri: match.recipe.hero_url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 38 }}>{match.recipe.emoji ?? '🍳'}</Text>
          </View>
        )}
        {!allReady ? (
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              backgroundColor: 'rgba(26,19,14,0.7)',
              paddingHorizontal: 9,
              paddingVertical: 5,
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.sansBold,
                fontSize: 10,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: '#FFF',
              }}
            >
              {match.haveCount} of {match.totalCount} matched
            </Text>
          </View>
        ) : null}
      </View>

      {/* Card body */}
      <View style={{ padding: 14 }}>
        <Text
          style={{
            fontFamily: fonts.display,
            fontSize: 15,
            lineHeight: 19,
            color: tokens.ink,
            marginBottom: 10,
          }}
          numberOfLines={2}
        >
          {match.recipe.title}
        </Text>

        {allReady ? (
          <View
            style={{
              alignSelf: 'flex-start',
              paddingVertical: 7,
              paddingHorizontal: 12,
              backgroundColor: tokens.sage,
              borderRadius: 999,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Text style={{ color: tokens.ink, fontSize: 11, fontWeight: '900' }}>
              ✓
            </Text>
            <Text
              style={{
                fontFamily: fonts.sansBold,
                fontSize: 12,
                color: tokens.ink,
              }}
            >
              Tap to cook
            </Text>
          </View>
        ) : (
          <View>
            {/* "Need" label */}
            <Text
              style={{
                fontFamily: fonts.sansBold,
                fontSize: 9,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                color: tokens.muted,
                marginBottom: 7,
              }}
            >
              Still need
            </Text>
            {/* Variant A chips */}
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 6,
                marginBottom: 4,
              }}
            >
              {match.missingIngredients.map((ing) => (
                <ChipAdd
                  key={ing.name}
                  ing={ing}
                  added={addedNames.has(ing.name)}
                  onAdd={handleChipAdd}
                />
              ))}
            </View>
            <Text
              style={{
                fontFamily: fonts.sans,
                fontSize: 10,
                color: tokens.muted,
                marginTop: 2,
              }}
            >
              Tap to add to shopping list
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

/**
 * ChipAdd — Variant A missing-ingredient chip.
 *
 * Gold-tinted, dashed-border → solid on "added" state.
 * Tapping calls onAdd and immediately flips to checkmark style.
 * Reason for gold: the chip is an action (add to shopping list), not just
 * information. Gold = primary action in the Hone palette.
 */
function ChipAdd({
  ing,
  added,
  onAdd,
}: {
  ing: { name: string; amount: number; unit: string };
  added: boolean;
  onAdd: (ing: { name: string; amount: number; unit: string }) => void;
}) {
  const label = ing.amount > 0
    ? `${ing.amount}${ing.unit ? ' ' + ing.unit : ''} ${ing.name}`
    : ing.name;

  return (
    <Pressable
      onPress={() => !added && onAdd(ing)}
      accessibilityRole="button"
      accessibilityLabel={
        added
          ? `${ing.name} added to shopping list`
          : `Add ${label} to shopping list`
      }
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: added ? tokens.primary : tokens.primaryLight,
        borderWidth: 1,
        borderColor: added ? tokens.primary : 'rgba(232,184,48,0.35)',
        borderRadius: 999,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Text
        style={{
          fontFamily: fonts.sansBold,
          fontSize: 12,
          color: added ? tokens.bgDeep : tokens.primary,
        }}
      >
        {added ? '✓' : '+'}
      </Text>
      <Text
        style={{
          fontFamily: fonts.sansBold,
          fontSize: 11,
          color: added ? tokens.bgDeep : tokens.primary,
        }}
        numberOfLines={1}
      >
        {ing.name}
      </Text>
    </Pressable>
  );
}

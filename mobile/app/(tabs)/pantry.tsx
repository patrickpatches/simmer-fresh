/**
 * Pantry — v0.6.0 (Pantry v3 redesign, 2026-05-03).
 *
 * Changes from v0.5.x:
 *
 *   1. Inline search replaces the full-screen IngredientSearchOverlay modal.
 *      Rationale: augmentation tasks (adding to an existing list) need the list
 *      visible while searching. A full-screen takeover hides the pills context
 *      the user needs to avoid duplicates. Inline keeps the pills frozen above
 *      the autocomplete results.
 *
 *   2. Clear-all confirmation Modal (not Alert — Alert can't be styled for
 *      dark tokens). "Clear all" moved from below the search bar to a low-
 *      prominence trash icon in the screen's title row. Count baked into the
 *      destroy button label so the user knows what they're losing.
 *
 *   3. Match banner now shows concrete numbers ("3 recipes you can cook now ·
 *      6 more within 1–3 ingredients") with a gold "See all" pill CTA. The
 *      ambiguous bare `→` arrow is removed.
 *
 *   4. Carousel snap regression fixed: switched from snapToOffsets (fragile
 *      with dynamic data) to snapToInterval (robust, one constant).
 *
 *   5. Emoji rendered inline with ingredient name in autocomplete results,
 *      not as a separate element that could reflow on narrow screens.
 */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  SectionList,
  Text,
  TextInput,
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
  INGREDIENT_CATALOG,
  CATEGORY_EMOJI,
  fuzzyMatchCatalog,
  matchedAlias,
} from '../../src/data/pantry-helpers';
import type {
  PantryCategory,
  CatalogEntry,
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

// ── Types ────────────────────────────────────────────────────────────────────

type AutocompleteSection = { title: PantryCategory; data: CatalogEntry[] };

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

  // Search state
  const [addName, setAddName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Search is active whenever the input has text — results stay visible while
  // the user picks items without the view snapping back on each selection.
  const isSearchActive = addName.length > 0 || isFocused;

  const [addedAt, setAddedAt] = useState<Record<string, number>>({});
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());

  // Clear-all confirmation modal
  const [showClearModal, setShowClearModal] = useState(false);

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

  const havePills = useMemo(
    () => sortedPantry.filter((p) => p.have_it),
    [sortedPantry],
  );

  // ── Autocomplete sections ──────────────────────────────────────────────────
  // When search is active, the SectionList shows these instead of browse content.

  const autocompleteSections = useMemo<AutocompleteSection[]>(() => {
    const q = addName.trim();
    const entries =
      q.length >= 2
        ? INGREDIENT_CATALOG.filter((e) => fuzzyMatchCatalog(e, q))
        : INGREDIENT_CATALOG;

    const inPantryNorms = new Set(pantryItems.map((p) => normalizeForMatch(p.name)));

    const map = new Map<PantryCategory, CatalogEntry[]>();
    for (const entry of entries) {
      const bucket = map.get(entry.category) ?? [];
      bucket.push(entry);
      map.set(entry.category, bucket);
    }
    return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
  }, [addName, pantryItems]);

  const inPantrySet = useMemo(() => {
    const s = new Set<string>();
    for (const p of pantryItems) s.add(p.name.toLowerCase().trim());
    return s;
  }, [pantryItems]);

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

  const handleSearchSelect = useCallback(
    (entry: CatalogEntry) => {
      addByName(entry.name, entry.category);
      // Don't collapse — let the user keep adding multiple items
    },
    [addByName],
  );

  const handleSearchCancel = useCallback(() => {
    setAddName('');
    setIsFocused(false);
    Keyboard.dismiss();
  }, []);

  const handleAddCustom = useCallback(() => {
    const trimmed = addName.trim();
    if (!trimmed) return;
    addByName(trimmed);
    setAddName('');
  }, [addName, addByName]);

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
  // v3: Modal confirmation replaces the inline button. This is the actual clear
  // function — it runs after the user confirms in the modal.

  const clearAll = useCallback(async () => {
    if (pantryItems.length === 0) return;
    setShowClearModal(false);
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

  const haveCount = havePills.length;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: tokens.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Fixed header zone — never scrolls ──────────────────────── */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 4,
          backgroundColor: tokens.bg,
        }}
      >
        {/* Eyebrow */}
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

        {/* Title row — title + optional trash icon */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
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
          </View>

          {/* Right side: item count + trash (only when pantry has items) */}
          {haveCount > 0 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 8 }}>
              <Text
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 11,
                  color: tokens.muted,
                }}
              >
                {haveCount} stocked
              </Text>
              <Pressable
                onPress={() => setShowClearModal(true)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Clear all pantry items"
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
              >
                <Icon name="trash" size={16} color={tokens.muted} />
              </Pressable>
            </View>
          ) : null}
        </View>

        {/* Search bar — real TextInput (v3: no more tappable Pressable → overlay) */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 14,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: tokens.surface ?? tokens.cream,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: isFocused
                ? tokens.primary
                : 'rgba(232,184,48,0.22)',
              paddingHorizontal: 14,
              paddingVertical: 12,
              ...(isFocused
                ? {
                    shadowColor: tokens.primary,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.10,
                    shadowRadius: 6,
                    elevation: 2,
                  }
                : {}),
            }}
          >
            <Icon name="search" size={15} color={tokens.muted} />
            <TextInput
              ref={inputRef}
              value={addName}
              onChangeText={setAddName}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search or add an ingredient…"
              placeholderTextColor={tokens.muted}
              style={{
                flex: 1,
                fontFamily: fonts.sans,
                fontSize: 15,
                color: tokens.ink,
                paddingVertical: 0,
              }}
              autoCorrect={false}
              autoCapitalize="none"
              spellCheck={false}
              returnKeyType="done"
              onSubmitEditing={handleAddCustom}
            />
            {/* Android clear button — iOS uses clearButtonMode */}
            {addName.length > 0 && Platform.OS === 'android' ? (
              <Pressable
                onPress={() => setAddName('')}
                hitSlop={10}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="x" size={11} color={tokens.muted} />
              </Pressable>
            ) : null}
          </View>

          {/* Cancel button — only when focused */}
          {isFocused ? (
            <Pressable
              onPress={handleSearchCancel}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Cancel search"
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 14,
                  color: tokens.primary,
                }}
              >
                Cancel
              </Text>
            </Pressable>
          ) : null}
        </View>

        {/* Have-it pills card — frozen above results in both modes */}
        {havePills.length > 0 ? (
          <View
            style={{
              marginBottom: 14,
              backgroundColor: tokens.cream,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: tokens.lineDark,
              padding: 12,
            }}
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
              {havePills.map((it) => (
                <Pill
                  key={it.id}
                  item={it}
                  fresh={freshIds.has(it.id)}
                  onRemove={() => removeItem(it)}
                />
              ))}
            </View>
          </View>
        ) : null}
      </View>

      {/* ── Content: browse mode or inline autocomplete ─────────────── */}
      {isSearchActive ? (
        /* ── Autocomplete results ────────────────────────────────────── */
        autocompleteSections.length === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 28,
              paddingBottom: insets.bottom + 60,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.sans,
                fontSize: 14,
                color: tokens.muted,
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              No match — press Enter or tap "+" to add it anyway.
            </Text>
            <Pressable
              onPress={handleAddCustom}
              style={({ pressed }) => ({
                paddingVertical: 11,
                paddingHorizontal: 20,
                backgroundColor: tokens.primaryLight,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(232,184,48,0.35)',
                opacity: pressed ? 0.75 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 14,
                  color: tokens.primary,
                }}
              >
                + Add "{addName.trim()}"
              </Text>
            </Pressable>
          </View>
        ) : (
          <SectionList<CatalogEntry, AutocompleteSection>
            sections={autocompleteSections}
            keyExtractor={(item, idx) => item.name + idx}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            stickySectionHeadersEnabled
            renderSectionHeader={({ section: { title } }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 7,
                  backgroundColor: tokens.bg,
                  paddingHorizontal: 20,
                  paddingVertical: 9,
                  borderBottomWidth: 1,
                  borderBottomColor: tokens.line,
                }}
              >
                <Text style={{ fontSize: 12, lineHeight: 15 }}>
                  {CATEGORY_EMOJI[title] ?? '📦'}
                </Text>
                <Text
                  style={{
                    fontSize: 9,
                    fontFamily: fonts.sansBold,
                    letterSpacing: 2,
                    color: tokens.warmBrown,
                    textTransform: 'uppercase',
                  }}
                >
                  {title}
                </Text>
              </View>
            )}
            renderItem={({ item, index, section }) => {
              const alias = matchedAlias(item, addName.trim());
              const alreadyAdded = inPantrySet.has(item.name.toLowerCase().trim());
              const isLast = index === section.data.length - 1;

              return (
                <Pressable
                  onPress={() => !alreadyAdded && handleSearchSelect(item)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    alreadyAdded
                      ? `${item.name} — already in pantry`
                      : `Add ${item.name} to pantry`
                  }
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 11,
                    minHeight: 46,
                    backgroundColor: tokens.cream,
                    borderBottomWidth: isLast ? 0 : 1,
                    borderBottomColor: tokens.line,
                    gap: 10,
                    opacity: alreadyAdded ? 0.45 : pressed ? 0.8 : 1,
                  })}
                >
                  {/* Emoji inline with name — same flex row, no reflow risk */}
                  <Text style={{ fontSize: 18, width: 26, textAlign: 'center', lineHeight: 22 }}>
                    {CATEGORY_EMOJI[item.category] ?? '📦'}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: alreadyAdded ? fonts.sans : fonts.sans,
                        color: alreadyAdded ? tokens.muted : tokens.ink,
                        lineHeight: 19,
                      }}
                    >
                      {item.name}
                    </Text>
                    {alias ? (
                      <Text
                        style={{
                          fontSize: 11,
                          fontFamily: fonts.sans,
                          color: tokens.muted,
                          marginTop: 1,
                        }}
                      >
                        also {alias}
                      </Text>
                    ) : null}
                  </View>
                  {alreadyAdded ? (
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: fonts.sansBold,
                        color: tokens.sage,
                        letterSpacing: 0.3,
                      }}
                    >
                      ✓ In pantry
                    </Text>
                  ) : (
                    <Icon name="plus" size={16} color={tokens.muted} />
                  )}
                </Pressable>
              );
            }}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 60,
            }}
          />
        )
      ) : (
        /* ── Browse mode ─────────────────────────────────────────────── */
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160, paddingTop: 4 }}
        >
          {/* Empty pantry state — shown when no pills */}
          {havePills.length === 0 ? (
            <EmptyPantry onAddFirst={() => inputRef.current?.focus()} />
          ) : null}

          {/* Gold match summary banner */}
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
                    ? `${fullMatches} recipe${fullMatches === 1 ? '' : 's'} you can cook now`
                    : `${ranked.length} match${ranked.length === 1 ? '' : 'es'} — keep adding`}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 11,
                    color: tokens.muted,
                  }}
                >
                  {fullMatches > 0
                    ? `${ranked.length - fullMatches > 0
                        ? `${ranked.length - fullMatches} more within 1–3 ingredients`
                        : 'You have everything you need'}`
                    : `${ranked.length} recipe${ranked.length === 1 ? '' : 's'} ranked by coverage`}
                </Text>
              </View>

              {/* "See all" gold pill CTA — replaces bare → arrow */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="See all matching recipes"
                style={({ pressed }) => ({
                  backgroundColor: pressed ? tokens.primary : tokens.primaryLight,
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderWidth: 1,
                  borderColor: 'rgba(232,184,48,0.40)',
                })}
              >
                <Text
                  style={{
                    fontFamily: fonts.sansBold,
                    fontSize: 11,
                    color: tokens.primary,
                  }}
                >
                  See all
                </Text>
              </Pressable>
            </View>
          ) : null}

          {/* Unlock nudge */}
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

          {/* Recipe match carousel */}
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

              {/* Carousel — snapToInterval is more reliable than snapToOffsets
                  because it doesn't depend on the computed offset array being
                  correct after data changes. CARD_GAP is the gap between cards
                  set in contentContainerStyle, so the snap unit is exact. */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + CARD_GAP}
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
      )}

      {/* ── Clear-all confirmation Modal ────────────────────────────── */}
      {/* Modal (not Alert) so we can apply dark tokens and custom styling.
          The count in the button label makes the cost of the action explicit. */}
      <Modal
        visible={showClearModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClearModal(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.55)',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: insets.bottom + 16,
            paddingHorizontal: 20,
          }}
          onPress={() => setShowClearModal(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation?.()}
            style={{
              width: '100%',
              backgroundColor: tokens.surface ?? tokens.cream,
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: tokens.lineDark,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.display,
                fontSize: 20,
                color: tokens.ink,
                marginBottom: 10,
                textAlign: 'center',
              }}
            >
              Clear your pantry?
            </Text>
            <Text
              style={{
                fontFamily: fonts.sans,
                fontSize: 13,
                color: tokens.muted,
                textAlign: 'center',
                lineHeight: 18,
                marginBottom: 24,
              }}
            >
              This removes all {haveCount} stocked ingredient{haveCount === 1 ? '' : 's'}.{'\n'}
              Your recipe matches will reset.
            </Text>

            {/* Destructive action */}
            <Pressable
              onPress={clearAll}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#C04040' : '#E05252',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
                marginBottom: 10,
              })}
            >
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 15,
                  color: '#FFF',
                }}
              >
                Clear {haveCount} ingredient{haveCount === 1 ? '' : 's'}
              </Text>
            </Pressable>

            {/* Safe default — phrased positively */}
            <Pressable
              onPress={() => setShowClearModal(false)}
              style={({ pressed }) => ({
                backgroundColor: pressed
                  ? tokens.bgDeep
                  : (tokens.surface2 ?? tokens.bgDeep),
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: tokens.line,
              })}
            >
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 15,
                  color: tokens.ink,
                }}
              >
                Keep my pantry
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

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
            {undo
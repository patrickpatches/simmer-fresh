/**
 * Plan & Shop — combined tab. Replaces the old standalone Plan calendar.
 *
 * Why we dropped the by-day calendar (per ux-redesign-research.md):
 *   Mealime, Whisk, Yummly, Tesco, and most modern meal-planning apps all
 *   removed by-day calendars in their last 2 redesigns. Home cooks shop
 *   weekly, not daily — the calendar was extra friction for a use case
 *   that doesn't exist outside restaurant-grade prep scheduling.
 *
 * Replaces with:
 *   - Two sub-tabs: Shopping list | Meals
 *   - Shopping list: aggregates ingredients across all selected meals,
 *     groups by aisle, subtracts pantry, supports per-item swaps
 *   - Meals: flat list of selected recipes; tap to view, × to remove
 *
 * Adding a meal: primary path is from Kitchen — tap + on any RecipeCard.
 * That meal lands here. No day picker, no scheduling.
 *
 * Data model: MealPlanEntry's `date` field is kept for backward-compat
 * but unused for grouping in this view. Sort order is reverse-add order.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  SectionList,
  Share,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import * as Haptics from 'expo-haptics';

import { tokens, fonts } from '../../src/theme/tokens';
import { Icon } from '../../src/components/Icon';
import { SwapSheet } from '../../src/components/SwapSheet';
import {
  getAllRecipes,
  getPantryItems,
  getAllPlanEntries,
  deleteMealPlanEntry,
  setIngredientSwap,
  clearIngredientSwap,
  getAllSwaps,
  getShoppingExtras,
  addShoppingExtra,
  deleteShoppingExtra,
  type SwapRecord,
  type MealPlanEntry,
  type PantryItem,
  type ShoppingExtra,
} from '../../db/database';
import { Modal, TextInput } from 'react-native';
import type { Recipe, Substitution } from '../../src/data/types';
import {
  categorizeIngredient,
  cleanIngredientName,
  normalizeForMatch,
  SHOPPING_SECTION_LABEL,
  SHOPPING_SECTION_ORDER,
  type PantryCategory,
} from '../../src/data/pantry-helpers';

type SubTab = 'shopping' | 'meals';

type ShoppingItem = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: PantryCategory;
  fromRecipes: string[];
  recipeId: string;
  ingredientId: string;
  substitutions: Substitution[];
};

type ShoppingSection = { title: string; sectionKey: PantryCategory; data: ShoppingItem[] };

function fmtAmt(n: number): string {
  if (n <= 0) return '';
  const r = Math.round(n * 10) / 10;
  return r % 1 === 0 ? String(Math.round(r)) : String(r);
}

export default function PlanAndShopTab() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();

  const [tab, setTab] = useState<SubTab>('shopping');
  const [entries, setEntries] = useState<MealPlanEntry[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [swaps, setSwaps] = useState<Map<string, SwapRecord>>(new Map());
  const [swapSheetItem, setSwapSheetItem] = useState<ShoppingItem | null>(null);
  const [extras, setExtras] = useState<ShoppingExtra[]>([]);
  const [showAddExtraSheet, setShowAddExtraSheet] = useState(false);

  // ── Load on mount + on focus ───────────────────────────────────────────────
  const load = useCallback(async () => {
    const [r, p, e, s, x] = await Promise.all([
      getAllRecipes(db),
      getPantryItems(db),
      getAllPlanEntries(db),
      getAllSwaps(db),
      getShoppingExtras(db),
    ]);
    setAllRecipes(r);
    setPantryItems(p);
    setEntries(e);
    setSwaps(s);
    setExtras(x);
    setLoading(false);
  }, [db]);

  useEffect(() => { load().catch(console.error); }, [load]);

  // Re-load when the tab regains focus (after a Kitchen-side add)
  useEffect(() => {
    const interval = setInterval(() => { load().catch(() => {}); }, 1500);
    return () => clearInterval(interval);
  }, [load]);

  const recipeMap = useMemo(() => {
    const m = new Map<string, Recipe>();
    for (const r of allRecipes) m.set(r.id, r);
    return m;
  }, [allRecipes]);

  // Distinct recipes planned (one row per unique recipe even if added twice)
  // Show every meal-plan entry as its own row. If the user added
  // Smash Burger twice (once for tonight, once to batch-cook tomorrow),
  // both instances appear and both contribute to the shopping list.
  // The previous dedup-by-recipe-id silently swallowed legitimate adds.
  const plannedRecipes = useMemo<Array<{ entry: MealPlanEntry; recipe: Recipe }>>(() => {
    const out: Array<{ entry: MealPlanEntry; recipe: Recipe }> = [];
    for (const e of entries) {
      const r = recipeMap.get(e.recipe_id);
      if (!r) continue;
      out.push({ entry: e, recipe: r });
    }
    return out;
  }, [entries, recipeMap]);

  // ── Shopping list aggregation ──────────────────────────────────────────────
  const shoppingItems = useMemo<ShoppingItem[]>(() => {
    const haveNorms = new Set(
      pantryItems.filter((p) => p.have_it).map((p) => normalizeForMatch(p.name)),
    );
    const inPantry = (name: string) => {
      const norm = normalizeForMatch(name);
      for (const p of haveNorms) {
        if (norm === p) return true;
        if (norm.length > 4 && p.length > 4 && (norm.includes(p) || p.includes(norm))) return true;
      }
      return false;
    };

    const aggregated = new Map<string, ShoppingItem>();
    for (const e of entries) {
      const recipe = recipeMap.get(e.recipe_id);
      if (!recipe) continue;
      const scale = e.servings / recipe.base_servings;

      for (const ing of recipe.ingredients) {
        if (inPantry(ing.name)) continue;
        const clean = cleanIngredientName(ing.name);
        const key = normalizeForMatch(ing.name);
        const scaledAmt = ing.amount * scale;

        if (aggregated.has(key)) {
          const existing = aggregated.get(key)!;
          if (existing.unit === ing.unit) {
            existing.amount += scaledAmt;
          }
          if (!existing.fromRecipes.includes(recipe.title)) {
            existing.fromRecipes.push(recipe.title);
          }
        } else {
          aggregated.set(key, {
            id: `shop-${key.replace(/\s+/g, '-')}-${recipe.id}`,
            name: clean,
            amount: scaledAmt,
            unit: ing.unit,
            category: categorizeIngredient(clean),
            fromRecipes: [recipe.title],
            recipeId: recipe.id,
            ingredientId: ing.id,
            substitutions: ing.substitutions ?? [],
          });
        }
      }
    }
    // Add user's ad-hoc shopping extras (ingredients not tied to a recipe)
    for (const x of extras) {
      const key = `extra:${x.id}`;
      aggregated.set(key, {
        id: `shop-extra-${x.id}`,
        name: x.name,
        amount: x.amount,
        unit: x.unit,
        category: x.category as PantryCategory,
        fromRecipes: ['Added by you'],
        recipeId: x.id, // reuse the field for delete-extra hook below
        ingredientId: 'extra',
        substitutions: [],
      });
    }
    return Array.from(aggregated.values());
  }, [entries, recipeMap, pantryItems, extras]);

  const shoppingSections = useMemo<ShoppingSection[]>(() => {
    return SHOPPING_SECTION_ORDER.map((cat) => ({
      title: SHOPPING_SECTION_LABEL[cat],
      sectionKey: cat,
      data: shoppingItems.filter((i) => i.category === cat),
    })).filter((s) => s.data.length > 0);
  }, [shoppingItems]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleRemove = async (entry: MealPlanEntry) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    await deleteMealPlanEntry(db, entry.id);
    await load();
  };

  const swapKey = (item: ShoppingItem) => `${item.recipeId}:${item.ingredientId}`;

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    const lines: string[] = [`🛒 Hone shopping list`, ''];
    for (const section of shoppingSections) {
      lines.push(`${section.title.toUpperCase()}`);
      for (const item of section.data) {
        const swap = swaps.get(swapKey(item));
        const name = swap ? swap.swap_name : item.name;
        const amt = fmtAmt(item.amount);
        lines.push(`  · ${[amt, item.unit, name].filter(Boolean).join(' ')}`);
      }
      lines.push('');
    }
    lines.push('Made with Hone');
    try { await Share.share({ message: lines.join('\n') }); } catch {}
  };

  const handleToggleChecked = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={tokens.paprika} />
      </View>
    );
  }

  const empty = plannedRecipes.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 18,
          paddingHorizontal: 20,
          paddingBottom: 160,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 6 }}>
          <Text style={{ flex: 1, fontFamily: fonts.display, fontSize: 28, color: tokens.ink, lineHeight: 32 }}>
            Plan & Shop
          </Text>
          {!empty && (
            <Pressable
              onPress={handleShare}
              accessibilityLabel="Share shopping list"
              hitSlop={8}
              style={({ pressed }) => ({
                flexDirection: 'row', alignItems: 'center', gap: 6,
                backgroundColor: pressed ? tokens.inkSoft : tokens.ink,
                borderRadius: 999,
                paddingHorizontal: 14, paddingVertical: 9,
              })}
            >
              <Icon name="external" size={13} color={tokens.cream} />
              <Text style={{ fontFamily: fonts.sansBold, fontSize: 12, color: tokens.cream }}>Share</Text>
            </Pressable>
          )}
        </View>
        <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: tokens.muted, marginBottom: 16 }}>
          {empty ? 'No meals selected yet' : `${plannedRecipes.length} meal${plannedRecipes.length === 1 ? '' : 's'} on the go`}
        </Text>

        {/* Sub-tabs */}
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: tokens.line,
            marginBottom: 16,
          }}
        >
          {(['shopping', 'meals'] as SubTab[]).map((id) => {
            const active = tab === id;
            const label = id === 'shopping' ? 'Shopping list' : 'Meals';
            const count = id === 'shopping' ? shoppingItems.length : plannedRecipes.length;
            return (
              <Pressable
                key={id}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setTab(id);
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 12,
                  borderBottomWidth: 2,
                  borderBottomColor: active ? tokens.paprika : 'transparent',
                  marginBottom: -1,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.sansBold,
                    fontSize: 13,
                    color: active ? tokens.ink : tokens.muted,
                  }}
                >
                  {label}{count > 0 ? `  ${count}` : ''}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Empty state */}
        {empty ? (
          <View
            style={{
              padding: 24,
              backgroundColor: tokens.cream,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: tokens.line,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 14,
            }}
          >
            <Text style={{ fontSize: 32 }}>🛒</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.display, fontSize: 18, color: tokens.ink, marginBottom: 6 }}>
                Pick meals from Kitchen
              </Text>
              <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: tokens.inkSoft, lineHeight: 19, marginBottom: 12 }}>
                Tap the <Text style={{ fontFamily: fonts.sansBold, color: tokens.paprika }}>+</Text> on any recipe in the Kitchen tab. The shopping list builds itself, grouped by aisle, with anything in your pantry already excluded.
              </Text>
              <Pressable
                onPress={() => router.push('/(tabs)/')}
                accessibilityLabel="Open Kitchen"
                style={({ pressed }) => ({
                  alignSelf: 'flex-start',
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  borderRadius: 999,
                  backgroundColor: pressed ? tokens.paprikaDeep : tokens.paprika,
                })}
              >
                <Text style={{ fontFamily: fonts.sansBold, fontSize: 12, color: tokens.cream }}>Browse Kitchen</Text>
              </Pressable>
            </View>
          </View>
        ) : tab === 'shopping' ? (
          // ── Shopping list ───────────────────────────────────────────────
          <ShoppingListView
            sections={shoppingSections}
            checkedIds={checkedIds}
            onToggleChecked={handleToggleChecked}
            swaps={swaps}
            swapKey={swapKey}
            onSwapPress={(item) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              setSwapSheetItem(item);
            }}
            onAddExtra={() => setShowAddExtraSheet(true)}
          />
        ) : (
          // ── Meals list ───────────────────────────────────────────────────
          <View style={{ gap: 10 }}>
            {plannedRecipes.map(({ entry, recipe }) => (
              <MealRow
                key={entry.id}
                recipe={recipe}
                entry={entry}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
                onRemove={() => handleRemove(entry)}
              />
            ))}
            <Pressable
              onPress={() => router.push('/(tabs)/')}
              accessibilityLabel="Add a meal from Kitchen"
              style={({ pressed }) => ({
                marginTop: 6,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: tokens.line,
                borderStyle: 'dashed',
                backgroundColor: pressed ? tokens.bgDeep : 'transparent',
              })}
            >
              <Icon name="plus" size={16} color={tokens.muted} />
              <Text style={{ fontFamily: fonts.sansBold, fontSize: 13, color: tokens.muted }}>
                Add a meal — opens Kitchen
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Swap sheet */}
      {/* Ad-hoc ingredient sheet — add an item not tied to any recipe */}
      <AddExtraSheet
        visible={showAddExtraSheet}
        onClose={() => setShowAddExtraSheet(false)}
        onSave={async (name, amount, unit) => {
          const extra: ShoppingExtra = {
            id: `extra-${Date.now()}`,
            name: name.trim(),
            amount: amount,
            unit: unit.trim(),
            category: 'Pantry Staples',
            created_at: Date.now(),
          };
          await addShoppingExtra(db, extra).catch(console.error);
          await load();
          setShowAddExtraSheet(false);
        }}
      />

      {swapSheetItem && (
        <SwapSheet
          visible
          ingredientName={swapSheetItem.name}
          substitutions={swapSheetItem.substitutions}
          activeSwapName={swaps.get(swapKey(swapSheetItem))?.swap_name}
          onClose={() => setSwapSheetItem(null)}
          onSelect={async (sub) => {
            const item = swapSheetItem;
            if (sub === null) {
              await clearIngredientSwap(db, item.recipeId, item.ingredientId).catch(console.error);
            } else {
              await setIngredientSwap(
                db, item.recipeId, item.ingredientId, item.name,
                sub.ingredient, sub.quantity_note ?? undefined,
              ).catch(console.error);
            }
            setSwaps(await getAllSwaps(db).catch(() => new Map<string, SwapRecord>()));
            setSwapSheetItem(null);
          }}
        />
      )}
    </View>
  );
}

// ── Shopping list view ──────────────────────────────────────────────────────

function ShoppingListView({
  sections,
  checkedIds,
  onToggleChecked,
  swaps,
  swapKey,
  onSwapPress,
  onAddExtra,
}: {
  sections: ShoppingSection[];
  checkedIds: Set<string>;
  onToggleChecked: (id: string) => void;
  swaps: Map<string, SwapRecord>;
  swapKey: (item: ShoppingItem) => string;
  onSwapPress: (item: ShoppingItem) => void;
  onAddExtra: () => void;
}) {
  if (sections.length === 0) {
    return (
      <View style={{ padding: 24, alignItems: 'center' }}>
        <Text style={{ fontSize: 36, marginBottom: 8 }}>🎉</Text>
        <Text style={{ fontFamily: fonts.display, fontSize: 18, color: tokens.ink, marginBottom: 4 }}>
          You have everything
        </Text>
        <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: tokens.muted, textAlign: 'center' }}>
          Your pantry covers every ingredient. Pick more meals to add to the list.
        </Text>
      </View>
    );
  }
  const total = sections.reduce((n, s) => n + s.data.length, 0);
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: tokens.muted }}>
          {total} item{total === 1 ? '' : 's'} · pantry items excluded
        </Text>
        <Pressable
          onPress={onAddExtra}
          accessibilityLabel="Add an ingredient to the shopping list"
          style={({ pressed }) => ({
            flexDirection: 'row', alignItems: 'center', gap: 5,
            paddingHorizontal: 11, paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: pressed ? tokens.paprikaDeep : tokens.paprika,
          })}
        >
          <Icon name="plus" size={13} color={tokens.cream} />
          <Text style={{ fontFamily: fonts.sansBold, fontSize: 12, color: tokens.cream }}>
            Add ingredient
          </Text>
        </Pressable>
      </View>
      {sections.map((section) => (
        <View key={section.sectionKey} style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontFamily: fonts.sansBold,
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: tokens.inkSoft,
              marginBottom: 8,
            }}
          >
            {section.title} · {section.data.length}
          </Text>
          {section.data.map((item, idx) => {
            const checked = checkedIds.has(item.id);
            const activeSwap = swaps.get(swapKey(item));
            const displayName = activeSwap ? activeSwap.swap_name : item.name;
            const amt = fmtAmt(item.amount);
            const hasSubs = item.substitutions.length > 0;
            const isLast = idx === section.data.length - 1;
            return (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  gap: 14,
                  borderBottomWidth: isLast ? 0 : 1,
                  borderBottomColor: tokens.line,
                }}
              >
                <Pressable
                  onPress={() => onToggleChecked(item.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  hitSlop={8}
                  style={{
                    width: 26, height: 26, borderRadius: 7,
                    borderWidth: 2,
                    borderColor: checked ? tokens.sage : tokens.line,
                    backgroundColor: checked ? tokens.sage : 'transparent',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {checked && <Icon name="check" size={14} color={tokens.cream} />}
                </Pressable>
                <Pressable style={{ flex: 1 }} onPress={() => onToggleChecked(item.id)}>
                  <Text
                    style={{
                      fontFamily: fonts.sans,
                      fontSize: 15,
                      color: checked ? tokens.muted : activeSwap ? tokens.ochre : tokens.ink,
                      textDecorationLine: checked ? 'line-through' : 'none',
                    }}
                  >
                    {amt && item.unit
                      ? <><Text style={{ fontFamily: fonts.sansBold }}>{amt} {item.unit}</Text>{' '}{displayName}</>
                      : amt
                        ? <><Text style={{ fontFamily: fonts.sansBold }}>{amt}</Text>{' '}{displayName}</>
                        : displayName}
                  </Text>
                  <Text style={{ fontFamily: fonts.sans, fontSize: 11, color: tokens.muted, marginTop: 2 }}>
                    {item.fromRecipes.length === 1
                      ? `for ${item.fromRecipes[0]}`
                      : `for ${item.fromRecipes.length} recipes`}
                  </Text>
                </Pressable>
                {(hasSubs || activeSwap) && (
                  <Pressable
                    onPress={() => onSwapPress(item)}
                    accessibilityLabel={`Swap ${item.name}`}
                    hitSlop={8}
                    style={{
                      width: 30, height: 30, borderRadius: 15,
                      backgroundColor: activeSwap ? tokens.ochre : tokens.bgDeep,
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Icon name="swap" size={14} color={activeSwap ? tokens.cream : tokens.ink} />
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

// ── Meal row ─────────────────────────────────────────────────────────────────

function MealRow({
  recipe,
  entry,
  onPress,
  onRemove,
}: {
  recipe: Recipe;
  entry: MealPlanEntry;
  onPress: () => void;
  onRemove: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`${recipe.title}, view recipe`}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: pressed ? tokens.bgDeep : tokens.cream,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.line,
        padding: 14,
        gap: 14,
      })}
    >
      {recipe.emoji ? (
        <Text style={{ fontSize: 30 }}>{recipe.emoji}</Text>
      ) : (
        <View
          style={{
            width: 44, height: 44, borderRadius: 12,
            backgroundColor: recipe.hero_fallback?.[0] ?? tokens.bgDeep,
          }}
        />
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.sansBold, fontSize: 15, color: tokens.ink }} numberOfLines={1}>
          {recipe.title}
        </Text>
        <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: tokens.muted, marginTop: 2 }}>
          {recipe.time_min} min · {recipe.difficulty}
          {recipe.yield_unit ? ` · ${entry.servings} ${recipe.yield_unit}${entry.servings === 1 ? '' : 's'}` : ` · serves ${entry.servings}`}
        </Text>
      </View>
      <Pressable
        onPress={onRemove}
        hitSlop={10}
        accessibilityLabel={`Remove ${recipe.title}`}
        style={({ pressed }) => ({
          width: 32, height: 32, borderRadius: 16,
          backgroundColor: pressed ? tokens.line : tokens.bgDeep,
          alignItems: 'center', justifyContent: 'center',
        })}
      >
        <Icon name="x" size={14} color={tokens.muted} />
      </Pressable>
    </Pressable>
  );
}


// ── Add-extra sheet (ad-hoc shopping items, not tied to any recipe) ──────────

function AddExtraSheet({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, amount: number, unit: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('');

  const reset = () => { setName(''); setAmount(''); setUnit(''); };
  const handleClose = () => { reset(); onClose(); };
  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name, parseFloat(amount) || 0, unit);
    reset();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <Pressable
        onPress={handleClose}
        style={{ flex: 1, backgroundColor: 'rgba(26,22,18,0.45)' }}
      />
      <View
        style={{
          backgroundColor: tokens.bg,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 12,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            width: 36, height: 4, borderRadius: 2,
            backgroundColor: tokens.line,
            marginBottom: 18,
          }}
        />
        <Text style={{ fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: tokens.paprika, marginBottom: 4 }}>
          Add to shopping list
        </Text>
        <Text style={{ fontFamily: fonts.display, fontSize: 22, color: tokens.ink, marginBottom: 14 }}>
          Pick up something else
        </Text>

        <Text style={fieldLabel}>What is it?</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Toilet paper, paper towels, dishwashing tablets"
          placeholderTextColor={tokens.muted}
          autoCapitalize="sentences"
          style={inputStyle}
        />

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <View style={{ width: 100 }}>
            <Text style={fieldLabel}>Amount</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="1"
              placeholderTextColor={tokens.muted}
              keyboardType="decimal-pad"
              style={inputStyle}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={fieldLabel}>Unit (optional)</Text>
            <TextInput
              value={unit}
              onChangeText={setUnit}
              placeholder="pack, kg, bottle…"
              placeholderTextColor={tokens.muted}
              autoCapitalize="none"
              style={inputStyle}
            />
          </View>
        </View>

        <Pressable
          onPress={handleSave}
          disabled={!name.trim()}
          style={({ pressed }) => ({
            marginTop: 18,
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: 'center',
            backgroundColor: !name.trim() ? tokens.bgDeep : pressed ? tokens.paprikaDeep : tokens.paprika,
          })}
        >
          <Text style={{
            fontFamily: fonts.sansBold,
            fontSize: 14,
            color: !name.trim() ? tokens.muted : tokens.cream,
          }}>
            Add to list
          </Text>
        </Pressable>
        <Pressable
          onPress={handleClose}
          style={({ pressed }) => ({
            marginTop: 8,
            paddingVertical: 12,
            borderRadius: 14,
            alignItems: 'center',
            backgroundColor: pressed ? tokens.bgDeep : 'transparent',
          })}
        >
          <Text style={{ fontFamily: fonts.sansBold, fontSize: 13, color: tokens.inkSoft }}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const fieldLabel = {
  fontFamily: fonts.sansBold,
  fontSize: 10,
  letterSpacing: 1.2,
  textTransform: 'uppercase' as const,
  color: tokens.muted,
  marginBottom: 6,
};

const inputStyle = {
  backgroundColor: tokens.cream,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: tokens.line,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontFamily: fonts.sans,
  fontSize: 14,
  color: tokens.ink,
};

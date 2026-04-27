/**
 * Plan & Shop — simple recipe plan toggle + shopping list.
 *
 * hone.html parity: recipes are either planned or not. No calendar,
 * no date picker. Plan = a set of recipes you want to cook this week.
 * Shopping list aggregates all planned recipes, subtracts pantry,
 * groups by store aisle.
 *
 * The plan toggle lives on both this screen (remove) and on the
 * recipe detail screen (add). Both write through togglePlannedRecipe().
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  SectionList,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import * as Haptics from 'expo-haptics';

import { tokens, fonts } from '../../src/theme/tokens';
import { Icon } from '../../src/components/Icon';
import {
  getAllRecipes,
  getPantryItems,
  getPlannedEntries,
  removePlannedRecipe,
  updatePlannedServings,
} from '../../db/database';
import type { MealPlanEntry, PantryItem } from '../../db/database';
import type { Recipe } from '../../src/data/types';
import {
  categorizeIngredient,
  cleanIngredientName,
  normalizeForMatch,
  SHOPPING_SECTION_LABEL,
  SHOPPING_SECTION_ORDER,
} from '../../src/data/pantry-helpers';
import type { PantryCategory } from '../../src/data/pantry-helpers';

// ── Shopping types ────────────────────────────────────────────────────────────

interface ShopItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: PantryCategory;
}
type ShopSection = { title: string; sectionKey: PantryCategory; data: ShopItem[] };

function fmtAmt(n: number): string {
  if (n <= 0) return '';
  const r = Math.round(n * 10) / 10;
  return r % 1 === 0 ? String(Math.round(r)) : String(r);
}

// ── Custom item TextInput for shopping list ───────────────────────────────────

function CustomItemInput({ onAdd }: { onAdd: (name: string) => void }) {
  const [val, setVal] = useState('');
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 16,
        gap: 8,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: tokens.cream,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: tokens.lineDark,
          paddingHorizontal: 14,
          paddingVertical: 12,
          gap: 8,
        }}
      >
        <Icon name="plus" size={14} color={tokens.muted} />
        <TextInput
          value={val}
          onChangeText={setVal}
          placeholder="Add item to list…"
          placeholderTextColor={tokens.muted}
          style={{
            flex: 1,
            fontFamily: fonts.sans,
            fontSize: 14,
            color: tokens.ink,
            padding: 0,
          }}
          returnKeyType="done"
          onSubmitEditing={() => {
            if (val.trim()) { onAdd(val.trim()); setVal(''); }
          }}
        />
        {val.trim() ? (
          <Pressable
            onPress={() => { onAdd(val.trim()); setVal(''); }}
            style={{
              backgroundColor: tokens.primary,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text style={{ fontFamily: fonts.sansBold, fontSize: 12, color: '#FFF' }}>
              Add
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function PlanTab() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();

  const [allRecipes, setAllRecipes]     = useState<Recipe[]>([]);
  const [pantryItems, setPantryItems]   = useState<PantryItem[]>([]);
  const [planEntries, setPlanEntries]   = useState<MealPlanEntry[]>([]);
  const [loading, setLoading]           = useState(true);
  const [showShopping, setShowShopping] = useState(false);
  const [shopItems, setShopItems]       = useState<ShopItem[]>([]);
  const [customItems, setCustomItems]   = useState<string[]>([]);
  const [checkedIds, setCheckedIds]     = useState<Set<string>>(new Set());

  // Initial load
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [recipes, pantry, entries] = await Promise.all([
        getAllRecipes(db),
        getPantryItems(db),
        getPlannedEntries(db),
      ]);
      if (!cancelled) {
        setAllRecipes(recipes);
        setPantryItems(pantry);
        setPlanEntries(entries);
        setLoading(false);
      }
    }
    load().catch(console.error);
    return () => { cancelled = true; };
  }, [db]);

  // Refresh plan when tab gains focus (recipe detail may have toggled)
  useFocusEffect(
    useCallback(() => {
      getPlannedEntries(db).then(setPlanEntries).catch(console.error);
    }, [db]),
  );

  const recipeMap = useMemo(() => {
    const m = new Map<string, Recipe>();
    for (const r of allRecipes) m.set(r.id, r);
    return m;
  }, [allRecipes]);

  // Remove from plan
  const handleRemove = async (recipeId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    await removePlannedRecipe(db, recipeId);
    setPlanEntries((prev) => prev.filter((e) => e.recipe_id !== recipeId));
  };

  // Update servings
  const handleServings = async (recipeId: string, delta: number) => {
    const entry = planEntries.find((e) => e.recipe_id === recipeId);
    if (!entry) return;
    const next = Math.max(1, Math.min(20, entry.servings + delta));
    if (next === entry.servings) return;
    Haptics.selectionAsync().catch(() => {});
    await updatePlannedServings(db, recipeId, next);
    setPlanEntries((prev) =>
      prev.map((e) => (e.recipe_id === recipeId ? { ...e, servings: next } : e)),
    );
  };

  // Build shopping list
  const handleGenerateShopping = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    const haveNorms = new Set(
      pantryItems.filter((p) => p.have_it).map((p) => normalizeForMatch(p.name)),
    );

    const inPantry = (name: string): boolean => {
      const norm = normalizeForMatch(name);
      for (const p of haveNorms) {
        if (norm === p) return true;
        if (norm.length > 4 && p.length > 4 && (norm.includes(p) || p.includes(norm)))
          return true;
      }
      return false;
    };

    const aggregated = new Map<string, ShopItem>();
    for (const entry of planEntries) {
      const recipe = recipeMap.get(entry.recipe_id);
      if (!recipe) continue;
      const scale = entry.servings / recipe.base_servings;
      for (const ing of recipe.ingredients) {
        if (inPantry(ing.name)) continue;
        const clean = cleanIngredientName(ing.name);
        const key   = normalizeForMatch(ing.name);
        const scaledAmt = ing.amount * scale;
        if (aggregated.has(key)) {
          const ex = aggregated.get(key)!;
          if (ex.unit === ing.unit) ex.amount += scaledAmt;
        } else {
          aggregated.set(key, {
            id: `shop-${key.replace(/\s+/g, '-')}`,
            name: clean,
            amount: scaledAmt,
            unit: ing.unit,
            category: categorizeIngredient(clean),
          });
        }
      }
    }

    setShopItems(Array.from(aggregated.values()));
    setCheckedIds(new Set());
    setCustomItems([]);
    setShowShopping(true);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={tokens.primary} />
      </View>
    );
  }

  const plannedRecipes = planEntries
    .map((e) => ({ entry: e, recipe: recipeMap.get(e.recipe_id) }))
    .filter((x): x is { entry: MealPlanEntry; recipe: Recipe } => !!x.recipe);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg }}>
      <FlatList
        data={plannedRecipes}
        keyExtractor={(x) => x.entry.recipe_id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 160,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ marginBottom: 20 }}>
            {/* Kicker */}
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
              This week
            </Text>

            {/* Headline */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 }}>
              <Text
                style={{
                  flex: 1,
                  fontFamily: fonts.display,
                  fontSize: 36,
                  lineHeight: 40,
                  color: tokens.ink,
                }}
              >
                Meal Plan
              </Text>
              {plannedRecipes.length > 0 && (
                <Pressable
                  onPress={handleGenerateShopping}
                  accessibilityRole="button"
                  accessibilityLabel="Build shopping list"
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: pressed ? tokens.inkSoft : tokens.ink,
                    borderRadius: 999,
                    paddingHorizontal: 14,
                    paddingVertical: 9,
                    marginBottom: 4,
                  })}
                >
                  <Icon name="cart" size={14} color="#FFF" />
                  <Text style={{ fontFamily: fonts.sansBold, fontSize: 12, color: '#FFF' }}>
                    Shop
                  </Text>
                </Pressable>
              )}
            </View>

            <Text
              style={{
                fontFamily: fonts.sans,
                fontSize: 12,
                color: tokens.muted,
              }}
            >
              {plannedRecipes.length === 0
                ? 'No recipes planned yet — tap + Plan on any recipe'
                : `${plannedRecipes.length} recipe${plannedRecipes.length !== 1 ? 's' : ''} planned`}
            </Text>
          </View>
        }
        renderItem={({ item: { entry, recipe } }) => (
          <View
            style={{
              backgroundColor: tokens.cream,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: tokens.lineDark,
              marginBottom: 12,
              overflow: 'hidden',
              shadowColor: tokens.ink,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {/* Recipe row */}
            <Pressable
              onPress={() => router.push(`/recipe/${recipe.id}`)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 14,
                gap: 12,
                backgroundColor: pressed ? tokens.bgDeep : 'transparent',
              })}
            >
              {/* Colour swatch / emoji */}
              {recipe.emoji ? (
                <Text style={{ fontSize: 32 }}>{recipe.emoji}</Text>
              ) : (
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: recipe.hero_fallback?.[0] ?? tokens.primaryLight,
                  }}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 16,
                    color: tokens.ink,
                    lineHeight: 20,
                  }}
                  numberOfLines={2}
                >
                  {recipe.title}
                </Text>
                {recipe.source ? (
                  <Text
                    style={{
                      fontFamily: fonts.sansBold,
                      fontSize: 11,
                      color: tokens.primary,
                      marginTop: 2,
                    }}
                  >
                    {recipe.source.chef}
                  </Text>
                ) : null}
              </View>
              {/* Remove */}
              <Pressable
                onPress={() => handleRemove(entry.recipe_id)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${recipe.title} from plan`}
                style={({ pressed }) => ({
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: pressed ? tokens.bgDeep : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                })}
              >
                <Icon name="x" size={16} color={tokens.muted} />
              </Pressable>
            </Pressable>

            {/* Servings row */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingBottom: 14,
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 10,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  color: tokens.muted,
                  flex: 1,
                }}
              >
                Servings
              </Text>
              {/* Stepper */}
              <Pressable
                onPress={() => handleServings(entry.recipe_id, -1)}
                hitSlop={8}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  borderWidth: 1.5,
                  borderColor: entry.servings <= 1 ? tokens.line : tokens.primary,
                  backgroundColor: 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: entry.servings <= 1 ? 0.35 : 1,
                }}
              >
                <Icon
                  name="minus"
                  size={14}
                  color={entry.servings <= 1 ? tokens.muted : tokens.primary}
                />
              </Pressable>
              <Text
                style={{
                  fontFamily: fonts.display,
                  fontSize: 22,
                  color: tokens.ink,
                  minWidth: 28,
                  textAlign: 'center',
                  fontVariant: ['tabular-nums'],
                }}
              >
                {entry.servings}
              </Text>
              <Pressable
                onPress={() => handleServings(entry.recipe_id, 1)}
                hitSlop={8}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  borderWidth: 1.5,
                  borderColor: entry.servings >= 20 ? tokens.line : tokens.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: entry.servings >= 20 ? 0.35 : 1,
                }}
              >
                <Icon
                  name="plus"
                  size={14}
                  color={entry.servings >= 20 ? tokens.muted : tokens.primary}
                />
              </Pressable>
              <Text
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 12,
                  color: tokens.muted,
                }}
              >
                people
              </Text>
              {recipe.time_min ? (
                <Text
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 11,
                    color: tokens.muted,
                    marginLeft: 'auto',
                  }}
                >
                  {recipe.time_min} min
                </Text>
              ) : null}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View
            style={{
              marginTop: 8,
              padding: 20,
              backgroundColor: tokens.cream,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: tokens.lineDark,
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 36 }}>📋</Text>
            <Text
              style={{
                fontFamily: fonts.display,
                fontSize: 18,
                color: tokens.ink,
                textAlign: 'center',
              }}
            >
              Nothing planned yet
            </Text>
            <Text
              style={{
                fontFamily: fonts.sans,
                fontSize: 13,
                color: tokens.muted,
                textAlign: 'center',
                lineHeight: 18,
              }}
            >
              Open any recipe and tap{' '}
              <Text style={{ fontFamily: fonts.sansBold, color: tokens.primary }}>
                + Plan
              </Text>{' '}
              to add it here
            </Text>
          </View>
        }
      />

      {/* Floating shop CTA */}
      {plannedRecipes.length > 0 && (
        <View
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: insets.bottom + 90,
          }}
        >
          <Pressable
            onPress={handleGenerateShopping}
            style={({ pressed }) => ({
              backgroundColor: pressed ? tokens.primaryDeep : tokens.primary,
              borderRadius: 18,
              paddingVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              shadowColor: tokens.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            })}
          >
            <Icon name="cart" size={18} color="#FFF" />
            <Text style={{ fontFamily: fonts.sansXBold, fontSize: 14, color: '#FFF' }}>
              Build Shopping List · {plannedRecipes.length} meal{plannedRecipes.length !== 1 ? 's' : ''}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Shopping list modal */}
      <Modal
        visible={showShopping}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowShopping(false)}
      >
        <ShoppingListSheet
          items={shopItems}
          customItems={customItems}
          checkedIds={checkedIds}
          onToggle={(id) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            setCheckedIds((prev) => {
              const next = new Set(prev);
              next.has(id) ? next.delete(id) : next.add(id);
              return next;
            });
          }}
          onAddCustom={(name) => setCustomItems((prev) => [...prev, name])}
          onClose={() => setShowShopping(false)}
        />
      </Modal>
    </View>
  );
}

// ── Shopping list sheet ───────────────────────────────────────────────────────

function ShoppingListSheet({
  items,
  customItems,
  checkedIds,
  onToggle,
  onAddCustom,
  onClose,
}: {
  items: ShopItem[];
  customItems: string[];
  checkedIds: Set<string>;
  onToggle: (id: string) => void;
  onAddCustom: (name: string) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const checkedCount = checkedIds.size;
  const totalCount = items.length + customItems.length;

  const sections = useMemo<ShopSection[]>(() => {
    return SHOPPING_SECTION_ORDER.map((cat) => ({
      title: SHOPPING_SECTION_LABEL[cat],
      sectionKey: cat,
      data: items.filter((i) => i.category === cat),
    })).filter((s) => s.data.length > 0);
  }, [items]);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg, paddingTop: insets.top + 8 }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: tokens.line,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.display, fontSize: 28, color: tokens.ink }}>
              Shopping List
            </Text>
            <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: tokens.muted, marginTop: 3 }}>
              {totalCount} items · pantry items excluded
            </Text>
            {checkedCount > 0 && (
              <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: tokens.sage, marginTop: 2 }}>
                {checkedCount} of {totalCount} grabbed ✓
              </Text>
            )}
          </View>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: tokens.bgDeep,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="x" size={16} color={tokens.ink} />
          </Pressable>
        </View>
      </View>

      {/* BUG-003 FIX: custom item input built here where keyboard works */}
      <CustomItemInput onAdd={onAddCustom} />

      {items.length === 0 && customItems.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <Text style={{ fontSize: 36, marginBottom: 12 }}>🎉</Text>
          <Text style={{ fontFamily: fonts.display, fontSize: 20, color: tokens.ink, marginBottom: 8 }}>
            Your pantry covers everything
          </Text>
          <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: tokens.muted, textAlign: 'center' }}>
            Nothing extra to buy for this plan.
          </Text>
        </View>
      ) : (
        <SectionList
          sections={[
            ...sections,
            ...(customItems.length > 0
              ? [{
                  title: 'Added by you',
                  sectionKey: 'Pantry Staples' as PantryCategory,
                  data: customItems.map((name, i) => ({
                    id: `custom-${i}`,
                    name,
                    amount: 0,
                    unit: '',
                    category: 'Pantry Staples' as PantryCategory,
                  })),
                }]
              : []),
          ]}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: insets.bottom + 24 }}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled
          keyboardShouldPersistTaps="handled"
          renderSectionHeader={({ section }) => (
            <View
              style={{
                backgroundColor: tokens.bgDeep,
                paddingHorizontal: 20,
                paddingVertical: 9,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 11,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  color: tokens.inkSoft,
                }}
              >
                {section.title}
              </Text>
            </View>
          )}
          renderItem={({ item, index, section }) => {
            const checked = checkedIds.has(item.id);
            const isLast = index === section.data.length - 1;
            const amtStr = fmtAmt(item.amount);
            return (
              <Pressable
                onPress={() => onToggle(item.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: tokens.cream,
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                  gap: 14,
                  minHeight: 56,
                  borderBottomWidth: isLast ? 0 : 1,
                  borderBottomColor: tokens.line,
                }}
              >
                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    borderWidth: 2,
                    borderColor: checked ? tokens.sage : tokens.line,
                    backgroundColor: checked ? tokens.sage : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {checked && <Icon name="check" size={14} color="#FFF" />}
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: fonts.sans,
                    fontSize: 15,
                    color: checked ? tokens.muted : tokens.ink,
                    textDecorationLine: checked ? 'line-through' : 'none',
                  }}
                >
                  {amtStr && item.unit ? (
                    <Text>
                      <Text style={{ fontFamily: fonts.sansBold }}>
                        {amtStr} {item.unit}
                      </Text>
                      {' '}{item.name}
                    </Text>
                  ) : amtStr ? (
                    <Text>
                      <Text style={{ fontFamily: fonts.sansBold }}>{amtStr}</Text>
                      {' '}{item.name}
                    </Text>
                  ) : (
                    item.name
                  )}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

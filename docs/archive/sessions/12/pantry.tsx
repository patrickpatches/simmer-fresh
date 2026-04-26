/**
 * Pantry — "cook with what you have."
 *
 * Ingredients are auto-seeded from all recipes in the library plus a set of
 * common staples on first load. The user toggles what they have; the app
 * scores every recipe against the pantry and surfaces the best matches.
 *
 * Scoring: coverage + 0.1 × aromatics_bonus (see pantry-helpers.ts).
 * The match summary pill opens a recipe suggestion sheet sorted by score.
 *
 * Ergonomics rationale:
 *   - Toggle sits on the right — right-thumb reach zone (90% of users).
 *   - Minimum 52dp row height — oily/damp fingers hit it reliably.
 *   - Category headers use bgDeep separator to signal hierarchy without
 *     adding visual noise between items in the same group.
 */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SectionList,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import * as Haptics from 'expo-haptics';

import { tokens, fonts } from '../../src/theme/tokens';
import { Icon } from '../../src/components/Icon';
import {
  getAllRecipes,
  getPantryItems,
  upsertPantryItem,
  deletePantryItem,
} from '../../db/database';
import type { PantryItem } from '../../db/database';
import type { Recipe } from '../../src/data/types';
import {
  PANTRY_CATEGORIES,
  CATEGORY_EMOJI,
  categorizeIngredient,
  normalizeForMatch,
  cleanIngredientName,
  scoreRecipeAgainstPantry,
  initializePantryItems,
} from '../../src/data/pantry-helpers';
import type { RecipeMatchResult } from '../../src/data/pantry-helpers';

type Section = { title: string; data: PantryItem[] };

// ── Main screen ───────────────────────────────────────────────────────────────

export default function PantryTab() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();

  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addName, setAddName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ── Load ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [items, recipes] = await Promise.all([
        getPantryItems(db),
        getAllRecipes(db),
      ]);
      if (cancelled) return;
      setAllRecipes(recipes);
      if (items.length === 0) {
        await initializePantryItems(db, recipes);
        const seeded = await getPantryItems(db);
        if (!cancelled) setPantryItems(seeded);
      } else {
        setPantryItems(items);
      }
      setLoading(false);
    }
    load().catch(console.error);
    return () => { cancelled = true; };
  }, [db]);

  // ── Scoring ─────────────────────────────────────────────────────────────────

  const matchResults = useMemo<RecipeMatchResult[]>(() => {
    if (!allRecipes.length) return [];
    return allRecipes
      .map((r) => scoreRecipeAgainstPantry(r, pantryItems))
      .sort((a, b) => b.score - a.score);
  }, [allRecipes, pantryItems]);

  const canMakeCount = matchResults.filter((m) => m.haveCount === m.totalCount).length;
  const topMatches = matchResults.filter((m) => m.score > 0.05);

  // ── Sections ────────────────────────────────────────────────────────────────

  const sections = useMemo<Section[]>(() => {
    const q = search.trim().toLowerCase();
    return PANTRY_CATEGORIES.map((cat) => ({
      title: cat,
      data: pantryItems.filter(
        (p) => p.category === cat && (q === '' || p.name.toLowerCase().includes(q)),
      ),
    })).filter((s) => s.data.length > 0);
  }, [pantryItems, search]);

  const haveCount = pantryItems.filter((p) => p.have_it).length;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleToggle = useCallback(
    async (item: PantryItem) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      const updated = { ...item, have_it: !item.have_it };
      await upsertPantryItem(db, updated);
      setPantryItems((prev) => prev.map((p) => (p.id === item.id ? updated : p)));
    },
    [db],
  );

  const handleAdd = async () => {
    const name = addName.trim();
    if (!name) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    const category = categorizeIngredient(name);
    const id = 'custom-' + Date.now();
    const newItem: PantryItem = { id, name, category, quantity: null, unit: null, have_it: true };
    await upsertPantryItem(db, newItem);
    setPantryItems((prev) => [...prev, newItem]);
    setAddName('');
  };

  const handleDeleteCustom = async (item: PantryItem) => {
    if (!item.id.startsWith('custom-')) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    await deletePantryItem(db, item.id);
    setPantryItems((prev) => prev.filter((p) => p.id !== item.id));
  };

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={tokens.sage} />
        <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: tokens.muted, marginTop: 12 }}>
          Loading your pantry…
        </Text>
      </View>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: tokens.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        style={{ backgroundColor: tokens.bg }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 140,
        }}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Header
            haveCount={haveCount}
            totalCount={pantryItems.length}
            canMakeCount={canMakeCount}
            search={search}
            setSearch={setSearch}
            addName={addName}
            setAddName={setAddName}
            onAdd={handleAdd}
            onOpenSuggestions={() => setShowSuggestions(true)}
          />
        }
        renderSectionHeader={({ section }) => (
          <SectionHeader title={section.title as string} />
        )}
        renderItem={({ item, index, section }) => (
          <PantryItemRow
            item={item}
            isLast={index === section.data.length - 1}
            onToggle={handleToggle}
            onDeleteCustom={handleDeleteCustom}
          />
        )}
        ListEmptyComponent={
          search ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.sans, fontSize: 14, color: tokens.muted }}>
                No ingredients match "{search}"
              </Text>
            </View>
          ) : null
        }
      />

      {/* Recipe suggestions modal */}
      <SuggestionsModal
        visible={showSuggestions}
        onClose={() => setShowSuggestions(false)}
        matches={topMatches}
        canMakeCount={canMakeCount}
      />
    </KeyboardAvoidingView>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

function Header({
  haveCount,
  totalCount,
  canMakeCount,
  search,
  setSearch,
  addName,
  setAddName,
  onAdd,
  onOpenSuggestions,
}: {
  haveCount: number;
  totalCount: number;
  canMakeCount: number;
  search: string;
  setSearch: (s: string) => void;
  addName: string;
  setAddName: (s: string) => void;
  onAdd: () => void;
  onOpenSuggestions: () => void;
}) {
  return (
    <View style={{ paddingHorizontal: 20, paddingBottom: 4 }}>
      {/* Kicker */}
      <Text
        style={{
          fontFamily: fonts.sansBold,
          fontSize: 11,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: tokens.sage,
          marginBottom: 4,
        }}
      >
        Your kitchen
      </Text>

      {/* Title row */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 38, color: tokens.ink, lineHeight: 42 }}>
          Pantry
        </Text>
        <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: tokens.muted, marginBottom: 6 }}>
          {haveCount}/{totalCount} stocked
        </Text>
      </View>

      {/* Recipe match summary pill */}
      <Pressable
        onPress={onOpenSuggestions}
        accessibilityRole="button"
        accessibilityLabel={`You can make ${canMakeCount} recipes right now. Tap to see them.`}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: pressed ? '#485538' : tokens.sage,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginBottom: 20,
        })}
      >
        <Text style={{ fontSize: 20 }}>🍳</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.sansBold, fontSize: 14, color: tokens.cream }}>
            {canMakeCount === 0
              ? 'Stock your pantry to find recipes'
              : `You can make ${canMakeCount} ${canMakeCount === 1 ? 'recipe' : 'recipes'} right now`}
          </Text>
          {canMakeCount > 0 && (
            <Text style={{ fontFamily: fonts.sans, fontSize: 11, color: 'rgba(250,246,238,0.7)', marginTop: 2 }}>
              Tap to see what's on the menu
            </Text>
          )}
        </View>
        <Icon name="arrow-right" size={16} color={tokens.cream} />
      </Pressable>

      {/* Search bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: tokens.cream,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: tokens.line,
          paddingHorizontal: 14,
          paddingVertical: 11,
          gap: 10,
          marginBottom: 14,
        }}
      >
        <Icon name="search" size={15} color={tokens.muted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search ingredients…"
          placeholderTextColor={tokens.muted}
          style={{
            flex: 1,
            fontFamily: fonts.sans,
            fontSize: 14,
            color: tokens.ink,
            padding: 0,
          }}
          returnKeyType="search"
          accessibilityLabel="Search pantry ingredients"
        />
        {search ? (
          <Pressable onPress={() => setSearch('')} hitSlop={8} accessibilityLabel="Clear search">
            <Icon name="x" size={14} color={tokens.muted} />
          </Pressable>
        ) : null}
      </View>

      {/* Quick-add row */}
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          marginBottom: 8,
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
            borderColor: tokens.line,
            paddingHorizontal: 14,
            paddingVertical: 11,
            gap: 10,
          }}
        >
          <Icon name="plus" size={15} color={tokens.muted} />
          <TextInput
            value={addName}
            onChangeText={setAddName}
            placeholder="Add an ingredient…"
            placeholderTextColor={tokens.muted}
            style={{
              flex: 1,
              fontFamily: fonts.sans,
              fontSize: 14,
              color: tokens.ink,
              padding: 0,
            }}
            returnKeyType="done"
            onSubmitEditing={onAdd}
            accessibilityLabel="New ingredient name"
          />
        </View>
        <Pressable
          onPress={onAdd}
          disabled={!addName.trim()}
          accessibilityRole="button"
          accessibilityLabel="Add ingredient to pantry"
          style={({ pressed }) => ({
            borderRadius: 14,
            backgroundColor:
              !addName.trim() ? tokens.bgDeep : pressed ? tokens.paprikaDeep : tokens.paprika,
            paddingHorizontal: 18,
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <Text
            style={{
              fontFamily: fonts.sansBold,
              fontSize: 13,
              color: !addName.trim() ? tokens.muted : tokens.cream,
            }}
          >
            Add
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  const emoji = CATEGORY_EMOJI[title as keyof typeof CATEGORY_EMOJI] ?? '📦';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: tokens.bgDeep,
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginTop: 8,
      }}
    >
      <Text style={{ fontSize: 14 }}>{emoji}</Text>
      <Text
        style={{
          fontFamily: fonts.sansBold,
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: tokens.inkSoft,
        }}
      >
        {title}
      </Text>
    </View>
  );
}

// ── Pantry item row ───────────────────────────────────────────────────────────

function PantryItemRow({
  item,
  isLast,
  onToggle,
  onDeleteCustom,
}: {
  item: PantryItem;
  isLast: boolean;
  onToggle: (item: PantryItem) => void;
  onDeleteCustom: (item: PantryItem) => void;
}) {
  const progress = useSharedValue(item.have_it ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(item.have_it ? 1 : 0, { duration: 200 });
  }, [item.have_it, progress]);

  const toggleStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['transparent', tokens.sage]),
    borderColor: interpolateColor(progress.value, [0, 1], [tokens.line, tokens.sage]),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [tokens.muted, tokens.cream]),
  }));

  return (
    <Pressable
      onPress={() => onToggle(item)}
      onLongPress={() => item.id.startsWith('custom-') && onDeleteCustom(item)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: item.have_it }}
      accessibilityLabel={`${item.name}, ${item.have_it ? 'in pantry' : 'not in pantry'}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tokens.cream,
        paddingHorizontal: 20,
        paddingVertical: 14,
        gap: 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: tokens.line,
        minHeight: 52,
      }}
    >
      <Text
        style={{
          flex: 1,
          fontFamily: fonts.sans,
          fontSize: 14,
          lineHeight: 20,
          color: item.have_it ? tokens.ink : tokens.inkSoft,
        }}
        numberOfLines={2}
      >
        {item.name}
        {item.id.startsWith('custom-') && (
          <Text style={{ color: tokens.muted, fontSize: 11 }}> · hold to remove</Text>
        )}
      </Text>

      <Animated.View
        style={[
          {
            borderWidth: 1.5,
            borderRadius: 999,
            paddingHorizontal: 14,
            paddingVertical: 7,
            minWidth: 84,
            alignItems: 'center',
          },
          toggleStyle,
        ]}
      >
        <Animated.Text
          style={[
            {
              fontFamily: fonts.sansBold,
              fontSize: 12,
            },
            labelStyle,
          ]}
        >
          {item.have_it ? '✓ Got it' : 'Got it?'}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

// ── Recipe suggestions modal ──────────────────────────────────────────────────

function SuggestionsModal({
  visible,
  onClose,
  matches,
  canMakeCount,
}: {
  visible: boolean;
  onClose: () => void;
  matches: RecipeMatchResult[];
  canMakeCount: number;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.bg,
          paddingTop: insets.top + 8,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: tokens.line,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.display, fontSize: 26, color: tokens.ink }}>
              Recipe Matches
            </Text>
            <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: tokens.muted, marginTop: 2 }}>
              {canMakeCount > 0
                ? `${canMakeCount} you can cook right now · ${matches.length} total matches`
                : `${matches.length} matches — stock up on the missing items`}
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Close recipe suggestions"
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

        {matches.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🧺</Text>
            <Text style={{ fontFamily: fonts.display, fontSize: 20, color: tokens.ink, marginBottom: 8 }}>
              Pantry's empty
            </Text>
            <Text style={{ fontFamily: fonts.sans, fontSize: 14, color: tokens.muted, textAlign: 'center' }}>
              Toggle what you have and the best-matching recipes appear here.
            </Text>
          </View>
        ) : (
          <SectionList
            sections={[{ title: 'matches', data: matches }]}
            keyExtractor={(m) => m.recipe.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
            renderSectionHeader={() => null}
            renderItem={({ item: m }) => (
              <MatchCard
                match={m}
                onPress={() => {
                  onClose();
                  router.push(`/recipe/${m.recipe.id}`);
                }}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        )}
      </View>
    </Modal>
  );
}

// ── Match card ────────────────────────────────────────────────────────────────

function MatchCard({
  match,
  onPress,
}: {
  match: RecipeMatchResult;
  onPress: () => void;
}) {
  const pct = match.totalCount > 0 ? match.haveCount / match.totalCount : 0;
  const isComplete = match.haveCount === match.totalCount;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${match.recipe.title}. ${match.haveCount} of ${match.totalCount} ingredients in pantry.`}
      style={({ pressed }) => ({
        backgroundColor: tokens.cream,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: isComplete ? tokens.sage : tokens.line,
        padding: 16,
        opacity: pressed ? 0.92 : 1,
      })}
    >
      {/* Recipe name row */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        {match.recipe.emoji ? (
          <Text style={{ fontSize: 28, lineHeight: 32 }}>{match.recipe.emoji}</Text>
        ) : null}
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontFamily: fonts.display, fontSize: 18, color: tokens.ink, lineHeight: 22 }}
            numberOfLines={2}
          >
            {match.recipe.title}
          </Text>
          <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: tokens.muted, marginTop: 2 }}>
            {match.recipe.time_min} min · {match.recipe.difficulty}
          </Text>
        </View>
        {isComplete && (
          <View
            style={{
              backgroundColor: tokens.sage,
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontFamily: fonts.sansBold, fontSize: 10, color: tokens.cream }}>
              READY
            </Text>
          </View>
        )}
      </View>

      {/* Progress bar */}
      <View style={{ height: 6, backgroundColor: tokens.bgDeep, borderRadius: 3, marginBottom: 8, overflow: 'hidden' }}>
        <View
          style={{
            height: 6,
            width: `${Math.round(pct * 100)}%`,
            backgroundColor: isComplete ? tokens.sage : tokens.ochre,
            borderRadius: 3,
          }}
        />
      </View>

      {/* Ingredient count + missing */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: fonts.sansBold, fontSize: 12, color: isComplete ? tokens.sage : tokens.inkSoft }}>
          {match.haveCount} of {match.totalCount} ingredients
        </Text>
        {!isComplete && match.missingNames.length > 0 && (
          <Text
            style={{ fontFamily: fonts.sans, fontSize: 11, color: tokens.muted, flex: 1, textAlign: 'right' }}
            numberOfLines={1}
          >
            missing: {match.missingNames.slice(0, 3).join(', ')}
          </Text>
        )}
      </View>

      {/* Smart swap hint */}
      {!isComplete && match.swapCoveredCount > 0 && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            marginTop: 8,
            backgroundColor: 'rgba(91,107,71,0.08)',
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 5,
            alignSelf: 'flex-start',
          }}
        >
          <Icon name="swap" size={11} color={tokens.sage} />
          <Text style={{ fontFamily: fonts.sansBold, fontSize: 11, color: tokens.sage }}>
            {match.swapCoveredCount === 1
              ? '1 smart swap available'
              : `${match.swapCoveredCount} smart swaps available`}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

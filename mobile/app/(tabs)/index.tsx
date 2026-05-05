/**
 * Kitchen -- the anchor tab.
 *
 * Editorial hero, search bar, filter chips, recipe card list.
 * Matches hone.html layout: kicker -> headline -> recipe count ->
 * search -> filter chips -> cards.
 *
 * BUG-001 FIX: FlatList renders the header as part of the scroll
 * -- no separate sticky header to fight with. The list content starts
 * from insets.top so nothing is obscured.
 *
 * BUG-002 FIX: keyboardShouldPersistTaps="handled" so the search bar
 * remains focusable through the FlatList.
 *
 * DECISION-012 Kitchen improvements:
 *   1. Active chip label -> tokens.onPrimary (legible on rust pill)
 *   2. Dynamic subtitle -- changes based on active filter
 *   3. Ingredient search -- matches ingredient names too
 *   4. "Cooking tonight" pinned row -- surfaces planned recipes
 *   5. Cuisine filter chips -- browse by origin
 */
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import type { Recipe, CuisineId } from '../../src/data/types';
import {
  getAllRecipes,
  getFavoriteIds,
  toggleFavorite,
  getPlannedRecipeIds,
} from '../../db/database';
import { RecipeCard } from '../../src/components/RecipeCard';
import { Icon } from '../../src/components/Icon';
import { tokens, fonts, shadows } from '../../src/theme/tokens';

// ---------------------------------------------------------------------------
// Filter types -- mode chips + cuisine chips share the same state
// ---------------------------------------------------------------------------

type ModeFilter = 'All' | 'Quick' | 'Weekend' | 'Favourites' | 'Yours';
type Filter = ModeFilter | CuisineId;

const MODE_FILTERS: ModeFilter[] = ['All', 'Quick', 'Weekend', 'Favourites', 'Yours'];

// Display labels for each cuisine ID
// Only cuisines that have at least one recipe are shown (derived at runtime)
const CUISINE_LABELS: Record<CuisineId, string> = {
  levantine:  'Levantine',
  indian:     'Indian',
  malaysian:  'Malaysian',
  japanese:   'Japanese',
  thai:       'Thai',
  italian:    'Italian',
  french:     'French',
  american:   'American',
  australian: 'Australian',
  mexican:    'Mexican',
  filipino:   'Filipino',
  chinese:    'Chinese',
};

// ---------------------------------------------------------------------------
// Dynamic subtitle -- tells the user what they're looking at
// ---------------------------------------------------------------------------

function buildSubtitle(
  filter: Filter,
  results: Recipe[],
  totalCount: number,
): string {
  const n = results.length;
  const r = n === 1 ? 'recipe' : 'recipes';
  switch (filter) {
    case 'All':        return `${totalCount} recipes · chef-inspired, honestly adapted`;
    case 'Quick':      return `${n} quick ${r} · under 30 minutes`;
    case 'Weekend':    return `${n} weekend ${r} · worth the time`;
    case 'Favourites': return n === 0 ? 'No favourites yet' : `${n} ${n === 1 ? 'favourite' : 'favourites'}`;
    case 'Yours':      return n === 0 ? 'No recipes added yet' : `${n} of your ${r}`;
    default: {
      const label = CUISINE_LABELS[filter as CuisineId] ?? filter;
      return `${n} ${label} ${r}`;
    }
  }
}

export default function KitchenHome() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const [search, setSearch]           = useState('');
  const [recipes, setRecipes]         = useState<Recipe[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [plannedIds, setPlannedIds]   = useState<Set<string>>(new Set());
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState<Filter>('All');

  // Initial load
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [all, favs, planned] = await Promise.all([
        getAllRecipes(db),
        getFavoriteIds(db),
        getPlannedRecipeIds(db),
      ]);
      if (!cancelled) {
        setRecipes(all);
        setFavoriteIds(favs);
        setPlannedIds(planned);
        setLoading(false);
      }
    }
    load().catch(console.error);
    return () => { cancelled = true; };
  }, [db]);

  // Refresh plan state when tab is focused (keep in sync with Plan tab toggles)
  useFocusEffect(
    React.useCallback(() => {
      getPlannedRecipeIds(db).then(setPlannedIds).catch(console.error);
    }, [db]),
  );

  const handleToggleFavorite = async (id: string) => {
    await toggleFavorite(db, id);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Derive which cuisines have at least one recipe -- cuisine row only shows
  // what actually exists in the library (no orphan chips for empty cuisines)
  const availableCuisines = React.useMemo((): CuisineId[] => {
    const seen = new Set<CuisineId>();
    for (const r of recipes) {
      for (const c of (r.categories?.cuisines ?? [])) seen.add(c);
    }
    // Preserve the display order from CUISINE_LABELS
    return (Object.keys(CUISINE_LABELS) as CuisineId[]).filter((c) => seen.has(c));
  }, [recipes]);

  // Filter + search
  // Ingredient search: getAllRecipes eager-loads ingredients, so this is free
  const results = recipes.filter((r) => {
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const hit =
        r.title.toLowerCase().includes(q) ||
        r.tagline.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        (r.source?.chef ?? '').toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(q));
      if (!hit) return false;
    }
    switch (filter) {
      case 'Quick':      return r.time_min <= 30;
      case 'Weekend':    return r.time_min > 45;
      case 'Favourites': return favoriteIds.has(r.id);
      case 'Yours':      return r.user_added;
      case 'All':        return true;
      default:
        // Cuisine filter
        return r.categories?.cuisines.includes(filter as CuisineId) ?? false;
    }
  });

  // All planned recipes (regardless of current filter) for the pinned banner
  const allPlannedRecipes = recipes.filter((r) => plannedIds.has(r.id));

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
        <ActivityIndicator color={tokens.primaryInk} />
      </View>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(r) => r.id}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingTop: insets.top + 20,
        paddingHorizontal: 20,
        paddingBottom: 140,
        backgroundColor: tokens.bg,
      }}
      style={{ backgroundColor: tokens.bg }}
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
              color: tokens.primaryInk,
              marginBottom: 4,
            }}
          >
            A cooking companion
          </Text>

          {/* Hero headline */}
          <Text
            style={{
              fontFamily: fonts.display,
              fontSize: 36,
              lineHeight: 40,
              color: tokens.ink,
            }}
          >
            What are you{'\n'}
            <Text
              style={{
                fontFamily: fonts.displayItalic,
                fontStyle: 'italic',
                color: tokens.primary,
              }}
            >
              cooking
            </Text>{' '}
            tonight?
          </Text>

          {/* Dynamic subtitle -- responds to active filter */}
          <Text
            style={{
              marginTop: 8,
              fontFamily: fonts.sans,
              fontSize: 12,
              color: tokens.muted,
            }}
          >
            {buildSubtitle(filter, results, recipes.length)}
          </Text>

          {/* Search bar -- matches title, tagline, tags, chef, AND ingredients */}
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 13,
              borderRadius: 16,
              backgroundColor: tokens.cream,
              borderWidth: 1,
              borderColor: tokens.lineDark,
              gap: 10,
              ...shadows.card,
            }}
          >
            <Icon name="search" size={16} color={tokens.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search recipes, chefs, ingredients…"
              placeholderTextColor={tokens.muted}
              style={{
                flex: 1,
                color: tokens.ink,
                fontFamily: fonts.sans,
                fontSize: 14,
                padding: 0,
              }}
              returnKeyType="search"
            />
            {search ? (
              <Pressable
                onPress={() => setSearch('')}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <Icon name="x" size={14} color={tokens.muted} />
              </Pressable>
            ) : null}
          </View>

          {/* Mode chips -- All / Quick / Weekend / Favourites / Yours */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingTop: 14 }}
            keyboardShouldPersistTaps="handled"
          >
            {MODE_FILTERS.map((chip) => {
              const active = filter === chip;
              return (
                <Pressable
                  key={chip}
                  onPress={() => setFilter(chip)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: active ? tokens.primary : tokens.cream,
                    borderWidth: 1,
                    borderColor: active ? tokens.primary : tokens.lineDark,
                    ...(active ? shadows.card : null),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.sansBold,
                      fontSize: 12,
                      // tokens.onPrimary (#FAFAF7) on rust pill -- cream on rust.
                      // The previous tokens.ink (#111410) was correct in theory but
                      // the active pill bg (tokens.primary = rust #B84030) is dark
                      // enough that cream reads better than near-black.
                      color: active ? tokens.onPrimary : tokens.inkSoft,
                    }}
                  >
                    {chip}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Cuisine chips -- second row, only rendered when recipes exist.
              Tap again to deselect (returns to All).
              Uses sage-green accent to distinguish from mode chips (rust).
              Why separate rows not one long row: mode chips are always
              relevant; cuisine chips are a secondary browsing layer. Two
              rows makes the hierarchy clear without nesting or icons. */}
          {availableCuisines.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingTop: 8 }}
              keyboardShouldPersistTaps="handled"
            >
              {availableCuisines.map((cuisine) => {
                const active = filter === cuisine;
                return (
                  <Pressable
                    key={cuisine}
                    onPress={() => setFilter(active ? 'All' : cuisine)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 999,
                      backgroundColor: active ? tokens.sage : tokens.cream,
                      borderWidth: 1,
                      borderColor: active ? tokens.sage : tokens.lineDark,
                      ...(active ? shadows.card : null),
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.sansBold,
                        fontSize: 12,
                        // sage (#2E5E3E) is dark enough that onPrimary (cream)
                        // reads clearly -- same logic as the rust pill above
                        color: active ? tokens.onPrimary : tokens.inkSoft,
                      }}
                    >
                      {CUISINE_LABELS[cuisine]}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {/* Cooking tonight banner -- shown when any recipes are planned.
              Uses amber surface to stand out without competing with the
              rust primary. Tapping navigates to the Shop tab (shopping list). */}
          {allPlannedRecipes.length > 0 && (
            <Pressable
              onPress={() => router.push('/shop' as never)}
              accessibilityRole="button"
              accessibilityLabel={`Cooking tonight: ${allPlannedRecipes.length} ${allPlannedRecipes.length === 1 ? 'recipe' : 'recipes'} planned`}
              style={{
                marginTop: 16,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 11,
                borderRadius: 14,
                backgroundColor: tokens.amber,
                borderWidth: 1,
                borderColor: tokens.amberLine,
                gap: 10,
                ...shadows.card,
              }}
            >
              <Text style={{ fontSize: 16 }}>{'🍽️'}</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: fonts.sansBold,
                    fontSize: 11,
                    color: tokens.ochre,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                  }}
                >
                  Cooking tonight
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 12,
                    color: tokens.warmBrown,
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                >
                  {allPlannedRecipes.map((r) => r.title).join(' · ')}
                </Text>
              </View>
              <Icon name="arrow-right" size={14} color={tokens.ochre} />
            </Pressable>
          )}
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ marginBottom: 16 }}>
          <RecipeCard
            recipe={item}
            onPress={(r) => router.push(`/recipe/${r.id}`)}
            favorite={favoriteIds.has(item.id)}
            onToggleFavorite={handleToggleFavorite}
            isPlanned={plannedIds.has(item.id)}
          />
        </View>
      )}
      ListEmptyComponent={
        <View
          style={{
            marginTop: 24,
            paddingVertical: 36,
            paddingHorizontal: 24,
            backgroundColor: tokens.cream,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: tokens.line,
            alignItems: 'center',
            ...shadows.card,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: tokens.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 26 }}>{'🍽️'}</Text>
          </View>
          <Text
            style={{
              fontFamily: fonts.display,
              fontSize: 18,
              color: tokens.ink,
              marginBottom: 6,
            }}
          >
            Nothing matches
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
            Try clearing the search or switching the filter to see more.
          </Text>
        </View>
      }
    />
  );
}

/**
 * Kitchen (Home) — the anchor screen.
 *
 * Port of the HTML prototype's Home. What's here in v0.1:
 *   - Editorial hero ("What are you cooking tonight?") with italic emphasis
 *     on "cooking" — Fraunces italic is the recipe-app equivalent of a pull-
 *     quote; it signals this is not a productivity app.
 *   - Search (UI-only for v0.1; wiring the filter runs in the next task).
 *   - Recipe cards from SEED_RECIPES.
 *
 * What's NOT here yet (coming in follow-ups):
 *   - Cuisine/type category scrollers
 *   - Mood filter chips (Quick / Weekend / Favourites / Yours)
 *   - "Cook with what you have" CTA (blocks on Pantry screen)
 *   - Active meal plan strip (blocks on Plan screen)
 *   - Search ranking / fuzzy match
 *
 * These are in the HTML and will port over as their underlying screens come
 * online. The shipping order is deliberate: prove Home renders + navigates,
 * then fan out.
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
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import type { Recipe } from '../../src/data/types';
import { getAllRecipes, getFavoriteIds, toggleFavorite } from '../../db/database';
import { RecipeCard } from '../../src/components/RecipeCard';
import { Icon } from '../../src/components/Icon';
import { tokens, fonts } from '../../src/theme/tokens';

export default function KitchenHome() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [all, favs] = await Promise.all([getAllRecipes(db), getFavoriteIds(db)]);
      if (!cancelled) {
        setRecipes(all);
        setFavoriteIds(favs);
        setLoading(false);
      }
    }
    load().catch(console.error);
    return () => { cancelled = true; };
  }, [db]);

  const handleToggleFavorite = async (id: string) => {
    await toggleFavorite(db, id);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const results = recipes.filter((r) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.tagline.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q)) ||
      (r.source?.chef ?? '').toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={tokens.paprika} />
      </View>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(r) => r.id}
      contentContainerStyle={{
        paddingTop: insets.top + 24,
        paddingHorizontal: 20,
        paddingBottom: 140, // clear the floating tab bar
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
              color: tokens.paprika,
              marginBottom: 4,
            }}
          >
            A cooking companion
          </Text>

          {/* Hero */}
          <Text
            style={{
              fontFamily: fonts.display,
              fontSize: 38,
              lineHeight: 42,
              color: tokens.ink,
            }}
          >
            What are you{'\n'}
            <Text style={{ fontFamily: fonts.displayItalic, fontStyle: 'italic' }}>
              cooking
            </Text>{' '}
            tonight?
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontFamily: fonts.sans,
              fontSize: 12,
              color: tokens.muted,
            }}
          >
            {recipes.length} recipes · chef-inspired, honestly adapted
          </Text>

          {/* Search */}
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 16,
              backgroundColor: tokens.cream,
              borderWidth: 1,
              borderColor: tokens.line,
              gap: 10,
            }}
          >
            <Icon name="search" size={16} color={tokens.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search recipes, chefs, ingredients..."
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
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <Icon name="x" size={14} color={tokens.muted} />
              </Pressable>
            ) : null}
          </View>

          {/* Filter row — placeholder chips. Real filtering lands when the
             category and mood logic port over. Kept visible so layout
             doesn't shift when they go live. */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingTop: 16 }}
          >
            {['All', 'Quick', 'Weekend', 'Favourites', 'Yours'].map((chip, i) => (
              <View
                key={chip}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: i === 0 ? tokens.paprika : 'transparent',
                  borderWidth: 1.5,
                  borderColor: i === 0 ? tokens.paprika : tokens.line,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.sansBold,
                    fontSize: 12,
                    color: i === 0 ? tokens.cream : tokens.inkSoft,
                  }}
                >
                  {chip}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ marginBottom: 16 }}>
          <RecipeCard
            recipe={item}
            onPress={(r) => router.push(`/recipe/${r.id}`)}
            favorite={favoriteIds.has(item.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        </View>
      )}
      ListEmptyComponent={
        <View style={{ paddingVertical: 80, alignItems: 'center' }}>
          <Text style={{ fontSize: 40, marginBottom: 8 }}>🍽️</Text>
          <Text
            style={{
              fontFamily: fonts.display,
              fontSize: 18,
              color: tokens.ink,
              marginBottom: 4,
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
            }}
          >
            Try clearing the search
          </Text>
        </View>
      }
    />
  );
}

/**
 * IngredientSearchOverlay — full-screen search takeover for the Pantry tab.
 *
 * Why full-screen instead of inline dropdown?
 *   - Inline dropdowns fight with keyboard height, obscure the pill cloud,
 *     and collapse to a small scroll zone on short screens. A slide-up modal
 *     gives the user a full keyboard + results surface with zero layout
 *     conflict.
 *   - The header autofocuses the input so the keyboard is already up when
 *     the screen slides in — no extra tap required.
 *   - Have-it pills are shown in the overlay header so the user can see what
 *     they've already added while browsing the catalog.
 *
 * Interaction contract:
 *   - onAdd(name) — called with the canonical ingredient name on row tap.
 *     The parent is responsible for adding to DB and updating pantry state.
 *     The overlay does NOT close automatically: the user can add multiple
 *     items in one session. They close it by tapping ‹ or Android back.
 *   - onClose — called when the user explicitly dismisses. Parent sets
 *     visible=false.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  SectionList,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tokens, fonts } from '../theme/tokens';
import {
  INGREDIENT_CATALOG,
  fuzzyMatchCatalog,
  matchedAlias,
} from '../data/pantry-helpers';
import type { CatalogEntry, PantryCategory } from '../data/pantry-helpers';
import type { PantryItem } from '../../db/database';

// ── Types ────────────────────────────────────────────────────────────────────

type Section = { title: PantryCategory; data: CatalogEntry[] };

type Props = {
  visible: boolean;
  pantryItems: PantryItem[];
  /** category is omitted when user adds a custom name not in the catalog */
  onAdd: (name: string, category?: PantryCategory) => void;
  onClose: () => void;
};

// ── Component ────────────────────────────────────────────────────────────────

export function IngredientSearchOverlay({
  visible,
  pantryItems,
  onAdd,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');

  // Autofocus the input after the slide animation completes.
  useEffect(() => {
    if (visible) {
      // Small delay lets the Modal slide-in animation get out of the way.
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    } else {
      setQuery('');
    }
  }, [visible]);

  // ── Derived ──────────────────────────────────────────────────────────────

  // Set of already-in-pantry names (normalised) for quick lookup.
  const inPantrySet = useMemo(() => {
    const s = new Set<string>();
    for (const p of pantryItems) {
      s.add(p.name.toLowerCase().trim());
    }
    return s;
  }, [pantryItems]);

  // Sections: group catalog results by category. If no query, show all.
  const sections = useMemo<Section[]>(() => {
    const q = query.trim();
    const entries = q.length >= 2
      ? INGREDIENT_CATALOG.filter((e) => fuzzyMatchCatalog(e, q))
      : INGREDIENT_CATALOG;

    // Group by category, preserving catalog order within each group.
    const map = new Map<PantryCategory, CatalogEntry[]>();
    for (const entry of entries) {
      const bucket = map.get(entry.category) ?? [];
      bucket.push(entry);
      map.set(entry.category, bucket);
    }
    return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
  }, [query]);

  // Pills: pantry items the user already has (have_it = true).
  const havePills = useMemo(
    () => pantryItems.filter((p) => p.have_it).slice(0, 10),
    [pantryItems],
  );

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSelect = (entry: CatalogEntry) => {
    onAdd(entry.name, entry.category);
    // Don't close — let the user keep adding.
    // The pill will appear in the have-it row above.
  };

  // ── Render helpers ────────────────────────────────────────────────────────

  function renderHighlighted(text: string) {
    const q = query.trim().toLowerCase();
    if (!q) return <Text style={styles.resultName}>{text}</Text>;
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return <Text style={styles.resultName}>{text}</Text>;
    return (
      <Text style={styles.resultName}>
        {text.slice(0, idx)}
        <Text style={styles.resultNameBold}>{text.slice(idx, idx + q.length)}</Text>
        {text.slice(idx + q.length)}
      </Text>
    );
  }

  const renderItem = ({
    item,
    index,
    section,
  }: {
    item: CatalogEntry;
    index: number;
    section: Section;
  }) => {
    const alias = matchedAlias(item, query.trim());
    const alreadyAdded = inPantrySet.has(item.name.toLowerCase().trim());
    const isLast = index === section.data.length - 1;

    return (
      <Pressable
        onPress={() => !alreadyAdded && handleSelect(item)}
        accessibilityRole="button"
        accessibilityLabel={
          alreadyAdded
            ? `${item.name} — already in pantry`
            : `Add ${item.name} to pantry`
        }
        style={({ pressed }) => [
          styles.resultRow,
          !isLast && { borderBottomWidth: 1, borderBottomColor: tokens.line },
          pressed && !alreadyAdded && { backgroundColor: tokens.bgDeep },
          alreadyAdded && { opacity: 0.45 },
        ]}
      >
        <View style={styles.resultMain}>
          {renderHighlighted(item.name)}
          {alias ? (
            <Text style={styles.resultAlias}>also {alias}</Text>
          ) : null}
        </View>
        {alreadyAdded ? (
          <View style={[styles.tag, { backgroundColor: tokens.sageLight }]}>
            <Text style={[styles.tagText, { color: tokens.sageDeep }]}>In pantry</Text>
          </View>
        ) : (
          <View style={[styles.tag, { backgroundColor: tokens.bgDeep }]}>
            <Text style={[styles.tagText, { color: tokens.inkSoft }]}>
              {item.category}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          { paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + 8 },
        ]}
      >
        {/* ── Header: back + search input ──────────────────────────── */}
        <View style={styles.header}>
          <Pressable
            onPress={onClose}
            hitSlop={14}
            accessibilityRole="button"
            accessibilityLabel="Close search"
            style={styles.backBtn}
          >
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder="Search ingredients…"
            placeholderTextColor={tokens.muted}
            style={styles.searchInput}
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && Platform.OS === 'android' ? (
            <Pressable
              onPress={() => setQuery('')}
              hitSlop={10}
              style={styles.clearBtn}
            >
              <Text style={styles.clearX}>×</Text>
            </Pressable>
          ) : null}
        </View>

        {/* ── Have-it pills ─────────────────────────────────────────── */}
        {havePills.length > 0 ? (
          <View style={styles.pillsRow}>
            {havePills.map((p) => (
              <View key={p.id} style={styles.havePill}>
                <Text style={styles.havePillText}>{p.name}</Text>
              </View>
            ))}
            {pantryItems.filter(pi => pi.have_it).length > 10 ? (
              <View style={styles.morePill}>
                <Text style={styles.morePillText}>
                  +{pantryItems.filter(pi => pi.have_it).length - 10}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* ── Catalog results ───────────────────────────────────────── */}
        {sections.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>
              No match — tap "+" to add it anyway.
            </Text>
            <Pressable
              onPress={() => {
                const trimmed = query.trim();
                if (trimmed) {
                  onAdd(trimmed); // parent's addByName falls back to categorizeIngredient
                  setQuery('');
                }
              }}
              style={({ pressed }) => [
                styles.addNewBtn,
                { opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <Text style={styles.addNewBtnText}>+ Add "{query.trim()}"</Text>
            </Pressable>
          </View>
        ) : (
          <SectionList<CatalogEntry, Section>
            sections={sections}
            keyExtractor={(item, idx) => item.name + idx}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
              </View>
            )}
            renderItem={renderItem}
            stickySectionHeadersEnabled
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{
              paddingBottom: insets.bottom + 60,
            }}
          />
        )}
      </View>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  container: {
    flex: 1,
    backgroundColor: tokens.bg,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 6,
    borderBottomWidth: 1,
    borderBottomColor: tokens.line,
  },
  backBtn: {
    width: 32,
    height: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  backArrow: {
    fontSize: 26,
    color: tokens.primary,
    fontFamily: fonts.sans,
    lineHeight: 30,
    marginTop: -2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.sans,
    color: tokens.ink,
    paddingVertical: 0,
  },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: tokens.bgDeep,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  clearX: {
    fontSize: 15,
    color: tokens.muted,
    lineHeight: 17,
  },
  pillsRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: tokens.line,
  },
  havePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: tokens.sageLight,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(170,204,168,0.50)',
  },
  havePillText: {
    fontSize: 11,
    fontFamily: fonts.sansBold,
    color: tokens.sage,
  },
  morePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: tokens.lineDark,
  },
  morePillText: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: tokens.muted,
  },
  sectionHeader: {
    backgroundColor: tokens.bgDeep,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: fonts.sansBold,
    letterSpacing: 1.5,
    color: tokens.muted,
  },
  resultRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 13,
    minHeight: 50,
    backgroundColor: tokens.cream,
    gap: 10,
  },
  resultMain: {
    flex: 1,
  },
  resultName: {
    fontSize: 14,
    fontFamily: fonts.sans,
    color: tokens.inkSoft,
    lineHeight: 20,
  },
  resultNameBold: {
    fontFamily: fonts.sansBold,
    color: tokens.ink,
  },
  resultAlias: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: tokens.muted,
    marginTop: 1,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontFamily: fonts.sansBold,
    letterSpacing: 0.5,
  },
  noResults: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 28,
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: fonts.sans,
    color: tokens.muted,
    textAlign: 'center' as const,
    marginBottom: 16,
  },
  addNewBtn: {
    paddingVertical: 11,
    paddingHorizontal: 20,
    backgroundColor: tokens.primaryLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(232,184,48,0.35)',
  },
  addNewBtnText: {
    fontSize: 14,
    fontFamily: fonts.sansBold,
    color: tokens.primary,
  },
} as const;

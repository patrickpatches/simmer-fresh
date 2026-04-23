/**
 * SwapSheet — bottom sheet for selecting an ingredient substitution.
 *
 * Renders as a React Native Modal (slide-up animation). Shows:
 *   - Current / original ingredient at the top
 *   - Each substitution option with quality badge + reason line
 *   - "Back to original" row when a swap is already active
 *
 * Design decisions:
 *   - Modal not a portal/absolute overlay: simplest native approach, works
 *     inside both ScrollView and SectionList parents without z-index fights.
 *   - Haptic on every selection — this is a consequential action.
 *   - Quality badge colours follow the warm Simmer Fresh palette:
 *       perfect_swap → sage (calm green confirmation)
 *       great_swap   → ochre (warm, positive)
 *       good_swap / good → inkSoft (neutral, honest)
 *       compromise   → warn (amber, honest caution)
 */

import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import type { Substitution, SwapQuality } from '../data/types';
import { tokens, fonts } from '../theme/tokens';
import { Icon } from './Icon';

// ── Public types ──────────────────────────────────────────────────────────────

export interface SwapSheetProps {
  visible: boolean;
  ingredientName: string;
  substitutions: Substitution[];
  /** Name of the currently active swap, if any — to highlight it. */
  activeSwapName?: string;
  /** Called with the chosen substitution, or null to revert to original. */
  onSelect: (sub: Substitution | null) => void;
  onClose: () => void;
}

// ── Quality badge config ──────────────────────────────────────────────────────

function badgeConfig(quality: SwapQuality): { label: string; bg: string; text: string } {
  switch (quality) {
    case 'perfect_swap':
      return { label: 'Perfect', bg: tokens.sage, text: tokens.cream };
    case 'great_swap':
      return { label: 'Great swap', bg: tokens.ochre, text: tokens.ink };
    case 'good_swap':
    case 'good':
      return { label: 'Good swap', bg: tokens.bgDeep, text: tokens.inkSoft };
    case 'compromise':
      return { label: 'Tradeoff', bg: '#F5E6C8', text: tokens.warn };
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SwapSheet({
  visible,
  ingredientName,
  substitutions,
  activeSwapName,
  onSelect,
  onClose,
}: SwapSheetProps) {
  const insets = useSafeAreaInsets();
  const isSwapped = Boolean(activeSwapName) && activeSwapName !== ingredientName;
  const displayName = isSwapped ? activeSwapName! : ingredientName;

  const handleSelect = (sub: Substitution | null) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onSelect(sub);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Dim backdrop */}
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(26,22,18,0.45)' }}
        onPress={onClose}
      >
        {/* Sheet panel — stops backdrop press from propagating through */}
        <Pressable
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: tokens.cream,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingBottom: insets.bottom + 16,
            maxHeight: '80%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.12,
            shadowRadius: 20,
            elevation: 24,
          }}
          // Prevent backdrop tap from bleeding through the sheet
          onPress={() => {}}
        >
          {/* Handle */}
          <View
            style={{
              alignItems: 'center',
              paddingTop: 12,
              paddingBottom: 4,
            }}
          >
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: tokens.line,
              }}
            />
          </View>

          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingTop: 8,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: tokens.line,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 10,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  color: tokens.paprika,
                  marginBottom: 4,
                }}
              >
                Swap ingredient
              </Text>
              <Text
                style={{
                  fontFamily: fonts.display,
                  fontSize: 20,
                  lineHeight: 24,
                  color: tokens.ink,
                }}
                numberOfLines={2}
              >
                {displayName}
              </Text>
              {isSwapped && (
                <Text
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 12,
                    color: tokens.muted,
                    marginTop: 2,
                  }}
                >
                  Original: {ingredientName}
                </Text>
              )}
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close swap sheet"
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: tokens.bgDeep,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="x" size={15} color={tokens.ink} />
            </Pressable>
          </View>

          {/* Options list */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
          >
            {/* Revert to original — only shown when a swap is active */}
            {isSwapped && (
              <SwapOption
                name={ingredientName}
                reason="The original recipe ingredient."
                qualityBadge={{ label: 'Original', bg: tokens.line, text: tokens.inkSoft }}
                isActive={false}
                isOriginal
                onPress={() => handleSelect(null)}
              />
            )}

            {/* Substitution options */}
            {substitutions.map((sub, idx) => {
              const badge = badgeConfig(sub.quality);
              const isActive = sub.ingredient === activeSwapName;
              return (
                <SwapOption
                  key={idx}
                  name={sub.ingredient}
                  reason={sub.changes}
                  quantityNote={sub.quantity_note}
                  qualityBadge={badge}
                  isActive={isActive}
                  onPress={() => handleSelect(sub)}
                />
              );
            })}

            {substitutions.length === 0 && !isSwapped && (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={{ fontFamily: fonts.display, fontSize: 18, color: tokens.muted, marginBottom: 8 }}>
                  No swaps on file yet
                </Text>
                <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: tokens.muted, textAlign: 'center' }}>
                  We haven't researched substitutions for this ingredient yet.
                </Text>
              </View>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Single option row ─────────────────────────────────────────────────────────

function SwapOption({
  name,
  reason,
  quantityNote,
  qualityBadge,
  isActive,
  isOriginal,
  onPress,
}: {
  name: string;
  reason: string;
  quantityNote?: string;
  qualityBadge: { label: string; bg: string; text: string };
  isActive: boolean;
  isOriginal?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Swap to ${name}`}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: isActive
          ? 'rgba(91,107,71,0.08)'
          : pressed
            ? tokens.bgDeep
            : 'transparent',
        gap: 14,
      })}
    >
      {/* Active indicator */}
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: isActive ? tokens.sage : tokens.line,
          backgroundColor: isActive ? tokens.sage : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 2,
          flexShrink: 0,
        }}
      >
        {isActive && <Icon name="check" size={10} color={tokens.cream} />}
      </View>

      {/* Text block */}
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Text
            style={{
              fontFamily: fonts.sansBold,
              fontSize: 14,
              color: isOriginal ? tokens.muted : tokens.ink,
              flexShrink: 1,
            }}
          >
            {name}
          </Text>
          {/* Quality badge */}
          <View
            style={{
              backgroundColor: qualityBadge.bg,
              borderRadius: 999,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.sansBold,
                fontSize: 10,
                color: qualityBadge.text,
                letterSpacing: 0.3,
              }}
            >
              {qualityBadge.label}
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 13,
            lineHeight: 18,
            color: tokens.inkSoft,
          }}
        >
          {reason}
        </Text>

        {quantityNote && (
          <Text
            style={{
              fontFamily: fonts.displayItalic,
              fontStyle: 'italic',
              fontSize: 12,
              color: tokens.ochre,
            }}
          >
            {quantityNote}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
